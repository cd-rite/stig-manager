<script setup>
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { computed } from 'vue'
import ClassificationBadge from '../../../components/common/ClassificationBadge.vue'
import EarlierRevisionsPills from './EarlierRevisionsPills.vue'

const props = defineProps({
  benchmarks: {
    type: Array,
    default: () => [],
  },
  selectedId: {
    type: String,
    default: null,
  },
  compact: {
    type: Boolean,
    default: false,
  },
  itemSize: {
    type: Number,
    default: 72,
  },
  lineClamp: {
    type: Number,
    default: 2,
  },
})

const emit = defineEmits(['select'])

const tablePt = computed(() => ({
  root: { class: 'sm-scrollbar-thin', style: { backgroundColor: 'var(--color-background-dark)' } },
  table: { style: { borderCollapse: 'separate', borderSpacing: '0', background: 'var(--color-background-darkest)' } },
  thead: {
    style: {
      background: 'var(--color-background-dark)',
      position: 'sticky',
      top: '0',
      zIndex: '1',
    },
  },
  headerCell: {
    style: {
      background: 'var(--color-background-dark)',
      borderBottom: '1px solid var(--color-border-default)',
      color: 'var(--color-text-dim)',
      fontWeight: '700',
      fontSize: '0.95rem',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      padding: '0.4rem 0.55rem',
    },
  },
  bodyRow: {
    style: {
      cursor: 'pointer',
      background: 'var(--color-background-dark)',
      height: `${props.itemSize}px`,
      transition: 'background-color 0.1s ease',
    },
  },
}))

const selectedRow = computed(() =>
  props.selectedId ? props.benchmarks.find(b => b.benchmarkId === props.selectedId) ?? null : null,
)

function onRowClick(event) {
  emit('select', event.data)
}
</script>

<template>
  <DataTable
    :value="benchmarks"
    :selection="selectedRow"
    selection-mode="single"
    data-key="benchmarkId"
    scrollable
    scroll-height="flex"
    :virtual-scroller-options="{ itemSize, showLoader: true }"
    striped-rows
    class="benchmarks-table"
    :style="{ '--bm-line-clamp': lineClamp }"
    :pt="tablePt"
    @row-click="onRowClick"
  >
    <Column
      header="Benchmark"
      field="title"
      :sortable="!compact"
      :style="{ minWidth: compact ? '11rem' : '22rem' }"
    >
      <template #body="{ data }">
        <div class="bm-cell">
          <div class="bm-cell__title" :title="data.title">
            {{ data.title }}
          </div>
          <div class="bm-cell__id-row">
            <span class="bm-cell__id">{{ data.benchmarkId }}</span>
            <ClassificationBadge v-if="data.marking" :level="data.marking" />
          </div>
          <div v-if="compact" class="bm-cell__meta-row">
            <span class="bm-cell__meta">
              {{ data.lastRevisionStr }} · {{ data.ruleCount }} rules · {{ data.lastRevisionDate }}
            </span>
            <EarlierRevisionsPills :revisions="data.revisionStrs" :max="2" />
          </div>
        </div>
      </template>
    </Column>

    <Column
      v-if="!compact"
      header="Latest"
      field="lastRevisionStr"
      sortable
      :style="{ width: '7rem' }"
    >
      <template #body="{ data }">
        <span class="bm-cell__mono">{{ data.lastRevisionStr }}</span>
      </template>
    </Column>

    <Column
      v-if="!compact"
      header="Rev. date"
      field="lastRevisionDate"
      sortable
      :style="{ width: '9rem' }"
    >
      <template #body="{ data }">
        <span class="bm-cell__mono bm-cell__dim">{{ data.lastRevisionDate }}</span>
      </template>
    </Column>

    <Column
      v-if="!compact"
      header="Rules"
      field="ruleCount"
      sortable
      :style="{ width: '6rem', textAlign: 'right' }"
    >
      <template #body="{ data }">
        <span class="bm-cell__mono">{{ data.ruleCount }}</span>
      </template>
    </Column>

    <Column
      v-if="!compact"
      header="Earlier revisions"
      :style="{ minWidth: '14rem' }"
    >
      <template #body="{ data }">
        <EarlierRevisionsPills :revisions="data.revisionStrs" />
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
.benchmarks-table {
  height: 100%;
}

.bm-cell {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
  padding: 0.15rem 0;
}

.bm-cell__title {
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-text-primary);
  display: -webkit-box;
  line-clamp: var(--bm-line-clamp, 2);
  -webkit-line-clamp: var(--bm-line-clamp, 2);
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.bm-cell__id-row {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.bm-cell__id {
  font-family: monospace;
  font-size: 1.05rem;
  color: var(--color-text-dim);
}

.bm-cell__meta-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.1rem;
}

.bm-cell__meta {
  font-family: monospace;
  font-size: 1.1rem;
  color: var(--color-text-dim);
}

.bm-cell__mono {
  font-family: monospace;
  font-size: 1.1rem;
  color: var(--color-text-primary);
}

.bm-cell__dim {
  color: var(--color-text-dim);
}
</style>
