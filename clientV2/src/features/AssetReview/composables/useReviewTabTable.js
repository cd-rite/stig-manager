import { computed, inject, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { calculateChecklistStats, getEngineDisplay, getResultDisplay } from '../lib/checklistUtils.js'
import { buildEngineOptions } from '../lib/reviewFilterOptions.js'

const EMPTY_STATS = {
  total: 0,
  results: { pass: 0, fail: 0, notapplicable: 0, other: 0 },
  engine: { manual: 0, engine: 0, override: 0 },
  statuses: { saved: 0, submitted: 0, accepted: 0, rejected: 0 },
}

export function useReviewTabTable(dataRef, filterSchema) {
  const { accessMode, currentReview } = inject('assetReviewContext')
  const { formResult, formDetail, formComment } = inject('reviewEditForm')

  const editable = computed(() =>
    accessMode.value === 'rw' && (
      !currentReview.value?.status?.label
      || currentReview.value.status.label === 'saved'
      || currentReview.value.status.label === 'rejected'
    ),
  )

  const isAlreadyApplied = data =>
    data.result === formResult.value
    && (data.detail ?? '') === formDetail.value
    && (data.comment ?? '') === formComment.value

  const getApplyTooltip = (data) => {
    if (!editable.value) {
      return 'Cannot apply review while submitted or accepted'
    }
    if (isAlreadyApplied(data)) {
      return 'Review is already applied'
    }
    return 'Apply this review'
  }

  const filters = ref(
    Object.fromEntries(
      Object.entries(filterSchema).map(([key, matchMode]) => [key, { value: null, matchMode }]),
    ),
  )

  const resetFilters = () => {
    for (const key of Object.keys(filters.value)) {
      filters.value[key].value = null
    }
  }

  const route = useRoute()
  watch([
    () => route.params.collectionId,
    () => route.params.assetId,
    () => route.params.benchmarkId,
    () => route.params.revisionStr,
  ], () => {
    resetFilters()
  })

  const processedData = computed(() =>
    (dataRef.value ?? []).map(item => ({
      ...item,
      _engineDisplay: getEngineDisplay(item),
      _statusLabel: item.status?.label ?? '',
    })),
  )

  const stats = computed(() => calculateChecklistStats(dataRef.value) ?? EMPTY_STATS)

  const resultOptions = computed(() => {
    const results = new Set((dataRef.value ?? []).map(item => item.result).filter(Boolean))
    return Array.from(results).map(val => ({
      value: val,
      label: getResultDisplay(val),
    })).sort((a, b) => a.label.localeCompare(b.label))
  })

  const engineOptions = computed(() => buildEngineOptions(dataRef.value ?? []))

  return {
    editable,
    isAlreadyApplied,
    getApplyTooltip,
    filters,
    resetFilters,
    processedData,
    stats,
    resultOptions,
    engineOptions,
  }
}
