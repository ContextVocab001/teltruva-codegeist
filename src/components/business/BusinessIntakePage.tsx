import { useEffect, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
import * as pdfjs from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { buildCaseReviewData, prepareStructuredCase, runOcr } from '../../api/caseAnalysis'
import './business.css'
import './BusinessIntakePage.css'

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker

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

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function filesToOcrImages(files: File[]) {
  const images: string[] = []

  for (const file of files) {
    if (file.type.startsWith('image/')) {
      images.push(await fileToDataUrl(file))
      continue
    }

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
      for (let pageNumber = 1; pageNumber <= Math.min(pdf.numPages, 6); pageNumber += 1) {
        const page = await pdf.getPage(pageNumber)
        const viewport = page.getViewport({ scale: 1.8 })
        const canvas = document.createElement('canvas')
        canvas.width = Math.ceil(viewport.width)
        canvas.height = Math.ceil(viewport.height)
        const context = canvas.getContext('2d')
        if (!context) continue
        await page.render({ canvas, canvasContext: context, viewport }).promise
        images.push(canvas.toDataURL('image/jpeg', 0.9))
      }
    }
  }

  return images
}

type DocumentReview = ReturnType<typeof buildCaseReviewData>

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function fileTypeLabel(file: File) {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return 'PDF'
  return 'IMAGE'
}

