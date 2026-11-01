export type BusinessCaseReview = {
    categoryId: string
  }
  
  const STORAGE_KEY = 'teltruva-business-case-review-tlt-2026-001-v1'
  
  const emptyReview: BusinessCaseReview = {
    categoryId: '',
  }
  
  export function loadBusinessCaseReview(): BusinessCaseReview {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (!saved) return emptyReview
  
      const parsed = JSON.parse(saved) as Partial<BusinessCaseReview>
      return {
        categoryId: typeof parsed.categoryId === 'string' ? parsed.categoryId : '',
      }
    } catch {
      return emptyReview
    }
  }
  
  export function saveBusinessCaseReview(review: BusinessCaseReview) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(review))
  }
  