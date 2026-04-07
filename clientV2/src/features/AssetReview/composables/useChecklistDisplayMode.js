import { computed, ref } from 'vue'
import botIcon from '../../../assets/bot2.svg'

// Defines the available columns for the checklist grid
const checklistColumns = ref([
  { field: 'severity', header: 'Cat' },
  { field: 'groupId', header: 'Group' },
  { field: 'ruleId', header: 'Rule Id' },
  { field: 'groupTitle', header: 'Group Title' },
  { field: 'ruleTitle', header: 'Rule Title' },
  { field: 'result', header: 'Result' },
  { field: 'detail', header: 'Detail' },
  { field: 'comment', header: 'Comment' },
  { field: 'resultEngine', header: 'Engine', image: botIcon },
  { field: 'status', header: 'Status' },
  { field: 'touchTs', header: 'Last action', icon: 'pi pi-clock' },
])

// Define default selected columns (everything except groupTitle maybe, or just check the old default)

const selectedChecklistColumns = ref([
  checklistColumns.value[0], // CAT
  checklistColumns.value[1], // Group
  checklistColumns.value[2], // ruleId
  checklistColumns.value[4], // Rule Title
  checklistColumns.value[5], // Result
  checklistColumns.value[6], // Detail
  checklistColumns.value[7], // Comment
  checklistColumns.value[8], // Engine
  checklistColumns.value[9], // Status
  checklistColumns.value[10], // TouchTs
])

// Row height state across all consumers
const lineClamp = ref(3)

export function useChecklistDisplayMode() {
  const isColVisible = (field) => {
    return selectedChecklistColumns.value.some(col => col.field === field)
  }

  const setColVisible = (field, visible) => {
    const isVis = isColVisible(field)
    if (visible && !isVis) {
      const col = checklistColumns.value.find(c => c.field === field)
      if (col) {
        selectedChecklistColumns.value.push(col)
      }
    }
    else if (!visible && isVis) {
      selectedChecklistColumns.value = selectedChecklistColumns.value.filter(c => c.field !== field)
    }
  }

  const displayMode = computed(() => {
    const hasGroupId = isColVisible('groupId')
    const hasRuleTitle = isColVisible('ruleTitle')
    const hasGroupTitle = isColVisible('groupTitle')
    const hasRuleId = isColVisible('ruleId')

    if (hasGroupId && hasGroupTitle && !hasRuleTitle && !hasRuleId) {
      return 'groupGroup'
    }
    if (hasRuleId && hasRuleTitle && !hasGroupId && !hasGroupTitle) {
      return 'ruleRule'
    }
    if (hasGroupId && hasRuleTitle && !hasGroupTitle && !hasRuleId) {
      return 'groupRule'
    }
    return 'custom'
  })

  const setDisplayMode = (mode) => {
    if (mode === 'groupRule') {
      setColVisible('groupId', true)
      setColVisible('ruleTitle', true)
      setColVisible('groupTitle', false)
      setColVisible('ruleId', false)
    }
    else if (mode === 'groupGroup') {
      setColVisible('groupId', true)
      setColVisible('groupTitle', true)
      setColVisible('ruleTitle', false)
      setColVisible('ruleId', false)
    }
    else if (mode === 'ruleRule') {
      setColVisible('ruleId', true)
      setColVisible('ruleTitle', true)
      setColVisible('groupId', false)
      setColVisible('groupTitle', false)
    }
  }

  const displayModeItems = computed(() => [
    {
      label: 'Group/Rule display',
      items: [
        {
          label: 'Group ID and Rule title',
          icon: displayMode.value === 'groupRule' ? 'pi pi-circle-fill' : 'pi pi-circle',
          command: () => setDisplayMode('groupRule'),
        },
        {
          label: 'Group ID and Group title',
          icon: displayMode.value === 'groupGroup' ? 'pi pi-circle-fill' : 'pi pi-circle',
          command: () => setDisplayMode('groupGroup'),
        },
        {
          label: 'Rule ID and Rule title',
          icon: displayMode.value === 'ruleRule' ? 'pi pi-circle-fill' : 'pi pi-circle',
          command: () => setDisplayMode('ruleRule'),
        },
      ],
    },
  ])

  // Row height control (line-clamp 1-10, default 3)
  const itemSize = computed(() => (15 * lineClamp.value) + 6)

  function increaseRowHeight() {
    if (lineClamp.value < 10) {
      lineClamp.value++
    }
  }

  function decreaseRowHeight() {
    if (lineClamp.value > 1) {
      lineClamp.value--
    }
  }

  return {
    checklistColumns,
    selectedChecklistColumns,
    isColVisible,
    displayModeItems,
    lineClamp,
    itemSize,
    increaseRowHeight,
    decreaseRowHeight,
  }
}
