<script setup>
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { computed, ref } from 'vue'

import assessmentIcon from '../../../assets/assessment.svg'
import engineIcon from '../../../assets/bot2.svg'
import overrideIcon from '../../../assets/override2.svg'
import manualIcon from '../../../assets/user.svg'
import LabelsRow from '../../../components/columns/LabelsRow.vue'
import ColumnFilter from '../../../components/common/ColumnFilter.vue'
import EngineBadge from '../../../components/common/EngineBadge.vue'
import Label from '../../../components/common/Label.vue'
import ManualBadge from '../../../components/common/ManualBadge.vue'
import OverrideBadge from '../../../components/common/OverrideBadge.vue'
import ResultBadge from '../../../components/common/ResultBadge.vue'
import ReviewEditPopover from '../../../components/common/ReviewEditPopover.vue'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import StatusFooter from '../../../components/common/StatusFooter.vue'
import { useGridDensity } from '../../../shared/composables/useGridDensity.js'
import { durationToNow } from '../../../shared/lib.js'
import { calculateChecklistStats, getEngineDisplay, getResultDisplay } from '../../../shared/lib/checklistUtils.js'
import { normalizeColor } from '../../../shared/lib/colorUtils.js'
import { formatReviewDate } from '../../../shared/lib/reviewFormUtils.js'

const props = defineProps({
  gridData: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  visibleFields: {
    type: Set,
    required: true,
  },
  collectionId: {
    type: String,
    default: null,
  },
  selectedRuleId: {
    type: String,
    default: null,
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
  clearSaveError: {
    type: Function,
    default: () => {},
  },
  currentReview: {
    type: Object,
    default: null,
  },
  selection: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['action', 'row-save', 'status-action', 'edit-asset', 'edit-close', 'update:selection'])

const { itemSize } = useGridDensity('collection-rule-table', 1, 12, 24)

const isDataSelectable = (data) => {
  return data?.access === 'rw'
}

function onSelectionChange(val) {
  const filtered = val.filter(row => row.access === 'rw')
  emit('update:selection', filtered)
}

const isAllSelected = computed(() => {
  const selectable = filteredData.value.filter(isDataSelectable)
  if (selectable.length === 0) { return false }
  return selectable.every(row => props.selection.some(s => s.assetId === row.assetId))
})

function onSelectAllChange(event) {
  if (event.checked) {
    const selectable = filteredData.value.filter(isDataSelectable)
    emit('update:selection', selectable)
  }
  else {
    emit('update:selection', [])
  }
}

const getRowClass = (data) => {
  return data.access !== 'rw' ? 'row-non-writable' : ''
}

function onFooterAction(key) {
  emit('action', key)
}

// --- Popover wiring ---
const reviewEditPopover = ref(null)
const popoverAnchor = ref(null)
const editingRow = ref(null)
const enabledTabs = ['history', 'attachments', 'statusText']

function openRowEditor(event, rowData) {
  if (!rowData || rowData.access !== 'rw') {
    return
  }
  const isSameRow = editingRow.value?.assetId === rowData.assetId
  const wasOpen = !!editingRow.value

  editingRow.value = rowData
  emit('edit-asset', rowData.assetId)

  const row = event.target?.closest ? event.target.closest('tr') : null
  const rowRect = row ? row.getBoundingClientRect() : { top: 0, height: 0 }
  const clickX = event.clientX ?? 0

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
    reviewEditPopover.value?.toggle(anchorEvent)
  }
  else if (wasOpen) {
    reviewEditPopover.value?.reposition(anchorEvent)
  }
  else {
    reviewEditPopover.value?.show(anchorEvent)
  }
}

function onRowClick(event) {
  const rowData = event.data
  if (!rowData || rowData.access !== 'rw') {
    return
  }
  openRowEditor(event.originalEvent || event, rowData)
}

function onPopoverSave(payload) {
  if (!editingRow.value) {
    return
  }
  emit('row-save', { ...payload, assetId: editingRow.value.assetId })
}

function onPopoverStatusAction(payload) {
  if (!editingRow.value) {
    return
  }
  emit('status-action', { ...payload, assetId: editingRow.value.assetId })
}

function onPopoverClose() {
  editingRow.value = null
  emit('edit-close')
}

const filters = ref({
  engine: { value: null },
  status: { value: null },
  result: { value: null },
  label: { value: null },
})

const engineIconMap = { manual: manualIcon, engine: engineIcon, override: overrideIcon }
const engineLabelMap = { manual: 'Manual', engine: 'Engine', override: 'Override' }

const engineOptions = computed(() => {
  const types = new Set(props.gridData.map(row => getEngineDisplay(row)).filter(Boolean))
  return Array.from(types).map(val => ({ value: val, label: engineLabelMap[val] ?? val, image: engineIconMap[val] }))
})

const statusOptions = computed(() => {
  const statuses = new Set(props.gridData.map(row => row.status?.label ?? row.status).filter(Boolean))
  return Array.from(statuses).map(val => ({ value: val, label: val.charAt(0).toUpperCase() + val.slice(1) }))
})

const resultOptions = computed(() => {
  const results = new Set(props.gridData.map(row => getResultDisplay(row.result)).filter(Boolean))
  return Array.from(results).map(val => ({ value: val, label: val }))
})

const labelOptions = computed(() => {
  const labelMap = new Map()
  for (const row of props.gridData) {
    for (const l of (row.assetLabels || [])) {
      if (l.name && !labelMap.has(l.name)) {
        labelMap.set(l.name, l.color)
      }
    }
  }
  return Array.from(labelMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, color]) => ({ value: name, label: name, color }))
})

