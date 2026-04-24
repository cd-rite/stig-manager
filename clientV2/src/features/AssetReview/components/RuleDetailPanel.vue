<script setup>
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import RuleInfo from './RuleInfo.vue'

defineProps({
  ruleContent: {
    type: Object,
    default: null,
  },
  isRuleLoading: {
    type: Boolean,
    default: false,
  },
  ruleContentError: {
    type: Object,
    default: null,
  },
  currentReview: {
    type: Object,
    default: null,
  },
  reviewHistory: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['retry-rule-content'])
</script>

<template>
  <Splitter
    layout="vertical"
    :pt="{
      gutter: { style: 'background: var(--color-border-dark)' },
      root: { style: 'border: none; background: transparent' },
    }"
    style="height: 100%"
  >
    <SplitterPanel :size="60" :min-size="20">
      <RuleInfo
        :rule-content="ruleContent"
        :is-loading="isRuleLoading"
        :rule-content-error="ruleContentError"
        @retry="emit('retry-rule-content')"
      />
    </SplitterPanel>
  </Splitter>
</template>
