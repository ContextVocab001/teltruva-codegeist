import { useEffect, useMemo } from 'react'
import './business.css'
import { loadBusinessCaseReview } from './caseReviewStorage'
import { loadBusinessStatuses } from './statusMaster'

const baseStatusCounts: Record<string, number> = {
  'needs-review': 2,
  'waiting-information': 2,
  'ready-action': 1,
  'in-progress': 4,
  'resolved': 0,
}

const sampleCases = [
  { id: 'TLT-2026-001', title: 'Possible duplicate charge after checkout', language: 'Japanese → English', evidence: 'Receipt attached', priority: 'Urgent', route: '/business/cases/demo' },
  { id: 'TLT-2026-002', title: 'Reservation cancellation refund request', language: 'Spanish → English', evidence: 'Email attached', priority: 'Normal', statusId: 'waiting-information' },
  { id: 'TLT-2026-003', title: 'Incorrect room charge on final invoice', language: 'English → English', evidence: 'Invoice attached', priority: 'High', statusId: 'ready-action' },
]

function BusinessPage() {
  const statuses = loadBusinessStatuses()
  const savedReview = loadBusinessCaseReview()
  const defaultStatus = statuses.find((status) => status.isDefault && status.enabled)?.id ?? 'needs-review'
  const demoCaseStatusId = savedReview.statusId || defaultStatus

  const cases = useMemo(() => sampleCases.map((item) => ({
    ...item,
    statusId: item.id === 'TLT-2026-001' ? demoCaseStatusId : item.statusId,
  })), [demoCaseStatusId])

  const activeStatuses = statuses.filter((status) => status.enabled || status.id === demoCaseStatusId)
  const statusCounts = activeStatuses.map((status) => ({
    ...status,
    count: (baseStatusCounts[status.id] ?? 0) + (status.id === demoCaseStatusId ? 1 : 0),
  }))

  useEffect(() => {
    document.body.classList.add('business-route')
    document.title = 'Teltruva for Business'
    return () => document.body.classList.remove('business-route')
  }, [])

  return (
    <div className="business-page">
      <header className="workspace-header">
        <button className="workspace-brand" type="button" onClick={() => window.location.href = '/'}>
          <span className="workspace-brand-mark">T</span>
          <span><strong>Teltruva</strong><small>for Business</small></span>
        </button>
        <p className="workspace-purpose">Multilingual customer support workspace</p>
        <nav className="workspace-nav">
          <button className="active" type="button">Cases</button>
          <a href="#case-flow">How cases move</a>
          <button type="button" onClick={() => window.location.href = '/'}>Individual service</button>
        </nav>
      </header>

      <main className="workspace-main">
        <section className="workspace-intro">
          <div>
            <p className="workspace-kicker">Customer support cases</p>
            <h1>Review what needs attention.</h1>
            <p>Check multilingual inquiries, evidence, requested outcomes, and missing information before taking action.</p>
          </div>
          <button className="primary-button" type="button" onClick={() => window.location.href = '/business/cases/demo'}>Open priority case</button>
        </section>

        <section className="status-grid status-grid-dynamic" aria-label="Case status overview">
          {statusCounts.map((status) => (
            <article className="status-card" key={status.id}>
              <i style={{ background: status.color }} />
              <div><strong>{status.count}</strong><span>{status.name}</span></div>
            </article>
          ))}
        </section>

        <section className="case-list-section">
          <div className="section-title">
            <div><p className="workspace-kicker">Cases requiring attention</p><h2>Open cases</h2></div>
            <span>{cases.length} shown</span>
          </div>

          <div className="case-list">
            {cases.map((item) => {
              const status = statuses.find((entry) => entry.id === item.statusId)
              return (
                <article className="case-row" key={item.id}>
                  <div className="case-row-main">
                    <span className="status-dot" style={{ background: status?.color ?? '#64748b' }} />
                    <div><small>{item.id}</small><h3>{item.title}</h3></div>
                  </div>
                  <div className="case-row-meta">
                    <span>{item.language}</span><span>{item.evidence}</span><span>Priority: {item.priority}</span>
                  </div>
                  <div className="case-row-action">
                    <span className="status-pill" style={{ background: `${status?.color ?? '#64748b'}22`, color: status?.color ?? '#64748b' }}>
                      {status?.name ?? 'Unknown status'}
                    </span>
                    <button type="button" disabled={!item.route} onClick={() => { if (item.route) window.location.href = item.route }}>Open case</button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="case-flow" id="case-flow">
          <div><p className="workspace-kicker">How cases move</p><h2>A clear path from inquiry to response</h2></div>
          <ol>{['Receive', 'Structure', 'Review', 'Act', 'Respond'].map((step, index) => <li key={step}><span>{index + 1}</span><strong>{step}</strong></li>)}</ol>
        </section>

        <section className="trust-strip">
          <div><strong>Human review before action</strong><span>Nothing is sent automatically.</span></div>
          <div><strong>Evidence stays connected</strong><span>Source documents remain visible with the case.</span></div>
          <div><strong>Languages stay distinct</strong><span>Customer and service languages are clearly identified.</span></div>
        </section>
      </main>

      <footer className="workspace-footer"><strong>Teltruva for Business</strong><span>Multilingual support, structured for action.</span><button type="button" onClick={() => window.location.href = '/'}>Individual service</button><span>© 2026 Teltruva</span></footer>
    </div>
  )
}

export default BusinessPage
