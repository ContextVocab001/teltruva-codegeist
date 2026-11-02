export type BusinessMember = {
    id: string
    name: string
    teamId: string
    enabled: boolean
    deletable: boolean
  }
  
  const STORAGE_KEY = 'teltruva-business-member-master-v1'
  
  export const defaultBusinessMembers: BusinessMember[] = [
    { id: 'billing-specialist', name: 'Billing specialist', teamId: 'billing-team', enabled: true, deletable: false },
    { id: 'customer-care-specialist', name: 'Customer care specialist', teamId: 'customer-care', enabled: true, deletable: false },
    { id: 'operations-specialist', name: 'Operations specialist', teamId: 'hotel-operations', enabled: true, deletable: false },
  ]
  
  export function loadBusinessMembers(): BusinessMember[] {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (!saved) return defaultBusinessMembers
      const parsed = JSON.parse(saved) as BusinessMember[]
      if (!Array.isArray(parsed)) return defaultBusinessMembers
      const valid = parsed.filter((member) =>
        member && typeof member.id === 'string' && typeof member.name === 'string' &&
        typeof member.teamId === 'string' && typeof member.enabled === 'boolean' &&
        typeof member.deletable === 'boolean'
      )
      return valid.length ? valid : defaultBusinessMembers
    } catch {
      return defaultBusinessMembers
    }
  }
  
  export function saveBusinessMembers(members: BusinessMember[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
  }
  