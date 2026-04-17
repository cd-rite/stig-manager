<script setup>
import { computed, inject, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import EngineBadge from '../../../components/common/EngineBadge.vue'
import ManualBadge from '../../../components/common/ManualBadge.vue'
import OverrideBadge from '../../../components/common/OverrideBadge.vue'
import ResultBadge from '../../../components/common/ResultBadge.vue'
import ReviewEditPopover from '../../../components/common/ReviewEditPopover.vue'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import StatusFooter from '../../../components/common/StatusFooter.vue'
import { useChecklistDisplayMode } from '../composables/useChecklistDisplayMode.js'
import { useSearch } from '../composables/useSearch.js'
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
const { stats, isFiltered, currentFilteredData, searchFilter: sharedSearchFilter, resetFilters } = useSearch(gridData)

onMounted(() => {
  resetFilters()
})

watch([
  () => route.params.collectionId,
  () => route.params.assetId,
  () => route.params.benchmarkId,
  () => route.params.revisionStr,
], () => {
  resetFilters()
})

watch(() => props.searchFilter, (val) => {
  if (val !== sharedSearchFilter.value) {
    sharedSearchFilter.value = val
  }
}, { immediate: true })

watch(sharedSearchFilter, (val) => {
  if (val !== props.searchFilter) {
    emit('update:searchFilter', val)
  }
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

  const targetData = isFiltered.value ? currentFilteredData.value : data
  const isValid = selectedRuleId.value && targetData.some(r => r.ruleId === selectedRuleId.value)

  if (!isValid) {
    const firstVisible = targetData[0]
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

function handleFooterAction(actionKey) {
  if (actionKey === 'refresh') {
    emit('refresh')
  }
}
</script>

<template>
  <div
    class="checklist-grid" :style="{ '--line-clamp': lineClamp, '--item-size': `${itemSize}px` }"
    @scroll.capture="onGridScroll" @wheel.capture="onGridWheel"
  >
    <ChecklistGridHeader
      :asset="asset" :revision-info="revisionInfo" :is-loading="isLoading"
      :access-mode="accessMode" @refresh="emit('refresh')"
    />

    <ChecklistGridTable
      :selected-row="selectedRow" :grid-data="gridData" :is-loading="isLoading"
      @update:selected-row="onSelectionChange" @row-click="onRowClick"
    >
      <template #footer>
        <StatusFooter
          :refresh-loading="isLoading" :total-count="gridData.length"
          :filtered-count="isFiltered ? currentFilteredData.length : null" @action="handleFooterAction"
        >
          <template #right-extra>
            <ResultBadge status="O" :count="stats.results.fail" />
            <ResultBadge status="NF" :count="stats.results.pass" />
            <ResultBadge status="NA" :count="stats.results.notapplicable" />
            <ResultBadge status="NR+" :count="stats.results.other" />
            <span class="footer-divider">|</span>
            <ManualBadge :count="stats.engine.manual" />
            <EngineBadge :count="stats.engine.engine" />
            <OverrideBadge :count="stats.engine.override" />
            <span class="footer-divider">|</span>
            <StatusBadge status="saved" :count="stats.statuses.saved" />
            <StatusBadge status="submitted" :count="stats.statuses.submitted" />
            <StatusBadge status="accepted" :count="stats.statuses.accepted" />
            <StatusBadge status="rejected" :count="stats.statuses.rejected" />
          </template>
        </StatusFooter>
      </template>
    </ChecklistGridTable>

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
