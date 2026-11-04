import { useEffect, useMemo, useState } from 'react'
import './business.css'
import { loadBusinessCategories } from './categoryMaster'
import { loadBusinessTeams } from './teamMaster'
import { loadBusinessPriorities } from './priorityMaster'
import { loadBusinessStatuses } from './statusMaster'
import { loadBusinessTags } from './tagMaster'
import { loadBusinessMembers } from './memberMaster'
import { loadBusinessCaseReview, saveBusinessCaseReview } from './caseReviewStorage'

function BusinessCasePage() {
  const categories = loadBusinessCategories()
  const teams = loadBusinessTeams()
  const priorities = loadBusinessPriorities()
  const statuses = loadBusinessStatuses()
  const tags = loadBusinessTags()
  const members = loadBusinessMembers()
  const savedReview = loadBusinessCaseReview()
  const [selectedCategory, setSelectedCategory] = useState(savedReview.categoryId)
  const [selectedTags, setSelectedTags] = useState<string[]>(savedReview.tagIds)
  const defaultPriority = priorities.find((priority) => priority.isDefault && priority.enabled)?.id ?? priorities.find((priority) => priority.enabled)?.id ?? ''
  const [selectedPriority, setSelectedPriority] = useState(savedReview.priorityId || defaultPriority)
  const [selectedTeam, setSelectedTeam] = useState(savedReview.assignedTeamId)
  const [selectedAssignee, setSelectedAssignee] = useState(savedReview.assigneeId)
  const defaultStatus = statuses.find((status) => status.isDefault && status.enabled)?.id ?? statuses.find((status) => status.enabled)?.id ?? ''
  const [selectedStatus, setSelectedStatus] = useState(savedReview.statusId || defaultStatus)
  const [dueDate, setDueDate] = useState(savedReview.dueDate)
  const [saveMessage, setSaveMessage] = useState('')

  const categoryOptions = useMemo(
    () => categories.filter((category) => category.enabled || category.id === selectedCategory),
    [categories, selectedCategory]
  )
  const tagOptions = useMemo(
    () => tags.filter((tag) => tag.enabled && !selectedTags.includes(tag.id)),
    [tags, selectedTags]
  )
  const teamOptions = useMemo(
    () => teams.filter((team) => team.enabled || team.id === selectedTeam),
    [teams, selectedTeam]
  )
  const assigneeOptions = useMemo(
    () => members.filter((member) => member.teamId === selectedTeam && (member.enabled || member.id === selectedAssignee)),
    [members, selectedTeam, selectedAssignee]
  )
  const priorityOptions = useMemo(
    () => priorities.filter((priority) => priority.enabled || priority.id === selectedPriority),
    [priorities, selectedPriority]
  )
  const statusOptions = useMemo(
    () => statuses.filter((status) => status.enabled || status.id === selectedStatus),
    [statuses, selectedStatus]
  )

  const selectedCategoryRecord = categories.find((category) => category.id === selectedCategory)
  const selectedTeamRecord = teams.find((team) => team.id === selectedTeam)
  const selectedAssigneeRecord = members.find((member) => member.id === selectedAssignee)
  const selectedPriorityRecord = priorities.find((priority) => priority.id === selectedPriority)
  const selectedStatusRecord = statuses.find((status) => status.id === selectedStatus)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const selectedDueDate = dueDate ? new Date(`${dueDate}T00:00:00`) : null
  const dueDateIsPast = Boolean(selectedDueDate && selectedDueDate < today)

  useEffect(() => {
    document.body.classList.add('business-route')
    document.title = 'Case TLT-2026-001 | Teltruva'
    return () => document.body.classList.remove('business-route')
  }, [])

  const saveReview = () => {
    if (!selectedCategory) {
      setSaveMessage('Select a category before saving the review.')
      return
    }
    if (!selectedTeam) {
      setSaveMessage('Select an assigned team before saving the review.')
      return
    }

    if (!selectedAssignee) {
      setSaveMessage('Select an assignee before saving the review.')
      return
    }

    saveBusinessCaseReview({
      categoryId: selectedCategory,
      tagIds: selectedTags,
      priorityId: selectedPriority,
      assignedTeamId: selectedTeam,
      assigneeId: selectedAssignee,
      statusId: selectedStatus,
      dueDate,
    })
    setSaveMessage('Category, tags, priority, assigned team, assignee, status, and due date saved in this browser demo.')
  }

  return (
    <div className="business-page">
      <header className="workspace-header">
        <button className="workspace-brand" type="button" onClick={() => window.location.href = '/business'}>
          <span className="workspace-brand-mark">T</span>
          <span><strong>Teltruva</strong><small>for Business</small></span>
        </button>
        <p className="workspace-purpose">Case review</p>
        <nav className="workspace-nav">
          <button type="button" onClick={() => window.location.href = '/business'}>← Back to cases</button>
          <button type="button" onClick={() => window.location.href = '/'}>Individual service</button>
        </nav>
      </header>

      <main className="workspace-main case-page-main">
        <div className="case-page-heading">
          <div><p className="workspace-kicker">Priority case</p><h1>Case TLT-2026-001</h1></div>
          <span className="status-pill" style={{ background: `${selectedStatusRecord?.color ?? '#7147de'}22`, color: selectedStatusRecord?.color ?? '#7147de' }}>{selectedStatusRecord?.name ?? 'Status'}</span>
        </div>

        <article className="case-detail-card">
          <section className="case-detail-content">
            <div className="case-title"><span>AI</span><div><small>Hotel billing issue</small><h2>Possible duplicate charge after checkout</h2></div></div>
            <div className="summary-box"><h3>Issue summary</h3><p>The customer reports a charge that may duplicate an amount already included in the hotel receipt and asks the billing team to review it.</p></div>
            <div className="information-grid"><div><span>Customer language</span><strong>Japanese</strong></div><div><span>Service language</span><strong>English</strong></div><div><span>Supporting evidence</span><strong>Hotel receipt</strong></div><div><span>Requested outcome</span><strong>Billing review</strong></div></div>
            <div className="missing-box"><b>!</b><div><strong>Missing information</strong><p>Confirm whether the pending card charge has posted before the case is sent for action.</p></div></div>
          </section>

          <aside className="decision-panel">
            <div className="decision-heading">
              <div><h2>Company review</h2><button className="manage-master-link" type="button" onClick={() => window.location.href = '/business/settings'}>Manage master data</button></div>
              <span>Company-managed fields</span>
            </div>

            <label>Category
              <select value={selectedCategory} onChange={(event) => { setSelectedCategory(event.target.value); setSaveMessage('') }}>
                <option value="" disabled>Select category</option>
                {categoryOptions.map((category) => <option key={category.id} value={category.id}>{category.name}{category.enabled ? '' : ' (disabled)'}</option>)}
              </select>
            </label>
            {selectedCategoryRecord && !selectedCategoryRecord.enabled && <p className="disabled-category-notice">This category is disabled for new selections, but remains on this previously saved case.</p>}

            <div className="case-tags-field">
              <span className="case-field-label">Tags</span>
              <div className="selected-tag-list" aria-label="Selected tags">
                {selectedTags.length === 0 && <span className="empty-tag-message">No tags selected</span>}
                {selectedTags.map((tagId) => {
                  const tag = tags.find((item) => item.id === tagId)
                  return (
                    <span className={tag?.enabled === false ? 'case-tag disabled' : 'case-tag'} key={tagId}>
                      {tag?.name ?? 'Deleted tag'}{tag?.enabled === false ? ' (disabled)' : ''}
                      <button type="button" aria-label={`Remove ${tag?.name ?? 'tag'}`} onClick={() => { setSelectedTags((current) => current.filter((id) => id !== tagId)); setSaveMessage('') }}>×</button>
                    </span>
                  )
                })}
              </div>
              <select value="" onChange={(event) => { if (event.target.value) setSelectedTags((current) => [...current, event.target.value]); setSaveMessage('') }}>
                <option value="">Select another tag</option>
                {tagOptions.map((tag) => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
              </select>
            </div>

            <label>Priority
              <select value={selectedPriority} onChange={(event) => { setSelectedPriority(event.target.value); setSaveMessage('') }}>
                <option value="" disabled>Select priority</option>
                {priorityOptions.map((priority) => <option key={priority.id} value={priority.id}>{priority.name}{priority.enabled ? '' : ' (disabled)'}</option>)}
              </select>
            </label>
            {selectedPriorityRecord && !selectedPriorityRecord.enabled && <p className="disabled-category-notice">This priority is disabled for new selections, but remains on this previously saved case.</p>}

            <label>Assigned team
              <select value={selectedTeam} onChange={(event) => { setSelectedTeam(event.target.value); if (selectedAssigneeRecord?.teamId !== event.target.value) setSelectedAssignee(''); setSaveMessage('') }}>
                <option value="" disabled>Select team</option>
                {teamOptions.map((team) => <option key={team.id} value={team.id}>{team.name}{team.enabled ? '' : ' (disabled)'}</option>)}
              </select>
            </label>
            {selectedTeamRecord && !selectedTeamRecord.enabled && <p className="disabled-category-notice">This team is disabled for new assignments, but remains on this previously saved case.</p>}

            <label>Assignee
              <select value={selectedAssignee} disabled={!selectedTeam} onChange={(event) => { setSelectedAssignee(event.target.value); setSaveMessage('') }}>
                <option value="" disabled>{selectedTeam ? 'Select assignee' : 'Select a team first'}</option>
                {assigneeOptions.map((member) => <option key={member.id} value={member.id}>{member.name}{member.enabled ? '' : ' (disabled)'}</option>)}
              </select>
            </label>
            {selectedAssigneeRecord && !selectedAssigneeRecord.enabled && <p className="disabled-category-notice">This member is disabled for new assignments, but remains on this previously saved case.</p>}

            <label>Status
              <select value={selectedStatus} onChange={(event) => { setSelectedStatus(event.target.value); setSaveMessage('') }}>
                <option value="" disabled>Select status</option>
                {statusOptions.map((status) => <option key={status.id} value={status.id}>{status.name}{status.enabled ? '' : ' (disabled)'}</option>)}
              </select>
            </label>
            {selectedStatusRecord && !selectedStatusRecord.enabled && <p className="disabled-category-notice">This status is disabled for new selections, but remains on this previously saved case.</p>}

            <label>Due date
              <input
                type="date"
                value={dueDate}
                onChange={(event) => { setDueDate(event.target.value); setSaveMessage('') }}
                style={{ minHeight: '52px', padding: '0 14px', border: '1px solid #c6d4e4', borderRadius: '11px', background: '#fff', color: '#203956', font: 'inherit', fontSize: '19px' }}
              />
            </label>
            {dueDateIsPast && <p className="disabled-category-notice">This due date is in the past. You can still save it for an existing or overdue case.</p>}

            <div className="human-note"><b>✓</b><p><strong>Human review required.</strong> Teltruva does not choose the company category, priority, assigned team, or assignee.</p></div>
            <button className="primary-button full" type="button" onClick={saveReview}>Save review</button>
            {saveMessage && <p className="case-save-message" aria-live="polite">{saveMessage}</p>}
          </aside>
        </article>
      </main>
    </div>
  )
}

export default BusinessCasePage
