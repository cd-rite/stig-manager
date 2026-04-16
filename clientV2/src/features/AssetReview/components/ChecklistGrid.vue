<script setup>
import { computed, inject, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import ReviewEditPopover from '../../../components/common/ReviewEditPopover.vue'
import { useChecklistDisplayMode } from '../composables/useChecklistDisplayMode.js'
import ChecklistGridHeader from './ChecklistGridHeader.vue'
import ChecklistGridTable from './ChecklistGridTable.vue'

const props = defineProps({
  searchFilter: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:searchFilter', 'row-save', 'status-action', 'refresh'])

const {
  gridData,
  isChecklistLoading: isLoading,
  selectedRuleId,
  asset,
  revisionInfo,
  accessMode,
  selectRule,
  clearSaveError,
  ruleLookupMap,
} = inject('assetReviewContext')

const selectedRow = computed(() => {
  if (!selectedRuleId.value || !gridData.value) {
    return null
  }
  return ruleLookupMap.value.get(selectedRuleId.value) ?? null
})
const reviewEditPopover = ref()
const popoverAnchor = ref(null)
const editingRow = ref(null)

const route = useRoute()

const { lineClamp, itemSize } = useChecklistDisplayMode()

const localSearchFilter = computed({
  get: () => props.searchFilter,
  set: (val) => emit('update:searchFilter', val)
})

watch([
  () => route.params.collectionId,
  () => route.params.assetId,
  () => route.params.benchmarkId,
  () => route.params.revisionStr,
], () => {
  localSearchFilter.value = ''
})

function openRowEditor(event, rowData) {
  const isSameRow = editingRow.value?.ruleId === rowData.ruleId
  const wasOpen = !!editingRow.value

  editingRow.value = rowData

  const row = event.target?.closest ? event.target.closest('tr') : null
  const rowRect = row ? row.getBoundingClientRect() : { top: 0, bottom: 0, height: 0 }
  const clickX = event.clientX

  if (popoverAnchor.value) {
    popoverAnchor.value.style.left = `${clickX}px`
    popoverAnchor.value.style.top = `${rowRect.top}px`
    popoverAnchor.value.style.height = `${rowRect.height}px`
  }

  const anchorEvent = {
    currentTarget: popoverAnchor.value,
    target: popoverAnchor.value,
    clientX: clickX,
  }

  if (isSameRow) {
    reviewEditPopover.value.toggle(anchorEvent)
  }
  else if (wasOpen) {
    reviewEditPopover.value.reposition(anchorEvent)
  }
  else {
    reviewEditPopover.value.show(anchorEvent)
  }
}


const scrollLocked = computed(() => !!editingRow.value && !!reviewEditPopover.value?.isDirty)

function onGridWheel(event) {
  if (scrollLocked.value) {
    event.preventDefault()
  }
}

function onGridScroll() {
  if (!editingRow.value) {
    return
  }
  reviewEditPopover.value?.hide()
}

watch(() => gridData.value, (data) => {
  if (!data?.length) {
    selectRule(null)
    return
  }

  const isValid = selectedRuleId.value && data.some(r => r.ruleId === selectedRuleId.value)

  if (!isValid) {
    const firstVisible = data[0]
    if (firstVisible) {
      selectRule(firstVisible.ruleId)
    }
  }

  if (editingRow.value) {
    const updated = ruleLookupMap.value.get(editingRow.value.ruleId)
    if (updated) {
      editingRow.value = updated
    }
  }
})

function guardUnsaved(targetRuleId) {
  const isSameRow = editingRow.value?.ruleId === targetRuleId
  if (!isSameRow && reviewEditPopover.value?.isDirty) {
    reviewEditPopover.value.triggerUnsavedWarning()
    return false
  }
  return true
}

function onSelectionChange(newRow) {
  if (!newRow) {
    return
  }
  if (!guardUnsaved(newRow.ruleId)) {
    return
  }
  selectRule(newRow.ruleId)
}

function onRowClick(event) {
  event.originalEvent?.stopPropagation()
  if (!guardUnsaved(event.data.ruleId)) {
    return
  }
  selectRule(event.data.ruleId)
  openRowEditor(event.originalEvent || event, event.data)
}


</script>

<template>
  <div
    class="checklist-grid" :style="{ '--line-clamp': lineClamp, '--item-size': `${itemSize}px` }"
    @scroll.capture="onGridScroll" @wheel.capture="onGridWheel"
  >
    <ChecklistGridHeader
      v-model:search-filter="localSearchFilter"
      :asset="asset" :revision-info="revisionInfo" :is-loading="isLoading"
      :access-mode="accessMode" @refresh="emit('refresh')"
    />

    <ChecklistGridTable
      :selected-row="selectedRow" :grid-data="gridData" :is-loading="isLoading"
      :search-filter="localSearchFilter"
      @update:selected-row="onSelectionChange" @row-click="onRowClick"
      @refresh="emit('refresh')"
    />

    <ReviewEditPopover
      ref="reviewEditPopover"
      @save="(payload) => $emit('row-save', payload)"
      @status-action="(payload) => $emit('status-action', payload)"
      @close="editingRow = null"
      @clear-save-error="clearSaveError"
    />

    <div
      ref="popoverAnchor"
      class="popover-anchor"
      style="position: fixed; width: 0px; pointer-events: none; visibility: hidden; z-index: -1;"
    />
  </div>
</template>

<style scoped>
.checklist-grid {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-subtle);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  overflow: hidden;
}

.footer-divider {
  color: var(--color-border-default);
  margin: 0 0.25rem;
  font-weight: 300;
}
</style>
