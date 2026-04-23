<script setup>
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHttpStatus } from '../../../shared/api/apiClient.js'
import { fetchStigRevisions } from '../../../shared/api/stigsApi.js'
import { useAsyncState } from '../../../shared/composables/useAsyncState.js'
import RuleInfo from '../../AssetReview/components/RuleInfo.vue'
import { useBenchmarkList } from '../composables/useBenchmarkList.js'
import { useLineClamp } from '../composables/useLineClamp.js'
import { useRevisionDiff } from '../composables/useRevisionDiff.js'
import { useRevisionRules } from '../composables/useRevisionRules.js'
import { useRuleSelection } from '../composables/useRuleSelection.js'
import BenchmarksTable from './BenchmarksTable.vue'
import DiffDetailPanel from './DiffDetailPanel.vue'
import RulePane from './RulePane.vue'

const route = useRoute()
const router = useRouter()

const benchmarkIdParam = computed(() => route.params.benchmarkId ?? null)
const revisionStrParam = computed(() => route.params.revisionStr ?? null)
const compareRev = computed(() => route.query.compareRev ?? null)
const selectedRuleId = computed(() => route.query.ruleId ?? null)
const selectedDiffRowKey = computed(() => route.query.diffKey ?? null)

const hasSelection = computed(() => !!benchmarkIdParam.value)
const diffMode = computed(() => !!compareRev.value)

function handleRouteError(err) {
  const status = getHttpStatus(err)
  if (status === 403 || status === 404 || status === 400) {
    router.push({ name: 'not-found', params: { pathMatch: route.path.substring(1).split('/') } })
  }
}

const {
  benchmarks,
  filter,
  filtered,
  filteredCount,
  totalCount,
  isLoading: benchmarksLoading,
  error: benchmarksError,
  reload: reloadBenchmarks,
} = useBenchmarkList({ onRouteError: handleRouteError })

const selectedBenchmark = computed(() => {
  const id = benchmarkIdParam.value
  if (!id) {
    return null
  }
  return (benchmarks.value ?? []).find(b => b.benchmarkId === id) ?? null
})

const effectiveViewRev = computed(() => revisionStrParam.value ?? selectedBenchmark.value?.lastRevisionStr ?? null)

const {
  state: benchmarkRevisions,
  isLoading: revisionsLoading,
  execute: loadRevisions,
} = useAsyncState(
  bm => fetchStigRevisions(bm),
  { immediate: false, initialState: [], onError: null },
)

watch(
  benchmarkIdParam,
  (bm) => {
    if (bm) {
      loadRevisions(bm)
    }
    else {
      benchmarkRevisions.value = []
    }
  },
  { immediate: true },
)

const { getRulesForRev, watchCurrent, invalidate: invalidateRules } = useRevisionRules()
const revState = watchCurrent(benchmarkIdParam, effectiveViewRev)

// Row-height density for the rule/diff tables in the middle pane. `ruleLineClamp`
// is writable — v-model flows from the orchestrator through RulePane/RulePaneToolbar
// into the shared <DensityControls>.
const {
  lineClamp: ruleLineClamp,
  itemSize: ruleItemSize,
  min: ruleLineClampMin,
  max: ruleLineClampMax,
} = useLineClamp(2)

// Fixed row heights for the benchmark list — title can wrap to 2 lines plus id-row
// and (in compact mode) a meta row with earlier revisions.
const bmLineClamp = 2
const bmItemSize = computed(() => hasSelection.value ? 92 : 76)

const {
  diffRows,
  diffStatus,
  diffError,
  diffDetailFor,
  retry: retryDiff,
  rowByKey,
} = useRevisionDiff({
  benchmarkId: benchmarkIdParam,
  viewRev: effectiveViewRev,
  compareRev,
  getRulesForRev,
})

const {
  ruleContent,
  isRuleLoading,
  ruleContentError,
  retry: retryRule,
} = useRuleSelection({
  benchmarkId: benchmarkIdParam,
  viewRev: effectiveViewRev,
  selectedRuleId,
})

// RuleInfo (from AssetReview) uses `selectedChecklistItem` both as an empty-state
// gate and for the "Rule for Group X" crumb. Feed it the matching rule from the
// loaded revision so the component actually renders its content.
const selectedRuleStub = computed(() => {
  const id = selectedRuleId.value
  if (!id) {
    return null
  }
  return (revState.rules ?? []).find(r => r.ruleId === id) ?? null
})

const selectedDiffRow = computed(() =>
  selectedDiffRowKey.value ? rowByKey(selectedDiffRowKey.value) : null,
)
const selectedDiffDetail = computed(() =>
  selectedDiffRowKey.value ? diffDetailFor(selectedDiffRowKey.value) : null,
)

