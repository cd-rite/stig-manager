<script setup>
import Column from 'primevue/column'
import Popover from 'primevue/popover'
import { onBeforeUnmount, ref } from 'vue'

defineProps({
  field: String,
  header: String,
})

const popoverRef = ref()
const popoverLabels = ref([])

// Constants for label size estimation (tighter than LabelsRow since no shield sharing the row)
const CHAR_WIDTH = 5.5 // Approximate width per character at 0.65rem font
const LABEL_PADDING = 10 // Horizontal padding (5px * 2)
const LABEL_GAP = 3 // Gap between labels
const OVERFLOW_BADGE_WIDTH = 8 // Width of "+N" badge
const RIGHT_MARGIN = 0 // No extra margin needed

// Container width tracking per row
const containerWidths = ref(new Map())
const resizeObservers = ref(new Map())

function setContainerRef(el, rowId) {
  if (el) {
    // Initial measurement
    containerWidths.value.set(rowId, el.offsetWidth)

    // Watch for resize
    if (!resizeObservers.value.has(rowId)) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          containerWidths.value.set(rowId, entry.contentRect.width)
        }
      })
      observer.observe(el)
      resizeObservers.value.set(rowId, observer)
    }
  }
}

onBeforeUnmount(() => {
  resizeObservers.value.forEach(observer => observer.disconnect())
})

// Normalize color to include # prefix
function normalizeColor(color) {
  if (!color) {
    return '#cccccc'
  }
  return color.startsWith('#') ? color : `#${color}`
}

// Helper function to determine text color based on background
function getContrastColor(hexColor) {
  if (!hexColor) {
    return '#000000'
  }
  const hex = hexColor.replace('#', '')
  const r = Number.parseInt(hex.substr(0, 2), 16)
  const g = Number.parseInt(hex.substr(2, 2), 16)
  const b = Number.parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

// Estimate the width of a label based on its text
function estimateLabelWidth(text) {
  return (String(text).length * CHAR_WIDTH) + LABEL_PADDING
}

// Calculate visible labels for a given row
function getVisibleLabelsData(labels, rowId) {
  const width = containerWidths.value.get(rowId) || 0

  if (!labels || labels.length === 0) {
    return { visible: [], overflow: [], overflowCount: 0 }
  }

  // If we don't have width yet, show all (will recalculate after mount)
  if (!width || width <= 0) {
    return { visible: labels, overflow: [], overflowCount: 0 }
  }

  const availableWidth = width - RIGHT_MARGIN
  let usedWidth = 0
  const visible = []

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i]
    const labelWidth = estimateLabelWidth(label.name) + (visible.length > 0 ? LABEL_GAP : 0)

    // Check if we need room for overflow badge
    const remainingLabels = labels.length - i - 1
    const needsOverflowBadge = remainingLabels > 0
    const reservedWidth = needsOverflowBadge ? OVERFLOW_BADGE_WIDTH + LABEL_GAP : 0

    if (usedWidth + labelWidth + reservedWidth <= availableWidth) {
      visible.push(label)
      usedWidth += labelWidth
    }
    else {
      break
    }
  }

  // Always show at least one label if there are any
  if (visible.length === 0 && labels.length > 0) {
    visible.push(labels[0])
  }

  const overflow = labels.slice(visible.length)

  return {
    visible,
    overflow,
    overflowCount: overflow.length,
  }
}

function showPopover(event, overflowLabels) {
  popoverLabels.value = overflowLabels || []
  popoverRef.value?.show(event)
}

function hidePopover() {
  popoverRef.value?.hide()
}
</script>

<template>
  <Column :field="field" :header="header">
    <template #body="slotProps">
      <div
        :ref="(el) => setContainerRef(el, slotProps.data.assetId || slotProps.index)"
        class="labels-row"
      >
        <template v-if="slotProps.data[slotProps.field]?.length">
          <span
            v-for="label in getVisibleLabelsData(slotProps.data[slotProps.field], slotProps.data.assetId || slotProps.index).visible"
            :key="label.labelId"
            :style="{ backgroundColor: normalizeColor(label.color), color: getContrastColor(label.color) }"
            class="label-tag"
          >
            {{ label.name }}
          </span>
          <span
            v-if="getVisibleLabelsData(slotProps.data[slotProps.field], slotProps.data.assetId || slotProps.index).overflowCount > 0"
            class="label-tag label-overflow"
            @mouseenter="showPopover($event, getVisibleLabelsData(slotProps.data[slotProps.field], slotProps.data.assetId || slotProps.index).overflow)"
            @mouseleave="hidePopover"
          >
            +{{ getVisibleLabelsData(slotProps.data[slotProps.field], slotProps.data.assetId || slotProps.index).overflowCount }}
          </span>
        </template>
      </div>
      <Popover ref="popoverRef">
        <div class="overflow-labels-popover">
          <span
            v-for="label in popoverLabels"
            :key="label.labelId"
            :style="{ backgroundColor: normalizeColor(label.color), color: getContrastColor(label.color) }"
            class="label-tag"
          >
            {{ label.name }}
          </span>
        </div>
      </Popover>
    </template>
  </Column>
</template>

<style scoped>
.labels-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 3px;
  align-items: center;
}

.label-tag {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 8px;
  white-space: nowrap;
}

.label-overflow {
  background-color: #000;
  color: #fff;
  cursor: pointer;
}

.overflow-labels-popover {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 250px;
}
</style>
