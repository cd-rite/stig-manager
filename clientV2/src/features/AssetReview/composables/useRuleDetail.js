import { computed, ref, watch } from 'vue'
import { useAsyncState } from '../../../shared/composables/useAsyncState.js'
import { fetchReview, fetchRule } from '../api/assetReviewApi.js'

export function useRuleDetail({ ruleLookupMap, collectionId, assetId, benchmarkId, revisionStr }) {
  // --- Selected rule ---
  const selectedRuleId = ref(null)

  const selectedChecklistItem = computed(() => {
    if (!selectedRuleId.value || !ruleLookupMap.value) {
      return null
    }
    return ruleLookupMap.value.get(selectedRuleId.value) ?? null
  })

  // --- Rule content (fetched on demand via getRuleByRevision) ---
  const {
    state: ruleContent,
    isLoading: isRuleLoading,
    error: ruleContentError,
    execute: loadRuleContent,
  } = useAsyncState(
    ruleId => fetchRule(benchmarkId.value, revisionStr.value, ruleId),
    { immediate: false, initialState: null, onError: null },
  )

  // --- Current review (fetched via getReviewByAssetRule for popover attribution) ---
  const {
    state: currentReview,
    isLoading: isReviewLoading,
    error: reviewError,
    execute: loadCurrentReview,
  } = useAsyncState(
    ruleId => fetchReview(collectionId.value, assetId.value, ruleId),
    { immediate: false, initialState: null, onError: null },
  )

  // Fire both fetches in parallel when the selected rule changes
  watch(selectedRuleId, (ruleId) => {
    if (!ruleId) {
      ruleContent.value = null
      currentReview.value = null
      return
    }

    // Clear stale data immediately so the UI doesn't flash previous content on slow networks
    ruleContent.value = null
    currentReview.value = null

    if (benchmarkId?.value && revisionStr?.value) {
      loadRuleContent(ruleId)
    }

    if (collectionId?.value && assetId?.value) {
      loadCurrentReview(ruleId)
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
    isReviewLoading,
    reviewError,
    selectRule,
    clearSelectedRule,
  }
}
