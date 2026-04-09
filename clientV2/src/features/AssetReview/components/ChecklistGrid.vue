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

const emit = defineEmits(['update:searchFilter', 'select-rule', 'row-save', 'status-action', 'refresh', 'clear-save-error'])

// Inject feature-level context
const {
  gridData,
  isChecklistLoading: isLoading,
  selectedRuleId,
  asset,
  revisionInfo,
  accessMode,
  selectRule,
  ruleLookupMap,
} = inject('assetReviewContext')

const selectedRow = computed(() => {
  if (!selectedRuleId.value || !gridData.value) {
    return null
  }
  const idx = ruleLookupMap.value.get(selectedRuleId.value)
  return idx !== undefined ? gridData.value[idx] : null
})
const reviewEditPopover = ref()
const editingRow = ref(null)
const editingPopoverWidth = ref(null)

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

// Sync the shared search filter with the prop (for backward compatibility)
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
  const row = event.target ? event.target.closest('tr') : null
  const resultCell = row?.querySelector('[data-result-cell]')
  const anchorEl = resultCell || event.currentTarget || event.target

  const gridEl = anchorEl?.closest ? anchorEl.closest('.checklist-grid') : null
  if (gridEl && resultCell) {
    const gridRect = gridEl.getBoundingClientRect()
    const cellRect = resultCell.getBoundingClientRect()
    const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    editingPopoverWidth.value = (gridRect.right + 1 * rem) - cellRect.left + (7 * rem)
  }
  else {
    editingPopoverWidth.value = null
  }

  const anchorEvent = { currentTarget: anchorEl, target: anchorEl }

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

function onPopoverClose() {
  editingRow.value = null
}

function onPopoverSave(payload) {
  emit('row-save', payload)
}

function onPopoverStatusAction(payload) {
  emit('status-action', payload)
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
    const updated = data.find(r => r.ruleId === editingRow.value.ruleId)
    if (updated) {
      editingRow.value = updated
    }
  }
})

function onSelectionChange(newRow) {
  const isSameRow = editingRow.value?.ruleId === newRow?.ruleId
  if (!isSameRow && reviewEditPopover.value?.isDirty) {
    reviewEditPopover.value.triggerUnsavedWarning()
    return
  }
  selectedRow.value = newRow
}

function onRowClick(event) {
  event.originalEvent?.stopPropagation()
  const isSameRow = editingRow.value?.ruleId === event.data.ruleId
  if (!isSameRow && reviewEditPopover.value?.isDirty) {
    reviewEditPopover.value.triggerUnsavedWarning()
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
      ref="reviewEditPopover" :width="editingPopoverWidth"
      @save="onPopoverSave" @status-action="onPopoverStatusAction" @close="onPopoverClose"
      @clear-save-error="clearSaveError"
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
