import { useEffect, useMemo, useState } from 'react'
import './business.css'
import { loadBusinessCaseReview } from './caseReviewStorage'
import { loadBusinessPriorities } from './priorityMaster'
import { loadBusinessStatuses } from './statusMaster'

const sampleCases = [
  {
    id: 'TLT-2026-001',
    title: 'Possible duplicate charge after checkout',
    language: 'Japanese → English',
    evidence: 'Receipt attached',
    priorityId: 'urgent',
    route: '/business/cases/demo',
  },
  {
    id: 'TLT-2026-002',
    title: 'Reservation cancellation refund request',
    language: 'Spanish → English',
    evidence: 'Email attached',
    priorityId: 'normal',
    statusId: 'waiting-information',
  },
  {
    id: 'TLT-2026-003',
    title: 'Incorrect room charge on final invoice',
    language: 'English → English',
    evidence: 'Invoice attached',
    priorityId: 'high',
    statusId: 'ready-action',
  },
]

function getDueDateSummary(dueDate: string) {
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
  if (days <= 3) {
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
  const priorities = loadBusinessPriorities()
  const savedReview = loadBusinessCaseReview()
  const defaultStatus = statuses.find((status) => status.isDefault && status.enabled)?.id ?? 'needs-review'
  const defaultPriority = priorities.find((priority) => priority.isDefault && priority.enabled)?.id ?? 'normal'
  const demoCaseStatusId = savedReview.statusId || defaultStatus
  const demoCasePriorityId = savedReview.priorityId || defaultPriority
  const demoDueDateSummary = getDueDateSummary(savedReview.dueDate)

  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const cases = useMemo(
    () => sampleCases.map((item) => ({
      ...item,
      statusId: item.id === 'TLT-2026-001' ? demoCaseStatusId : item.statusId,
      priorityId: item.id === 'TLT-2026-001' ? demoCasePriorityId : item.priorityId,
      dueDateSummary: item.id === 'TLT-2026-001' ? demoDueDateSummary : null,
    })),
    [demoCasePriorityId, demoCaseStatusId, demoDueDateSummary?.label]
  )

  const filteredCases = useMemo(() => {
    const query = searchText.trim().toLowerCase()

    return cases.filter((item) => {
      const matchesSearch = !query || item.id.toLowerCase().includes(query) || item.title.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'all' || item.statusId === statusFilter
      const matchesPriority = priorityFilter === 'all' || item.priorityId === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [cases, priorityFilter, searchText, statusFilter])

  const filtersAreActive = Boolean(searchText.trim() || statusFilter !== 'all' || priorityFilter !== 'all')

  const clearFilters = () => {
    setSearchText('')
    setStatusFilter('all')
    setPriorityFilter('all')
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
            <p>Search the current company workspace and narrow cases by status or priority.</p>
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
              <p>Change the search text, status, or priority to see other cases.</p>
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
