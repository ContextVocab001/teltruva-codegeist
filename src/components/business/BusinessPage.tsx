import { useEffect } from 'react'
import './business.css'

const workflowSteps = [
  {
    number: '01',
    title: 'Receive multilingual inquiries',
    description: 'Give customers a clear way to explain an issue and share supporting documents in their own language.',
  },
  {
    number: '02',
    title: 'Structure the case',
    description: 'Organize the issue, evidence, requested resolution, and missing information into a consistent case summary.',
  },
  {
    number: '03',
    title: 'Support the service team',
    description: 'Prepare the case for review in the company workflow while keeping people in control of every response.',
  },
]

function BusinessPage() {
  useEffect(() => {
    document.body.classList.add('business-route')
    document.title = 'Teltruva for Business'

    return () => {
      document.body.classList.remove('business-route')
      document.title = 'Teltruva'
    }
  }, [])

  const goToConsumer = () => {
    window.location.href = '/'
  }

  return (
    <div className="business-page">
      <header className="business-header">
        <button className="business-brand" type="button" onClick={goToConsumer} aria-label="Go to Teltruva home">
          <span className="business-brand-mark" aria-hidden="true">T</span>
          <span>
            <strong>Teltruva</strong>
            <small>for Business</small>
          </span>
        </button>
        <nav className="business-header-actions" aria-label="Business page navigation">
          <span>Enterprise support workspace</span>
          <button type="button" onClick={goToConsumer}>Individual service</button>
        </nav>
      </header>

      <main>
        <section className="business-hero">
          <div className="business-hero-copy">
            <p className="business-eyebrow">Multilingual customer support</p>
            <h1>Turn complex customer issues into clear, actionable cases.</h1>
            <p className="business-lead">
              Teltruva helps service teams receive inquiries across languages, organize supporting evidence,
              and prepare consistent case information without removing human review.
            </p>
            <div className="business-hero-actions">
              <span className="business-status">Business workspace foundation</span>
              <a href="#workflow">View planned workflow</a>
            </div>
          </div>

          <aside className="business-preview" aria-label="Illustrative case workspace preview">
            <div className="business-preview-top">
              <span>Case overview</span>
              <mark>Prepared for review</mark>
            </div>
            <div className="business-case-title">
              <span className="business-case-icon" aria-hidden="true">AI</span>
              <div>
                <small>Multilingual inquiry</small>
                <strong>Hotel billing issue</strong>
              </div>
            </div>
            <dl className="business-case-details">
              <div><dt>Customer language</dt><dd>Japanese</dd></div>
              <div><dt>Service language</dt><dd>English</dd></div>
              <div><dt>Evidence</dt><dd>Receipt attached</dd></div>
              <div><dt>Requested outcome</dt><dd>Billing review</dd></div>
            </dl>
            <div className="business-review-note">
              <span aria-hidden="true">✓</span>
              <p><strong>Human review stays required.</strong> Nothing is sent automatically.</p>
            </div>
          </aside>
        </section>

        <section className="business-value" aria-label="Business value">
          <article><strong>Clear intake</strong><p>Reduce ambiguity before a case reaches the service team.</p></article>
          <article><strong>Evidence-aware</strong><p>Keep documents and extracted facts connected to the issue.</p></article>
          <article><strong>Human controlled</strong><p>Review every case summary and response before use.</p></article>
        </section>

        <section className="business-workflow" id="workflow">
          <div className="business-section-heading">
            <p>Planned workflow</p>
            <h2>A foundation for business support operations</h2>
            <span>This page currently establishes the enterprise experience. Workflow integrations will be added in later phases.</span>
          </div>
          <div className="business-steps">
            {workflowSteps.map((step) => (
              <article key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="business-roadmap">
          <div>
            <p>Built for responsible integration</p>
            <h2>Designed to connect with the tools support teams already use.</h2>
          </div>
          <div className="business-roadmap-items">
            <span>Case intake</span>
            <span>Structured evidence</span>
            <span>Team review</span>
            <span>Workflow integration</span>
          </div>
        </section>
      </main>

      <footer className="business-footer">
        <div><strong>Teltruva</strong><span>Multilingual support, structured for action.</span></div>
        <div><span>Business experience in development</span><span>© 2026 Teltruva</span></div>
      </footer>
    </div>
  )
}

export default BusinessPage
