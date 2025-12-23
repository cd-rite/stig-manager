<script setup>
import Column from 'primevue/column'
import LabelsRow from './LabelsRow.vue'
import shieldGreenCheck from '../../../assets/shield-green-check.svg'

defineProps({
  field: String,
  header: String
})
</script>

<template>
  <Column :field="field" :header="header">
    <template #body="slotProps">
      <div class="asset-with-labels">
        <!-- Top row: Asset name with icon -->
        <div class="asset-row">
          <span class="asset-name">{{ slotProps.data.assetName }}</span>
          <img :src="shieldGreenCheck" width="14" height="14" class="asset-icon" />
        </div>
        <!-- Bottom row: Labels (uses LabelsRow component for measurement) -->
        <LabelsRow
          v-if="slotProps.data.labels?.length"
          :labels="slotProps.data.labels"
        />
      </div>
    </template>
  </Column>
</template>

<style scoped>
.asset-with-labels {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 2px 0;
}

.asset-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.asset-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.asset-icon {
  flex-shrink: 0;
}
</style>
