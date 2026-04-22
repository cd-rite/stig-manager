<script setup>
import { computed, inject, onMounted, ref, toRefs, watch } from 'vue'
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
  gridData: {
    type: Array,
    default: () => [],
  },
  isChecklistLoading: {
    type: Boolean,
    default: false,
  },
  selectedRuleId: {
    type: String,
    default: null,
  },
  asset: {
    type: Object,
    default: null,
  },
  revisionInfo: {
    type: Object,
    default: null,
  },
  accessMode: {
    type: String,
    default: 'r',
  },
  selectRule: {
    type: Function,
    required: true,
  },
  clearSaveError: {
    type: Function,
    required: true,
  },
  ruleLookupMap: {
    type: Object,
    default: () => new Map(),
  },
  fieldSettings: {
    type: Object,
    default: null,
  },
  canAccept: {
    type: Boolean,
    default: false,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
  saveError: {
    type: String,
    default: null,
  },
  currentReview: {
    type: Object,
    default: null,
  },
  collectionId: {
    type: String,
    default: null,
  },
  assetId: {
    type: [String, Number],
    default: null,
  },
})

const emit = defineEmits(['update:searchFilter', 'row-save', 'status-action', 'refresh'])

const { selectRule, clearSaveError } = props

const {
  gridData,
  isChecklistLoading: isLoading,
  selectedRuleId,
  asset,
  revisionInfo,
  accessMode,
  ruleLookupMap,
  fieldSettings,
  canAccept,
  isSaving,
  saveError,
  currentReview,
  collectionId,
  assetId,
} = toRefs(props)

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
      :current-review="currentReview"
      :selected-rule-id="selectedRuleId"
      :collection-id="collectionId"
      :asset-id="assetId"
      :field-settings="fieldSettings"
      :access-mode="accessMode"
      :can-accept="canAccept"
      :is-saving="isSaving"
      :save-error="saveError"
      :clear-save-error="clearSaveError"
      @save="(payload) => $emit('row-save', payload)"
      @status-action="(payload) => $emit('status-action', payload)"
      @close="editingRow = null"
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
