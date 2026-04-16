<script setup>
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { computed, ref } from 'vue'

import ColumnFilter from '../../../components/common/ColumnFilter.vue'
import Label from '../../../components/common/Label.vue'
import LabelsRow from '../../../components/columns/LabelsRow.vue'
import ResultBadge from '../../../components/common/ResultBadge.vue'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import StatusFooter from '../../../components/common/StatusFooter.vue'
import { durationToNow } from '../../../shared/lib.js'
import { calculateChecklistStats, getEngineDisplay, getResultDisplay } from '../../../shared/lib/checklistUtils.js'
import { useGridDensity } from '../../../shared/composables/useGridDensity.js'
import { normalizeColor } from '../../../shared/lib/colorUtils.js'
import { formatReviewDate } from '../../../shared/lib/reviewFormUtils.js'
import engineIcon from '../../../assets/bot2.svg'
import overrideIcon from '../../../assets/override2.svg'
import manualIcon from '../../../assets/user.svg'

const props = defineProps({
  gridData: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const { itemSize } = useGridDensity('collection-rule-table', 1, 12, 24)

const emit = defineEmits(['action'])

function onFooterAction(key) {
  emit('action', key)
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

const stats = computed(() => calculateChecklistStats(filteredData.value))

const allMetrics = computed(() => {
  const s = stats.value
  if (!s) return []
  return [
    { key: 'manual', value: s.engine.manual, label: 'Manual', icon: 'pi pi-user' },
    { key: 'override', value: s.engine.override, label: 'Override', icon: 'pi pi-arrow-right-arrow-left' },
    { key: 'engine', value: s.engine.engine, label: 'Engine', icon: 'pi pi-cog' },
    { key: 'saved', value: s.statuses.saved, label: 'Saved', icon: 'pi pi-save' },
    { key: 'submitted', value: s.statuses.submitted, label: 'Submitted', icon: 'pi pi-arrow-right', class: 'metric-submitted' },
    { key: 'accepted', value: s.statuses.accepted, label: 'Accepted', icon: 'pi pi-check', class: 'metric-accepted' },
    { key: 'rejected', value: s.statuses.rejected, label: 'Rejected', icon: 'pi pi-times', class: 'metric-rejected' },
    { key: 'nf', value: s.results.pass, label: 'NF', class: 'metric-nf' },
    { key: 'open', value: s.results.fail, label: 'O', class: 'metric-open' },
    { key: 'na', value: s.results.notapplicable, label: 'NA', class: 'metric-na' },
    { key: 'nrPlus', value: s.results.other, label: 'NR+', class: 'metric-nr' },
  ]
})

const footerMetrics = computed(() => allMetrics.value.filter(m => m.value > 0))

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
  bodyRow: { style: { cursor: 'pointer', height: 'var(--item-size, 36px)', overflow: 'hidden' } },
  footer: { style: { padding: '0', border: 'none' } },
  emptyMessageCell: { class: 'agg-grid-empty-cell' },
}
</script>

<template>
  <DataTable
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
  >
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
    <Column field="assetLabels" :style="{ width: '12rem', minWidth: '8rem' }" :pt="columnPt.left">
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
    <Column field="detail" header="Detail" sortable :style="{ width: '20%', minWidth: '12rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <div class="cell-text-field">
          <span v-if="data.detail" class="cell-text cell-text--clamped" :title="data.detail">{{ data.detail }}</span>
          <span v-else class="cell-text cell-text--placeholder">—</span>
        </div>
      </template>
    </Column>

    <!-- Comment -->
    <Column field="comment" header="Comment" sortable :style="{ width: '20%', minWidth: '12rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <span class="cell-text cell-text--clamped" :title="data.comment">{{ data.comment }}</span>
      </template>
    </Column>

    <!-- User -->
    <Column field="username" header="User" sortable :style="{ width: '10rem', minWidth: '8rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <span class="cell-text">{{ data.username }}</span>
      </template>
    </Column>

    <!-- Time -->
    <Column field="touchTs" sortable :style="{ width: '5rem', minWidth: '5rem' }" :pt="columnPt.center">
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
        :metrics="footerMetrics"
        :total-count="gridData.length"
        :filtered-count="filteredData.length !== gridData.length ? filteredData.length : null"
        @action="onFooterAction"
      />
    </template>
  </DataTable>
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
</style>