const filteredData = computed(() => {
  let data = props.gridData
  const ef = filters.value.engine.value
  const sf = filters.value.status.value
  const rf = filters.value.result.value
  const lf = filters.value.label.value

  if (ef?.length) {
    data = data.filter(row => ef.includes(getEngineDisplay(row)))
  }
  if (sf?.length) {
    data = data.filter(row => sf.includes(row.status?.label ?? row.status))
  }
  if (rf?.length) {
    data = data.filter(row => rf.includes(getResultDisplay(row.result)))
  }
  if (lf?.length) {
    data = data.filter(row => (row.assetLabels || []).some(l => lf.includes(l.name)))
  }
  return data
})

const stats = computed(() => calculateChecklistStats(filteredData.value) ?? {
  results: { pass: 0, fail: 0, notapplicable: 0, other: 0 },
  engine: { manual: 0, engine: 0, override: 0 },
  statuses: { saved: 0, submitted: 0, accepted: 0, rejected: 0 },
  total: 0,
})

function getColumnPt(alignment = 'left') {
  const isCenter = alignment === 'center'
  return {
    headerCell: {
      style: { borderRight: '1px solid var(--color-border-light)' },
      class: isCenter ? 'column-header-center' : 'column-header-left',
    },
    columnHeaderContent: {
      style: {
        fontSize: '1rem',
        color: 'var(--color-text-primary)',
        justifyContent: isCenter ? 'center' : 'flex-start',
        textAlign: isCenter ? 'center' : 'left',
      },
    },
    bodyCell: {
      style: {
        verticalAlign: 'top',
        padding: '0.15rem 0.35rem',
        overflow: 'hidden',
        textAlign: isCenter ? 'center' : 'left',
      },
      class: isCenter ? 'column-body-center' : 'column-body-left',
    },
    bodyCellContent: {
      style: {
        display: 'flex',
        justifyContent: isCenter ? 'center' : 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
      },
    },
  }
}

const columnPt = {
  center: getColumnPt('center'),
  left: getColumnPt('left'),
}

const dataTablePt = {
  tableContainer: { style: { height: '100%' } },
  table: { style: { tableLayout: 'auto', minWidth: '100%' } },
  bodyRow: ({ props, index }) => {
    const rowData = props.value[index]
    return {
      style: { cursor: 'pointer', height: 'var(--item-size, 36px)', overflow: 'hidden' },
      title: rowData?.access !== 'rw' ? 'Read only' : '',
    }
  },
  footer: { style: { padding: '0', border: 'none' } },
  emptyMessageCell: { class: 'agg-grid-empty-cell' },
}
</script>

