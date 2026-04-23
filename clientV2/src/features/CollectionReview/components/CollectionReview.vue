<script setup>
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RuleInfo from '../../../components/common/RuleInfo.vue'
import { getHttpStatus } from '../../../shared/api/apiClient.js'
import { fetchCollection } from '../../../shared/api/collectionsApi.js'
import { useAsyncState } from '../../../shared/composables/useAsyncState.js'
import { useCurrentUser } from '../../../shared/composables/useCurrentUser.js'
import { defaultFieldSettings } from '../../../shared/lib/reviewFormUtils.js'
import { useRecentViews } from '../../NavRail/composables/useRecentViews.js'
import { fetchAssetsByCollectionStig, fetchCollectionChecklist, fetchReviewsByRule, fetchRule } from '../api/collectionReviewApi.js'
import { useBulkActionStates } from '../composables/useBulkActionStates.js'
import { useRuleReviewActions } from '../composables/useRuleReviewActions.js'
import BatchEditModal from './BatchEditModal.vue'
import ChecklistGrid from './ChecklistGrid.vue'
import RejectReasonModal from './RejectReasonModal.vue'
import RuleTable from './RuleTable.vue'

const route = useRoute()
const router = useRouter()
const { addView, removeView } = useRecentViews()
const { getCollectionRoleId } = useCurrentUser()

const collectionId = computed(() => route.params.collectionId)
const benchmarkId = computed(() => route.params.benchmarkId)
const revisionStr = computed(() => route.params.revisionStr)

function recentViewKey(cId = collectionId.value, bId = benchmarkId.value) {
  return `collection-review:${cId}:${bId}`
}

// Fatal route-level error handler.
// Any error on it → redirect.
function handleRouteError(err) {
  const status = getHttpStatus(err)
  const isPrivilegeError = err.body?.error === 'User has insufficient privilege to complete this request.'
  if (status === 404 || status === 403 || status === 400 || isPrivilegeError) {
    removeView(recentViewKey())
    router.push({ name: 'not-found', params: { pathMatch: route.path.substring(1).split('/') } })
  }
  else {
    removeView(recentViewKey())
    router.push({ name: 'not-found', params: { pathMatch: route.path.substring(1).split('/') } })
  }
}

const { state: collection, execute: loadCollection } = useAsyncState(
  () => fetchCollection(collectionId.value),
  { immediate: false, initialState: null, onError: handleRouteError },
)

const fieldSettings = computed(() => collection.value?.settings?.fields ?? defaultFieldSettings)
const statusSettings = computed(() => collection.value?.settings?.status ?? {
  canAccept: false,
  minAcceptGrant: 4,
})

const roleId = computed(() => getCollectionRoleId(collectionId.value))
const canAccept = computed(() =>
  statusSettings.value.canAccept && roleId.value >= statusSettings.value.minAcceptGrant,
)

const { state: gridData, isLoading: isChecklistLoading, error: checklistError, execute: loadChecklist } = useAsyncState(
  () => fetchCollectionChecklist(collectionId.value, benchmarkId.value, revisionStr.value),
  { immediate: false, initialState: [] },
)

const { state: assets, execute: loadAssets } = useAsyncState(
  () => fetchAssetsByCollectionStig(collectionId.value, benchmarkId.value),
  { immediate: false, initialState: [] },
)

const assetCount = computed(() => assets.value?.length ?? 0)

const selectedRuleId = ref(null)

const selectedChecklistItem = computed(() => {
  if (!selectedRuleId.value || !gridData.value?.length) {
    return null
  }
  return gridData.value.find(r => r.ruleId === selectedRuleId.value) ?? null
})

const {
  state: ruleContent,
  isLoading: isRuleLoading,
  error: ruleContentError,
  execute: loadRuleContent,
} = useAsyncState(
  ruleId => fetchRule(benchmarkId.value, revisionStr.value, ruleId),
  { immediate: false, initialState: null, onError: null },
)

