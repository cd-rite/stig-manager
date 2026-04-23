import { computed, ref } from 'vue'

/**
 * Adjustable row height state for the library's tables. Mirrors the pattern in
 * AssetReview's useChecklistDisplayMode: `lineClamp` controls how many lines of
 * wrapped text each row can show; `itemSize` is derived for virtual-scroller
 * row sizing. Exposed as CSS vars (--line-clamp / --item-size) on the parent.
 *
 * `lineClamp` is writable — bind it via v-model to <DensityControls> and the
 * component mutates it directly within the [min, max] bounds.
 */
export function useLineClamp(initial = 2, { min = 1, max = 10 } = {}) {
  const lineClamp = ref(initial)
  const itemSize = computed(() => 15 * lineClamp.value + 6)

  return { lineClamp, itemSize, min, max }
}
