import engineIcon from '../../../assets/bot2.svg'
import overrideIcon from '../../../assets/override2.svg'
import manualIcon from '../../../assets/user.svg'
import { getEngineDisplay } from './checklistUtils.js'

const ENGINE_META = {
  engine: { label: 'Engine', image: engineIcon },
  override: { label: 'Override', image: overrideIcon },
  manual: { label: 'Manual', image: manualIcon },
}

export function buildEngineOptions(items) {
  const seen = new Set()
  for (const item of items ?? []) {
    const display = getEngineDisplay(item)
    if (display) {
      seen.add(display)
    }
  }
  return Array.from(seen).map(value => ({
    value,
    label: ENGINE_META[value].label,
    image: ENGINE_META[value].image,
  }))
}