// If a benchmarkId is in the route but not resolvable once the list loads, redirect.
watch([benchmarks, benchmarkIdParam], ([list, bm]) => {
  if (!bm || !list?.length) {
    return
  }
  if (!list.find(b => b.benchmarkId === bm)) {
    router.push({ name: 'not-found', params: { pathMatch: route.path.substring(1).split('/') } })
  }
})

// Auto-select first rule (view mode). router.replace so it doesn't add history.
watch(
  () => [revState.rules, diffMode.value, selectedRuleId.value, selectedBenchmark.value],
  () => {
    if (diffMode.value) {
      return
    }
    if (selectedRuleId.value) {
      return
    }
    if (!selectedBenchmark.value) {
      return
    }
    const first = revState.rules?.[0]
    if (!first) {
      return
    }
    replaceQuery({ ruleId: first.ruleId })
  },
)

// Auto-select first diff row when diffRows lands.
watch(
  () => [diffRows.value, diffMode.value, selectedDiffRowKey.value],
  () => {
    if (!diffMode.value) {
      return
    }
    if (selectedDiffRowKey.value) {
      return
    }
    const first = diffRows.value?.[0]
    if (!first) {
      return
    }
    replaceQuery({ diffKey: first.key })
  },
)

// If the current benchmark has only one revision, strip any stale ?compareRev /
// ?diffKey (a user could land here via an old deep-link from a multi-rev benchmark).
watch(benchmarkRevisions, (revs) => {
  if ((revs?.length ?? 0) <= 1 && (compareRev.value || selectedDiffRowKey.value)) {
    replaceQuery({ compareRev: null, diffKey: null })
  }
})

function goToList() {
  router.push({ name: 'stig-library' })
}
function goToBenchmark(benchmark) {
  router.push({
    name: 'stig-library-benchmark',
    params: { benchmarkId: benchmark.benchmarkId },
  })
}
function setViewRev(rev) {
  router.push({
    name: 'stig-library-benchmark',
    params: { benchmarkId: benchmarkIdParam.value, revisionStr: rev },
    query: compareRev.value ? { compareRev: compareRev.value } : {},
  })
}
function setCompareRev(rev) {
  const query = { ...route.query }
  if (rev) {
    query.compareRev = rev
  }
  else {
    delete query.compareRev
  }
  delete query.ruleId
  delete query.diffKey
  router.push({ name: route.name, params: route.params, query })
}
function setSelectedRule(ruleId) {
  const query = { ...route.query }
  if (ruleId) {
    query.ruleId = ruleId
  }
  else {
    delete query.ruleId
  }
  router.push({ name: route.name, params: route.params, query })
}
function setSelectedDiffRow(key) {
  const query = { ...route.query }
  if (key) {
    query.diffKey = key
  }
  else {
    delete query.diffKey
  }
  router.push({ name: route.name, params: route.params, query })
}
function replaceQuery(patch) {
  const query = { ...route.query, ...patch }
  for (const [k, v] of Object.entries(patch)) {
    if (v == null) {
      delete query[k]
    }
  }
  router.replace({ name: route.name, params: route.params, query })
}

function onRetryDiff() {
  invalidateRules(benchmarkIdParam.value)
  retryDiff()
}
</script>

