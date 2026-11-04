export type DueDateRules = {
    dueSoonThresholds: number[]
  }
  
  const STORAGE_KEY = 'teltruva-business-due-date-rules-v2'
  const PREVIOUS_STORAGE_KEY = 'teltruva-business-due-date-rules-v1'
  
  export const defaultDueDateRules: DueDateRules = {
    dueSoonThresholds: [3, 7],
  }
  
  function normalizeThresholds(values: unknown): number[] {
    if (!Array.isArray(values)) {
      return [...defaultDueDateRules.dueSoonThresholds]
    }
  
    const thresholds = values
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 1 && value <= 365)
  
    const uniqueSorted = [...new Set(thresholds)].sort((a, b) => a - b)
    return uniqueSorted.length > 0
      ? uniqueSorted
      : [...defaultDueDateRules.dueSoonThresholds]
  }
  
  function readCurrentRules(): DueDateRules | null {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
  
    const parsed = JSON.parse(saved) as Partial<DueDateRules>
    return {
      dueSoonThresholds: normalizeThresholds(parsed.dueSoonThresholds),
    }
  }
  
  function migratePreviousRules(): DueDateRules | null {
    const saved = window.localStorage.getItem(PREVIOUS_STORAGE_KEY)
    if (!saved) return null
  
    const parsed = JSON.parse(saved) as { dueSoonDays?: unknown }
    const previousThreshold = Number(parsed.dueSoonDays)
    const values = Number.isInteger(previousThreshold)
      ? [3, previousThreshold]
      : defaultDueDateRules.dueSoonThresholds
  
    const migrated = {
      dueSoonThresholds: normalizeThresholds(values),
    }
  
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
    return migrated
  }
  
  export function loadDueDateRules(): DueDateRules {
    try {
      return (
        readCurrentRules() ??
        migratePreviousRules() ??
        { dueSoonThresholds: [...defaultDueDateRules.dueSoonThresholds] }
      )
    } catch {
      return {
        dueSoonThresholds: [...defaultDueDateRules.dueSoonThresholds],
      }
    }
  }
  
  export function saveDueDateRules(rules: DueDateRules) {
    const normalized = {
      dueSoonThresholds: normalizeThresholds(rules.dueSoonThresholds),
    }
  
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
  }
  