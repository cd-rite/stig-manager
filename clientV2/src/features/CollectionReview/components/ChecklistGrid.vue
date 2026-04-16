<script setup>
import { computed, ref } from 'vue'
import { useGridDensity } from '../../../shared/composables/useGridDensity.js'
import ChecklistGridHeader from './ChecklistGridHeader.vue'
import ChecklistGridTable from './ChecklistGridTable.vue'

const props = defineProps({
  gridData: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  selectedRuleId: {
    type: String,
    default: null,
  },
  assetCount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['select-rule'])

const searchFilter = ref('')

const selectedRow = computed(() => {
  if (!props.selectedRuleId) {
    return null
  }
  return props.gridData.find(r => r.ruleId === props.selectedRuleId) ?? null
})

function onSelectionChange(row) {
  if (row?.ruleId) {
    emit('select-rule', row.ruleId)
  }
}

const { lineClamp, itemSize } = useGridDensity('collection-checklist', 1, 12, 24)
</script>

<template>
  <div
    class="checklist-grid relative flex h-full flex-col bg-[var(--color-background-dark)]"
    :style="{ '--line-clamp': lineClamp, '--item-size': `${itemSize}px` }"
  >
    <ChecklistGridHeader v-model:search-filter="searchFilter" />
    <ChecklistGridTable
      :grid-data="gridData"
      :is-loading="isLoading"
      :selected-row="selectedRow"
      :search-filter="searchFilter"
      :asset-count="assetCount"
      @update:selected-row="onSelectionChange"
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
</style>