const {
  state: reviewsData,
  isLoading: isReviewsLoading,
  execute: loadReviews,
} = useAsyncState(
  ruleId => fetchReviewsByRule(collectionId.value, ruleId),
  { immediate: false, initialState: [], onError: null },
)

watch(collectionId, () => {
  if (collectionId.value) {
    loadCollection()
  }
}, { immediate: true })

watch([collectionId, benchmarkId, revisionStr], () => {
  if (collectionId.value && benchmarkId.value && revisionStr.value) {
    loadChecklist()
    loadAssets()
  }
}, { immediate: true })

watch(
  [collection, () => route.params.benchmarkId, () => route.params.revisionStr],
  ([c]) => {
    if (c?.name && route.params.benchmarkId) {
      addView({
        key: recentViewKey(collectionId.value, route.params.benchmarkId),
        url: route.fullPath,
        label: `${c.name} / ${route.params.benchmarkId}`,
        type: 'collection-review',
      })
    }
  },
)

// If the checklist fetch fails (e.g. bad benchmarkId/revisionStr), remove the
// recent view entry so the nav rail doesn't pin a broken route.
watch(checklistError, (err) => {
  if (err) {
    removeView(recentViewKey())
  }
})

watch(gridData, (data) => {
  if (!data?.length) {
    selectedRuleId.value = null
    return
  }
  const stillValid = selectedRuleId.value && data.some(r => r.ruleId === selectedRuleId.value)
  if (!stillValid) {
    selectedRuleId.value = data[0].ruleId
  }
})

watch(selectedRuleId, (ruleId) => {
  if (!ruleId) {
    return
  }
  if (benchmarkId.value && revisionStr.value) {
    loadRuleContent(ruleId)
  }
  if (collectionId.value) {
    loadReviews(ruleId)
  }
})

function onSelectRule(ruleId) {
  selectedRuleId.value = ruleId
}

function onRetryRule() {
  if (selectedRuleId.value) {
    loadRuleContent(selectedRuleId.value)
  }
}

const showRuleLoading = computed(() => isRuleLoading.value && !ruleContent.value)
const showReviewsLoading = computed(() => isReviewsLoading.value)

const editingAssetId = ref(null)
const accessMode = ref('rw')
const selectedAssetIds = ref(new Set())

const selectedRows = computed({
  get: () => {
    const ids = selectedAssetIds.value
    if (!ids.size) {
      return []
    }
    return (reviewsData.value || []).filter(r => ids.has(r.assetId))
  },
  set: (rows) => {
    selectedAssetIds.value = new Set((rows || []).map(r => r.assetId))
  },
})

const { actionStates } = useBulkActionStates(selectedRows, fieldSettings)

watch(selectedRuleId, () => {
  selectedAssetIds.value = new Set()
})

const currentReview = computed(() => {
  if (!editingAssetId.value || !reviewsData.value?.length) {
    return null
  }
  return reviewsData.value.find(r => r.assetId === editingAssetId.value) ?? null
})

function upsertReview(assetId, updated) {
  if (!reviewsData.value) {
    return
  }
  const idx = reviewsData.value.findIndex(r => r.assetId === assetId)
  if (idx === -1) {
    reviewsData.value = [...reviewsData.value, { ...updated, assetId }]
  }
  else {
    const merged = { ...reviewsData.value[idx], ...updated, assetId }
    reviewsData.value = [
      ...reviewsData.value.slice(0, idx),
      merged,
      ...reviewsData.value.slice(idx + 1),
    ]
  }
}

const {
  isSaving,
  saveError,
  clearSaveError,
  saveFullReview,
  saveStatusAction,
  performBulkAction,
  performBatchEdit,
} = useRuleReviewActions(
  { collectionId, assetId: editingAssetId, ruleId: selectedRuleId },
  {
    reviewsData,
    upsertReview,
    currentReview,
    refreshReviews: () => selectedRuleId.value ? loadReviews(selectedRuleId.value) : null,
  },
)

function onRowSave(payload) {
  if (payload?.assetId) {
    editingAssetId.value = payload.assetId
  }
  saveFullReview({
    result: payload.result,
    detail: payload.detail,
    comment: payload.comment,
    status: payload.status,
  })
}

