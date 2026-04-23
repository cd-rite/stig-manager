<script setup>
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { computed } from 'vue'
import CatBadge from '../../../components/common/CatBadge.vue'

const props = defineProps({
  rules: {
    type: Array,
    default: () => [],
  },
  selectedRuleId: {
    type: String,
    default: null,
  },
  itemSize: {
    type: Number,
    default: 48,
  },
  lineClamp: {
    type: Number,
    default: 2,
  },
})

const emit = defineEmits(['select-rule'])

const SEVERITY_TO_CAT = { high: 1, medium: 2, low: 3 }

const selectedRow = computed(() =>
  props.selectedRuleId ? props.rules.find(r => r.ruleId === props.selectedRuleId) ?? null : null,
)

function getColumnPt(alignment = 'left') {
  const isCenter = alignment === 'center'
  return {
    headerCell: {
      style: {
        borderRight: '1px solid var(--color-border-light)',
        background: 'var(--color-background-dark)',
        color: 'var(--color-text-dim)',
        padding: '0.3rem 0.4rem',
      },
    },
    columnHeaderContent: {
      style: {
        fontSize: '1rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--color-text-dim)',
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

const tablePt = computed(() => ({
  root: { class: 'sm-scrollbar-thin', style: { backgroundColor: 'var(--color-background-dark)' } },
  tableContainer: { style: { height: '100%' } },
  table: { style: { tableLayout: 'auto', minWidth: '100%', background: 'var(--color-background-darkest)' } },
  thead: { style: { background: 'var(--color-background-dark)', position: 'sticky', top: '0', zIndex: '1' } },
  bodyRow: {
    style: {
      cursor: 'pointer',
      background: 'var(--color-background-dark)',
      height: `${props.itemSize}px`,
      overflow: 'hidden',
    },
  },
}))

function onRowClick(event) {
  emit('select-rule', event.data)
}
</script>

<template>
  <DataTable
    :value="rules"
    :selection="selectedRow"
    selection-mode="single"
    data-key="ruleId"
    scrollable
    scroll-height="flex"
    :virtual-scroller-options="{ itemSize, showLoader: true }"
    striped-rows
    resizable-columns
    class="view-rule-table"
    :style="{ '--line-clamp': lineClamp }"
    :pt="tablePt"
    @row-click="onRowClick"
  >
    <Column header="Cat" :style="{ width: '6.5rem', minWidth: '6.5rem' }" :pt="columnPt.center">
      <template #body="{ data }">
        <CatBadge :category="SEVERITY_TO_CAT[data.severity] ?? 3" variant="label" />
      </template>
    </Column>
    <Column header="STIG ID" field="version" sortable :style="{ width: '12rem', minWidth: '10rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <span class="cell-text cell-mono">{{ data.version }}</span>
      </template>
    </Column>
    <Column header="Group" field="groupId" sortable :style="{ width: '6rem', minWidth: '6rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <span class="cell-text cell-mono">{{ data.groupId }}</span>
      </template>
    </Column>
    <Column header="Rule Id" field="ruleId" sortable :style="{ width: '15rem', minWidth: '14rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <span class="cell-text cell-mono">{{ data.ruleId }}</span>
      </template>
    </Column>
    <Column header="Rule Title" field="title" sortable :style="{ minWidth: '16rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <span class="cell-text cell-text--clamped" :title="data.title">{{ data.title }}</span>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
.view-rule-table {
  flex: 1;
  min-height: 0;
  height: 100%;
}

:deep(.p-datatable-thead > tr > th:last-child) {
  border-right: none;
}

.cell-text {
  font-size: 1.3rem;
  line-height: 1.3;
  color: var(--color-text-primary);
}

.cell-mono {
  font-family: monospace;
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
</style>
