<script setup>
import { html as renderDiffHtml } from 'diff2html'
import { computed } from 'vue'

const props = defineProps({
  propName: {
    type: String,
    required: true,
  },
  patch: {
    type: String,
    required: true,
  },
})

// Match legacy client config exactly — notably line-by-line (diff2html's default)
// avoids the empty-placeholder rows that side-by-side inserts to align columns.
const D2H_CONFIG = {
  drawFileList: false,
  matching: 'lines',
  diffStyle: 'word',
}

const rendered = computed(() => {
  if (!props.patch) {
    return null
  }
  try {
    return { html: renderDiffHtml(props.patch, D2H_CONFIG), error: false }
  }
  catch {
    return { html: '', error: true }
  }
})
</script>

<template>
  <section class="diff-property-section">
    <header class="diff-property-section__head">
      {{ propName }}
    </header>
    <div
      v-if="rendered && !rendered.error"
      class="diff-property-section__body d2h-wrapper"
      v-html="rendered.html"
    />
    <div v-else class="diff-property-section__error">
      Could not render diff for <code>{{ propName }}</code>.
    </div>
  </section>
</template>

<style scoped>
@import 'diff2html/bundles/css/diff2html.min.css';

.diff-property-section {
  background-color: var(--color-background-dark);
  border: 1px solid var(--color-border-default);
  border-radius: 0.3rem;
  overflow: hidden;
}

.diff-property-section__head {
  padding: 0.35rem 0.75rem;
  background-color: var(--color-background-subtle);
  border-bottom: 1px solid var(--color-border-default);
  font: 700 0.95rem monospace;
  color: var(--color-text-primary);
}

.diff-property-section__body {
  overflow-x: auto;
}

.diff-property-section__error {
  padding: 0.75rem 1rem;
  color: var(--color-text-error);
  font-style: italic;
}

/* Dark-theme overrides for diff2html output rendered inside .d2h-wrapper via v-html.
   Ported from legacy client dark-mode.css (lines 3059-3119) and mapped onto app tokens. */
.d2h-wrapper :deep(.d2h-file-wrapper) {
  border: none;
  background-color: transparent;
}

/* Hide diff2html's own file-header (filename + "Viewed" checkbox) and hunk info
   (the `@@ -1,5 +1,5 @@` line). Our <header class="diff-property-section__head">
   already labels the property; those internals are redundant. */
.d2h-wrapper :deep(.d2h-file-header) {
  display: none;
}

.d2h-wrapper :deep(.d2h-info) {
  display: none;
}

.d2h-wrapper :deep(.d2h-file-diff) {
  background-color: var(--color-background-dark);
  border: none;
}

.d2h-wrapper :deep(.d2h-code-linenumber) {
  background-color: transparent;
  color: hsl(0, 0%, 50%);
  border-right-color: var(--color-border-light);
}

.d2h-wrapper :deep(.d2h-code-side-linenumber) {
  background-color: transparent;
  color: hsl(0, 0%, 50%);
  border-right-color: var(--color-border-light);
}

.d2h-wrapper :deep(.d2h-del) {
  background-color: hsl(0, 60%, 17%);
  border-right-color: hsl(0, 59%, 20%);
}

.d2h-wrapper :deep(.d2h-ins) {
  background-color: hsl(110, 22%, 22%);
  border-right-color: hsl(120, 33%, 20%);
}

.d2h-wrapper :deep(.d2h-file-diff .d2h-del.d2h-change) {
  background-color: hsl(0, 60%, 17%);
}

.d2h-wrapper :deep(.d2h-file-diff .d2h-ins.d2h-change) {
  background-color: hsl(110, 22%, 22%);
}

.d2h-wrapper :deep(.d2h-code-line del),
.d2h-wrapper :deep(.d2h-code-side-line del) {
  background-color: hsl(0, 63%, 31%);
  text-decoration: none;
}

.d2h-wrapper :deep(.d2h-code-line ins),
.d2h-wrapper :deep(.d2h-code-side-line ins) {
  background-color: hsl(110, 35%, 30%);
  text-decoration: none;
}

.d2h-wrapper :deep(.d2h-code-line),
.d2h-wrapper :deep(.d2h-code-side-line) {
  color: var(--color-text-primary);
}

.d2h-wrapper :deep(.d2h-emptyplaceholder) {
  background-color: var(--color-background-dark);
  border-color: var(--color-border-default);
}

.d2h-wrapper :deep(.d2h-cntx) {
  background-color: var(--color-background-dark);
}
</style>
