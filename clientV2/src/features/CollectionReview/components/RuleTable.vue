<script setup>
import RuleTableGrid from './RuleTableGrid.vue'
import RuleTableHeader from './RuleTableHeader.vue'
import { useGridDensity } from '../../../shared/composables/useGridDensity.js'

defineProps({
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

const { lineClamp, itemSize } = useGridDensity('collection-rule-table', 1, 12, 24)
</script>

<template>
  <div
    class="rule-table"
    :style="{ '--line-clamp': lineClamp, '--item-size': `${itemSize}px` }"
  >
    <RuleTableHeader :selected-rule-id="selectedRuleId" />
    <RuleTableGrid :grid-data="gridData" :is-loading="isLoading" />
  </div>
</template>

<style scoped>
.rule-table {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-subtle);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  overflow: hidden;
}
</style>