<template>
  <div class="stig-library">
    <header class="stig-library__header">
      <h1
        class="stig-library__title"
        :class="{ 'stig-library__title--clickable': hasSelection }"
        :title="hasSelection ? 'Back to full STIG list' : null"
        @click="hasSelection && goToList()"
      >
        STIG Library
      </h1>
    </header>

    <div class="stig-library__bar">
      <IconField icon-position="left" class="stig-library__filter">
        <InputIcon class="pi pi-search" />
        <InputText
          v-model="filter"
          placeholder="Filter benchmarks by title or ID…"
        />
      </IconField>
      <!-- STIG content search placeholder. The app does not yet have a backend
           endpoint for searching STIG content (check/fix/discussion text across
           benchmarks). Wire this up when that endpoint exists. -->
      <Button
        v-tooltip="'STIG content search — coming soon'"
        icon="pi pi-search-plus"
        label="Full search…"
        severity="secondary"
        size="small"
        disabled
      />
      <div class="stig-library__bar-spacer" />
      <span class="stig-library__count">
        {{ filteredCount }} of {{ totalCount }}
      </span>
    </div>

    <div v-if="benchmarksLoading" class="stig-library__state">
      <i class="pi pi-spin pi-spinner" />
      <span>Loading benchmarks…</span>
    </div>
    <div v-else-if="benchmarksError" class="stig-library__state stig-library__state--error">
      <i class="pi pi-exclamation-triangle" />
      <span>{{ benchmarksError.message ?? 'Could not load benchmarks.' }}</span>
      <button type="button" class="stig-library__retry" @click="reloadBenchmarks">
        Retry
      </button>
    </div>

    <Splitter
      v-else-if="hasSelection"
      :pt="{
        gutter: { style: 'background: var(--color-border-default)' },
        root: { style: 'border: none; background: transparent; height: 100%' },
      }"
      class="stig-library__tri"
    >
      <SplitterPanel :size="16" :min-size="8">
        <BenchmarksTable
          :benchmarks="filtered"
          :selected-id="benchmarkIdParam"
          compact
          :item-size="bmItemSize"
          :line-clamp="bmLineClamp"
          @select="goToBenchmark"
        />
      </SplitterPanel>
      <SplitterPanel :size="40" :min-size="15">
        <RulePane
          v-model:line-clamp="ruleLineClamp"
          :benchmark="selectedBenchmark"
          :view-rev="effectiveViewRev"
          :compare-rev="compareRev"
          :revisions="benchmarkRevisions"
          :revisions-loading="revisionsLoading"
          :rules="revState.rules"
          :rules-loading="revState.isLoading"
          :rules-error="revState.error"
          :diff-rows="diffRows"
          :diff-status="diffStatus"
          :diff-error="diffError"
          :selected-rule-id="selectedRuleId"
          :selected-diff-row-key="selectedDiffRowKey"
          :item-size="ruleItemSize"
          :line-clamp-min="ruleLineClampMin"
          :line-clamp-max="ruleLineClampMax"
          @change-view-rev="setViewRev"
          @change-compare-rev="setCompareRev"
          @select-rule="r => setSelectedRule(r.ruleId)"
          @select-diff-row="r => setSelectedDiffRow(r.key)"
          @close="goToList"
          @retry-rules="revState.retry"
          @retry-diff="onRetryDiff"
        />
      </SplitterPanel>
      <SplitterPanel :size="44" :min-size="18">
        <div class="stig-library__detail">
          <RuleInfo
            v-if="!diffMode"
            :rule-content="ruleContent"
            :is-loading="isRuleLoading"
            :rule-content-error="ruleContentError"
            :selected-checklist-item="selectedRuleStub"
            @retry="retryRule"
          />
          <DiffDetailPanel
            v-else
            :diff-row="selectedDiffRow"
            :diff-detail="selectedDiffDetail"
            :view-rev="effectiveViewRev"
            :compare-rev="compareRev"
            :status="diffStatus"
            :error="diffError"
          />
        </div>
      </SplitterPanel>
    </Splitter>

    <div v-else class="stig-library__list">
      <BenchmarksTable
        :benchmarks="filtered"
        :selected-id="null"
        :compact="false"
        :item-size="bmItemSize"
        :line-clamp="bmLineClamp"
        @select="goToBenchmark"
      />
    </div>
  </div>
</template>

<style scoped>
.stig-library {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-background-darkest);
  color: var(--color-text-primary);
}

.stig-library__header {
  padding: 0.75rem 1rem 0.25rem;
}

.stig-library__title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary);
  display: inline-block;
}

.stig-library__title--clickable {
  cursor: pointer;
}

.stig-library__title--clickable:hover {
  color: var(--color-primary-highlight);
}

.stig-library__bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem 0.75rem;
  border-bottom: 1px solid var(--color-border-default);
}

.stig-library__filter {
  min-width: 20rem;
  max-width: 32rem;
  flex: 1;
}

.stig-library__bar-spacer {
  flex: 1;
}

.stig-library__count {
  color: var(--color-text-dim);
  font-size: 0.95rem;
}

.stig-library__tri {
  flex: 1;
  min-height: 0;
}

.stig-library__list {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding: 0.5rem;
}

.stig-library__detail {
  height: 100%;
  overflow-y: auto;
  padding: 0.5rem 1rem 1rem;
  background-color: var(--color-background-dark);
}

.stig-library__state {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  color: var(--color-text-dim);
  font-style: italic;
}

.stig-library__state--error {
  color: var(--color-text-error);
}

.stig-library__retry {
  margin-left: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 3px;
  border: 1px solid var(--color-border-default);
  background-color: var(--color-background-subtle);
  color: var(--color-text-primary);
  cursor: pointer;
  font-style: normal;
}

.stig-library__retry:hover {
  background-color: var(--color-bg-hover);
}
</style>
