# AssetReview Feature

This feature renders the full Asset Review page — a split-pane UI where a user selects a rule from a checklist grid on the left and edits/submits a review via a popover, while inspecting rule details in a panel on the right.

---

## Directory Structure

```
src/features/AssetReview/
├── api/
│   └── assetReviewApi.js         # All API calls for this feature
├── components/
│   ├── AssetReview.vue            # Feature root / "store" component
│   ├── ChecklistGrid.vue          # Left pane: grid + popover controller
│   ├── ChecklistGridHeader.vue    # Toolbar above the grid
│   ├── ChecklistGridTable.vue     # Pure PrimeVue DataTable wrapper
│   ├── ReviewEditPopover.vue      # (shared) Floating form for editing a review
│   ├── ReviewHistoryTab.vue       # Popover tab: history of this rule's reviews
│   ├── ReviewOtherAssetsTab.vue   # Popover tab: same rule across other assets
│   ├── ReviewResources.vue        # Popover tab: attachments / resources
│   ├── ReviewStatusTextTab.vue    # Popover tab: status text detail
│   └── RuleInfo.vue               # Right pane: rule content / detail panel
├── composables/
│   ├── useChecklistData.js        # Fetches and caches the checklist array
│   ├── useChecklistDisplayMode.js # Controls column visibility and row height
│   ├── useReviewActions.js        # PUT/PATCH API + optimistic grid updates
│   ├── useRuleDetail.js           # Fetches rule content and current review on selection
│   └── useSearch.js               # Shared grid filter/search state
├── lib/
│   ├── checklistUtils.js          # Pure helpers: getResultDisplay, getEngineDisplay, severityMap
│   └── labels.js                  # Label color utilities
└── test/
    └── checklistUtils.test.js
```

---

## State Architecture

`AssetReview.vue` is the **feature root**. It is the single source of truth — it initializes all composables, wires their outputs together, and distributes state downward via Vue's `provide`/`inject`.

```
AssetReview.vue  (provide → 'assetReviewContext')
├── ChecklistGrid.vue              (inject assetReviewContext)
│   ├── ChecklistGridHeader.vue
│   ├── ChecklistGridTable.vue
│   └── ReviewEditPopover.vue      (inject assetReviewContext, provide → 'reviewEditForm')
│       ├── ReviewHistoryTab.vue   (inject assetReviewContext, inject reviewEditForm)
│       ├── ReviewOtherAssetsTab.vue
│       └── ReviewResources.vue
└── RuleInfo.vue
```

### Why `provide`/`inject` instead of props?

The page uses a `<Splitter>` which adds non-feature-aware wrapper components between the root and the children. Threading 15+ reactive values through opaque wrappers as props would be unworkable. `provide`/`inject` creates a **feature-scoped context** that is destroyed with the component tree when the user navigates away — giving us the cleanup benefits of local state without prop drilling.

---

## Composable Dependency Chain

The composables are initialized in order in `AssetReview.vue` because each one depends on the output of the previous:

```
useChecklistData({ assetId, benchmarkId, revisionStr })
  └─ returns: gridData, ruleLookupMap, upsertReview, accessMode

useRuleDetail({ ruleLookupMap, collectionId, assetId, ... })
  └─ returns: selectedRuleId, currentReview, selectRule

useReviewActions({ collectionId, assetId }, { gridData, upsertReview, currentReview })
  └─ returns: saveFullReview, saveStatusAction, isSaving, saveError
```

---

## `assetReviewContext` — What Gets Provided

| Key | Type | Source | Purpose |
|---|---|---|---|
| `collectionId` | `Ref<string>` | route | Current collection |
| `assetId` | `Ref<string>` | route | Current asset |
| `asset` | `Ref<object>` | API | Asset metadata (name, etc.) |
| `accessMode` | `Ref<'r'\|'rw'>` | checklist API | Whether the user can edit |
| `checklistData` | `Ref<array>` | `useChecklistData` | Raw checklist array |
| `gridData` | `Ref<array>` | `useChecklistData` | Alias of checklistData, used for reactivity |
| `ruleLookupMap` | `Ref<Map>` | `useChecklistData` | O(1) `ruleId → row` lookup |
| `isChecklistLoading` | `Ref<boolean>` | `useChecklistData` | Loading state for the grid |
| `checklistError` | `Ref<Error\|null>` | `useChecklistData` | Checklist fetch error |
| `fieldSettings` | `Ref<object>` | collection settings | Which review fields are required/enabled |
| `statusSettings` | `Ref<object>` | collection settings | `canAccept`, `minAcceptGrant`, etc. |
| `canAccept` | `Ref<boolean>` | derived | Whether the current user can accept reviews |
| `isSaving` | `Ref<boolean>` | `useReviewActions` | True during any PUT/PATCH |
| `saveError` | `Ref<string\|null>` | `useReviewActions` | Last save error message |
| `currentReview` | `Ref<object\|null>` | `useRuleDetail` | Full review object for the selected rule |
| `selectedRuleId` | `Ref<string\|null>` | `useRuleDetail` | Rule ID currently selected in the grid |
| `revisionInfo` | `Computed<object>` | derived | Human-readable version/release string |
| `selectRule` | `Function` | `useRuleDetail` | Changes `selectedRuleId`, triggers data fetch |
| `loadChecklist` | `Function` | `useChecklistData` | Re-fetches the full checklist |
| `clearSaveError` | `Function` | `useReviewActions` | Dismisses the save error banner |

