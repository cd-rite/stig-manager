import { computed, ref } from 'vue'
import { useAsyncState } from '../../../shared/composables/useAsyncState.js'
import { fetchChecklist } from '../api/assetReviewApi.js'

export function useChecklistData({ assetId, benchmarkId, revisionStr }) {
  const accessMode = ref('r')

  // --- Checklist data ---
  // onError: null — we expose checklistError so AssetReview.vue can show an inline
  // page-level banner. We must NOT redirect on a checklist 404/403 because that
  // can mean the STIG was simply unassigned, not that the whole route is gone.
  const {
    state: checklistData,
    isLoading: isChecklistLoading,
    error: checklistError,
    execute: loadChecklist,
  } = useAsyncState(
    async () => {
      const response = await fetchChecklist(
        assetId.value,
        benchmarkId.value,
        revisionStr.value,
        ['comment', 'detail', 'rule'],
      )
      accessMode.value = response.access ?? 'r'
      return response.checklist ?? []
    },
    { immediate: false, initialState: [], onError: null },
  )

  // Merged grid data: now provided directly by the unified API
  const gridData = computed(() => checklistData.value || [])

  function upsertReview(ruleId, review) {
    const idx = checklistData.value.findIndex(r => r.ruleId === ruleId)
    if (idx !== -1) {
      checklistData.value = [
        ...checklistData.value.slice(0, idx),
        { ...checklistData.value[idx], ...review },
        ...checklistData.value.slice(idx + 1),
      ]
    }
  }

  return {
    accessMode,
    checklistData,
    isChecklistLoading,
    checklistError,
    gridData,
    loadChecklist,
    upsertReview,
  }
}
