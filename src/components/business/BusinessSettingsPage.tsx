import { useEffect, useState } from 'react'
import './business.css'
import { loadBusinessCategories, saveBusinessCategories, type BusinessCategory } from './categoryMaster'
import { loadBusinessTeams, saveBusinessTeams, type BusinessTeam } from './teamMaster'
import { loadBusinessPriorities, saveBusinessPriorities, type BusinessPriority } from './priorityMaster'
import { loadBusinessStatuses, saveBusinessStatuses, type BusinessStatus } from './statusMaster'

type SettingsSection = 'categories' | 'priorities' | 'teams' | 'statuses'
type DeletableMaster = { kind: SettingsSection; id: string; name: string }

function BusinessSettingsPage() {
  const [section, setSection] = useState<SettingsSection>('categories')
  const [categories, setCategories] = useState<BusinessCategory[]>(() => loadBusinessCategories())
  const [teams, setTeams] = useState<BusinessTeam[]>(() => loadBusinessTeams())
  const [priorities, setPriorities] = useState<BusinessPriority[]>(() => loadBusinessPriorities())
  const [statuses, setStatuses] = useState<BusinessStatus[]>(() => loadBusinessStatuses())
  const [newValue, setNewValue] = useState('')
  const [message, setMessage] = useState('')
  const [itemToDelete, setItemToDelete] = useState<DeletableMaster | null>(null)
  const [blockedDefaultPriority, setBlockedDefaultPriority] = useState<BusinessPriority | null>(null)
  const [blockedDefaultStatus, setBlockedDefaultStatus] = useState<BusinessStatus | null>(null)

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
      setMessage(`Enter a ${section === 'categories' ? 'category' : section === 'priorities' ? 'priority' : 'team'} name.`)
      return
    }

    if (section === 'categories') {
      if (categories.some((item) => item.name.toLowerCase() === name.toLowerCase())) return setMessage('That category already exists.')
      const next = [...categories, { id: `custom-${Date.now()}`, name, enabled: true, deletable: true }]
      setCategories(next); saveBusinessCategories(next); setMessage('Category added and made available for case review.')
    } else if (section === 'priorities') {
      if (priorities.some((item) => item.name.toLowerCase() === name.toLowerCase())) return setMessage('That priority already exists.')
      const next = [...priorities, { id: `custom-${Date.now()}`, name, color: '#6b5bd2', enabled: true, deletable: true, isDefault: false }]
      setPriorities(next); saveBusinessPriorities(next); setMessage('Priority added and made available for case review.')
    } else if (section === 'statuses') {
      if (statuses.some((item) => item.name.toLowerCase() === name.toLowerCase())) return setMessage('That status already exists.')
      const next = [...statuses, { id: `custom-${Date.now()}`, name, color: '#5b67d6', enabled: true, deletable: true, isDefault: false }]
      setStatuses(next); saveBusinessStatuses(next); setMessage('Status added and made available for case review.')
    } else {
      if (teams.some((item) => item.name.toLowerCase() === name.toLowerCase())) return setMessage('That team already exists.')
      const next = [...teams, { id: `custom-${Date.now()}`, name, enabled: true, deletable: true }]
      setTeams(next); saveBusinessTeams(next); setMessage('Team added and made available for case assignment.')
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

  const togglePriority = (id: string) => {
    const target = priorities.find((item) => item.id === id)
    if (target?.isDefault && target.enabled) {
      setBlockedDefaultPriority(target)
      return
    }
    const next = priorities.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item)
    setPriorities(next); saveBusinessPriorities(next); setMessage('Priority availability updated.')
  }

  const setDefaultPriority = (id: string) => {
    const next = priorities.map((item) => ({ ...item, isDefault: item.id === id, enabled: item.id === id ? true : item.enabled }))
    setPriorities(next); saveBusinessPriorities(next); setMessage('Default priority updated.')
  }

  const toggleStatus = (id: string) => {
    const target = statuses.find((item) => item.id === id)
    if (target?.isDefault && target.enabled) {
      setBlockedDefaultStatus(target)
      return
    }
    const next = statuses.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item)
    setStatuses(next); saveBusinessStatuses(next); setMessage('Status availability updated.')
  }

  const setDefaultStatus = (id: string) => {
    const next = statuses.map((item) => ({ ...item, isDefault: item.id === id, enabled: item.id === id ? true : item.enabled }))
    setStatuses(next); saveBusinessStatuses(next); setMessage('Default status updated.')
  }

  const confirmDelete = () => {
    if (!itemToDelete) return
    if (itemToDelete.kind === 'categories') {
      const next = categories.filter((item) => item.id !== itemToDelete.id)
      setCategories(next)
      saveBusinessCategories(next)
      setMessage('Category deleted from this browser demo.')
    } else if (itemToDelete.kind === 'priorities') {
      const next = priorities.filter((item) => item.id !== itemToDelete.id)
      setPriorities(next)
      saveBusinessPriorities(next)
      setMessage('Priority deleted from this browser demo.')
    } else if (itemToDelete.kind === 'statuses') {
      const next = statuses.filter((item) => item.id !== itemToDelete.id)
      setStatuses(next); saveBusinessStatuses(next); setMessage('Status deleted from this browser demo.')
    } else {
      const next = teams.filter((item) => item.id !== itemToDelete.id)
      setTeams(next)
      saveBusinessTeams(next)
      setMessage('Team deleted from this browser demo.')
    }
    setItemToDelete(null)
  }

  const isCategories = section === 'categories'
  const isPriorities = section === 'priorities'
  const isStatuses = section === 'statuses'
  const values = isCategories ? categories : isPriorities ? priorities : isStatuses ? statuses : teams
  const activeCount = values.filter((item) => item.enabled).length
  const singular = isCategories ? 'category' : isPriorities ? 'priority' : isStatuses ? 'status' : 'team'

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
            <button className={isPriorities ? 'active' : ''} type="button" onClick={() => switchSection('priorities')}>Priorities</button>
            <button className={section === 'teams' ? 'active' : ''} type="button" onClick={() => switchSection('teams')}>Teams</button>
            <button type="button" disabled>Members <span>Later</span></button>
            <button className={isStatuses ? 'active' : ''} type="button" onClick={() => switchSection('statuses')}>Statuses</button>
          </nav>

          <section className="master-panel">
            <div className="master-panel-heading"><div><p>{isCategories ? 'Category master' : isPriorities ? 'Priority master' : isStatuses ? 'Status master' : 'Team master'}</p><h2>{isCategories ? 'Categories' : isPriorities ? 'Priorities' : isStatuses ? 'Statuses' : 'Teams'}</h2></div><span>{activeCount} active</span></div>
            <p className="master-description">{isCategories ? 'Categories are selected by support specialists. Teltruva does not assign them automatically.' : isPriorities ? 'Priorities are selected by support specialists. Choose one enabled value as the default.' : isStatuses ? 'Statuses describe the current stage of each case. Choose one enabled value as the default.' : 'Teams are selected by support specialists. Teltruva does not assign cases automatically.'}</p>

            <div className="add-master-value">
              <label htmlFor="new-master-value">New {singular}</label>
              <div><input id="new-master-value" value={newValue} onChange={(event) => setNewValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') addValue() }} placeholder={`Enter ${singular} name`} /><button type="button" onClick={addValue}>Add {singular}</button></div>
              {message && <p aria-live="polite">{message}</p>}
            </div>

            <div className="master-list" role="list">
              {values.map((item) => {
                const priority = isPriorities ? item as BusinessPriority : null
                const status = isStatuses ? item as BusinessStatus : null
                const workflowValue = priority ?? status
                return (
                  <article className={item.enabled ? '' : 'disabled'} key={item.id} role="listitem">
                    <div className="master-item-copy">
                      <div className="master-name-row">
                        {workflowValue && <span className="priority-color-dot" style={{ background: workflowValue.color }} />}
                        <strong>{item.name}</strong>
                        {workflowValue?.isDefault && <span className="default-priority-badge">Default</span>}
                      </div>
                      <span>{item.enabled ? `Available for case ${isCategories ? 'review' : isPriorities ? 'prioritization' : isStatuses ? 'status updates' : 'assignment'}` : `Disabled for new ${isCategories ? 'selections' : isPriorities ? 'selections' : 'assignments'}`}</span>
                    </div>
                    <div className="master-actions">
                      {priority && !priority.isDefault && priority.enabled && <button type="button" onClick={() => setDefaultPriority(priority.id)}>Make default</button>}
                      {status && !status.isDefault && status.enabled && <button type="button" onClick={() => setDefaultStatus(status.id)}>Make default</button>}
                      <button type="button" onClick={() => isCategories ? toggleCategory(item.id) : isPriorities ? togglePriority(item.id) : isStatuses ? toggleStatus(item.id) : toggleTeam(item.id)}>{item.enabled ? 'Disable' : 'Enable'}</button>
                      {item.deletable && !workflowValue?.isDefault && <button className="delete-master-button" type="button" onClick={() => setItemToDelete({ kind: section, id: item.id, name: item.name })}>Delete</button>}
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="settings-note"><strong>Demo storage</strong><p>Changes are stored only in this browser. Company accounts, administrator permissions, and permanent shared storage will be added later.</p></div>
          </section>
        </div>
      </main>

      {itemToDelete && <div className="delete-dialog-backdrop" role="presentation" onMouseDown={() => setItemToDelete(null)}><section className="delete-dialog" role="alertdialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><div className="delete-dialog-icon">!</div><h2>Delete “{itemToDelete.name}”?</h2><p>This demo {itemToDelete.kind === 'categories' ? 'category' : itemToDelete.kind === 'priorities' ? 'priority' : itemToDelete.kind === 'statuses' ? 'status' : 'team'} has not been used in any cases. This action cannot be undone.</p><div className="delete-dialog-actions"><button type="button" onClick={() => setItemToDelete(null)}>Cancel</button><button className="confirm-delete-button" type="button" onClick={confirmDelete}>Delete {itemToDelete.kind === 'categories' ? 'category' : itemToDelete.kind === 'priorities' ? 'priority' : itemToDelete.kind === 'statuses' ? 'status' : 'team'}</button></div></section></div>}

      {blockedDefaultPriority && (
        <div className="delete-dialog-backdrop" role="presentation" onMouseDown={() => setBlockedDefaultPriority(null)}>
          <section className="delete-dialog default-priority-dialog" role="alertdialog" aria-modal="true" aria-labelledby="default-priority-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="default-priority-dialog-icon" aria-hidden="true">i</div>
            <h2 id="default-priority-dialog-title">“{blockedDefaultPriority.name}” is the default priority</h2>
            <p>Choose another enabled priority as the default before disabling this one.</p>
            <div className="delete-dialog-actions">
              <button className="primary-dialog-button" type="button" onClick={() => setBlockedDefaultPriority(null)}>Got it</button>
            </div>
          </section>
        </div>
      )}
      {blockedDefaultStatus && (
        <div className="delete-dialog-backdrop" role="presentation" onMouseDown={() => setBlockedDefaultStatus(null)}>
          <section className="delete-dialog default-priority-dialog" role="alertdialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <div className="default-priority-dialog-icon" aria-hidden="true">i</div>
            <h2>“{blockedDefaultStatus.name}” is the default status</h2>
            <p>Choose another enabled status as the default before disabling this one.</p>
            <div className="delete-dialog-actions"><button className="primary-dialog-button" type="button" onClick={() => setBlockedDefaultStatus(null)}>Got it</button></div>
          </section>
        </div>
      )}

    </div>
  )
}

export default BusinessSettingsPage
