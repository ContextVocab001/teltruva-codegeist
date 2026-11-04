import { useEffect, useMemo, useState } from 'react'
import './business.css'
import { loadBusinessCaseReview } from './caseReviewStorage'
import { loadBusinessCategories } from './categoryMaster'
import { loadBusinessPriorities } from './priorityMaster'
import { loadBusinessStatuses } from './statusMaster'
import { loadBusinessTeams } from './teamMaster'
import { loadBusinessMembers } from './memberMaster'
import { loadBusinessTags } from './tagMaster'
import { loadDueDateRules } from './dueDateRules'

const sampleCases = [
  {
    id: 'TLT-2026-001',
    title: 'Possible duplicate charge after checkout',
    language: 'Japanese → English',
    evidence: 'Receipt attached',
    priorityId: 'urgent',
    categoryId: 'billing',
    assignedTeamId: 'billing-team',
    assigneeId: 'billing-specialist',
    tagIds: ['duplicate-charge', 'receipt-attached'],
    route: '/business/cases/demo',
  },
  {
    id: 'TLT-2026-002',
    title: 'Reservation cancellation refund request',
    language: 'Spanish → English',
    evidence: 'Email attached',
    priorityId: 'normal',
    categoryId: 'reservation',
    assignedTeamId: 'customer-care',
    assigneeId: 'customer-care-specialist',
    tagIds: ['refund-requested', 'missing-information'],
    statusId: 'waiting-information',
  },
  {
    id: 'TLT-2026-003',
    title: 'Incorrect room charge on final invoice',
    language: 'English → English',
    evidence: 'Invoice attached',
    priorityId: 'high',
    categoryId: 'billing',
    assignedTeamId: 'hotel-operations',
    assigneeId: 'operations-specialist',
    tagIds: ['receipt-attached', 'international-customer'],
    statusId: 'ready-action',
  },
]

function getDueDateSummary(dueDate: string, largestThreshold: number) {
  if (!dueDate) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(`${dueDate}T00:00:00`)
  if (Number.isNaN(due.getTime())) return null

  const days = Math.round((due.getTime() - today.getTime()) / 86400000)
  const formatted = due.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  if (days < 0) {
    return {
      label: `Overdue · ${formatted}`,
      background: '#fff0ee',
      color: '#a33b35',
      border: '#e5aaa6',
    }
  }
  if (days === 0) {
    return {
      label: `Due today · ${formatted}`,
      background: '#fff3dc',
      color: '#8a5b08',
      border: '#e7c978',
    }
  }
  if (days <= largestThreshold) {
    return {
      label: `Due in ${days} day${days === 1 ? '' : 's'} · ${formatted}`,
      background: '#fff8e8',
      color: '#795b17',
      border: '#e8d095',
    }
  }

  return null
}

