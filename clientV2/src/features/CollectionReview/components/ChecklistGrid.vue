<script setup>
import { computed } from 'vue'
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
})

const emit = defineEmits(['select-rule'])

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
</script>

<template>
  <div
    class="checklist-grid relative flex h-full flex-col bg-[var(--color-background-dark)]"
    :style="{ '--item-size': '36px', '--line-clamp': 1 }"
  >
    <ChecklistGridHeader />
    <ChecklistGridTable
      :grid-data="gridData"
      :is-loading="isLoading"
      :selected-row="selectedRow"
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
