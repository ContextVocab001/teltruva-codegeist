export type BusinessCaseReview = {
    categoryId: string
    priority: string
  }
  
  const STORAGE_KEY = 'teltruva-business-case-review-tlt-2026-001-v2'
  
  const emptyReview: BusinessCaseReview = {
    categoryId: '',
    priority: 'normal',
  }
  
  export function loadBusinessCaseReview(): BusinessCaseReview {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (!saved) return emptyReview
  
      const parsed = JSON.parse(saved) as Partial<BusinessCaseReview>
      const validPriorities = ['low', 'normal', 'high', 'urgent']
  
      return {
        categoryId: typeof parsed.categoryId === 'string' ? parsed.categoryId : '',
        priority: typeof parsed.priority === 'string' && validPriorities.includes(parsed.priority)
          ? parsed.priority
          : 'normal',
      }
    } catch {
      return emptyReview
    }
  }
  
  export function saveBusinessCaseReview(review: BusinessCaseReview) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(review))
  }
  