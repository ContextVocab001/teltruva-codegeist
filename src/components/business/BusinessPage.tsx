import { useEffect } from 'react'
import './business.css'

const cases = [
  { id: 'TLT-2026-001', title: 'Possible duplicate charge after checkout', language: 'Japanese → English', evidence: 'Receipt attached', status: 'Needs review', tone: 'review', priority: 'Normal' },
  { id: 'TLT-2026-002', title: 'Reservation cancellation refund request', language: 'Spanish → English', evidence: 'Email attached', status: 'Waiting for information', tone: 'waiting', priority: 'Normal' },
  { id: 'TLT-2026-003', title: 'Incorrect room charge on final invoice', language: 'English → English', evidence: 'Invoice attached', status: 'Ready for action', tone: 'ready', priority: 'High' },
]

const stats = [
  ['3', 'Needs review', 'review'],
  ['2', 'Waiting for information', 'waiting'],
  ['1', 'Ready for action', 'ready'],
  ['4', 'In progress', 'progress'],
]

function BusinessPage() {
  useEffect(() => {
    document.body.classList.add('business-route')
    document.title = 'Teltruva for Business'
    return () => document.body.classList.remove('business-route')
  }, [])

  const openCase = (id: string) => {
    if (id === 'TLT-2026-001') window.location.href = '/business/cases/demo'
  }

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
          <div><p className="workspace-kicker">Customer support cases</p><h1>Review what needs attention.</h1><p>Check multilingual inquiries, evidence, requested outcomes, and missing information before taking action.</p></div>
          <button className="primary-button" type="button" onClick={() => openCase('TLT-2026-001')}>Open priority case</button>
        </section>

        <section className="status-grid" aria-label="Case status overview">
          {stats.map(([value,label,tone]) => <article className={`status-card ${tone}`} key={label}><i /><div><strong>{value}</strong><span>{label}</span></div></article>)}
        </section>

        <section className="case-list-section">
          <div className="section-title"><div><p className="workspace-kicker">Cases requiring attention</p><h2>Open cases</h2></div><span>3 shown</span></div>
          <div className="case-list">
            {cases.map((item) => (
              <article className="case-row" key={item.id}>
                <div className="case-row-main"><span className={`status-dot ${item.tone}`} /><div><small>{item.id}</small><h3>{item.title}</h3></div></div>
                <div className="case-row-meta"><span>{item.language}</span><span>{item.evidence}</span><span>Priority: {item.priority}</span></div>
                <div className="case-row-action"><span className={`status-pill ${item.tone}`}>{item.status}</span><button type="button" disabled={item.id !== 'TLT-2026-001'} onClick={() => openCase(item.id)}>Open case</button></div>
              </article>
            ))}
          </div>
        </section>

        <section className="case-flow" id="case-flow">
          <div><p className="workspace-kicker">How cases move</p><h2>A clear path from inquiry to response</h2></div>
          <ol>
            {['Receive','Structure','Review','Act','Respond'].map((step,index) => <li key={step}><span>{index+1}</span><strong>{step}</strong></li>)}
          </ol>
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
