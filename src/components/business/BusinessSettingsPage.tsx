import { useEffect, useState } from 'react'
import './business.css'
import { loadBusinessCategories, saveBusinessCategories, type BusinessCategory } from './categoryMaster'
import { loadBusinessTeams, saveBusinessTeams, type BusinessTeam } from './teamMaster'

type SettingsSection = 'categories' | 'teams'
type DeletableMaster = { kind: SettingsSection; id: string; name: string }

function BusinessSettingsPage() {
  const [section, setSection] = useState<SettingsSection>('categories')
  const [categories, setCategories] = useState<BusinessCategory[]>(() => loadBusinessCategories())
  const [teams, setTeams] = useState<BusinessTeam[]>(() => loadBusinessTeams())
  const [newValue, setNewValue] = useState('')
  const [message, setMessage] = useState('')
  const [itemToDelete, setItemToDelete] = useState<DeletableMaster | null>(null)

  useEffect(() => {
    document.body.classList.add('business-route')
    document.title = 'Business settings | Teltruva'
    return () => document.body.classList.remove('business-route')
  }, [])

  const switchSection = (nextSection: SettingsSection) => {
    setSection(nextSection)
    setNewValue('')
    setMessage('')
  }

  const addValue = () => {
    const name = newValue.trim()
    if (!name) {
      setMessage(`Enter a ${section === 'categories' ? 'category' : 'team'} name.`)
      return
    }

    if (section === 'categories') {
      if (categories.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
        setMessage('That category already exists.')
        return
      }
      const next = [...categories, { id: `custom-${Date.now()}`, name, enabled: true, deletable: true }]
      setCategories(next)
      saveBusinessCategories(next)
      setMessage('Category added and made available for case review.')
    } else {
      if (teams.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
        setMessage('That team already exists.')
        return
      }
      const next = [...teams, { id: `custom-${Date.now()}`, name, enabled: true, deletable: true }]
      setTeams(next)
      saveBusinessTeams(next)
      setMessage('Team added and made available for case assignment.')
    }
    setNewValue('')
  }

  const toggleCategory = (id: string) => {
    const next = categories.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item)
    setCategories(next)
    saveBusinessCategories(next)
    setMessage('Category availability updated.')
  }

  const toggleTeam = (id: string) => {
    const next = teams.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item)
    setTeams(next)
    saveBusinessTeams(next)
    setMessage('Team availability updated.')
  }

  const confirmDelete = () => {
    if (!itemToDelete) return
    if (itemToDelete.kind === 'categories') {
      const next = categories.filter((item) => item.id !== itemToDelete.id)
      setCategories(next)
      saveBusinessCategories(next)
      setMessage('Category deleted from this browser demo.')
    } else {
      const next = teams.filter((item) => item.id !== itemToDelete.id)
      setTeams(next)
      saveBusinessTeams(next)
      setMessage('Team deleted from this browser demo.')
    }
    setItemToDelete(null)
  }

  const isCategories = section === 'categories'
  const values = isCategories ? categories : teams
  const activeCount = values.filter((item) => item.enabled).length
  const singular = isCategories ? 'category' : 'team'

  return (
    <div className="business-page">
      <header className="workspace-header">
        <button className="workspace-brand" type="button" onClick={() => window.location.href = '/business'}><span className="workspace-brand-mark">T</span><span><strong>Teltruva</strong><small>for Business</small></span></button>
        <p className="workspace-purpose">Business settings</p>
        <nav className="workspace-nav"><button type="button" onClick={() => window.location.href = '/business/cases/demo'}>← Back to case</button><button type="button" onClick={() => window.location.href = '/business'}>All cases</button></nav>
      </header>

      <main className="workspace-main settings-main">
        <section className="settings-heading"><div><p className="workspace-kicker">Company-managed fields</p><h1>Business settings</h1><p>Maintain the approved values that support specialists can select when reviewing a case.</p></div><span className="demo-badge">Browser demo storage</span></section>

        <div className="settings-layout">
          <nav className="settings-nav" aria-label="Business settings sections">
            <button className={isCategories ? 'active' : ''} type="button" onClick={() => switchSection('categories')}>Categories</button>
            <button type="button" disabled>Tags <span>Later</span></button>
            <button type="button" disabled>Priorities <span>Later</span></button>
            <button className={!isCategories ? 'active' : ''} type="button" onClick={() => switchSection('teams')}>Teams</button>
            <button type="button" disabled>Members <span>Later</span></button>
            <button type="button" disabled>Statuses <span>Later</span></button>
          </nav>

          <section className="master-panel">
            <div className="master-panel-heading"><div><p>{isCategories ? 'Category master' : 'Team master'}</p><h2>{isCategories ? 'Categories' : 'Teams'}</h2></div><span>{activeCount} active</span></div>
            <p className="master-description">{isCategories ? 'Categories are selected by support specialists. Teltruva does not assign them automatically.' : 'Teams are selected by support specialists. Teltruva does not assign cases automatically.'}</p>

            <div className="add-master-value">
              <label htmlFor="new-master-value">New {singular}</label>
              <div><input id="new-master-value" value={newValue} onChange={(event) => setNewValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') addValue() }} placeholder={`Enter ${singular} name`} /><button type="button" onClick={addValue}>Add {singular}</button></div>
              {message && <p aria-live="polite">{message}</p>}
            </div>

            <div className="master-list" role="list">
              {values.map((item) => (
                <article className={item.enabled ? '' : 'disabled'} key={item.id} role="listitem">
                  <div><strong>{item.name}</strong><span>{item.enabled ? `Available for case ${isCategories ? 'review' : 'assignment'}` : `Disabled for new ${isCategories ? 'selections' : 'assignments'}`}</span></div>
                  <div className="master-actions">
                    <button type="button" onClick={() => isCategories ? toggleCategory(item.id) : toggleTeam(item.id)}>{item.enabled ? 'Disable' : 'Enable'}</button>
                    {item.deletable && <button className="delete-master-button" type="button" onClick={() => setItemToDelete({ kind: section, id: item.id, name: item.name })}>Delete</button>}
                  </div>
                </article>
              ))}
            </div>

            <div className="settings-note"><strong>Demo storage</strong><p>Changes are stored only in this browser. Company accounts, administrator permissions, and permanent shared storage will be added later.</p></div>
          </section>
        </div>
      </main>

      {itemToDelete && <div className="delete-dialog-backdrop" role="presentation" onMouseDown={() => setItemToDelete(null)}><section className="delete-dialog" role="alertdialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><div className="delete-dialog-icon">!</div><h2>Delete “{itemToDelete.name}”?</h2><p>This demo {itemToDelete.kind === 'categories' ? 'category' : 'team'} has not been used in any cases. This action cannot be undone.</p><div className="delete-dialog-actions"><button type="button" onClick={() => setItemToDelete(null)}>Cancel</button><button className="confirm-delete-button" type="button" onClick={confirmDelete}>Delete {itemToDelete.kind === 'categories' ? 'category' : 'team'}</button></div></section></div>}
    </div>
  )
}

export default BusinessSettingsPage
