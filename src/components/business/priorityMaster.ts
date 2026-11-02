export type BusinessPriority = {
    id: string
    name: string
    color: string
    enabled: boolean
    deletable: boolean
    isDefault: boolean
  }
  
  const STORAGE_KEY = 'teltruva-business-priority-master-v1'
  
  export const defaultBusinessPriorities: BusinessPriority[] = [
    { id: 'low', name: 'Low', color: '#5f7894', enabled: true, deletable: false, isDefault: false },
    { id: 'normal', name: 'Normal', color: '#3476d2', enabled: true, deletable: false, isDefault: true },
    { id: 'high', name: 'High', color: '#d48516', enabled: true, deletable: false, isDefault: false },
    { id: 'urgent', name: 'Urgent', color: '#c7443e', enabled: true, deletable: false, isDefault: false },
  ]
  
  export function loadBusinessPriorities(): BusinessPriority[] {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (!saved) return defaultBusinessPriorities
  
      const parsed = JSON.parse(saved) as BusinessPriority[]
      if (!Array.isArray(parsed)) return defaultBusinessPriorities
  
      const valid = parsed.filter((priority) =>
        priority &&
        typeof priority.id === 'string' &&
        typeof priority.name === 'string' &&
        typeof priority.color === 'string' &&
        typeof priority.enabled === 'boolean' &&
        typeof priority.deletable === 'boolean' &&
        typeof priority.isDefault === 'boolean'
      )
      return valid.length ? valid : defaultBusinessPriorities
    } catch {
      return defaultBusinessPriorities
    }
  }
  
  export function saveBusinessPriorities(priorities: BusinessPriority[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(priorities))
  }
  