function BusinessCaseListPage() {
  const statuses = loadBusinessStatuses()
  const categories = loadBusinessCategories()
  const teams = loadBusinessTeams()
  const members = loadBusinessMembers()
  const tags = loadBusinessTags()
  const dueDateRules = loadDueDateRules()
  const largestDueSoonThreshold = Math.max(...dueDateRules.dueSoonThresholds)
  const priorities = loadBusinessPriorities()
  const savedReview = loadBusinessCaseReview()
  const defaultStatus = statuses.find((status) => status.isDefault && status.enabled)?.id ?? 'needs-review'
  const defaultPriority = priorities.find((priority) => priority.isDefault && priority.enabled)?.id ?? 'normal'
  const demoCaseStatusId = savedReview.statusId || defaultStatus
  const demoCasePriorityId = savedReview.priorityId || defaultPriority
  const demoDueDateSummary = getDueDateSummary(savedReview.dueDate, largestDueSoonThreshold)

  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [teamFilter, setTeamFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [dueDateFilter, setDueDateFilter] = useState('all')

  const cases = useMemo(
    () => sampleCases.map((item) => ({
      ...item,
      statusId: item.id === 'TLT-2026-001' ? demoCaseStatusId : item.statusId,
      priorityId: item.id === 'TLT-2026-001' ? demoCasePriorityId : item.priorityId,
      categoryId: item.id === 'TLT-2026-001' ? savedReview.categoryId || item.categoryId : item.categoryId,
      assignedTeamId: item.id === 'TLT-2026-001' ? savedReview.assignedTeamId || item.assignedTeamId : item.assignedTeamId,
      assigneeId: item.id === 'TLT-2026-001' ? savedReview.assigneeId || item.assigneeId : item.assigneeId,
      tagIds: item.id === 'TLT-2026-001' && savedReview.tagIds.length > 0 ? savedReview.tagIds : item.tagIds,
      dueDate: item.id === 'TLT-2026-001' ? savedReview.dueDate : '',
      dueDateSummary: item.id === 'TLT-2026-001' ? demoDueDateSummary : null,
    })),
    [demoCasePriorityId, demoCaseStatusId, demoDueDateSummary?.label]
  )

  const matchesDueDateFilter = (dueDate: string) => {
    if (dueDateFilter === 'all') return true
    if (dueDateFilter === 'none') return !dueDate
    if (!dueDate) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(`${dueDate}T00:00:00`)
    if (Number.isNaN(due.getTime())) return false

    const days = Math.round((due.getTime() - today.getTime()) / 86400000)
    if (dueDateFilter === 'overdue') return days < 0
    if (dueDateFilter === 'today') return days === 0
    if (dueDateFilter.startsWith('within-')) {
      const threshold = Number(dueDateFilter.replace('within-', ''))
      return Number.isInteger(threshold) && days >= 0 && days <= threshold
    }
    return true
  }

  const filteredCases = useMemo(() => {
    const query = searchText.trim().toLowerCase()

    return cases.filter((item) => {
      const matchesSearch = !query || item.id.toLowerCase().includes(query) || item.title.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'all' || item.statusId === statusFilter
      const matchesPriority = priorityFilter === 'all' || item.priorityId === priorityFilter
      const matchesCategory = categoryFilter === 'all' || item.categoryId === categoryFilter
      const matchesTeam = teamFilter === 'all' || item.assignedTeamId === teamFilter
      const matchesAssignee = assigneeFilter === 'all' || item.assigneeId === assigneeFilter
      const matchesTag = tagFilter === 'all' || item.tagIds.includes(tagFilter)
      const matchesDueDate = matchesDueDateFilter(item.dueDate)
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesTeam && matchesAssignee && matchesTag && matchesDueDate
    })
  }, [cases, assigneeFilter, categoryFilter, dueDateFilter, priorityFilter, searchText, statusFilter, tagFilter, teamFilter])

  const filtersAreActive = Boolean(
    searchText.trim() || statusFilter !== 'all' || priorityFilter !== 'all' ||
    categoryFilter !== 'all' || teamFilter !== 'all' || assigneeFilter !== 'all' ||
    tagFilter !== 'all' || dueDateFilter !== 'all'
  )

  const clearFilters = () => {
    setSearchText('')
    setStatusFilter('all')
    setPriorityFilter('all')
    setCategoryFilter('all')
    setTeamFilter('all')
    setAssigneeFilter('all')
    setTagFilter('all')
    setDueDateFilter('all')
  }

  useEffect(() => {
    document.body.classList.add('business-route')
    document.title = 'All cases | Teltruva for Business'
    return () => document.body.classList.remove('business-route')
  }, [])

  return (
    <div className="business-page">
      <header className="workspace-header">
        <button className="workspace-brand" type="button" onClick={() => window.location.href = '/business'}>
          <span className="workspace-brand-mark">T</span>
          <span><strong>Teltruva</strong><small>for Business</small></span>
        </button>
        <p className="workspace-purpose">Case workspace</p>
        <nav className="workspace-nav">
          <button type="button" onClick={() => window.location.href = '/business'}>← Back to dashboard</button>
          <button type="button" onClick={() => window.location.href = '/'}>Individual service</button>
        </nav>
      </header>

      <main className="workspace-main cases-page-main">
        <section className="all-cases-heading">
          <div>
            <p className="workspace-kicker">Case workspace</p>
            <h1>All cases</h1>
            <p>Search the current company workspace and narrow cases by status, priority, category, team, assignee, tag, or due date.</p>
          </div>
        </section>

        <section className="case-filter-panel" aria-label="Case search and filters">
          <label className="case-search-field">
            <span>Search</span>
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search by case ID or title"
            />
          </label>

          <label className="case-filter-field">
            <span>Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All statuses</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </label>

          <label className="case-filter-field">
            <span>Priority</span>
            <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
              <option value="all">All priorities</option>
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>{priority.name}</option>
              ))}
            </select>
          </label>

          <label className="case-filter-field">
            <span>Category</span>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}{category.enabled ? '' : ' (disabled)'}
                </option>
              ))}
            </select>
          </label>

          <label className="case-filter-field">
            <span>Team</span>
            <select value={teamFilter} onChange={(event) => setTeamFilter(event.target.value)}>
              <option value="all">All teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}{team.enabled ? '' : ' (disabled)'}
                </option>
              ))}
            </select>
          </label>

          <label className="case-filter-field">
            <span>Assignee</span>
            <select value={assigneeFilter} onChange={(event) => setAssigneeFilter(event.target.value)}>
              <option value="all">All assignees</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}{member.enabled ? '' : ' (disabled)'}
                </option>
              ))}
            </select>
          </label>

          <label className="case-filter-field">
            <span>Tag</span>
            <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
              <option value="all">All tags</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}{tag.enabled ? '' : ' (disabled)'}
                </option>
              ))}
            </select>
          </label>

          <label className="case-filter-field">
            <span>Due date</span>
            <select value={dueDateFilter} onChange={(event) => setDueDateFilter(event.target.value)}>
              <option value="all">All due dates</option>
              <option value="overdue">Overdue</option>
              <option value="today">Due today</option>
              {dueDateRules.dueSoonThresholds.map((days) => (
                <option key={days} value={`within-${days}`}>Due within {days} day{days === 1 ? '' : 's'}</option>
              ))}
              <option value="none">No due date</option>
            </select>
          </label>

          <button className="clear-case-filters" type="button" onClick={clearFilters} disabled={!filtersAreActive}>
            Clear filters
          </button>
        </section>

        <section className="case-list-section all-cases-section">
          <div className="section-title">
            <div><p className="workspace-kicker">Current demo data</p><h2>Cases</h2></div>
            <span>{filteredCases.length} of {cases.length} cases</span>
          </div>

          {filteredCases.length > 0 ? (
            <div className="case-list">
              {filteredCases.map((item) => {
                const status = statuses.find((entry) => entry.id === item.statusId)
                const priority = priorities.find((entry) => entry.id === item.priorityId)

                return (
                  <article className="case-row" key={item.id}>
                    <div className="case-row-main">
                      <span className="status-dot" style={{ background: status?.color ?? '#64748b' }} />
                      <div>
                        <small>{item.id}</small>
                        <h3 title={item.title}>{item.title}</h3>
                        {item.dueDateSummary && (
                          <span style={{
                            width: 'max-content',
                            maxWidth: '100%',
                            marginTop: '8px',
                            padding: '5px 9px',
                            display: 'inline-flex',
                            border: `1px solid ${item.dueDateSummary.border}`,
                            borderRadius: '999px',
                            background: item.dueDateSummary.background,
                            color: item.dueDateSummary.color,
                            fontSize: '15px',
                            fontWeight: 800,
                            lineHeight: 1.25,
                          }}>
                            {item.dueDateSummary.label}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="case-row-meta">
                      <span>{item.language}</span>
                      <span>{item.evidence}</span>
                      <span>Priority: {priority?.name ?? 'Not set'}</span>
                    </div>

                    <div className="case-row-action">
                      <span
                        className="status-pill"
                        style={{
                          background: `${status?.color ?? '#64748b'}22`,
                          color: status?.color ?? '#64748b',
                        }}
                      >
                        {status?.name ?? 'Unknown status'}
                      </span>
                      <button
                        type="button"
                        disabled={!item.route}
                        onClick={() => { if (item.route) window.location.href = item.route }}
                      >
                        Open case
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="case-filter-empty" role="status">
              <strong>No cases match these filters.</strong>
              <p>Change the search text, status, priority, category, team, assignee, tag, or due date to see other cases.</p>
              <button type="button" onClick={clearFilters}>Clear filters</button>
            </div>
          )}
        </section>
      </main>

      <footer className="workspace-footer">
        <strong>Teltruva for Business</strong>
        <span>Multilingual support, structured for action.</span>
        <button type="button" onClick={() => window.location.href = '/'}>Individual service</button>
        <span>© 2026 Teltruva</span>
      </footer>
    </div>
  )
}

export default BusinessCaseListPage
