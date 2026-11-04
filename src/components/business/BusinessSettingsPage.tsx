import { useEffect, useState } from 'react'
import './business.css'
import { loadBusinessCategories, saveBusinessCategories, type BusinessCategory } from './categoryMaster'
import { loadBusinessTeams, saveBusinessTeams, type BusinessTeam } from './teamMaster'
import { loadBusinessPriorities, saveBusinessPriorities, type BusinessPriority } from './priorityMaster'
import { loadBusinessStatuses, saveBusinessStatuses, type BusinessStatus } from './statusMaster'
import { loadBusinessTags, saveBusinessTags, type BusinessTag } from './tagMaster'
import { loadBusinessMembers, saveBusinessMembers, type BusinessMember } from './memberMaster'
import { loadDueDateRules, saveDueDateRules } from './dueDateRules'

type SettingsSection = 'categories' | 'tags' | 'priorities' | 'teams' | 'members' | 'statuses' | 'due-date-rules'
type DeletableMaster = { kind: SettingsSection; id: string; name: string }
type EditableMaster = { kind: SettingsSection; id: string; name: string; teamId?: string }
type DuplicateMaster = { kind: SettingsSection; name: string }

function BusinessSettingsPage() {
  const [section, setSection] = useState<SettingsSection>('categories')
  const [categories, setCategories] = useState<BusinessCategory[]>(() => loadBusinessCategories())
  const [teams, setTeams] = useState<BusinessTeam[]>(() => loadBusinessTeams())
  const [priorities, setPriorities] = useState<BusinessPriority[]>(() => loadBusinessPriorities())
  const [statuses, setStatuses] = useState<BusinessStatus[]>(() => loadBusinessStatuses())
  const [tags, setTags] = useState<BusinessTag[]>(() => loadBusinessTags())
  const [members, setMembers] = useState<BusinessMember[]>(() => loadBusinessMembers())
  const [newMemberTeamId, setNewMemberTeamId] = useState('')
  const [newValue, setNewValue] = useState('')
  const [message, setMessage] = useState('')
  const [itemToDelete, setItemToDelete] = useState<DeletableMaster | null>(null)
  const [itemToEdit, setItemToEdit] = useState<EditableMaster | null>(null)
  const [editName, setEditName] = useState('')
  const [editTeamId, setEditTeamId] = useState('')
  const [duplicateMaster, setDuplicateMaster] = useState<DuplicateMaster | null>(null)
  const [blockedDefaultPriority, setBlockedDefaultPriority] = useState<BusinessPriority | null>(null)
  const [blockedDefaultStatus, setBlockedDefaultStatus] = useState<BusinessStatus | null>(null)
  const initialDueDateRules = loadDueDateRules()
  const [dueSoonThresholds, setDueSoonThresholds] = useState<number[]>(initialDueDateRules.dueSoonThresholds)
  const [newDueSoonDays, setNewDueSoonDays] = useState('')
  const [dueDateRuleMessage, setDueDateRuleMessage] = useState('')

  useEffect(() => {
    document.body.classList.add('business-route')
    document.title = 'Business settings | Teltruva'
    return () => document.body.classList.remove('business-route')
  }, [])

  const switchSection = (nextSection: SettingsSection) => {
    setSection(nextSection)
    setNewValue('')
    setMessage('')
    setNewMemberTeamId('')
    setDueDateRuleMessage('')
  }

  const addValue = () => {
    const name = newValue.trim()
    if (!name) {
      setMessage(`Enter a ${section === 'categories' ? 'category' : section === 'tags' ? 'tag' : section === 'priorities' ? 'priority' : section === 'statuses' ? 'status' : section === 'members' ? 'member' : 'team'} name.`)
      return
    }

    if (section === 'categories') {
      if (categories.some((item) => item.name.toLowerCase() === name.toLowerCase())) { setDuplicateMaster({ kind: 'categories', name }); setMessage(''); return }
      const next = [...categories, { id: `custom-${Date.now()}`, name, enabled: true, deletable: true }]
      setCategories(next); saveBusinessCategories(next); setMessage('Category added and made available for case review.')
    } else if (section === 'tags') {
      if (tags.some((item) => item.name.toLowerCase() === name.toLowerCase())) { setDuplicateMaster({ kind: 'tags', name }); setMessage(''); return }
      const normalizedName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
      if (!normalizedName) return setMessage('Use letters, numbers, spaces, hyphens, or underscores.')
      const next = [...tags, { id: `custom-${Date.now()}`, name: normalizedName, enabled: true, deletable: true }]
      setTags(next); saveBusinessTags(next); setMessage('Tag added and made available for case review.')
    } else if (section === 'priorities') {
      if (priorities.some((item) => item.name.toLowerCase() === name.toLowerCase())) { setDuplicateMaster({ kind: 'priorities', name }); setMessage(''); return }
      const next = [...priorities, { id: `custom-${Date.now()}`, name, color: '#6b5bd2', enabled: true, deletable: true, isDefault: false }]
      setPriorities(next); saveBusinessPriorities(next); setMessage('Priority added and made available for case review.')
    } else if (section === 'members') {
      if (!newMemberTeamId) return setMessage('Select a team for this member.')
      if (members.some((item) => item.name.trim().toLowerCase() === name.toLowerCase())) {
        setDuplicateMaster({ kind: 'members', name })
        setMessage('')
        return
      }
      const next = [...members, { id: `custom-${Date.now()}`, name, teamId: newMemberTeamId, enabled: true, deletable: true }]
      setMembers(next); saveBusinessMembers(next); setMessage('Member added and made available for case assignment.')
    } else if (section === 'statuses') {
      if (statuses.some((item) => item.name.toLowerCase() === name.toLowerCase())) { setDuplicateMaster({ kind: 'statuses', name }); setMessage(''); return }
      const next = [...statuses, { id: `custom-${Date.now()}`, name, color: '#5b67d6', enabled: true, deletable: true, isDefault: false }]
      setStatuses(next); saveBusinessStatuses(next); setMessage('Status added and made available for case review.')
    } else {
      if (teams.some((item) => item.name.toLowerCase() === name.toLowerCase())) { setDuplicateMaster({ kind: 'teams', name }); setMessage(''); return }
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

  const toggleTag = (id: string) => {
    const next = tags.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item)
    setTags(next); saveBusinessTags(next); setMessage('Tag availability updated.')
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

  const toggleMember = (id: string) => {
    const next = members.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item)
    setMembers(next); saveBusinessMembers(next); setMessage('Member availability updated.')
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

  const startEdit = (item: EditableMaster) => {
    setItemToEdit(item)
    setEditName(item.name)
    setEditTeamId(item.teamId ?? '')
  }

  const saveEdit = () => {
    if (!itemToEdit) return
    const name = editName.trim()
    if (!name) {
      setMessage('Enter a name before saving.')
      return
    }

    if (itemToEdit.kind === 'categories') {
      if (categories.some((item) => item.id !== itemToEdit.id && item.name.toLowerCase() === name.toLowerCase())) { setDuplicateMaster({ kind: 'categories', name }); return }
      const next = categories.map((item) => item.id === itemToEdit.id ? { ...item, name } : item)
      setCategories(next); saveBusinessCategories(next)
    } else if (itemToEdit.kind === 'tags') {
      const normalizedName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
      if (!normalizedName) return setMessage('Use letters, numbers, spaces, hyphens, or underscores.')
      if (tags.some((item) => item.id !== itemToEdit.id && item.name.toLowerCase() === normalizedName)) { setDuplicateMaster({ kind: 'tags', name: normalizedName }); return }
      const next = tags.map((item) => item.id === itemToEdit.id ? { ...item, name: normalizedName } : item)
      setTags(next); saveBusinessTags(next)
    } else if (itemToEdit.kind === 'priorities') {
      if (priorities.some((item) => item.id !== itemToEdit.id && item.name.toLowerCase() === name.toLowerCase())) { setDuplicateMaster({ kind: 'priorities', name }); return }
      const next = priorities.map((item) => item.id === itemToEdit.id ? { ...item, name } : item)
      setPriorities(next); saveBusinessPriorities(next)
    } else if (itemToEdit.kind === 'teams') {
      if (teams.some((item) => item.id !== itemToEdit.id && item.name.toLowerCase() === name.toLowerCase())) { setDuplicateMaster({ kind: 'teams', name }); return }
      const next = teams.map((item) => item.id === itemToEdit.id ? { ...item, name } : item)
      setTeams(next); saveBusinessTeams(next)
    } else if (itemToEdit.kind === 'members') {
      if (!editTeamId) return setMessage('Select a team before saving.')
      const normalizedName = name.toLowerCase()
      const next = members
        .filter((item) => item.id === itemToEdit.id || item.name.trim().toLowerCase() !== normalizedName)
        .map((item) => item.id === itemToEdit.id ? { ...item, name, teamId: editTeamId } : item)
      setMembers(next)
      saveBusinessMembers(next)
    } else {
      if (statuses.some((item) => item.id !== itemToEdit.id && item.name.toLowerCase() === name.toLowerCase())) { setDuplicateMaster({ kind: 'statuses', name }); return }
      const next = statuses.map((item) => item.id === itemToEdit.id ? { ...item, name } : item)
      setStatuses(next); saveBusinessStatuses(next)
    }

    setItemToEdit(null)
    setMessage(itemToEdit.kind === 'members' ? 'Member updated. Any duplicate member name was replaced.' : 'Master data updated.')
  }

  const confirmDelete = () => {
    if (!itemToDelete) return
    if (itemToDelete.kind === 'categories') {
      const next = categories.filter((item) => item.id !== itemToDelete.id)
      setCategories(next)
      saveBusinessCategories(next)
      setMessage('Category deleted from this browser demo.')
    } else if (itemToDelete.kind === 'tags') {
      const next = tags.filter((item) => item.id !== itemToDelete.id)
      setTags(next); saveBusinessTags(next); setMessage('Tag deleted from this browser demo.')
    } else if (itemToDelete.kind === 'priorities') {
      const next = priorities.filter((item) => item.id !== itemToDelete.id)
      setPriorities(next)
      saveBusinessPriorities(next)
      setMessage('Priority deleted from this browser demo.')
    } else if (itemToDelete.kind === 'members') {
      const next = members.filter((item) => item.id !== itemToDelete.id)
      setMembers(next); saveBusinessMembers(next); setMessage('Member deleted from this browser demo.')
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

  const addDueDateThreshold = () => {
    const days = Number(newDueSoonDays)
    if (!Number.isInteger(days) || days < 1 || days > 365) {
      setDueDateRuleMessage('Enter a whole number from 1 to 365.')
      return
    }
    if (dueSoonThresholds.includes(days)) {
      setDueDateRuleMessage(`A ${days}-day threshold already exists.`)
      return
    }
    const next = [...dueSoonThresholds, days].sort((a, b) => a - b)
    setDueSoonThresholds(next)
    saveDueDateRules({ dueSoonThresholds: next })
    setNewDueSoonDays('')
    setDueDateRuleMessage(`Due within ${days} days was added.`)
  }

  const deleteDueDateThreshold = (days: number) => {
    if (dueSoonThresholds.length === 1) {
      setDueDateRuleMessage('Keep at least one due-soon threshold.')
      return
    }
    const next = dueSoonThresholds.filter((value) => value !== days)
    setDueSoonThresholds(next)
    saveDueDateRules({ dueSoonThresholds: next })
    setDueDateRuleMessage(`The ${days}-day threshold was removed.`)
  }

  const isCategories = section === 'categories'
  const isTags = section === 'tags'
  const isPriorities = section === 'priorities'
  const isMembers = section === 'members'
  const isStatuses = section === 'statuses'
  const isDueDateRules = section === 'due-date-rules'
  const values = isCategories ? categories : isTags ? tags : isPriorities ? priorities : isStatuses ? statuses : isMembers ? members : teams
  const activeCount = values.filter((item) => item.enabled).length
  const singular = isCategories ? 'category' : isTags ? 'tag' : isPriorities ? 'priority' : isStatuses ? 'status' : isMembers ? 'member' : 'team'

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
            <p className="settings-nav-group-label">Master data</p>
            <button className={isCategories ? 'active' : ''} type="button" onClick={() => switchSection('categories')}>Categories</button>
            <button className={isTags ? 'active' : ''} type="button" onClick={() => switchSection('tags')}>Tags</button>
            <button className={isPriorities ? 'active' : ''} type="button" onClick={() => switchSection('priorities')}>Priorities</button>
            <button className={section === 'teams' ? 'active' : ''} type="button" onClick={() => switchSection('teams')}>Teams</button>
            <button className={isMembers ? 'active' : ''} type="button" onClick={() => switchSection('members')}>Members</button>
            <button className={isStatuses ? 'active' : ''} type="button" onClick={() => switchSection('statuses')}>Statuses</button>
            <div className="settings-nav-divider" />
            <p className="settings-nav-group-label">Workflow settings</p>
            <button className={isDueDateRules ? 'active' : ''} type="button" onClick={() => switchSection('due-date-rules')}>Due date rules</button>
          </nav>

          {isDueDateRules ? (
          <section className="master-panel due-date-rules-panel">
            <div className="master-panel-heading">
              <div><p>Workflow setting</p><h2>Due date rules</h2></div>
              <span>{dueSoonThresholds.length} active</span>
            </div>
            <p className="master-description">Create the calendar-day thresholds that appear in case-list filters.</p>

            <div className="due-rule-card">
              <label htmlFor="new-due-soon-days">New due-soon threshold</label>
              <div className="due-rule-input-row">
                <input id="new-due-soon-days" type="number" min="1" max="365" step="1" value={newDueSoonDays} onChange={(event) => { setNewDueSoonDays(event.target.value); setDueDateRuleMessage('') }} placeholder="Enter days" />
                <span>calendar days</span>
                <button type="button" onClick={addDueDateThreshold}>Add threshold</button>
              </div>
              <p>A case can appear in more than one threshold. For example, a case due in 2 days is included in both “Due within 3 days” and “Due within 7 days.”</p>
              {dueDateRuleMessage && <p className="due-rule-message" aria-live="polite">{dueDateRuleMessage}</p>}
            </div>

            <div className="due-threshold-list" role="list">
              {dueSoonThresholds.map((days) => (
                <article key={days} role="listitem">
                  <div><strong>Due within {days} day{days === 1 ? '' : 's'}</strong><span>Includes today through the next {days} calendar day{days === 1 ? '' : 's'}.</span></div>
                  <button type="button" onClick={() => deleteDueDateThreshold(days)}>Delete</button>
                </article>
              ))}
            </div>

            <div className="settings-note"><strong>Automatic date states</strong><p>Overdue, Due today, and No due date are calculated automatically and do not need separate rules.</p></div>
          </section>
          ) : (
          <section className="master-panel">
            <div className="master-panel-heading"><div><p>{isCategories ? 'Category master' : isTags ? 'Tag master' : isPriorities ? 'Priority master' : isStatuses ? 'Status master' : isMembers ? 'Member master' : 'Team master'}</p><h2>{isCategories ? 'Categories' : isTags ? 'Tags' : isPriorities ? 'Priorities' : isStatuses ? 'Statuses' : isMembers ? 'Members' : 'Teams'}</h2></div><span>{activeCount} active</span></div>
            <p className="master-description">{isCategories ? 'Categories are selected by support specialists. Teltruva does not assign them automatically.' : isTags ? 'Tags are selected from the company master. Multiple tags can be attached to one case.' : isPriorities ? 'Priorities are selected by support specialists. Choose one enabled value as the default.' : isStatuses ? 'Statuses describe the current stage of each case. Choose one enabled value as the default.' : isMembers ? 'Members belong to a team. Only members of the selected team are available as assignees.' : 'Teams are selected by support specialists. Teltruva does not assign cases automatically.'}</p>

            <div className="add-master-value">
              <label htmlFor="new-master-value">New {singular}</label>
              <div className={isMembers ? 'member-add-row' : ''}><input id="new-master-value" value={newValue} onChange={(event) => setNewValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') addValue() }} placeholder={`Enter ${singular} name`} />{isMembers && <select value={newMemberTeamId} onChange={(event) => setNewMemberTeamId(event.target.value)}><option value="">Select team</option>{teams.filter((team) => team.enabled).map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}</select>}<button type="button" onClick={addValue}>Add {singular}</button></div>
              {message && <p aria-live="polite">{message}</p>}
            </div>

            <div className="master-list" role="list">
              {values.map((item) => {
                const priority = isPriorities ? item as BusinessPriority : null
                const status = isStatuses ? item as BusinessStatus : null
                const workflowValue = priority ?? status
                const member = isMembers ? item as BusinessMember : null
                const memberTeam = member ? teams.find((team) => team.id === member.teamId) : null
                return (
                  <article className={item.enabled ? '' : 'disabled'} key={item.id} role="listitem">
                    <div className="master-item-copy">
                      <div className="master-name-row">
                        {workflowValue && <span className="priority-color-dot" style={{ background: workflowValue.color }} />}
                        <strong>{item.name}</strong>{memberTeam && <span className="member-team-badge">{memberTeam.name}</span>}
                        {workflowValue?.isDefault && <span className="default-priority-badge">Default</span>}
                      </div>
                      <span>{item.enabled ? `Available for case ${isCategories ? 'review' : isTags ? 'tagging' : isPriorities ? 'prioritization' : isStatuses ? 'status updates' : isMembers ? 'assignment' : 'assignment'}` : `Disabled for new ${isCategories ? 'selections' : isTags ? 'tagging' : isPriorities ? 'selections' : 'assignments'}`}</span>
                    </div>
                    <div className="master-actions master-actions-stacked">
                      <div className="master-primary-actions">
                        {priority && !priority.isDefault && priority.enabled && <button type="button" onClick={() => setDefaultPriority(priority.id)}>Make default</button>}
                        {status && !status.isDefault && status.enabled && <button type="button" onClick={() => setDefaultStatus(status.id)}>Make default</button>}
                        <button type="button" onClick={() => isCategories ? toggleCategory(item.id) : isTags ? toggleTag(item.id) : isPriorities ? togglePriority(item.id) : isStatuses ? toggleStatus(item.id) : isMembers ? toggleMember(item.id) : toggleTeam(item.id)}>{item.enabled ? 'Disable' : 'Enable'}</button>
                        <button className="edit-master-button" type="button" onClick={() => startEdit({ kind: section, id: item.id, name: item.name, teamId: member?.teamId })}>Edit</button>
                      </div>
                      {item.deletable && !workflowValue?.isDefault && <button className="delete-master-button compact-delete-button" type="button" onClick={() => setItemToDelete({ kind: section, id: item.id, name: item.name })}>Delete</button>}
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="settings-note"><strong>Demo storage</strong><p>Changes are stored only in this browser. Company accounts, administrator permissions, and permanent shared storage will be added later.</p></div>
          </section>
          )}
        </div>
      </main>

      {duplicateMaster && (
        <div className="delete-dialog-backdrop" role="presentation" onMouseDown={() => setDuplicateMaster(null)}>
          <section className="delete-dialog default-priority-dialog duplicate-member-dialog" role="alertdialog" aria-modal="true" aria-labelledby="duplicate-master-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="default-priority-dialog-icon" aria-hidden="true">i</div>
            <h2 id="duplicate-master-title">“{duplicateMaster.name}” already exists</h2>
            <p>
              {duplicateMaster.kind === 'members'
                ? 'Use Edit on the existing member to change the member name or assigned team.'
                : `Use Edit on the existing ${duplicateMaster.kind.slice(0, -1)} instead of creating a duplicate.`}
            </p>
            <div className="delete-dialog-actions">
              <button className="primary-dialog-button" type="button" onClick={() => setDuplicateMaster(null)}>Got it</button>
            </div>
          </section>
        </div>
      )}

      {itemToEdit && (
        <div className="delete-dialog-backdrop" role="presentation" onMouseDown={() => setItemToEdit(null)}>
          <section className="delete-dialog edit-master-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-master-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="default-priority-dialog-icon" aria-hidden="true">✎</div>
            <h2 id="edit-master-title">Edit {itemToEdit.kind === 'members' ? 'member' : itemToEdit.kind.slice(0, -1)}</h2>
            <label className="edit-master-field">Name<input value={editName} onChange={(event) => setEditName(event.target.value)} autoFocus /></label>
            {itemToEdit.kind === 'members' && <label className="edit-master-field">Team<select value={editTeamId} onChange={(event) => setEditTeamId(event.target.value)}>{teams.filter((team) => team.enabled || team.id === editTeamId).map((team) => <option key={team.id} value={team.id}>{team.name}{team.enabled ? '' : ' (disabled)'}</option>)}</select></label>}
            <div className="delete-dialog-actions"><button type="button" onClick={() => setItemToEdit(null)}>Cancel</button><button className="primary-dialog-button" type="button" onClick={saveEdit}>Save changes</button></div>
          </section>
        </div>
      )}

      {itemToDelete && <div className="delete-dialog-backdrop" role="presentation" onMouseDown={() => setItemToDelete(null)}><section className="delete-dialog" role="alertdialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><div className="delete-dialog-icon">!</div><h2>Delete “{itemToDelete.name}”?</h2><p>This demo {itemToDelete.kind === 'categories' ? 'category' : itemToDelete.kind === 'tags' ? 'tag' : itemToDelete.kind === 'priorities' ? 'priority' : itemToDelete.kind === 'statuses' ? 'status' : itemToDelete.kind === 'members' ? 'member' : 'team'} has not been used in any cases. This action cannot be undone.</p><div className="delete-dialog-actions"><button type="button" onClick={() => setItemToDelete(null)}>Cancel</button><button className="confirm-delete-button" type="button" onClick={confirmDelete}>Delete {itemToDelete.kind === 'categories' ? 'category' : itemToDelete.kind === 'tags' ? 'tag' : itemToDelete.kind === 'priorities' ? 'priority' : itemToDelete.kind === 'statuses' ? 'status' : itemToDelete.kind === 'members' ? 'member' : 'team'}</button></div></section></div>}

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
