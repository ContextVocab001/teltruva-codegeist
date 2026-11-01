export type BusinessCategory = {
    id: string
    name: string
    enabled: boolean
    deletable: boolean
  }
  
  const STORAGE_KEY = 'teltruva-business-category-master-v1'
  
  export const defaultBusinessCategories: BusinessCategory[] = [
    { id: 'billing', name: 'Billing', enabled: true, deletable: false },
    { id: 'reservation', name: 'Reservation', enabled: true, deletable: false },
    { id: 'cancellation', name: 'Cancellation', enabled: true, deletable: false },
    { id: 'service-quality', name: 'Service quality', enabled: true, deletable: false },
    { id: 'refund', name: 'Refund', enabled: true, deletable: false },
    { id: 'other', name: 'Other', enabled: true, deletable: false },
  ]
  
  export function loadBusinessCategories(): BusinessCategory[] {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (!saved) return defaultBusinessCategories
  
      const parsed = JSON.parse(saved) as BusinessCategory[]
      if (!Array.isArray(parsed)) return defaultBusinessCategories
  
      return parsed.filter((category) =>
        category &&
        typeof category.id === 'string' &&
        typeof category.name === 'string' &&
        typeof category.enabled === 'boolean' &&
        typeof category.deletable === 'boolean'
      )
    } catch {
      return defaultBusinessCategories
    }
  }
  
  export function saveBusinessCategories(categories: BusinessCategory[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
  }
  