export type BusinessTag = {
    id: string
    name: string
    enabled: boolean
    deletable: boolean
  }
  
  const STORAGE_KEY = 'teltruva-business-tag-master-v1'
  
  export const defaultBusinessTags: BusinessTag[] = [
    { id: 'duplicate-charge', name: 'duplicate-charge', enabled: true, deletable: false },
    { id: 'receipt-attached', name: 'receipt-attached', enabled: true, deletable: false },
    { id: 'refund-requested', name: 'refund-requested', enabled: true, deletable: false },
    { id: 'missing-information', name: 'missing-information', enabled: true, deletable: false },
    { id: 'international-customer', name: 'international-customer', enabled: true, deletable: false },
  ]
  
  export function loadBusinessTags(): BusinessTag[] {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (!saved) return defaultBusinessTags
      const parsed = JSON.parse(saved) as BusinessTag[]
      if (!Array.isArray(parsed)) return defaultBusinessTags
      const valid = parsed.filter((tag) =>
        tag && typeof tag.id === 'string' && typeof tag.name === 'string' &&
        typeof tag.enabled === 'boolean' && typeof tag.deletable === 'boolean'
      )
      return valid.length ? valid : defaultBusinessTags
    } catch {
      return defaultBusinessTags
    }
  }
  
  export function saveBusinessTags(tags: BusinessTag[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tags))
  }
  