<template>
  <DataTable
    :selection="props.selection"
    :select-all="isAllSelected"
    :value="filteredData"
    :loading="isLoading"
    data-key="assetId"
    scrollable
    scroll-height="flex"
    :virtual-scroller-options="{ itemSize }"
    resizable-columns
    striped-rows
    class="rule-table-grid"
    :pt="dataTablePt"
    :is-data-selectable="isDataSelectable"
    :row-class="getRowClass"
    @select-all-change="onSelectAllChange"
    @row-click="onRowClick"
    @update:selection="onSelectionChange"
  >
    <!-- Selection -->
    <Column selection-mode="multiple" header-style="width: 2.5rem" :pt="columnPt.center" />

    <!-- Engine -->
    <Column field="resultEngine" sort-field="resultEngine.product" sortable :style="{ width: '4rem', minWidth: '4rem' }" :pt="columnPt.center">
      <template #header>
        <div class="column-header-with-filter">
          <img src="../../../assets/bot2.svg" alt="Engine" class="engine-header-icon" title="Result engine">
          <ColumnFilter v-model="filters.engine.value" :options="engineOptions" />
        </div>
      </template>
      <template #body="{ data }">
        <img
          v-if="getEngineDisplay(data) === 'engine'" src="../../../assets/bot2.svg" alt="Engine"
          class="engine-icon" title="Result engine"
        >
        <img
          v-else-if="getEngineDisplay(data) === 'override'" src="../../../assets/override2.svg" alt="Override"
          class="engine-icon" title="Overridden result"
        >
        <img
          v-else-if="getEngineDisplay(data) === 'manual'" src="../../../assets/user.svg" alt="Manual"
          class="engine-icon" title="Manual result"
        >
      </template>
    </Column>

    <!-- Status -->
    <Column field="status" sort-field="status.label" sortable :style="{ width: '9rem', minWidth: '9rem' }" :pt="columnPt.center">
      <template #header>
        <div class="column-header-with-filter">
          Status
          <ColumnFilter v-model="filters.status.value" :options="statusOptions">
            <template #option="{ option }">
              <StatusBadge :status="option.value" />
            </template>
          </ColumnFilter>
        </div>
      </template>
      <template #body="{ data }">
        <StatusBadge v-if="data.status" :status="data.status?.label ?? data.status" />
      </template>
    </Column>

    <!-- Asset -->
    <Column field="assetName" header="Asset" sortable :style="{ width: '14rem', minWidth: '10rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <span class="cell-text">{{ data.assetName }}</span>
      </template>
    </Column>

    <!-- Labels -->
    <Column v-if="visibleFields.has('labels')" field="assetLabels" :style="{ width: '12rem', minWidth: '8rem' }" :pt="columnPt.left">
      <template #header>
        <div class="column-header-with-filter">
          Labels
          <ColumnFilter v-model="filters.label.value" :options="labelOptions">
            <template #option="{ option }">
              <Label :value="option.label" :color="normalizeColor(option.color)" />
            </template>
          </ColumnFilter>
        </div>
      </template>
      <template #body="{ data }">
        <LabelsRow :labels="data.assetLabels" compact />
      </template>
    </Column>

    <!-- Result -->
    <Column field="result" sortable :style="{ width: '7rem', minWidth: '6rem' }" :pt="columnPt.center">
      <template #header>
        <div class="column-header-with-filter">
          Result
          <ColumnFilter v-model="filters.result.value" :options="resultOptions">
            <template #option="{ option }">
              <ResultBadge :status="option.value" />
            </template>
          </ColumnFilter>
        </div>
      </template>
      <template #body="{ data }">
        <ResultBadge v-if="getResultDisplay(data.result)" :status="getResultDisplay(data.result)" />
        <span v-else class="cell-result__empty">—</span>
      </template>
    </Column>

    <!-- Detail -->
    <Column v-if="visibleFields.has('detail')" field="detail" header="Detail" sortable :style="{ width: '20%', minWidth: '12rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <div class="cell-text-field">
          <span v-if="data.detail" class="cell-text cell-text--clamped" :title="data.detail">{{ data.detail }}</span>
          <span v-else class="cell-text cell-text--placeholder">—</span>
        </div>
      </template>
    </Column>

    <!-- Comment -->
    <Column v-if="visibleFields.has('comment')" field="comment" header="Comment" sortable :style="{ width: '20%', minWidth: '12rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <span class="cell-text cell-text--clamped" :title="data.comment">{{ data.comment }}</span>
      </template>
    </Column>

    <!-- User -->
    <Column v-if="visibleFields.has('user')" field="username" header="User" sortable :style="{ width: '10rem', minWidth: '8rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <span class="cell-text">{{ data.username }}</span>
      </template>
    </Column>

    <!-- Time -->
    <Column v-if="visibleFields.has('time')" field="touchTs" sortable :style="{ width: '5rem', minWidth: '5rem' }" :pt="columnPt.center">
      <template #header>
        <i class="pi pi-clock" title="Last action" />
      </template>
      <template #body="{ data }">
        <span v-if="data.touchTs" :title="formatReviewDate(data.touchTs)">{{ durationToNow(data.touchTs) }}</span>
      </template>
    </Column>

    <template #empty>
      <div class="agg-grid-empty-state">
        Select a rule above to see reviews.
      </div>
    </template>

    <template #footer>
      <StatusFooter
        class="rule-table-footer"
        :show-refresh="false"
        :show-export="true"
        :total-count="gridData.length"
        :filtered-count="filteredData.length !== gridData.length ? filteredData.length : null"
        total-label="reviews"
        :total-icon-src="assessmentIcon"
        @action="onFooterAction"
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
  </DataTable>

  <ReviewEditPopover
    ref="reviewEditPopover"
    :current-review="props.currentReview"
    :selected-rule-id="props.selectedRuleId"
    :collection-id="props.collectionId"
    :asset-id="editingRow?.assetId"
    :field-settings="props.fieldSettings"
    :access-mode="editingRow?.access"
    :can-accept="props.canAccept"
    :is-saving="props.isSaving"
    :save-error="props.saveError"
    :clear-save-error="props.clearSaveError"
    :enabled-tabs="enabledTabs"
    @save="onPopoverSave"
    @status-action="onPopoverStatusAction"
    @close="onPopoverClose"
  />

  <div
    ref="popoverAnchor"
    class="popover-anchor"
    style="position: fixed; width: 0px; pointer-events: none; visibility: hidden; z-index: -1;"
  />
