<script setup>
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import RuleInfo from '../../../components/common/RuleInfo.vue'
import { useAsyncState } from '../../../shared/composables/useAsyncState.js'
import { fetchCollectionChecklist, fetchReviewsByRule, fetchRule } from '../api/collectionReviewApi.js'
import ChecklistGrid from './ChecklistGrid.vue'
import RuleTable from './RuleTable.vue'

const route = useRoute()

const collectionId = computed(() => route.params.collectionId)
const benchmarkId = computed(() => route.params.benchmarkId)
const revisionStr = computed(() => route.params.revisionStr)

const { state: gridData, isLoading: isChecklistLoading, execute: loadChecklist } = useAsyncState(
  () => fetchCollectionChecklist(collectionId.value, benchmarkId.value, revisionStr.value),
  { immediate: false, initialState: [] },
)

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

watch([collectionId, benchmarkId, revisionStr], () => {
  if (collectionId.value && benchmarkId.value && revisionStr.value) {
    loadChecklist()
  }
}, { immediate: true })

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
    ruleContent.value = null
    reviewsData.value = []
    return
  }
  ruleContent.value = null
  reviewsData.value = []
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
                @select-rule="onSelectRule"
              />
            </SplitterPanel>
            <SplitterPanel :size="50" :min-size="20">
              <RuleTable
                :grid-data="reviewsData ?? []"
                :is-loading="isReviewsLoading"
              />
            </SplitterPanel>
          </Splitter>
        </SplitterPanel>

        <SplitterPanel :size="25" :min-size="20">
          <RuleInfo
            :rule-content="ruleContent"
            :is-loading="isRuleLoading"
            :rule-content-error="ruleContentError"
            :selected-checklist-item="selectedChecklistItem"
            @retry="onRetryRule"
          />
        </SplitterPanel>
      </Splitter>
    </div>
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