---

## `reviewEditForm` — What Gets Provided by `ReviewEditPopover`

`ReviewEditPopover` calls `useReviewEditForm()` and provides its result as `'reviewEditForm'`. This is consumed by the tabs inside the popover so they can read the current form state without re-fetching.

| Key | Purpose |
|---|---|
| `formResult`, `formDetail`, `formComment` | Controlled form field values |
| `statusLabel` | Derived string: `'saved'`, `'submitted'`, `'accepted'`, `'rejected'`, or `''` |
| `editable` | `true` only when `accessMode === 'rw'` and status is `''`, `saved`, or `rejected` |
| `isDirty` | `true` if any form field differs from the last-saved row data |
| `buttonStates` | Object describing Save/Submit/Accept button labels, enabled state, and action type |
| `isActionActive(type)` | Returns `true` if the button type matches the current review's lifecycle state |

---

## Review Lifecycle (Status Flow)

```
(no review)
    │
    ▼
  saved  ←──────── unsubmit ──────────┐
    │                                  │
    ▼                                  │
submitted ──────────────────────────► rejected
    │
    ▼
accepted
```

- **Save** → `PUT /reviews` with `status: 'saved'`
- **Submit** → `PUT /reviews` with `status: 'submitted'`  
- **Save & Submit** → Same `PUT`, triggered when the form is dirty before submitting
- **Unsubmit** → `PATCH /reviews` with `status: 'saved'` (resets to editable)
- **Accept** → `PATCH /reviews` with `status: 'accepted'`

All saves flow: `ReviewEditPopover` → emits `save`/`status-action` → `ChecklistGrid` re-emits up → `AssetReview` calls `saveFullReview` or `saveStatusAction` → optimistic `upsertReview` updates the grid row in place without a re-fetch.

---

## The Popover Anchoring System

The `ReviewEditPopover` is anchored to a hidden `<div class="popover-anchor">` inside `ChecklistGrid`. When a row is clicked:

1. The anchor `div` is repositioned to `{ left: clickX, top: rowTop, height: rowHeight }` using inline styles.
2. A synthetic event object (`{ currentTarget: anchor, clientX }`) is passed to the popover's `show` / `reposition` method.
3. `clampPopoverPosition()` then runs post-render to ensure the popover stays within the viewport and repositions the arrow to point to the exact click X coordinate.

This approach avoids conflicts with PrimeVue's internal scroll/target tracking by providing a stable, non-scrolling anchor element.

---

## Unsaved Changes Guard

`ReviewEditPopover` exposes `isDirty` and `triggerUnsavedWarning()` via `defineExpose`. `ChecklistGrid` uses these to:

- **Block row switching** if the user clicks a different row while `isDirty` is `true`.
- **Show a warning banner** inside the popover by calling `triggerUnsavedWarning()`.
- **Lock grid scroll** via the `scrollLocked` computed when the form is dirty.

All "guard" checks in `ChecklistGrid` go through the shared `guardUnsaved(targetRuleId)` helper to avoid duplication.

---

## Key Design Decisions

| Decision | Reason |
|---|---|
| Feature-scoped `provide`/`inject` over Pinia | State is destroyed on unmount; no manual cleanup needed. Avoids stale data when switching between assets. |
| Optimistic `upsertReview` instead of re-fetch | Keeps the grid responsive after a save without a full network round-trip. |
| `ruleLookupMap` (O(1) Map) | Avoids `.find()` loops on every selection change in a potentially large checklist. |
| `useAsyncState` for all async operations | Standardizes loading/error state management across all data-fetching composables. |
| Hidden anchor `<div>` for popover positioning | PrimeVue's `Popover` tracks the target element for positioning; using a stable hidden anchor avoids layout conflicts with the virtual-scrolled grid rows. |
