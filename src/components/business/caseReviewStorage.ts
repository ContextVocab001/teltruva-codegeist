export type BusinessCaseReview = {
    categoryId: string
    priorityId: string
    assignedTeamId: string
    statusId: string
  }
  
  const STORAGE_KEY = 'teltruva-business-case-review-tlt-2026-001-v5'
  const PREVIOUS_STORAGE_KEY = 'teltruva-business-case-review-tlt-2026-001-v4'
  
  const emptyReview: BusinessCaseReview = {
    categoryId: '',
    priorityId: '',
    assignedTeamId: '',
    statusId: '',
  }
  
  function normalizeReview(parsed: Record<string, unknown>): BusinessCaseReview {
    const legacyPriority = typeof parsed.priority === 'string' ? parsed.priority : ''
    return {
      categoryId: typeof parsed.categoryId === 'string' ? parsed.categoryId : '',
      priorityId: typeof parsed.priorityId === 'string' ? parsed.priorityId : legacyPriority,
      assignedTeamId: typeof parsed.assignedTeamId === 'string' ? parsed.assignedTeamId : '',
      statusId: typeof parsed.statusId === 'string' ? parsed.statusId : '',
    }
  }
  
  export function loadBusinessCaseReview(): BusinessCaseReview {
    try {
      const current = window.localStorage.getItem(STORAGE_KEY)
      if (current) return normalizeReview(JSON.parse(current) as Record<string, unknown>)
      const previous = window.localStorage.getItem(PREVIOUS_STORAGE_KEY)
      if (previous) return normalizeReview(JSON.parse(previous) as Record<string, unknown>)
      return emptyReview
    } catch {
      return emptyReview
    }
  }
  
  export function saveBusinessCaseReview(review: BusinessCaseReview) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(review))
  }
  