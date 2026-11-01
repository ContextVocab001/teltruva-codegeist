import { useEffect } from 'react'
import './business.css'

function BusinessCasePage() {
  useEffect(() => {
    document.body.classList.add('business-route')
    document.title = 'Case TLT-2026-001 | Teltruva'
    return () => document.body.classList.remove('business-route')
  }, [])

  return (
    <div className="business-page">
      <header className="workspace-header">
        <button className="workspace-brand" type="button" onClick={() => window.location.href = '/business'}><span className="workspace-brand-mark">T</span><span><strong>Teltruva</strong><small>for Business</small></span></button>
        <p className="workspace-purpose">Case review</p>
        <nav className="workspace-nav"><button type="button" onClick={() => window.location.href = '/business'}>← Back to cases</button><button type="button" onClick={() => window.location.href = '/'}>Individual service</button></nav>
      </header>

      <main className="workspace-main case-page-main">
        <div className="case-page-heading"><div><p className="workspace-kicker">Priority case</p><h1>Case TLT-2026-001</h1></div><span className="status-pill review">Needs review</span></div>
        <article className="case-detail-card">
          <section className="case-detail-content">
            <div className="case-title"><span>AI</span><div><small>Hotel billing issue</small><h2>Possible duplicate charge after checkout</h2></div></div>
            <div className="summary-box"><h3>Issue summary</h3><p>The customer reports a charge that may duplicate an amount already included in the hotel receipt and asks the billing team to review it.</p></div>
            <div className="information-grid"><div><span>Customer language</span><strong>Japanese</strong></div><div><span>Service language</span><strong>English</strong></div><div><span>Supporting evidence</span><strong>Hotel receipt</strong></div><div><span>Requested outcome</span><strong>Billing review</strong></div></div>
            <div className="missing-box"><b>!</b><div><strong>Missing information</strong><p>Confirm whether the pending card charge has posted before the case is sent for action.</p></div></div>
          </section>
          <aside className="decision-panel">
            <div className="decision-heading"><h2>Company review</h2><span>Manual decision</span></div>
            <label>Category<select defaultValue=""><option value="" disabled>Select category</option><option>Billing</option><option>Reservation</option><option>Service quality</option><option>Refund</option><option>Other</option></select></label>
            <label>Priority<select defaultValue="normal"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
            <label>Assigned team<select defaultValue=""><option value="" disabled>Select team</option><option>Billing team</option><option>Customer care</option><option>Hotel operations</option></select></label>
            <div className="human-note"><b>✓</b><p><strong>Human review required.</strong> Teltruva does not choose the company category, priority, or assignee.</p></div>
            <button className="primary-button full" type="button">Save review</button>
          </aside>
        </article>
      </main>
    </div>
  )
}

export default BusinessCasePage