</template>

<style scoped>
.column-header-with-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  width: 100%;
}

.rule-table-grid {
  flex: 1;
  min-height: 0;
}

.cell-text {
  font-size: 1.1rem;
  line-height: 1.3;
  color: var(--color-text-primary);
}

.cell-text--clamped {
  display: -webkit-box;
  line-clamp: var(--line-clamp, 1);
  -webkit-line-clamp: var(--line-clamp, 1);
  -webkit-box-orient: vertical;
  overflow: hidden;
  width: 100%;
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.cell-text-field {
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
}

.cell-text-field .cell-text--clamped {
  flex: 1;
  min-width: 0;
}

.cell-text--placeholder {
  color: var(--color-text-dim);
  font-style: italic;
  opacity: 0.5;
}

.cell-result__empty {
  color: var(--color-text-dim);
  font-size: 1rem;
  opacity: 0.9;
}

.engine-header-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.engine-icon {
  width: 1.4rem;
  height: 1.4rem;
  opacity: 0.7;
}

:deep(.p-datatable-thead > tr > th) {
  background: var(--color-background-dark);
  color: var(--color-text-dim);
  font-size: 0.85rem;
  font-weight: 600;
  border-bottom: 1px solid var(--color-border-default);
}
:deep(.p-datatable-thead > tr > th:hover) {
  background: color-mix(in srgb, var(--color-background-light) 10%, var(--color-background-dark));
}
:deep(.p-datatable-thead > tr > th:last-child) {
  border-right: none;
}

:deep(td.column-body-center) {
  text-align: center;
}
:deep(td.column-body-left) {
  text-align: left;
}

.agg-grid-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  color: var(--color-text-dim);
}

.footer-divider {
  color: var(--color-border-default);
  padding: 0 0.25rem;
}

:deep(.p-datatable-tbody > tr.row-non-writable) {
  cursor: not-allowed !important;
  opacity: 0.70;
  transition: opacity 0.2s;
}

:deep(.p-datatable-tbody > tr.row-non-writable:hover) {
  background: inherit !important;
}

:deep(.row-non-writable .p-checkbox) {
  opacity: 0.25;
  cursor: not-allowed;
  filter: grayscale(1);
}

:deep(.row-non-writable .p-checkbox-input) {
  pointer-events: none;
}
</style>
