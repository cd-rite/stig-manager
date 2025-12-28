<template>
  <DataTable
    :value="data"
    scrollable
    resizableColumns
    columnResizeMode="fit"
    scroll-height="flex"
    :virtualScrollerOptions="{ itemSize: 55, delay: 0 }"
    :pt="{
        table: { style: 'min-width: 50rem; table-layout: fixed' },
      column: {
          headerCell: { style: 'border-right: 1px solid var(--p-datatable-border-color); border-top: 1px solid var(--p-datatable-border-color)' },
          bodyCell: { style: 'padding: 4px 12px' }  /* Add this */
        }
      }"
  >
    <template v-for="col in columns" :key="col.field">
      <component :is="col.component" v-bind="col" :style="{ fontSize: '12px', height: '55px', width: col.width, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }"/>
    </template>
  </DataTable>
  <!-- {{ JSON.stringify(data, null, 2) }} -->
</template>

<script setup>
import { computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import DurationColumn from './DurationColumn.vue'
import PercentageColumn from './PercentageColumn.vue'
import { calculateCoraRiskRating } from '../lib/libCora.js'
import AssetWithLabelsColumn from './AssetWithLabelsColumn.vue'

const props = defineProps({
  apiMetricsSummary: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})


const aggregationType = computed(() => {
  const m = props.apiMetricsSummary
  if (m.length === 0) return null
  if (m[0].assetId && m[0].benchmarkId) return 'unagg'
  if (m[0].collectionId) return 'collection'
  if (m[0].assetId) return 'asset'
  if (m[0].labelId) return 'label'
  if (m[0].benchmarkId) return 'stig'
})

const columns = computed(() => {
  // Common columns
  const commonColumns = [
    { field: 'checks', header: 'Checks', component: Column, width: '50px'  },
    { field: 'oldest', header: 'Oldest', component: DurationColumn, width: '50px' },
    { field: 'updated', header: 'Updated', component: DurationColumn, width: '50px' },
    { field: 'assessedPct', header: 'Assessed', component: PercentageColumn, width: '80px' },
    { field: 'submitted', header: 'Submitted', component: PercentageColumn, width: '80px' },
    { field: 'accepted', header: 'Accepted', component: PercentageColumn, width: '80px' },
    { field: 'rejected', header: 'Rejected', component: PercentageColumn, width: '80px' },
    { field: 'cora', header: 'CORA', component: Column, width: '50px' },
    { field: 'low', header: 'Low', component: Column, width: '50px' },
    { field: 'medium', header: 'Medium', component: Column, width: '50px' },
    { field: 'high', header: 'High', component: Column, width: '50px' },
  ]
  switch (aggregationType.value) {
    case 'asset':
      return [
        { field: 'assetName', header: 'Asset', component: AssetWithLabelsColumn, width: '300px' },
        { field: 'stigCnt', header: 'Stigs', component: Column, width: '50px' },
        ...commonColumns,
      ]
    case 'stig':
      return [
        { field: 'benchmarkId', header: 'Benchmark', component: Column, width: '200px'  },
        { field: 'title', header: 'Title', component: Column, width: '200px'  },
        { field: 'revision', header: 'Revision', component: Column, width: '50px'  },
        { field: 'assetCnt', header: 'Assets', component: Column, width: '50px'  },
        ...commonColumns,
      ]
    default:
      return []
  }
})

const data = computed(() => {
  return props.apiMetricsSummary.map(r => {
    const commonData = {
      checks: r.metrics.assessments,
      assessed: r.metrics.assessed,
      oldest: r.metrics.minTs,
      newest: r.metrics.maxTs,
      updated: r.metrics.maxTouchTs,
      assessedPct: r.metrics.assessments ? r.metrics.assessed / r.metrics.assessments * 100 : 0,
      submitted: r.metrics.statuses.submitted,
      accepted: r.metrics.statuses.accepted,
      rejected: r.metrics.statuses.rejected,
      cora: calculateCoraRiskRating(r.metrics),
      low: r.metrics.findings.low,
      medium: r.metrics.findings.medium,
      high: r.metrics.findings.high,
    }
    switch (aggregationType.value) {
      case 'asset':
        return {
          assetId: r.assetId,
          assetName: r.name,
          labels: r.labels,
          stigCnt: r.benchmarkIds.length,
          ...commonData,
        }
        
      case 'stig':
        return {
          benchmarkId: r.benchmarkId,
          title: r.title,
          revision: {
            string: r.revisionStr,
            date: r.revisionDate,
            isPinned: r.revisionPinned
          },
          assetCnt: r.assets,
          ...commonData,
        }
      default:
        return commonData
    }
  })
})
</script>

<style scoped>
.agg-grid-row {
  font-size: 12px; 
  height: 45px; 
  width: 100px; 
  overflow: hidden; 
  white-space: nowrap; 
  text-overflow: ellipsis;
}

</style>