import { computed, ref } from 'vue'
import botIcon from '../../../assets/bot2.svg'

// Defines the available columns for the checklist grid
const checklistColumns = ref([
  { field: 'severity', header: 'Cat', permanent: true },
  { field: 'groupId', header: 'Group', permanent: true },
  { field: 'ruleId', header: 'Rule Id', permanent: true },
  { field: 'groupTitle', header: 'Group Title' },
  { field: 'ruleTitle', header: 'Rule Title' },
  { field: 'result', header: 'Result', permanent: true },
  { field: 'detail', header: 'Detail' },
  { field: 'comment', header: 'Comment' },
  { field: 'resultEngine', image: botIcon, permanent: true },
  { field: 'status', header: 'Status', permanent: true },
  { field: 'touchTs', icon: 'pi pi-clock' },
])

// Define default selected columns
const selectedChecklistColumns = ref(
  checklistColumns.value.filter(col =>
    ['severity', 'groupId', 'ruleId', 'ruleTitle', 'result', 'detail', 'comment', 'resultEngine', 'status', 'touchTs'].includes(col.field),
  ),
)

const lineClamp = ref(3)

export function useChecklistDisplayMode() {
  const isColVisible = (field) => {
    const col = checklistColumns.value.find(c => c.field === field)
    if (col?.permanent) {
      return true
    }
    if (selectedChecklistColumns.value.length === 0) {
      return true
    }
    return selectedChecklistColumns.value.some(col => col.field === field)
  }

  const setColVisible = (field, visible) => {
    const col = checklistColumns.value.find(c => c.field === field)
    if (col?.permanent) {
      return
    }

    if (selectedChecklistColumns.value.length === 0) {
      if (!visible) {
        selectedChecklistColumns.value = checklistColumns.value.filter(c => c.field !== field)
      }
      return
    }

    const isVis = isColVisible(field)
    if (visible && !isVis) {
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

  const itemSize = computed(() => (15 * lineClamp.value) + 6)

  return {
    checklistColumns,
    selectedChecklistColumns,
    isColVisible,
    displayModeItems,
    lineClamp,
    itemSize,
  }
}