function BusinessIntakePage() {
  const [data, setData] = useState<IntakeData>(emptyIntake)
  const [files, setFiles] = useState<File[]>([])
  const [showManualIdentifiers, setShowManualIdentifiers] = useState(false)
  const [step, setStep] = useState<'edit' | 'review' | 'submitted'>('edit')
  const [error, setError] = useState('')
  const [isReadingDocuments, setIsReadingDocuments] = useState(false)
  const [documentReview, setDocumentReview] = useState<DocumentReview | null>(null)
  const [documentText, setDocumentText] = useState('')
  const [isDraggingFiles, setIsDraggingFiles] = useState(false)

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

  const review = async (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) return

    setIsReadingDocuments(true)
    setError('')

    try {
      if (files.length > 0) {
        const images = await filesToOcrImages(files)
        if (images.length === 0) {
          throw new Error('No readable image or PDF pages were found in the selected documents.')
        }

        const ocr = await runOcr(images)
        if (!ocr.text.trim()) {
          throw new Error('No readable text was found. Try a clearer image or add the identifying information manually.')
        }

        const preparation = await prepareStructuredCase({
          interfaceLanguage: 'en',
          draftLanguage: 'en',
          userText: [data.issue, data.requestedOutcome ? `Requested outcome: ${data.requestedOutcome}` : ''].filter(Boolean).join('\n\n'),
          documentText: ocr.text,
          ocrPages: ocr.pages,
        })

        setDocumentText(ocr.text)
        setDocumentReview(buildCaseReviewData(preparation))
      } else {
        setDocumentText('')
        setDocumentReview(null)
      }

      setStep('review')
      window.scrollTo(0, 0)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The documents could not be read. Try again or enter identifying information manually.')
    } finally {
      setIsReadingDocuments(false)
    }
  }

  const acceptFiles = (selectedFiles: File[]) => {
    const supportedFiles = selectedFiles.filter((file) => {
      const extension = file.name.toLowerCase().split('.').pop()
      return file.type === 'application/pdf' || file.type.startsWith('image/') || ['pdf', 'png', 'jpg', 'jpeg', 'webp'].includes(extension ?? '')
    })

    if (supportedFiles.length !== selectedFiles.length) {
      setError('Only PDF, PNG, JPG, JPEG, and WEBP files are supported.')
      return
    }

    const next = [...files, ...supportedFiles].slice(0, 5)
    const totalSize = next.reduce((sum, file) => sum + file.size, 0)

    if (totalSize > 25 * 1024 * 1024) {
      setError('Supporting documents must be 25 MB or less in total.')
      return
    }

    setFiles(next)
    setDocumentReview(null)
    setDocumentText('')
    setError('')
  }

  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    acceptFiles(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  const dropFiles = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDraggingFiles(false)
    acceptFiles(Array.from(event.dataTransfer.files ?? []))
  }


  const submitInquiry = () => {
    setStep('submitted')
    window.scrollTo(0, 0)
  }

  return (
    <div className="business-page intake-simple-page">
      <header className="intake-simple-header">
        <div className="intake-company-brand">
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

                <label
                  className={`${isDraggingFiles ? 'intake-simple-upload is-dragging' : 'intake-simple-upload'}${files.length > 0 ? ' has-files' : ''}`}
                  onDragEnter={(event) => { event.preventDefault(); setIsDraggingFiles(true) }}
                  onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'copy'; setIsDraggingFiles(true) }}
                  onDragLeave={(event) => {
                    event.preventDefault()
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDraggingFiles(false)
                  }}
                  onDrop={dropFiles}
                >
                  <span className="intake-upload-icon" aria-hidden="true">↑</span>
                  <strong>
                    {isDraggingFiles
                      ? 'Drop documents here'
                      : files.length > 0
                        ? `${files.length} document${files.length === 1 ? '' : 's'} ready to read`
                        : 'Select or drop documents here'}
                  </strong>
                  <span>{files.length > 0 ? 'Drop more documents here or select additional files' : 'PDF, PNG, JPG, or WEBP · Up to 5 files · 25 MB total'}</span>
                  <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={addFiles} />
                </label>

                {files.length > 0 && (
                  <section className="intake-added-documents" aria-label="Documents ready to read">
                    <header><div><strong>Documents added</strong><span>{files.length} file{files.length === 1 ? '' : 's'}</span></div><small>Ready to read</small></header>
                    <div className="intake-added-document-list">
                      {files.map((file, index) => (
                        <article key={`${file.name}-${index}`}>
                          <span className={`intake-file-type ${fileTypeLabel(file).toLowerCase()}`} aria-hidden="true">{fileTypeLabel(file)}</span>
                          <div><strong>{file.name}</strong><span>{formatFileSize(file.size)} · Ready to read</span></div>
                          <button type="button" onClick={() => { setFiles((current) => current.filter((_, position) => position !== index)); setDocumentReview(null); setDocumentText('') }}>Remove</button>
                        </article>
                      ))}
                    </div>
                  </section>
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
              {isReadingDocuments && (
                <div className="intake-processing-status" role="status" aria-live="polite">
                  <span className="intake-processing-spinner" aria-hidden="true" />
                  <div><strong>Reading {files.length} document{files.length === 1 ? '' : 's'}…</strong><p>Extracting text and organizing the information for review.</p></div>
                </div>
              )}

              <div className="intake-simple-actions">
                <span>Nothing will be submitted until you review it.</span>
                <button className="primary-button" type="submit" disabled={isReadingDocuments}>{isReadingDocuments ? 'Reading documents…' : 'Review inquiry'}</button>
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

              {documentReview && (
                <div className="intake-review-block document-review-block">
                  <h2>Information found in the documents</h2>
                  {documentReview.confirmedFacts.length > 0 ? (
                    <dl>
                      {documentReview.confirmedFacts.map((fact) => (
                        <div key={fact.key}><dt>{fact.label}</dt><dd>{String(fact.value)}</dd></div>
                      ))}
                    </dl>
                  ) : (
                    <p>No structured details were confirmed from the documents.</p>
                  )}
                  {documentReview.primaryIdentifier ? (
                    <p className="document-identifier-confirmed"><strong>{documentReview.primaryIdentifier.label}:</strong> {documentReview.primaryIdentifier.value}</p>
                  ) : (
                    <p className="document-identifier-missing">A primary reservation, folio, order, or reference number was not confirmed. Add it manually if known.</p>
                  )}
                  <details className="ocr-text-details"><summary>View text read from documents</summary><pre>{documentText}</pre></details>
                </div>
              )}

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
            <button className="primary-button" type="button" onClick={() => { setData(emptyIntake); setFiles([]); setDocumentReview(null); setDocumentText(''); setShowManualIdentifiers(false); setStep('edit'); window.scrollTo(0, 0) }}>Start another inquiry</button>
          </section>
        )}
      </main>
    </div>
  )
}

export default BusinessIntakePage
