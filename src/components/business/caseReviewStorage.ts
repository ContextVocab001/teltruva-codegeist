export type BusinessCaseReview = {
  categoryId: string
  tagIds: string[]
  priorityId: string
  assignedTeamId: string
  assigneeId: string
  statusId: string
}

const STORAGE_KEY = 'teltruva-business-case-review-tlt-2026-001-v7'
const PREVIOUS_STORAGE_KEY = 'teltruva-business-case-review-tlt-2026-001-v6'

const emptyReview: BusinessCaseReview = {
  categoryId: '',
  tagIds: [],
  priorityId: '',
  assignedTeamId: '',
  assigneeId: '',
  statusId: '',
}

function normalizeReview(parsed: Record<string, unknown>): BusinessCaseReview {
  const legacyPriority = typeof parsed.priority === 'string' ? parsed.priority : ''
  return {
    categoryId: typeof parsed.categoryId === 'string' ? parsed.categoryId : '',
    tagIds: Array.isArray(parsed.tagIds) ? parsed.tagIds.filter((id): id is string => typeof id === 'string') : [],
    priorityId: typeof parsed.priorityId === 'string' ? parsed.priorityId : legacyPriority,
    assignedTeamId: typeof parsed.assignedTeamId === 'string' ? parsed.assignedTeamId : '',
    assigneeId: typeof parsed.assigneeId === 'string' ? parsed.assigneeId : '',
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
