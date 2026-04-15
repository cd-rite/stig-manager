import { apiCall } from '../../../shared/api/apiClient.js'

export function fetchCollectionChecklist(collectionId, benchmarkId, revisionStr) {
  return apiCall('getChecklistByCollectionStig', {
    collectionId,
    benchmarkId,
    revisionStr,
  })
}

export function fetchRule(benchmarkId, revisionStr, ruleId) {
  return apiCall('getRuleByRevision', {
    benchmarkId,
    revisionStr,
    ruleId,
    projection: ['detail', 'ccis', 'check', 'fix'],
  })
}

export function fetchReviewsByRule(collectionId, ruleId) {
  return apiCall('getReviewsByCollection', {
    collectionId,
    rules: 'all',
    ruleId,
  })
}