function onStatusAction(payload) {
  if (payload?.assetId) {
    editingAssetId.value = payload.assetId
  }
  saveStatusAction(payload.actionType)
}

function onEditAsset(assetId) {
  editingAssetId.value = assetId
}

function onEditClose() {
  editingAssetId.value = null
}

const rejectModalVisible = ref(false)
const batchEditModalVisible = ref(false)
const pendingRejectRows = ref([])

function runAction(actionType, rows, rejectText) {
  if (rows.length === 1) {
    editingAssetId.value = rows[0].assetId
  }
  performBulkAction({ actionType, rows, rejectText })
}

function onBulkAction(actionType) {
  const rows = selectedRows.value
  if (!rows?.length) {
    return
  }
  if (actionType === 'batchEdit') {
    batchEditModalVisible.value = true
    return
  }
  if (actionType === 'reject') {
    pendingRejectRows.value = [...rows]
    rejectModalVisible.value = true
    return
  }
  runAction(actionType, rows)
}

function onRejectConfirm(text) {
  const rows = pendingRejectRows.value
  pendingRejectRows.value = []
  if (!rows.length) {
    return
  }
  runAction('reject', rows, text)
}

function onRejectCancel() {
  pendingRejectRows.value = []
}

function onBatchEditConfirm(payload) {
  const rows = selectedRows.value
  if (!rows?.length) {
    return
  }
  performBatchEdit({ rows, payload })
}

// No more provide. Everything passed via props.
</script>

<template>
  <div class="collection-review">
    <div class="collection-review__content">
      <Splitter
        :pt="{
          gutter: { style: 'background: var(--color-border-dark)' },
          root: { style: 'border: none; background: transparent' },
        }"
        style="height: 100%"
      >
        <SplitterPanel :size="75" :min-size="40">
          <Splitter
            layout="vertical"
            :pt="{
              gutter: { style: 'background: var(--color-border-dark)' },
              root: { style: 'border: none; background: transparent' },
            }"
            style="height: 100%"
          >
            <SplitterPanel :size="50" :min-size="20">
              <ChecklistGrid
                :grid-data="gridData ?? []"
                :is-loading="isChecklistLoading"
                :selected-rule-id="selectedRuleId"
                :asset-count="assetCount"
                @select-rule="onSelectRule"
              />
            </SplitterPanel>
            <SplitterPanel :size="50" :min-size="20">
              <RuleTable
                v-model:selection="selectedRows"
                :grid-data="reviewsData ?? []"
                :is-loading="showReviewsLoading"
                :selected-rule-id="selectedRuleId"
                :collection-id="collectionId"
                :field-settings="fieldSettings"
                :can-accept="canAccept"
                :is-saving="isSaving"
                :save-error="saveError"
                :clear-save-error="clearSaveError"
                :current-review="currentReview"
                :action-states="actionStates"
                @row-save="onRowSave"
                @status-action="onStatusAction"
                @edit-asset="onEditAsset"
                @edit-close="onEditClose"
                @bulk-action="onBulkAction"
              />
            </SplitterPanel>
          </Splitter>
        </SplitterPanel>

        <SplitterPanel :size="25" :min-size="20">
          <RuleInfo
            :rule-content="ruleContent"
            :is-loading="showRuleLoading"
            :rule-content-error="ruleContentError"
            :selected-checklist-item="selectedChecklistItem"
            @retry="onRetryRule"
          />
        </SplitterPanel>
      </Splitter>
    </div>

    <RejectReasonModal
      v-model:visible="rejectModalVisible"
      :count="pendingRejectRows.length"
      @confirm="onRejectConfirm"
      @cancel="onRejectCancel"
    />

    <BatchEditModal
      v-model:visible="batchEditModalVisible"
      :rows="selectedRows"
      :field-settings="fieldSettings"
      @confirm="onBatchEditConfirm"
    />
  </div>
</template>

<style scoped>
.collection-review {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-background-darkest);
  color: var(--color-text-primary);
}

.collection-review__content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
