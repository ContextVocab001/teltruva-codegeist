import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import './business.css'
import './BusinessIntakePage.css'

type IntakeLanguage = 'English' | 'Japanese' | 'Spanish'

type IntakeData = {
  language: IntakeLanguage
  contactName: string
  email: string
  issue: string
  requestedOutcome: string
  documentName: string
  referenceNumber: string
}

const emptyIntake: IntakeData = {
  language: 'English',
  contactName: '',
  email: '',
  issue: '',
  requestedOutcome: '',
  documentName: '',
  referenceNumber: '',
}

function BusinessIntakePage() {
  const [data, setData] = useState<IntakeData>(emptyIntake)
  const [files, setFiles] = useState<File[]>([])
  const [showManualIdentifiers, setShowManualIdentifiers] = useState(false)
  const [step, setStep] = useState<'edit' | 'review' | 'submitted'>('edit')
  const [error, setError] = useState('')

  useEffect(() => {
    document.body.classList.add('business-route')
    document.title = 'Example Hotel Support | Teltruva'
    return () => document.body.classList.remove('business-route')
  }, [])

  const update = (field: keyof IntakeData, value: string) => {
    setData((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const validate = () => {
    if (!data.contactName.trim() || !data.email.trim() || !data.issue.trim()) {
      setError('Contact name, email, and inquiry details are required.')
      return false
    }
    if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) {
      setError('Enter a valid email address.')
      return false
    }
    return true
  }

  const review = (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    setStep('review')
    window.scrollTo(0, 0)
  }

  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? [])
    const next = [...files, ...selected].slice(0, 5)
    const totalSize = next.reduce((sum, file) => sum + file.size, 0)

    if (totalSize > 25 * 1024 * 1024) {
      setError('Supporting documents must be 25 MB or less in total.')
      event.target.value = ''
      return
    }

    setFiles(next)
    setError('')
    event.target.value = ''
  }

  const submitInquiry = () => {
    setStep('submitted')
    window.scrollTo(0, 0)
  }

  return (
    <div className="business-page intake-simple-page">
      <header className="intake-simple-header">
        <div className="intake-company-brand">
          <span className="intake-company-mark" aria-hidden="true">E</span>
          <div><strong>Example Hotel Support</strong><small>Powered by Teltruva</small></div>
        </div>
        <label className="intake-language-control">
          <span>Language</span>
          <select value={data.language} onChange={(event) => update('language', event.target.value)}>
            <option>English</option>
            <option>Japanese</option>
            <option>Spanish</option>
          </select>
        </label>
      </header>

      <main className="intake-simple-main">
        {step === 'edit' && (
          <>
            <section className="intake-simple-heading">
              <p className="workspace-kicker">Customer support</p>
              <h1>Contact Example Hotel</h1>
              <p>Describe the issue in your own words and add any documents you already have. You will review everything before submitting.</p>
            </section>

            <form className="intake-simple-form" onSubmit={review}>
              <section className="intake-simple-section" aria-labelledby="contact-section-title">
                <div className="intake-simple-section-heading">
                  <h2 id="contact-section-title">Contact information</h2>
                  <p>Enter the name and email address the hotel should use to contact you.</p>
                </div>
                <div className="intake-simple-grid">
                  <label>
                    Contact name <b>Required</b>
                    <input value={data.contactName} onChange={(event) => update('contactName', event.target.value)} placeholder="Your name" />
                  </label>
                  <label>
                    Email <b>Required</b>
                    <input type="email" value={data.email} onChange={(event) => update('email', event.target.value)} placeholder="name@example.com" />
                  </label>
                </div>
              </section>

              <section className="intake-simple-section" aria-labelledby="inquiry-section-title">
                <div className="intake-simple-section-heading">
                  <h2 id="inquiry-section-title">Your inquiry</h2>
                  <p>Billing, refunds, reservations, service issues, document requests, and other inquiries are welcome.</p>
                </div>
                <label>
                  What happened or what do you need? <b>Required</b>
                  <textarea value={data.issue} onChange={(event) => update('issue', event.target.value)} placeholder="Describe the issue or request in your own words." />
                </label>
                <label>
                  What outcome would you like?
                  <textarea value={data.requestedOutcome} onChange={(event) => update('requestedOutcome', event.target.value)} placeholder="For example: Please explain the charge and refund it if it was added incorrectly." />
                </label>
              </section>

              <section className="intake-simple-section" aria-labelledby="documents-section-title">
                <div className="intake-simple-section-heading">
                  <h2 id="documents-section-title">Supporting documents</h2>
                  <p>Add a receipt, folio, booking confirmation, invoice, or screenshot if available. Teltruva will use documents to identify relevant details.</p>
                </div>

                <label className="intake-simple-upload">
                  <strong>Select documents</strong>
                  <span>PDF, PNG, JPG, or WEBP · Up to 5 files · 25 MB total</span>
                  <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={addFiles} />
                </label>

                {files.length > 0 && (
                  <div className="intake-simple-file-list">
                    {files.map((file, index) => (
                      <div key={`${file.name}-${index}`}>
                        <span>{file.name}</span>
                        <button type="button" onClick={() => setFiles((current) => current.filter((_, position) => position !== index))}>Remove</button>
                      </div>
                    ))}
                  </div>
                )}

                <button className="intake-manual-toggle" type="button" aria-expanded={showManualIdentifiers} onClick={() => setShowManualIdentifiers((current) => !current)}>
                  {showManualIdentifiers ? 'Hide manual identification fields' : 'I do not have a document or want to enter identifying information'}
                </button>

                {showManualIdentifiers && (
                  <div className="intake-manual-fields">
                    <p>Use the same spelling shown on the reservation, purchase, or document when possible.</p>
                    <div className="intake-simple-grid">
                      <label>
                        Name shown on reservation or document
                        <input value={data.documentName} onChange={(event) => update('documentName', event.target.value)} placeholder="For example: TAITO UENO" />
                      </label>
                      <label>
                        Reservation, folio, or reference number
                        <input value={data.referenceNumber} onChange={(event) => update('referenceNumber', event.target.value)} placeholder="If known" />
                      </label>
                    </div>
                  </div>
                )}
              </section>

              {error && <p className="intake-simple-error" role="alert">{error}</p>}

              <div className="intake-simple-actions">
                <span>Nothing will be submitted until you review it.</span>
                <button className="primary-button" type="submit">Review inquiry</button>
              </div>
            </form>
          </>
        )}

        {step === 'review' && (
          <section className="intake-simple-review">
            <div className="intake-simple-heading">
              <p className="workspace-kicker">Review before submitting</p>
              <h1>Review your inquiry</h1>
              <p>Confirm the information below. The inquiry has not been submitted yet.</p>
            </div>

            <div className="intake-simple-review-card">
              <div className="intake-review-summary-grid">
                <div><span>Language</span><strong>{data.language}</strong></div>
                <div><span>Contact name</span><strong>{data.contactName}</strong></div>
                <div><span>Email</span><strong>{data.email}</strong></div>
              </div>

              <div className="intake-review-block"><h2>Inquiry</h2><p>{data.issue}</p></div>
              <div className="intake-review-block"><h2>Requested outcome</h2><p>{data.requestedOutcome || 'Not provided'}</p></div>
              <div className="intake-review-block"><h2>Supporting documents</h2>{files.length > 0 ? <ul>{files.map((file) => <li key={file.name}>{file.name}</li>)}</ul> : <p>No documents added</p>}</div>
              {(data.documentName || data.referenceNumber) && (
                <div className="intake-review-block"><h2>Manually provided identification</h2><dl>{data.documentName && <div><dt>Name on reservation or document</dt><dd>{data.documentName}</dd></div>}{data.referenceNumber && <div><dt>Reference number</dt><dd>{data.referenceNumber}</dd></div>}</dl></div>
              )}
            </div>

            <div className="intake-simple-actions">
              <button className="intake-secondary-action" type="button" onClick={() => { setStep('edit'); window.scrollTo(0, 0) }}>← Back to edit</button>
              <button className="primary-button" type="button" onClick={submitInquiry}>Submit inquiry</button>
            </div>
          </section>
        )}

        {step === 'submitted' && (
          <section className="intake-simple-submitted">
            <span aria-hidden="true">✓</span>
            <h1>Inquiry received</h1>
            <p>This demo has completed the customer submission step. The next phase will connect the reviewed information to the company workspace.</p>
            <button className="primary-button" type="button" onClick={() => { setData(emptyIntake); setFiles([]); setShowManualIdentifiers(false); setStep('edit'); window.scrollTo(0, 0) }}>Start another inquiry</button>
          </section>
        )}
      </main>
    </div>
  )
}

export default BusinessIntakePage
