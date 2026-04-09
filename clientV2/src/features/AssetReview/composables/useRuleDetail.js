import { computed, ref } from 'vue'

export function useRuleDetail({ ruleLookupMap }) {
  // --- Selected rule ---
  const selectedRuleId = ref(null)

  const selectedChecklistItem = computed(() => {
    if (!selectedRuleId.value || !ruleLookupMap.value) {
      return null
    }
    return ruleLookupMap.value.get(selectedRuleId.value) ?? null
  })

  // --- Rule content ---
  const ruleContent = computed(() => selectedChecklistItem.value?.rule ?? null)
  const isRuleLoading = ref(false)
  const ruleContentError = ref(null)

  // --- Current review ---
  const currentReview = computed(() => {
    const item = selectedChecklistItem.value
    if (!item) {
      return null
    }
    return {
      ruleId: item.ruleId,
      result: item.result,
      detail: item.detail,
      comment: item.comment,
      status: item.status,
      ts: item.ts,
      touchTs: item.touchTs,
      resultEngine: item.resultEngine,
      autoResult: item.autoResult,
    }
  })

  // --- Handle rule selection ---
  function selectRule(ruleId) {
    if (ruleId === selectedRuleId.value) {
      return
    }
    selectedRuleId.value = ruleId
  }

  function clearSelectedRule() {
    selectedRuleId.value = null
  }

  return {
    selectedRuleId,
    selectedChecklistItem,
    ruleContent,
    isRuleLoading,
    ruleContentError,
    currentReview,
    selectRule,
    clearSelectedRule,
  }
}
