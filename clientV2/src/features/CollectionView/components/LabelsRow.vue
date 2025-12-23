<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  labels: {
    type: Array,
    default: () => []
  }
})

// Constants for label size estimation
const CHAR_WIDTH = 6.5          // Approximate width per character at 0.65rem font
const LABEL_PADDING = 12        // Horizontal padding (5px * 2 + a bit extra)
const LABEL_GAP = 3             // Gap between labels
const OVERFLOW_BADGE_WIDTH = 28 // Width of "+N" badge
const RIGHT_MARGIN = 8          // Safety margin on the right

// Container ref and width
const containerRef = ref(null)
const containerWidth = ref(0)
let resizeObserver = null

onMounted(() => {
  if (containerRef.value) {
    // Initial measurement
    containerWidth.value = containerRef.value.offsetWidth

    // Watch for resize
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth.value = entry.contentRect.width
      }
    })
    resizeObserver.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

// Normalize color to include # prefix
function normalizeColor(color) {
  if (!color) return '#cccccc'
  return color.startsWith('#') ? color : `#${color}`
}

// Helper function to determine text color based on background
function getContrastColor(hexColor) {
  if (!hexColor) return '#000000'
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

// Estimate the width of a label based on its text
function estimateLabelWidth(text) {
  return (String(text).length * CHAR_WIDTH) + LABEL_PADDING
}

// Computed: which labels to show based on container width
const visibleLabelsData = computed(() => {
  const labels = props.labels
  const width = containerWidth.value

  if (!labels || labels.length === 0) return { visible: [], overflowCount: 0 }

  // If we don't have width yet, show all (will recalculate after mount)
  if (!width || width <= 0) return { visible: labels, overflowCount: 0 }

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
    } else {
      break
    }
  }

  // Always show at least one label
  if (visible.length === 0 && labels.length > 0) {
    visible.push(labels[0])
  }

  return {
    visible,
    overflowCount: labels.length - visible.length
  }
})
</script>

<template>
  <div class="labels-row" ref="containerRef">
    <span
      v-for="label in visibleLabelsData.visible"
      :key="label.labelId"
      :style="{ backgroundColor: normalizeColor(label.color), color: getContrastColor(label.color) }"
      class="label-tag"
    >{{ label.name }}</span>
    <span
      v-if="visibleLabelsData.overflowCount > 0"
      class="label-tag label-overflow"
    >+{{ visibleLabelsData.overflowCount }}</span>
  </div>
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
}
</style>
