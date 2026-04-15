<script setup>
import { computed, ref } from 'vue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import CatBadge from '../../../components/common/CatBadge.vue'
import ColumnFilter from '../../../components/common/ColumnFilter.vue'
import StatusFooter from '../../../components/common/StatusFooter.vue'
import { durationToNow } from '../../../shared/lib.js'
import { severityMap } from '../../../shared/lib/checklistUtils.js'

const props = defineProps({
  gridData: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  selectedRow: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:selectedRow'])

const filters = ref({
  severity: { value: null },
})

const dummyFooterMetrics = [
  { key: 'assets', value: 1800, icon: 'pi pi-bullseye' },
  { key: 'assessments', value: 298800, icon: 'pi pi-file-edit' },
  { key: 'nf', value: 298800, label: 'NF', class: 'metric-nf' },
  { key: 'submitted', value: 1798, icon: 'pi pi-arrow-right', class: 'metric-submitted' },
  { key: 'rules', value: '166 rules', icon: 'pi pi-shield', class: 'metric-rules' }
]

const catOptions = computed(() => {
  const severities = new Set(props.gridData.map(item => item.severity).filter(Boolean))
  return Array.from(severities).map(val => ({
    value: val,
    label: `Cat ${severityMap[val] ?? val}`,
  })).sort((a, b) => a.label.localeCompare(b.label))
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
  bodyRow: { style: { cursor: 'pointer', height: 'var(--item-size)', overflow: 'hidden' } },
  footer: { style: { padding: '0', border: 'none' } },
  emptyMessageCell: { class: 'agg-grid-empty-cell' },
}
</script>

<template>
  <DataTable
    :value="gridData"
    :loading="isLoading"
    :selection="selectedRow"
    selection-mode="single"
    data-key="ruleId"
    scrollable
    scroll-height="flex"
    :virtual-scroller-options="{ itemSize: 36 }"
    resizable-columns
    striped-rows
    class="checklist-grid__table"
    :pt="dataTablePt"
    @update:selection="(val) => emit('update:selectedRow', val)"
  >
    <Column field="severity" filter-field="severity" sortable :style="{ width: '6.5rem', minWidth: '6.5rem' }" :pt="columnPt.center">
      <template #header>
        <div class="column-header-with-filter">
          Cat
          <ColumnFilter v-model="filters.severity.value" :options="catOptions">
            <template #option="{ option }">
              <CatBadge :category="severityMap[option.value]" variant="label" />
            </template>
          </ColumnFilter>
        </div>
      </template>
      <template #body="{ data }">
        <div class="cell-center">
          <CatBadge :category="severityMap[data.severity]" variant="label" />
        </div>
      </template>
    </Column>
    <Column field="groupId" header="Group" sortable :style="{ width: '7rem', minWidth: '7rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <span class="cell-text">{{ data.groupId }}</span>
      </template>
    </Column>
    <Column field="version" header="STIG Id" sortable :style="{ width: '12rem', minWidth: '10rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <span class="cell-text">{{ data.version }}</span>
      </template>
    </Column>
    <Column field="ruleTitle" header="Rule Title" sortable :style="{ width: '25%', minWidth: '18rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <div class="cell-text-field">
          <span class="cell-text cell-text--clamped" :title="data.ruleTitle">{{ data.ruleTitle }}</span>
        </div>
      </template>
    </Column>

    <!-- Count Columns -->
    <Column field="counts.results.fail" sortable :style="{ width: '4.5rem', minWidth: '4.5rem' }" :pt="columnPt.center">
      <template #header><span style="color: #e74c3c; font-weight: 600;">O</span></template>
      <template #body="{ data }"><span class="cell-text">{{ data.counts?.results?.fail ?? 0 }}</span></template>
    </Column>
    <Column field="counts.results.pass" sortable :style="{ width: '4.5rem', minWidth: '4.5rem' }" :pt="columnPt.center">
      <template #header><span style="color: #2ecc71; font-weight: 600;">NF</span></template>
      <template #body="{ data }"><span class="cell-text">{{ data.counts?.results?.pass ?? 0 }}</span></template>
    </Column>
    <Column field="counts.results.notapplicable" sortable :style="{ width: '4.5rem', minWidth: '4.5rem' }" :pt="columnPt.center">
      <template #header><span style="color: #64748b; font-weight: 600;">NA</span></template>
      <template #body="{ data }"><span class="cell-text">{{ data.counts?.results?.notapplicable ?? 0 }}</span></template>
    </Column>
    <Column field="counts.results.other" sortable :style="{ width: '4.5rem', minWidth: '4.5rem' }" :pt="columnPt.center">
      <template #header><span style="color: var(--color-text-dim); font-weight: 600;">NR+</span></template>
      <template #body="{ data }"><span class="cell-text">{{ data.counts?.results?.other ?? 0 }}</span></template>
    </Column>

    <!-- Status Icons -->
    <Column field="counts.statuses.submitted" sortable :style="{ width: '4.5rem', minWidth: '4.5rem' }" :pt="columnPt.center">
      <template #header><i class="pi pi-arrow-right" style="color: #2ecc71; font-size: 1.1rem; font-weight: bold;" title="Submitted" /></template>
      <template #body="{ data }"><span class="cell-text">{{ data.counts?.statuses?.submitted ?? 0 }}</span></template>
    </Column>
    <Column field="counts.statuses.rejected" sortable :style="{ width: '4.5rem', minWidth: '4.5rem' }" :pt="columnPt.center">
      <template #header><i class="pi pi-ban" style="color: #e74c3c; font-size: 1.1rem;" title="Rejected" /></template>
      <template #body="{ data }"><span class="cell-text">{{ data.counts?.statuses?.rejected ?? 0 }}</span></template>
    </Column>
    <Column field="counts.statuses.accepted" sortable :style="{ width: '4.5rem', minWidth: '4.5rem' }" :pt="columnPt.center">
      <template #header><i class="pi pi-star-fill" style="color: #f1c40f; font-size: 1.1rem;" title="Accepted" /></template>
      <template #body="{ data }"><span class="cell-text">{{ data.counts?.statuses?.accepted ?? 0 }}</span></template>
    </Column>

    <!-- Timestamp Columns -->
    <Column field="timestamps.ts.min" header="Oldest" sortable :style="{ width: '6rem', minWidth: '6rem' }" :pt="columnPt.center">
      <template #body="{ data }">
        <span v-if="data.timestamps?.ts?.min" class="cell-text" :title="data.timestamps.ts.min">{{ durationToNow(data.timestamps.ts.min) }}</span>
      </template>
    </Column>
    <Column field="timestamps.ts.max" header="Newest" sortable :style="{ width: '6rem', minWidth: '6rem' }" :pt="columnPt.center">
      <template #body="{ data }">
        <span v-if="data.timestamps?.ts?.max" class="cell-text" :title="data.timestamps.ts.max">{{ durationToNow(data.timestamps.ts.max) }}</span>
      </template>
    </Column>

    <template #empty>
      <div class="agg-grid-empty-state">
        No checklist items found.
      </div>
    </template>

    <template #footer>
      <StatusFooter
        class="collection-review-footer"
        :metrics="dummyFooterMetrics"
        :show-refresh="true"
        :show-export="true"
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

.checklist-grid__table {
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
  line-clamp: var(--line-clamp, 3);
  -webkit-line-clamp: var(--line-clamp, 3);
  -webkit-box-orient: vertical;
  overflow: hidden;
  width: 100%;
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.cell-center {
  display: flex;
  justify-content: center;
  width: 100%;
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

:deep(.p-datatable-thead > tr > th:last-child) {
  border-right: none;
}

:deep(td.column-body-center) {
  text-align: center;
}

:deep(td.column-body-left) {
  text-align: left;
}

:deep(.p-datatable-thead > tr > th) {
  background: var(--color-background-dark);
  color: var(--color-text-dim);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: none;
  border-bottom: 1px solid var(--color-border-default);
}
:deep(.p-datatable-thead > tr > th:hover) {
  background: color-mix(in srgb, var(--color-background-light) 10%, var(--color-background-dark));
}

:deep(.p-datatable-tbody > tr.p-highlight) {
  background: color-mix(in srgb, var(--color-primary, #3b82f6) 12%, var(--color-background-light)) !important;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-primary, #3b82f6) 25%, transparent);
  outline: 1px inset color-mix(in srgb, var(--color-primary) 20%, transparent);
}

:deep(.p-datatable-tbody > tr:hover) {
  background: var(--color-background-light) !important;
}

:deep(.p-datatable-tbody > tr.p-highlight .cell-text) {
  color: var(--color-text-bright);
  font-weight: 500;
}

.agg-grid-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  color: var(--color-text-dim);
}

/* Footer Custom Styles */
:deep(.collection-review-footer .status-footer__metric-total) {
  display: none !important; /* Hide default generic "0 rows" total box to replace with custom rules stat */
}

:deep(.metric-nf) {
  border-color: rgba(46, 204, 113, 0.4) !important;
}
:deep(.metric-nf .status-footer__info-label) {
  color: #2ecc71 !important;
  font-weight: bold;
  order: -1; /* Move NF before the number */
  margin-right: 4px;
}

:deep(.metric-submitted .status-footer__info-icon) {
  color: #2ecc71 !important; /* green arrow */
}

:deep(.metric-rules .status-footer__info-icon) {
  color: #2ecc71 !important; /* green shield */
}
:deep(.metric-rules .status-footer__info-label) {
  display: none; /* Value already says "166 rules" */
}
</style>
