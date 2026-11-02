export type BusinessTeam = {
    id: string
    name: string
    enabled: boolean
    deletable: boolean
  }
  
  const STORAGE_KEY = 'teltruva-business-team-master-v1'
  
  export const defaultBusinessTeams: BusinessTeam[] = [
    { id: 'billing-team', name: 'Billing team', enabled: true, deletable: false },
    { id: 'customer-care', name: 'Customer care', enabled: true, deletable: false },
    { id: 'hotel-operations', name: 'Hotel operations', enabled: true, deletable: false },
  ]
  
  export function loadBusinessTeams(): BusinessTeam[] {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (!saved) return defaultBusinessTeams
  
      const parsed = JSON.parse(saved) as BusinessTeam[]
      if (!Array.isArray(parsed)) return defaultBusinessTeams
  
      return parsed.filter((team) =>
        team &&
        typeof team.id === 'string' &&
        typeof team.name === 'string' &&
        typeof team.enabled === 'boolean' &&
        typeof team.deletable === 'boolean'
      )
    } catch {
      return defaultBusinessTeams
    }
  }
  
  export function saveBusinessTeams(teams: BusinessTeam[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(teams))
  }
  