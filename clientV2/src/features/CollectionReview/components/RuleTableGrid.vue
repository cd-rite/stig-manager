<script setup>
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'

import LabelsRow from '../../../components/columns/LabelsRow.vue'
import ResultBadge from '../../../components/common/ResultBadge.vue'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import { durationToNow } from '../../../shared/lib.js'
import { getEngineDisplay, getResultDisplay } from '../../../shared/lib/checklistUtils.js'
import { formatReviewDate } from '../../../shared/lib/reviewFormUtils.js'

defineProps({
  gridData: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
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
  bodyRow: { style: { cursor: 'pointer', height: 'var(--item-size, 36px)', overflow: 'hidden' } },
  footer: { style: { padding: '0', border: 'none' } },
  emptyMessageCell: { class: 'agg-grid-empty-cell' },
}
</script>

<template>
  <DataTable
    :value="gridData"
    :loading="isLoading"
    data-key="assetId"
    scrollable
    scroll-height="flex"
    :virtual-scroller-options="{ itemSize: 36 }"
    resizable-columns
    striped-rows
    class="rule-table-grid"
    :pt="dataTablePt"
  >
    <!-- Engine -->
    <Column field="resultEngine" sort-field="resultEngine.product" sortable :style="{ width: '4rem', minWidth: '4rem' }" :pt="columnPt.center">
      <template #header>
        <img src="../../../assets/bot2.svg" alt="Engine" class="engine-header-icon" title="Result engine">
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
    <Column field="status" sort-field="status.label" header="Status" sortable :style="{ width: '9rem', minWidth: '9rem' }" :pt="columnPt.center">
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
    <Column field="assetLabels" header="Labels" :style="{ width: '12rem', minWidth: '8rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <LabelsRow :labels="data.assetLabels" compact />
      </template>
    </Column>

    <!-- Result -->
    <Column field="result" header="Result" sortable :style="{ width: '7rem', minWidth: '6rem' }" :pt="columnPt.center">
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
  </DataTable>
</template>

<style scoped>
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
  line-clamp: var(--line-clamp, 2);
  -webkit-line-clamp: var(--line-clamp, 2);
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
