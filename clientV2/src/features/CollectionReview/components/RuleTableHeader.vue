<script setup>
import Button from 'primevue/button'

import lineHeightDown from '../../../assets/line-height-down.svg'
import lineHeightUp from '../../../assets/line-height-up.svg'
import { useGridDensity } from '../../../shared/composables/useGridDensity.js'

defineProps({
  selectedRuleId: {
    type: String,
    default: null,
  },
})

const { lineClamp, increaseRowHeight, decreaseRowHeight } = useGridDensity('collection-rule-table', 1, 12, 24)
</script>

<template>
  <div class="rule-table-header">
    <div class="rule-table-header__content">
      <!-- Header Title -->
      <div class="rule-table__title-row">
        <h2 class="rule-table__title">
          Reviews of {{ selectedRuleId ?? '—' }}
        </h2>
      </div>

      <div class="rule-table__right-controls">
        <!-- Toolbar actions -->
        <div class="rule-table__action-controls">
          <Button text class="toolbar-btn" label="Submit">
            <template #icon>
              <i class="pi pi-arrow-right" style="color: #2ecc71; font-weight: bold; margin-right: 0.3rem;" />
            </template>
          </Button>

          <Button text class="toolbar-btn" label="Unsubmit">
            <template #icon>
              <i class="pi pi-bookmark" style="color: #95a5a6; margin-right: 0.3rem;" />
            </template>
          </Button>

          <div class="toolbar-divider" />

          <Button text class="toolbar-btn" icon="pi pi-pencil" label="Batch edit" />
        </div>

        <!-- Density -->
        <div class="rule-table__density-controls">
          <span class="rule-table__density-label">Density</span>
          <button
            class="rule-table__icon-btn" title="Decrease row height" :disabled="lineClamp <= 1"
            @click="decreaseRowHeight"
          >
            <img :src="lineHeightDown" alt="Decrease row height">
          </button>
          <button
            class="rule-table__icon-btn" title="Increase row height" :disabled="lineClamp >= 10"
            @click="increaseRowHeight"
          >
            <img :src="lineHeightUp" alt="Increase row height">
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rule-table-header {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: linear-gradient(180deg, var(--color-background-light), var(--color-background-dark));
  border-bottom: 1px solid var(--color-border-default);
  flex-shrink: 0;
  height: var(5rem);
}

.rule-table-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.75rem;
}

.rule-table__right-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rule-table__action-controls {
  display: flex;
  align-items: center;
}

.rule-table__title-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex: 1;
  min-width: 0;
}

.rule-table__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toolbar-btn {
  color: var(--color-text-bright);
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  height: 2rem;
}

.toolbar-btn :deep(.p-button-icon) {
  font-size: 0.85rem;
}

.toolbar-btn:hover {
  background: color-mix(in srgb, var(--color-background-light) 65%, transparent);
  color: var(--color-text-primary);
  border-color: color-mix(in srgb, var(--color-border-default) 50%, transparent);
}

.toolbar-divider {
  width: 1px;
  height: 1.5rem;
  background: var(--color-border-default);
  margin: 0 0.25rem;
}

/* Density Controls modeled directly after ChecklistGridHeader */
.rule-table__density-controls {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.15rem 0.25rem 0.15rem 0.5rem;
  border: 1px solid color-mix(in srgb, var(--color-border-default) 85%, transparent);
  border-radius: 5px;
  background: color-mix(in srgb, var(--color-background-light) 45%, transparent);
  height: 2rem;
}

.rule-table__density-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-bright);
  margin-right: 0.2rem;
}

.rule-table__icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--color-background-light) 25%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-border-light) 40%, transparent);
  border-radius: 5px;
  margin: 0 0.1rem;
  width: 1.6rem;
  height: 1.6rem;
  padding: 0;
  cursor: pointer;
  opacity: 0.9;
}

.rule-table__icon-btn:hover:not(:disabled) {
  opacity: 1;
  border-color: var(--color-border-default);
  background: color-mix(in srgb, var(--color-background-light) 75%, transparent);
}

.rule-table__icon-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.rule-table__icon-btn img {
  width: 14px;
  height: 14px;
}
</style>
