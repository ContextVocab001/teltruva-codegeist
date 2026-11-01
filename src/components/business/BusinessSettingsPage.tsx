import { useEffect, useState } from 'react'
import './business.css'

type Category = {
  id: number
  name: string
  enabled: boolean
  deletable: boolean
}

const initialCategories: Category[] = [
  { id: 1, deletable: false, name: 'Billing', enabled: true },
  { id: 2, deletable: false, name: 'Reservation', enabled: true },
  { id: 3, deletable: false, name: 'Cancellation', enabled: true },
  { id: 4, deletable: false, name: 'Service quality', enabled: true },
  { id: 5, deletable: false, name: 'Refund', enabled: true },
  { id: 6, deletable: false, name: 'Other', enabled: true },
]

function BusinessSettingsPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [newCategory, setNewCategory] = useState('')
  const [message, setMessage] = useState('')
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  useEffect(() => {
    document.body.classList.add('business-route')
    document.title = 'Business settings | Teltruva'
    return () => document.body.classList.remove('business-route')
  }, [])

  const addCategory = () => {
    const name = newCategory.trim()
    if (!name) {
      setMessage('Enter a category name.')
      return
    }
    if (categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
      setMessage('That category already exists.')
      return
    }
    setCategories((current) => [...current, { id: Date.now(), name, enabled: true, deletable: true }])
    setNewCategory('')
    setMessage('Category added for this demo session.')
  }

  const toggleCategory = (id: number) => {
    setCategories((current) => current.map((category) => category.id === id ? { ...category, enabled: !category.enabled } : category))
    setMessage('Category status updated for this demo session.')
  }

  const requestDeleteCategory = (category: Category) => {
    if (!category.deletable) return
    setCategoryToDelete(category)
  }

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return
    setCategories((current) => current.filter((item) => item.id !== categoryToDelete.id))
    setMessage('Category deleted from this demo session.')
    setCategoryToDelete(null)
  }

  return (
    <div className="business-page">
      <header className="workspace-header">
        <button className="workspace-brand" type="button" onClick={() => window.location.href = '/business'}>
          <span className="workspace-brand-mark">T</span>
          <span><strong>Teltruva</strong><small>for Business</small></span>
        </button>
        <p className="workspace-purpose">Business settings</p>
        <nav className="workspace-nav">
          <button type="button" onClick={() => window.location.href = '/business'}>← Back to cases</button>
          <button type="button" onClick={() => window.location.href = '/'}>Individual service</button>
        </nav>
      </header>

      <main className="workspace-main settings-main">
        <section className="settings-heading">
          <div>
            <p className="workspace-kicker">Company-managed fields</p>
            <h1>Business settings</h1>
            <p>Maintain the approved values that support specialists can select when reviewing a case.</p>
          </div>
          <span className="demo-badge">Demo configuration</span>
        </section>

        <div className="settings-layout">
          <nav className="settings-nav" aria-label="Business settings sections">
            <button className="active" type="button">Categories</button>
            <button type="button" disabled>Tags <span>Later</span></button>
            <button type="button" disabled>Priorities <span>Later</span></button>
            <button type="button" disabled>Teams <span>Later</span></button>
            <button type="button" disabled>Members <span>Later</span></button>
            <button type="button" disabled>Statuses <span>Later</span></button>
          </nav>

          <section className="master-panel" aria-labelledby="category-master-heading">
            <div className="master-panel-heading">
              <div><p>Category master</p><h2 id="category-master-heading">Categories</h2></div>
              <span>{categories.filter((category) => category.enabled).length} active</span>
            </div>

            <p className="master-description">Categories are selected by support specialists. Teltruva does not assign them automatically.</p>

            <div className="add-master-value">
              <label htmlFor="new-category">New category</label>
              <div>
                <input id="new-category" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') addCategory() }} placeholder="Enter category name" />
                <button type="button" onClick={addCategory}>Add category</button>
              </div>
              {message && <p aria-live="polite">{message}</p>}
            </div>

            <div className="master-list" role="list">
              {categories.map((category) => (
                <article className={category.enabled ? '' : 'disabled'} key={category.id} role="listitem">
                  <div><strong>{category.name}</strong><span>{category.enabled ? 'Available for case review' : 'Disabled for new selections'}</span></div>
                  <div className="master-actions">
                    <button type="button" onClick={() => toggleCategory(category.id)}>{category.enabled ? 'Disable' : 'Enable'}</button>
                    {category.deletable && <button className="delete-master-button" type="button" onClick={() => requestDeleteCategory(category)}>Delete</button>}
                  </div>
                </article>
              ))}
            </div>

            <div className="settings-note">
              <strong>Demo behavior</strong>
              <p>Changes currently remain only while this page is open. Company accounts, permissions, and permanent storage will be added in a later phase.</p>
            </div>
          </section>
        </div>
      </main>

      {categoryToDelete && (
        <div className="delete-dialog-backdrop" role="presentation" onMouseDown={() => setCategoryToDelete(null)}>
          <section className="delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description" onMouseDown={(event) => event.stopPropagation()}>
            <div className="delete-dialog-icon" aria-hidden="true">!</div>
            <h2 id="delete-dialog-title">Delete “{categoryToDelete.name}”?</h2>
            <p id="delete-dialog-description">This demo category has not been used in any cases. This action cannot be undone.</p>
            <div className="delete-dialog-actions">
              <button type="button" onClick={() => setCategoryToDelete(null)}>Cancel</button>
              <button className="confirm-delete-button" type="button" onClick={confirmDeleteCategory}>Delete category</button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default BusinessSettingsPage
