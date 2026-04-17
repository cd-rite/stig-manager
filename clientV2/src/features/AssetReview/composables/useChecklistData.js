import { computed, ref } from 'vue'
import { useAsyncState } from '../../../shared/composables/useAsyncState.js'
import { fetchChecklist } from '../api/assetReviewApi.js'
import { getEngineDisplay } from '../lib/checklistUtils.js'

function augmentItem(item) {
  return {
    ...item,
    _statusText: item.status?.label ?? item.status,
    _engineDisplay: getEngineDisplay(item),
  }
}

export function useChecklistData({ assetId, benchmarkId, revisionStr }) {
  const accessMode = ref('r')

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
        ['comment', 'detail'],
      )
      accessMode.value = response.access ?? 'r'
      return (response.checklist ?? []).map(augmentItem)
    },
    { immediate: false, initialState: [], onError: null },
  )

  const gridData = computed(() => checklistData.value || [])

  const ruleLookupMap = computed(() => {
    const map = new Map()
    for (const item of gridData.value) {
      map.set(item.ruleId, item)
    }
    return map
  })

  function upsertReview(ruleId, review) {
    const idx = checklistData.value.findIndex(r => r.ruleId === ruleId)
    if (idx !== -1) {
      checklistData.value[idx] = augmentItem({ ...checklistData.value[idx], ...review })
    }
  }

  return {
    accessMode,
    checklistData,
    isChecklistLoading,
    checklistError,
    gridData,
    ruleLookupMap,
    loadChecklist,
    upsertReview,
  }
}
