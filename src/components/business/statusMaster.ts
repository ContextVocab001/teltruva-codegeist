export type BusinessStatus = {
    id: string
    name: string
    color: string
    enabled: boolean
    deletable: boolean
    isDefault: boolean
  }
  
  const STORAGE_KEY = 'teltruva-business-status-master-v1'
  
  export const defaultBusinessStatuses: BusinessStatus[] = [
    { id: 'needs-review', name: 'Needs review', color: '#7147de', enabled: true, deletable: false, isDefault: true },
    { id: 'waiting-information', name: 'Waiting for information', color: '#e39a22', enabled: true, deletable: false, isDefault: false },
    { id: 'ready-action', name: 'Ready for action', color: '#248b5c', enabled: true, deletable: false, isDefault: false },
    { id: 'in-progress', name: 'In progress', color: '#3476d2', enabled: true, deletable: false, isDefault: false },
    { id: 'resolved', name: 'Resolved', color: '#3b7c68', enabled: true, deletable: false, isDefault: false },
  ]
  
  export function loadBusinessStatuses(): BusinessStatus[] {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (!saved) return defaultBusinessStatuses
      const parsed = JSON.parse(saved) as BusinessStatus[]
      if (!Array.isArray(parsed)) return defaultBusinessStatuses
      const valid = parsed.filter((status) =>
        status && typeof status.id === 'string' && typeof status.name === 'string' &&
        typeof status.color === 'string' && typeof status.enabled === 'boolean' &&
        typeof status.deletable === 'boolean' && typeof status.isDefault === 'boolean'
      )
      return valid.length ? valid : defaultBusinessStatuses
    } catch {
      return defaultBusinessStatuses
    }
  }
  
  export function saveBusinessStatuses(statuses: BusinessStatus[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses))
  }
  