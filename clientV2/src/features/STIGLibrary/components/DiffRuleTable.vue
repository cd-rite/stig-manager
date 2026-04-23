<script setup>
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { computed } from 'vue'
import CatBadge from '../../../components/common/CatBadge.vue'
import ChangedPropertyChip from '../../../components/common/ChangedPropertyChip.vue'
import RuleIdDiffSpan from '../../../components/common/RuleIdDiffSpan.vue'

const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
  selectedKey: {
    type: String,
    default: null,
  },
  itemSize: {
    type: Number,
    default: 52,
  },
})

const emit = defineEmits(['select-row'])

const SEVERITY_TO_CAT = { high: 1, medium: 2, low: 3 }

const selectedRow = computed(() =>
  props.selectedKey ? props.rows.find(r => r.key === props.selectedKey) ?? null : null,
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
  emit('select-row', event.data)
}
</script>

<template>
  <DataTable
    :value="rows"
    :selection="selectedRow"
    selection-mode="single"
    data-key="key"
    scrollable
    scroll-height="flex"
    :virtual-scroller-options="{ itemSize, showLoader: true }"
    striped-rows
    resizable-columns
    class="diff-rule-table"
    :pt="tablePt"
    @row-click="onRowClick"
  >
    <Column header="STIG ID" field="stigId" sortable :style="{ width: '15rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <span class="cell-text cell-mono">{{ data.stigId }}</span>
      </template>
    </Column>
    <Column header="Left rule" :style="{ width: '16rem', minWidth: '15rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <span class="cell-text cell-mono">
          <RuleIdDiffSpan v-if="data.leftRule" :id="data.leftRule" side="del" />
          <span v-else class="dim">—</span>
        </span>
      </template>
    </Column>
    <Column header="Right rule" :style="{ width: '16rem', minWidth: '15rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <span class="cell-text cell-mono">
          <RuleIdDiffSpan v-if="data.rightRule" :id="data.rightRule" side="add" />
          <span v-else class="dim">—</span>
        </span>
      </template>
    </Column>
    <Column header="Cat" :style="{ width: '5rem' }" :pt="columnPt.center">
      <template #body="{ data }">
        <CatBadge v-if="data.cat" :category="SEVERITY_TO_CAT[data.cat] ?? 3" variant="label" />
      </template>
    </Column>
    <Column header="Changed properties" :style="{ minWidth: '16rem' }" :pt="columnPt.left">
      <template #body="{ data }">
        <div class="chip-row">
          <ChangedPropertyChip
            v-for="prop in data.changed"
            :key="prop"
            :name="prop"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
.diff-rule-table {
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

.dim {
  color: var(--color-text-dim);
}

.chip-row {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}
</style>
