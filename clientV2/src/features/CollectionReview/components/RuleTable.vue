<script setup>
import RuleTableGrid from './RuleTableGrid.vue'
import RuleTableHeader from './RuleTableHeader.vue'

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
</script>

<template>
  <div class="rule-table">
    <RuleTableHeader />
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
