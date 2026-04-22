import { computed, ref } from 'vue'
import { useAsyncState } from '../../../shared/composables/useAsyncState.js'
import { patchReview, putReview } from '../../AssetReview/api/assetReviewApi.js'
import { postReviewBatch } from '../api/collectionReviewApi.js'

function statusPayloadForAction(actionType, rejectText) {
  switch (actionType) {
    case 'accept':
      return 'accepted'
    case 'submit':
      return 'submitted'
    case 'unsubmit':
      return 'saved'
    case 'reject':
      return { label: 'rejected', text: rejectText ?? '' }
    default:
      return null
  }
}

export function useRuleReviewActions({ collectionId, assetId, ruleId }, deps) {
  const { reviewsData, upsertReview } = deps

  const saveError = ref(null)

  function onSaveError(err) {
    saveError.value = err?.message ?? 'Failed to save review.'
  }

  function clearSaveError() {
    saveError.value = null
  }

  const { isLoading: isSavingReview, execute: executeSaveReview } = useAsyncState(
    async ({ result: newResult, detail, comment, status }) => {
      saveError.value = null
      const aid = assetId.value
      const rid = ruleId.value
      const row = reviewsData.value?.find(r => r.assetId === aid && r.ruleId === rid)
        ?? reviewsData.value?.find(r => r.assetId === aid)
      const resultChanged = row ? newResult !== row.result : true

      const body = {
        result: newResult,
        detail: detail ?? '',
        comment: comment ?? '',
        resultEngine: resultChanged ? null : (row?.resultEngine ?? null),
        status: status || 'saved',
      }

      const saved = await putReview(collectionId.value, aid, rid, body)

      upsertReview(aid, saved)

      return saved
    },
    { immediate: false, onError: onSaveError },
  )

  function saveFullReview(data) {
    executeSaveReview(data)
  }

  const { isLoading: isSavingStatus, execute: executeSaveStatus } = useAsyncState(
    async ({ actionType, rejectText }) => {
      saveError.value = null
      const status = statusPayloadForAction(actionType, rejectText)
      if (status === null) {
        return null
      }

      const aid = assetId.value
      const rid = ruleId.value
      const saved = await patchReview(collectionId.value, aid, rid, { status })

      upsertReview(aid, saved)

      return saved
    },
    { immediate: false, onError: onSaveError },
  )

  function saveStatusAction(actionType, rejectText) {
    executeSaveStatus({ actionType, rejectText })
  }

  const { isLoading: isSavingBulk, execute: executeBulkAction } = useAsyncState(
    async ({ actionType, rows, rejectText }) => {
      saveError.value = null
      const status = statusPayloadForAction(actionType, rejectText)
      if (status === null) {
        return null
      }

      const assetIds = rows.map(r => r.assetId)
      const rid = ruleId.value

      const body = {
        source: { review: { status } },
        assets: { assetIds },
        rules: { ruleIds: [rid] },
      }

      await postReviewBatch(collectionId.value, body)

      if (typeof deps.refreshReviews === 'function') {
        await deps.refreshReviews()
      }
    },
    { immediate: false, onError: onSaveError },
  )

  function performBulkAction({ actionType, rows, rejectText }) {
    if (!rows?.length) {
      return
    }
    if (rows.length === 1) {
      const row = rows[0]
      if (assetId && assetId.value !== row.assetId) {
        assetId.value = row.assetId
      }
      executeSaveStatus({ actionType, rejectText })
      return
    }
    executeBulkAction({ actionType, rows, rejectText })
  }

  const { isLoading: isSavingBatchEdit, execute: executeBatchEdit } = useAsyncState(
    async ({ rows, payload }) => {
      saveError.value = null

      const assetIds = rows.map(r => r.assetId)
      const rid = ruleId.value

      const body = {
        source: { review: payload },
        assets: { assetIds },
        rules: { ruleIds: [rid] },
      }

      await postReviewBatch(collectionId.value, body)

      if (typeof deps.refreshReviews === 'function') {
        await deps.refreshReviews()
      }
    },
    { immediate: false, onError: onSaveError },
  )

  function performBatchEdit({ rows, payload }) {
    if (!rows?.length) return
    executeBatchEdit({ rows, payload })
  }

  const isSaving = computed(
    () => isSavingReview.value || isSavingStatus.value || isSavingBulk.value || isSavingBatchEdit.value,
  )

  return {
    isSaving,
    saveError,
    clearSaveError,
    saveFullReview,
    saveStatusAction,
    performBulkAction,
    performBatchEdit,
  }
}
