export type BusinessCaseReview = {
    categoryId: string
    priority: string
    assignedTeamId: string
  }
  
  const STORAGE_KEY = 'teltruva-business-case-review-tlt-2026-001-v3'
  const PREVIOUS_STORAGE_KEY = 'teltruva-business-case-review-tlt-2026-001-v2'
  
  const emptyReview: BusinessCaseReview = {
    categoryId: '',
    priority: 'normal',
    assignedTeamId: '',
  }
  
  function normalizeReview(parsed: Partial<BusinessCaseReview>): BusinessCaseReview {
    const validPriorities = ['low', 'normal', 'high', 'urgent']
  
    return {
      categoryId: typeof parsed.categoryId === 'string' ? parsed.categoryId : '',
      priority: typeof parsed.priority === 'string' && validPriorities.includes(parsed.priority)
        ? parsed.priority
        : 'normal',
      assignedTeamId: typeof parsed.assignedTeamId === 'string' ? parsed.assignedTeamId : '',
    }
  }
  
  export function loadBusinessCaseReview(): BusinessCaseReview {
    try {
      const current = window.localStorage.getItem(STORAGE_KEY)
      if (current) return normalizeReview(JSON.parse(current) as Partial<BusinessCaseReview>)
  
      const previous = window.localStorage.getItem(PREVIOUS_STORAGE_KEY)
      if (previous) return normalizeReview(JSON.parse(previous) as Partial<BusinessCaseReview>)
  
      return emptyReview
    } catch {
      return emptyReview
    }
  }
  
  export function saveBusinessCaseReview(review: BusinessCaseReview) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(review))
  }
  