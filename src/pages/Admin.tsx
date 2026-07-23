import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, useUser, SignInButton } from '@clerk/clerk-react'
import { useQuery, useMutation } from 'convex/react'
import { Star, RotateCcw } from 'lucide-react'
import { api } from '../../convex/_generated/api'
import { TOPICS } from '../data/studyData'
import { FlashCardVisual, QuizQuestionCard, QuizChoices, QuizExplanation } from '../components/StudyPreview'
import type { Id } from '../../convex/_generated/dataModel'

type Section = 'overview' | 'users' | 'content' | 'demos' | 'tickets' | 'partners' | 'barber' | 'waitlist'

const SECTIONS: [Section, string][] = [
  ['overview', 'Overview'],
  ['users', 'Users'],
  ['content', 'Study Content'],
  ['demos', "DEMO's"],
  ['tickets', 'Dev Tickets'],
  ['partners', 'Partners'],
  ['barber', 'Barber Pages'],
  ['waitlist', 'Waitlist'],
]

const CONTENT_TOPICS = TOPICS.filter(t => t !== 'All')

const card: React.CSSProperties = {
  background: 'var(--color-white)',
  border: 'var(--border-whisper)',
  borderRadius: '12px',
  boxShadow: 'var(--shadow-card)',
  overflow: 'hidden',
}
const cardHeader: React.CSSProperties = { padding: '20px 24px', borderBottom: 'var(--border-whisper)' }
const rowBase: React.CSSProperties = { padding: '12px 24px', borderTop: 'var(--border-whisper)', fontSize: '13px' }
const contentInputStyle: React.CSSProperties = { fontSize: '13px', padding: '9px 12px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', outline: 'none' }
const CONTENT_LIST_LIMIT = 60

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function Pill({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'good' | 'warn' | 'bad' }) {
  const colors: Record<string, [string, string]> = {
    neutral: ['rgba(0,0,0,0.06)', 'rgba(0,0,0,0.6)'],
    good: ['rgba(26,174,57,0.1)', '#1aae39'],
    warn: ['rgba(221,91,0,0.1)', '#dd5b00'],
    bad: ['rgba(196,73,42,0.1)', '#c4492a'],
  }
  const [bg, fg] = colors[tone]
  return (
    <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, background: bg, color: fg, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function OverviewTab() {
  const stats = useQuery(api.admin.getStats)
  if (stats === undefined) return <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>Loading…</div>
  const tiles: [string, number | string][] = [
    ['Total users', stats.totalUsers],
    ['Lifetime pass holders', stats.lifetimePassHolders],
    ['Quiz sessions completed', stats.quizSessionsCount],
    ['Waitlist signups', stats.waitlistCount],
    ['Partner profiles', `${stats.partnerProfilesVisible} visible / ${stats.partnerProfilesCount} total`],
    ['Barber pages', `${stats.barberPagesLive} live / ${stats.barberPagesCount} total`],
    ['Open dev tickets', stats.openTicketsCount],
    ['Schools in pipeline', stats.schoolsInPipeline],
    ['Demos scheduled', stats.demosScheduled],
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
      {tiles.map(([label, value]) => (
        <div key={label} style={{ ...card, padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', marginBottom: '6px' }}>{label}</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-black-95)', letterSpacing: '-0.5px' }}>{value}</div>
        </div>
      ))}
    </div>
  )
}

function UsersTab() {
  const [search, setSearch] = useState('')
  const users = useQuery(api.admin.listUsers, { search: search || undefined })
  const grant = useMutation(api.admin.grantAccess)
  const revoke = useMutation(api.admin.revokeAccess)
  const [busy, setBusy] = useState<string | null>(null)

  async function toggleAccess(clerkId: string, hasAccess: boolean) {
    setBusy(clerkId)
    try {
      if (hasAccess) await revoke({ clerkId })
      else await grant({ clerkId })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div style={card}>
      <div style={cardHeader}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          style={{ width: '100%', fontSize: '13px', padding: '8px 12px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', outline: 'none' }}
        />
      </div>
      {users === undefined ? (
        <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>Loading…</div>
      ) : users.length === 0 ? (
        <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>No users found.</div>
      ) : (
        users.map(u => {
          const hasAccess = !!u.lifetimePassPurchasedAt
          return (
            <div key={u._id} style={{ ...rowBase, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--color-black-95)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {u.name ?? u.email}
                  {u.isAdmin && <Pill label="admin" tone="warn" />}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', marginTop: '2px' }}>
                  {u.email} · joined {fmtDate(u.createdAt)}{u.school ? ` · ${u.school}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <Pill label={hasAccess ? 'lifetime pass' : 'no pass'} tone={hasAccess ? 'good' : 'neutral'} />
                <button
                  onClick={() => toggleAccess(u.clerkId, hasAccess)}
                  disabled={busy === u.clerkId}
                  style={{
                    fontSize: '12px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px',
                    border: '1px solid rgba(0,0,0,0.12)', background: 'var(--color-white)',
                    color: hasAccess ? '#c4492a' : 'var(--color-blue)', cursor: busy === u.clerkId ? 'wait' : 'pointer',
                  }}
                >
                  {busy === u.clerkId ? 'Working…' : hasAccess ? 'Revoke' : 'Grant'}
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

const DEMO_STATUSES = ['not_contacted', 'contacted', 'demo_scheduled', 'demo_completed', 'closed_won', 'closed_lost'] as const
const DEMO_STATUS_LABEL: Record<typeof DEMO_STATUSES[number], string> = {
  not_contacted: 'Not contacted',
  contacted: 'Contacted',
  demo_scheduled: 'Demo scheduled',
  demo_completed: 'Demo completed',
  closed_won: 'Closed won',
  closed_lost: 'Closed lost',
}
const DEMO_STATUS_TONE: Record<typeof DEMO_STATUSES[number], 'neutral' | 'good' | 'warn' | 'bad'> = {
  not_contacted: 'neutral',
  contacted: 'warn',
  demo_scheduled: 'good',
  demo_completed: 'good',
  closed_won: 'good',
  closed_lost: 'bad',
}

function dateInputValue(ts?: number) {
  return ts ? new Date(ts).toISOString().slice(0, 10) : ''
}
function dateFromInput(val: string): number | undefined {
  return val ? new Date(`${val}T12:00:00`).getTime() : undefined
}

function DemosTab() {
  const [statusFilter, setStatusFilter] = useState<typeof DEMO_STATUSES[number] | 'all'>('all')
  const schools = useQuery(api.schoolDemos.listSchools, statusFilter === 'all' ? {} : { status: statusFilter })
  const addSchool = useMutation(api.schoolDemos.addSchool)
  const updateSchool = useMutation(api.schoolDemos.updateSchool)
  const deleteSchool = useMutation(api.schoolDemos.deleteSchool)

  const [showForm, setShowForm] = useState(false)
  const [schoolName, setSchoolName] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [status, setStatus] = useState<typeof DEMO_STATUSES[number]>('not_contacted')
  const [followUpBy, setFollowUpBy] = useState('')
  const [demoDate, setDemoDate] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (!schoolName.trim() || submitting) return
    setSubmitting(true)
    try {
      await addSchool({
        schoolName,
        contactName: contactName || undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
        status,
        followUpBy: dateFromInput(followUpBy),
        demoDate: dateFromInput(demoDate),
        notes: notes || undefined,
      })
      setSchoolName('')
      setContactName('')
      setContactEmail('')
      setContactPhone('')
      setStatus('not_contacted')
      setFollowUpBy('')
      setDemoDate('')
      setNotes('')
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = { fontSize: '13px', padding: '9px 12px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', outline: 'none' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={card}>
        <div style={{ ...cardHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-black-95)' }}>School demo pipeline</h2>
          <button onClick={() => setShowForm(s => !s)} className="fj-btn-primary" style={{ fontSize: '13px' }}>
            {showForm ? 'Cancel' : '+ Add school'}
          </button>
        </div>
        {showForm && (
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="School name" style={inputStyle} />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Contact name" style={{ ...inputStyle, flex: '1 1 160px' }} />
              <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Contact email" style={{ ...inputStyle, flex: '1 1 160px' }} />
              <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="Contact phone" style={{ ...inputStyle, flex: '1 1 140px' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={status} onChange={e => setStatus(e.target.value as typeof status)} style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)' }}>
                {DEMO_STATUSES.map(s => <option key={s} value={s}>{DEMO_STATUS_LABEL[s]}</option>)}
              </select>
              <label style={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                Follow up by
                <input type="date" value={followUpBy} onChange={e => setFollowUpBy(e.target.value)} style={{ fontSize: '12px', padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)' }} />
              </label>
              <label style={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                Demo date
                <input type="date" value={demoDate} onChange={e => setDemoDate(e.target.value)} style={{ fontSize: '12px', padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)' }} />
              </label>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notes — how they were found, what was discussed, etc."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
            <button
              onClick={handleSubmit}
              disabled={!schoolName.trim() || submitting}
              className="fj-btn-primary"
              style={{ fontSize: '13px', alignSelf: 'flex-end', opacity: !schoolName.trim() || submitting ? 0.6 : 1 }}
            >
              {submitting ? 'Adding…' : 'Add school'}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {(['all', ...DEMO_STATUSES] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '5px 12px', fontSize: '12px', fontWeight: 500, borderRadius: '9999px',
              border: '1px solid rgba(0,0,0,0.12)',
              background: statusFilter === s ? 'var(--color-blue)' : 'var(--color-white)',
              color: statusFilter === s ? '#fff' : 'rgba(0,0,0,0.6)', cursor: 'pointer',
            }}
          >
            {s === 'all' ? 'all' : DEMO_STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div style={card}>
        {schools === undefined ? (
          <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>Loading…</div>
        ) : schools.length === 0 ? (
          <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>No schools yet — add one above.</div>
        ) : (
          schools.map((s, i) => (
            <div key={s._id} style={{ ...rowBase, borderTop: i === 0 ? 'none' : rowBase.borderTop }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-black-95)' }}>{s.schoolName}</div>
                  {(s.contactName || s.contactEmail || s.contactPhone) && (
                    <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.55)', marginTop: '2px' }}>
                      {[s.contactName, s.contactEmail, s.contactPhone].filter(Boolean).join(' · ')}
                    </div>
                  )}
                  {s.notes && (
                    <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.55)', marginTop: '4px', whiteSpace: 'pre-wrap' }}>{s.notes}</div>
                  )}
                  <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Pill label={DEMO_STATUS_LABEL[s.status]} tone={DEMO_STATUS_TONE[s.status]} />
                    {s.followUpBy && <span>Follow up by {fmtDate(s.followUpBy)}</span>}
                    {s.demoDate && <span>Demo {fmtDate(s.demoDate)}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', flexShrink: 0, flexWrap: 'wrap' }}>
                  <select
                    value={s.status}
                    onChange={e => updateSchool({ schoolId: s._id, status: e.target.value as typeof s.status })}
                    style={{ fontSize: '12px', padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)' }}
                  >
                    {DEMO_STATUSES.map(st => <option key={st} value={st}>{DEMO_STATUS_LABEL[st]}</option>)}
                  </select>
                  <input
                    type="date"
                    title="Follow up by"
                    value={dateInputValue(s.followUpBy)}
                    onChange={e => updateSchool({ schoolId: s._id, followUpBy: dateFromInput(e.target.value) ?? null })}
                    style={{ fontSize: '12px', padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)' }}
                  />
                  <input
                    type="date"
                    title="Demo date"
                    value={dateInputValue(s.demoDate)}
                    onChange={e => updateSchool({ schoolId: s._id, demoDate: dateFromInput(e.target.value) ?? null })}
                    style={{ fontSize: '12px', padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)' }}
                  />
                  <button
                    onClick={() => deleteSchool({ schoolId: s._id })}
                    style={{ fontSize: '12px', color: 'rgba(0,0,0,0.38)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const CATEGORIES = ['bug', 'feature', 'content', 'other'] as const
const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const
const STATUSES = ['open', 'in_progress', 'done', 'wont_fix'] as const

function TicketsTab() {
  const [statusFilter, setStatusFilter] = useState<typeof STATUSES[number] | 'all'>('all')
  const tickets = useQuery(api.devTickets.listTickets, statusFilter === 'all' ? {} : { status: statusFilter })
  const submitTicket = useMutation(api.devTickets.submitTicket)
  const updateStatus = useMutation(api.devTickets.updateTicketStatus)
  const deleteTicket = useMutation(api.devTickets.deleteTicket)

  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('bug')
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>('medium')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (!title.trim() || submitting) return
    setSubmitting(true)
    try {
      await submitTicket({ title, description, category, priority, route: window.location.pathname })
      setTitle('')
      setDescription('')
      setCategory('bug')
      setPriority('medium')
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  const priorityTone: Record<typeof PRIORITIES[number], 'neutral' | 'warn' | 'bad'> = {
    low: 'neutral', medium: 'neutral', high: 'warn', critical: 'bad',
  }
  const statusTone: Record<typeof STATUSES[number], 'neutral' | 'good' | 'warn'> = {
    open: 'warn', in_progress: 'neutral', done: 'good', wont_fix: 'neutral',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={card}>
        <div style={{ ...cardHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-black-95)' }}>Drop a ticket for Claude</h2>
          <button onClick={() => setShowForm(s => !s)} className="fj-btn-primary" style={{ fontSize: '13px' }}>
            {showForm ? 'Cancel' : '+ New ticket'}
          </button>
        </div>
        {showForm && (
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Short summary (e.g. Flashcard flip animation stutters on mobile)"
              style={{ fontSize: '13px', padding: '9px 12px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', outline: 'none' }}
            />
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Details — what's wrong, what you want, links/screenshots if useful"
              rows={4}
              style={{ fontSize: '13px', padding: '9px 12px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select value={category} onChange={e => setCategory(e.target.value as typeof category)} style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={priority} onChange={e => setPriority(e.target.value as typeof priority)} style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)' }}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <button
                onClick={handleSubmit}
                disabled={!title.trim() || submitting}
                className="fj-btn-primary"
                style={{ fontSize: '13px', marginLeft: 'auto', opacity: !title.trim() || submitting ? 0.6 : 1 }}
              >
                {submitting ? 'Submitting…' : 'Submit ticket'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {(['all', ...STATUSES] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '5px 12px', fontSize: '12px', fontWeight: 500, borderRadius: '9999px',
              border: '1px solid rgba(0,0,0,0.12)',
              background: statusFilter === s ? 'var(--color-blue)' : 'var(--color-white)',
              color: statusFilter === s ? '#fff' : 'rgba(0,0,0,0.6)', cursor: 'pointer',
            }}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div style={card}>
        {tickets === undefined ? (
          <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>Loading…</div>
        ) : tickets.length === 0 ? (
          <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>No tickets yet.</div>
        ) : (
          tickets.map((t, i) => (
            <div key={t._id} style={{ ...rowBase, borderTop: i === 0 ? 'none' : rowBase.borderTop }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-black-95)' }}>{t.title}</div>
                  {t.description && (
                    <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.55)', marginTop: '4px', whiteSpace: 'pre-wrap' }}>{t.description}</div>
                  )}
                  <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Pill label={t.category} />
                    <Pill label={t.priority} tone={priorityTone[t.priority]} />
                    <Pill label={t.status.replace('_', ' ')} tone={statusTone[t.status]} />
                    <span>{fmtDate(t.createdAt)}{t.route ? ` · ${t.route}` : ''}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', flexShrink: 0 }}>
                  <select
                    value={t.status}
                    onChange={e => updateStatus({ ticketId: t._id, status: e.target.value as typeof t.status })}
                    style={{ fontSize: '12px', padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)' }}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                  <button
                    onClick={() => deleteTicket({ ticketId: t._id })}
                    style={{ fontSize: '12px', color: 'rgba(0,0,0,0.38)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function PartnersTab() {
  const partners = useQuery(api.admin.listPartnerProfilesAdmin)
  const setVisibility = useMutation(api.admin.setPartnerVisibilityAdmin)
  return (
    <div style={card}>
      {partners === undefined ? (
        <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>Loading…</div>
      ) : partners.length === 0 ? (
        <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>No partner profiles yet.</div>
      ) : (
        partners.map((p, i) => (
          <div key={p._id} style={{ ...rowBase, borderTop: i === 0 ? 'none' : rowBase.borderTop, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-black-95)' }}>{p.name}</div>
              <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', marginTop: '2px' }}>
                {p.type ?? 'unspecified'}{p.handle ? ` · @${p.handle}` : ''} · updated {fmtDate(p.updatedAt)}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Pill label={p.isVisible ? 'visible' : 'hidden'} tone={p.isVisible ? 'good' : 'neutral'} />
              <button
                onClick={() => setVisibility({ partnerId: p._id, isVisible: !p.isVisible })}
                style={{ fontSize: '12px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)', background: 'var(--color-white)', color: 'var(--color-blue)', cursor: 'pointer' }}
              >
                {p.isVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function BarberTab() {
  const pages = useQuery(api.admin.listBarberPages)
  const setStatus = useMutation(api.admin.setBarberPageStatus)
  const statusTone: Record<string, 'neutral' | 'good' | 'warn'> = { draft: 'neutral', live: 'good', offline: 'warn' }
  return (
    <div style={card}>
      {pages === undefined ? (
        <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>Loading…</div>
      ) : pages.length === 0 ? (
        <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>No barber pages yet.</div>
      ) : (
        pages.map((p, i) => (
          <div key={p._id} style={{ ...rowBase, borderTop: i === 0 ? 'none' : rowBase.borderTop, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-black-95)' }}>{p.name ?? p.slug}</div>
              <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', marginTop: '2px' }}>
                /{p.slug} · {p.ownerEmail}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Pill label={p.status} tone={statusTone[p.status]} />
              <select
                value={p.status}
                onChange={e => setStatus({ pageId: p._id, status: e.target.value as 'draft' | 'live' | 'offline' })}
                style={{ fontSize: '12px', padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)' }}
              >
                {(['draft', 'live', 'offline'] as const).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function WaitlistTab() {
  const rows = useQuery(api.admin.listWaitlist)
  return (
    <div style={card}>
      {rows === undefined ? (
        <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>Loading…</div>
      ) : rows.length === 0 ? (
        <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>Waitlist is empty.</div>
      ) : (
        rows.map((r, i) => (
          <div key={r._id} style={{ ...rowBase, borderTop: i === 0 ? 'none' : rowBase.borderTop, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-black-95)' }}>{r.email}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Pill label={r.role} />
              <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)' }}>{fmtDate(r.createdAt)}</span>
            </span>
          </div>
        ))
      )}
    </div>
  )
}

// ── Study Content tab — admin-editable flashcards + quiz questions ────────
// Lets Anthony edit any question/answer directly; edits go live immediately
// since Flash.tsx/Quiz.tsx read from the same Convex tables. Preview reuses
// the exact live-page rendering components from components/StudyPreview.

// Browser-chrome shell around the preview so it reads as "a page", not a
// bare component — traffic-light dots + a fake URL bar, matching the real
// route each preview mimics.
function PreviewModal({ path, onClose, children }: { path: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(20,20,20,0.6)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', overflowY: 'auto',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto',
          background: 'var(--color-white)', borderRadius: '14px', boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
        }}
      >
        {/* Fake browser chrome */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
          background: '#edecea', borderBottom: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '14px 14px 0 0', position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
          </div>
          <span style={{
            flex: 1, fontSize: '12px', color: 'rgba(0,0,0,0.45)', background: 'var(--color-white)',
            border: '1px solid rgba(0,0,0,0.08)', borderRadius: '6px', padding: '4px 10px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {path}
          </span>
          <button
            onClick={onClose}
            style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(0,0,0,0.5)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          >
            Close ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function FlashCardPreview({
  id, topic, question, answer, onClose,
}: { id: number; topic: string; question: string; answer: string; onClose: () => void }) {
  const [flipped, setFlipped] = useState(false)
  const [starred, setStarred] = useState(false)
  const disabledNavStyle: React.CSSProperties = {
    flex: 1, height: '40px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-white)',
    color: 'var(--color-warm-300)', cursor: 'not-allowed', fontSize: '16px', fontWeight: 600,
  }

  return (
    <PreviewModal path="fadejunkie.com/education/flash" onClose={onClose}>
      {/* Replica of Flash.tsx's top bar */}
      <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-white)' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 20px', height: '44px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-warm-500)' }}>← Hub</span>
          <div style={{ width: '1px', height: '18px', background: 'rgba(0,0,0,0.12)' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', padding: '2px', background: 'rgba(0,0,0,0.04)', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}>
            <span style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 600, borderRadius: '4px', background: 'var(--color-black-95)', color: '#fff' }}>Flashcards</span>
            <span style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 600, borderRadius: '4px', color: 'rgba(0,0,0,0.6)' }}>Quiz</span>
          </div>
        </div>
      </div>

      {/* Replica of Flash.tsx's main content */}
      <div style={{ background: 'var(--color-warm-white)', padding: '40px 24px 48px', borderRadius: '0 0 14px 14px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (id / 300) * 100)}%`, background: 'var(--color-blue)', borderRadius: '99px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-black-95)' }}>
              Card {id} <span style={{ color: 'var(--color-warm-300)', fontWeight: 400 }}>of 300</span>
            </span>
            <span className="fj-badge">{topic}</span>
          </div>

          <FlashCardVisual question={question} answer={answer} flipped={flipped} onFlip={() => setFlipped(f => !f)} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
            <button
              onClick={() => setStarred(s => !s)}
              title={starred ? 'Unstar' : 'Star'}
              style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid', borderColor: starred ? 'rgba(245,196,0,0.5)' : 'rgba(0,0,0,0.1)',
                background: starred ? 'rgba(255,196,0,0.08)' : 'var(--color-white)', cursor: 'pointer',
                color: starred ? '#b07a00' : 'rgba(0,0,0,0.4)',
              }}
            >
              <Star size={16} fill={starred ? '#f5c400' : 'none'} stroke={starred ? '#f5c400' : 'currentColor'} />
            </button>
            <button disabled style={disabledNavStyle}>←</button>
            <span style={{ fontSize: '13px', fontWeight: 600, minWidth: '52px', textAlign: 'center', color: 'var(--color-black-95)', flexShrink: 0 }}>1 / 1</span>
            <button disabled style={disabledNavStyle}>→</button>
            <button disabled style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-white)', color: 'rgba(0,0,0,0.2)', cursor: 'not-allowed' }}>
              <RotateCcw size={15} />
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(0,0,0,0.35)', margin: 0 }}>
            Preview only — tap the card to flip. Prev/next are disabled here.
          </p>
        </div>
      </div>
    </PreviewModal>
  )
}

function QuizQuestionPreview({
  id, topic, question, choices, answer, explanation, onClose,
}: { id: number; topic: string; question: string; choices: string[]; answer: number; explanation: string; onClose: () => void }) {
  return (
    <PreviewModal path="fadejunkie.com/education/quiz" onClose={onClose}>
      {/* Replica of Quiz.tsx's in-quiz top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-white)' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-warm-500)' }}>Exit quiz</span>
        <span style={{ fontSize: '12px', color: 'var(--color-warm-300)' }}>Q {id} of 300 · {topic}</span>
      </div>

      <div style={{ background: '#edecea', padding: '32px 24px 48px', borderRadius: '0 0 14px 14px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-black-95)' }}>
              Q {id} <span style={{ color: 'var(--color-warm-300)', fontWeight: 400 }}>of 300</span>
            </span>
            <span className="fj-badge">{topic}</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(0,0,0,0.1)', borderRadius: '99px', marginBottom: '32px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '100%', background: 'var(--color-blue)', borderRadius: '99px' }} />
          </div>

          <QuizQuestionCard question={question} />
          <QuizChoices choices={choices} answer={answer} selected={answer} answered onSelect={() => {}} />
          <QuizExplanation explanation={explanation} />
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(0,0,0,0.4)', margin: 0 }}>
            Preview only — shown with the correct answer already revealed.
          </p>
        </div>
      </div>
    </PreviewModal>
  )
}

function TopicSelect({ value, onChange }: { value: string; onChange: (t: string) => void }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)', alignSelf: 'flex-start' }}
    >
      {CONTENT_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
    </select>
  )
}

type FlashCardDoc = { _id: Id<'flashCards'>; id: number; topic: string; question: string; answer: string }

function FlashCardRow({ card }: { card: FlashCardDoc }) {
  const [editing, setEditing] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [topic, setTopic] = useState(card.topic)
  const [question, setQuestion] = useState(card.question)
  const [answer, setAnswer] = useState(card.answer)
  const [saving, setSaving] = useState(false)
  const update = useMutation(api.studyContent.updateFlashCard)
  const del = useMutation(api.studyContent.deleteFlashCard)

  async function save() {
    if (!question.trim() || !answer.trim() || saving) return
    setSaving(true)
    try {
      await update({ id: card._id, topic, question, answer })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  function cancel() {
    setTopic(card.topic); setQuestion(card.question); setAnswer(card.answer)
    setEditing(false)
  }

  async function remove() {
    if (!window.confirm(`Delete flashcard #${card.id}? This can't be undone.`)) return
    await del({ id: card._id })
  }

  return (
    <div style={rowBase}>
      {!editing ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
              <Pill label={card.topic} />
              <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.35)' }}>#{card.id}</span>
            </div>
            <div style={{ fontWeight: 600, color: 'var(--color-black-95)' }}>{card.question}</div>
            <div style={{ fontSize: '13px', color: 'rgba(0,0,0,0.55)', marginTop: '4px' }}>{card.answer}</div>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', flexShrink: 0, flexWrap: 'wrap' }}>
            <button onClick={() => setPreviewing(true)} className="fj-btn-secondary" style={{ fontSize: '12px', padding: '5px 10px' }}>Preview</button>
            <button
              onClick={() => setEditing(true)}
              style={{ fontSize: '12px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)', background: 'var(--color-white)', color: 'var(--color-blue)', cursor: 'pointer' }}
            >
              Edit
            </button>
            <button onClick={remove} style={{ fontSize: '12px', color: '#c4492a', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <TopicSelect value={topic} onChange={setTopic} />
          <textarea value={question} onChange={e => setQuestion(e.target.value)} rows={2} placeholder="Question" style={{ ...contentInputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={2} placeholder="Answer" style={{ ...contentInputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={save} disabled={saving || !question.trim() || !answer.trim()} className="fj-btn-primary" style={{ fontSize: '13px', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={cancel} style={{ fontSize: '13px', color: 'rgba(0,0,0,0.5)', background: 'none', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', padding: '9px 14px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {previewing && <FlashCardPreview id={card.id} topic={card.topic} question={card.question} answer={card.answer} onClose={() => setPreviewing(false)} />}
    </div>
  )
}

function NewFlashCardForm({ onDone }: { onDone: () => void }) {
  const [topic, setTopic] = useState<string>(CONTENT_TOPICS[0])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [saving, setSaving] = useState(false)
  const create = useMutation(api.studyContent.createFlashCard)

  async function save() {
    if (!question.trim() || !answer.trim() || saving) return
    setSaving(true)
    try {
      await create({ topic, question, answer })
      setQuestion(''); setAnswer('')
      onDone()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <TopicSelect value={topic} onChange={setTopic} />
      <textarea value={question} onChange={e => setQuestion(e.target.value)} rows={2} placeholder="Question" style={{ ...contentInputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
      <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={2} placeholder="Answer" style={{ ...contentInputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
      <button onClick={save} disabled={saving || !question.trim() || !answer.trim()} className="fj-btn-primary" style={{ fontSize: '13px', alignSelf: 'flex-end', opacity: saving ? 0.6 : 1 }}>
        {saving ? 'Adding…' : 'Add flashcard'}
      </button>
    </div>
  )
}

function FlashCardsPanel() {
  const cards = useQuery(api.studyContent.listFlashCards)
  const [topicFilter, setTopicFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const filtered = (cards ?? [])
    .filter(c => topicFilter === 'all' || c.topic === topicFilter)
    .filter(c => {
      if (!search.trim()) return true
      const s = search.toLowerCase()
      return c.question.toLowerCase().includes(s) || c.answer.toLowerCase().includes(s)
    })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={card}>
        <div style={{ ...cardHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search question or answer…"
            style={{ ...contentInputStyle, flex: '1 1 240px' }}
          />
          <button onClick={() => setShowForm(s => !s)} className="fj-btn-primary" style={{ fontSize: '13px' }}>
            {showForm ? 'Cancel' : '+ Add flashcard'}
          </button>
        </div>
        {showForm && <NewFlashCardForm onDone={() => setShowForm(false)} />}
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {(['all', ...CONTENT_TOPICS] as const).map(t => (
          <button
            key={t}
            onClick={() => setTopicFilter(t)}
            style={{
              padding: '5px 12px', fontSize: '12px', fontWeight: 500, borderRadius: '9999px',
              border: '1px solid rgba(0,0,0,0.12)',
              background: topicFilter === t ? 'var(--color-blue)' : 'var(--color-white)',
              color: topicFilter === t ? '#fff' : 'rgba(0,0,0,0.6)', cursor: 'pointer',
            }}
          >
            {t === 'all' ? 'All topics' : t}
          </button>
        ))}
      </div>

      <div style={card}>
        {cards === undefined ? (
          <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>No flashcards match.</div>
        ) : (
          <>
            {filtered.slice(0, CONTENT_LIST_LIMIT).map(c => <FlashCardRow key={c._id} card={c} />)}
            {filtered.length > CONTENT_LIST_LIMIT && (
              <div style={{ padding: '14px 24px', fontSize: '12px', color: 'rgba(0,0,0,0.4)', borderTop: rowBase.borderTop }}>
                Showing {CONTENT_LIST_LIMIT} of {filtered.length} — narrow by topic or search to see more.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

type QuizQuestionDoc = { _id: Id<'quizQuestions'>; id: number; topic: string; question: string; choices: string[]; answer: number; explanation: string }

function ChoiceEditor({
  choices, answer, onChoicesChange, onAnswerChange,
}: { choices: string[]; answer: number; onChoicesChange: (c: string[]) => void; onAnswerChange: (a: number) => void }) {
  function updateChoice(idx: number, val: string) {
    onChoicesChange(choices.map((c, i) => i === idx ? val : c))
  }
  function removeChoice(idx: number) {
    if (choices.length <= 2) return
    onChoicesChange(choices.filter((_, i) => i !== idx))
    if (answer === idx) onAnswerChange(0)
    else if (answer > idx) onAnswerChange(answer - 1)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {choices.map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="radio" checked={answer === i} onChange={() => onAnswerChange(i)} title="Mark as correct answer" />
          <input value={c} onChange={e => updateChoice(i, e.target.value)} style={{ ...contentInputStyle, flex: 1 }} placeholder={`Choice ${i + 1}`} />
          {choices.length > 2 && (
            <button onClick={() => removeChoice(i)} style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
          )}
        </div>
      ))}
      <button
        onClick={() => onChoicesChange([...choices, ''])}
        style={{ fontSize: '12px', color: 'var(--color-blue)', background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}
      >
        + Add choice
      </button>
    </div>
  )
}

function QuizQuestionRow({ q }: { q: QuizQuestionDoc }) {
  const [editing, setEditing] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [topic, setTopic] = useState(q.topic)
  const [question, setQuestion] = useState(q.question)
  const [choices, setChoices] = useState<string[]>(q.choices)
  const [answer, setAnswer] = useState(q.answer)
  const [explanation, setExplanation] = useState(q.explanation)
  const [saving, setSaving] = useState(false)
  const update = useMutation(api.studyContent.updateQuizQuestion)
  const del = useMutation(api.studyContent.deleteQuizQuestion)

  async function save() {
    if (!question.trim() || choices.some(c => !c.trim()) || saving) return
    setSaving(true)
    try {
      await update({ id: q._id, topic, question, choices, answer, explanation })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  function cancel() {
    setTopic(q.topic); setQuestion(q.question); setChoices(q.choices); setAnswer(q.answer); setExplanation(q.explanation)
    setEditing(false)
  }

  async function remove() {
    if (!window.confirm(`Delete quiz question #${q.id}? This can't be undone.`)) return
    await del({ id: q._id })
  }

  return (
    <div style={rowBase}>
      {!editing ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
              <Pill label={q.topic} />
              <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.35)' }}>#{q.id}</span>
            </div>
            <div style={{ fontWeight: 600, color: 'var(--color-black-95)' }}>{q.question}</div>
            <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.55)', marginTop: '4px' }}>
              {q.choices.map((c, i) => (
                <div key={i} style={{ color: i === q.answer ? '#0f7a28' : undefined, fontWeight: i === q.answer ? 600 : 400 }}>
                  {i === q.answer ? '✓ ' : '· '}{c}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', flexShrink: 0, flexWrap: 'wrap' }}>
            <button onClick={() => setPreviewing(true)} className="fj-btn-secondary" style={{ fontSize: '12px', padding: '5px 10px' }}>Preview</button>
            <button
              onClick={() => setEditing(true)}
              style={{ fontSize: '12px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)', background: 'var(--color-white)', color: 'var(--color-blue)', cursor: 'pointer' }}
            >
              Edit
            </button>
            <button onClick={remove} style={{ fontSize: '12px', color: '#c4492a', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <TopicSelect value={topic} onChange={setTopic} />
          <textarea value={question} onChange={e => setQuestion(e.target.value)} rows={2} placeholder="Question" style={{ ...contentInputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          <ChoiceEditor choices={choices} answer={answer} onChoicesChange={setChoices} onAnswerChange={setAnswer} />
          <textarea value={explanation} onChange={e => setExplanation(e.target.value)} rows={2} placeholder="Explanation" style={{ ...contentInputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={save} disabled={saving || !question.trim() || choices.some(c => !c.trim())} className="fj-btn-primary" style={{ fontSize: '13px', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={cancel} style={{ fontSize: '13px', color: 'rgba(0,0,0,0.5)', background: 'none', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', padding: '9px 14px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {previewing && (
        <QuizQuestionPreview id={q.id} topic={q.topic} question={q.question} choices={q.choices} answer={q.answer} explanation={q.explanation} onClose={() => setPreviewing(false)} />
      )}
    </div>
  )
}

function NewQuizQuestionForm({ onDone }: { onDone: () => void }) {
  const [topic, setTopic] = useState<string>(CONTENT_TOPICS[0])
  const [question, setQuestion] = useState('')
  const [choices, setChoices] = useState<string[]>(['', '', '', ''])
  const [answer, setAnswer] = useState(0)
  const [explanation, setExplanation] = useState('')
  const [saving, setSaving] = useState(false)
  const create = useMutation(api.studyContent.createQuizQuestion)

  async function save() {
    if (!question.trim() || choices.some(c => !c.trim()) || saving) return
    setSaving(true)
    try {
      await create({ topic, question, choices, answer, explanation })
      setQuestion(''); setChoices(['', '', '', '']); setAnswer(0); setExplanation('')
      onDone()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <TopicSelect value={topic} onChange={setTopic} />
      <textarea value={question} onChange={e => setQuestion(e.target.value)} rows={2} placeholder="Question" style={{ ...contentInputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
      <ChoiceEditor choices={choices} answer={answer} onChoicesChange={setChoices} onAnswerChange={setAnswer} />
      <textarea value={explanation} onChange={e => setExplanation(e.target.value)} rows={2} placeholder="Explanation" style={{ ...contentInputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
      <button onClick={save} disabled={saving || !question.trim() || choices.some(c => !c.trim())} className="fj-btn-primary" style={{ fontSize: '13px', alignSelf: 'flex-end', opacity: saving ? 0.6 : 1 }}>
        {saving ? 'Adding…' : 'Add question'}
      </button>
    </div>
  )
}

function QuizQuestionsPanel() {
  const questions = useQuery(api.studyContent.listQuizQuestions)
  const [topicFilter, setTopicFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const filtered = (questions ?? [])
    .filter(q => topicFilter === 'all' || q.topic === topicFilter)
    .filter(q => {
      if (!search.trim()) return true
      const s = search.toLowerCase()
      return q.question.toLowerCase().includes(s) || q.choices.some(c => c.toLowerCase().includes(s))
    })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={card}>
        <div style={{ ...cardHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search question or choices…"
            style={{ ...contentInputStyle, flex: '1 1 240px' }}
          />
          <button onClick={() => setShowForm(s => !s)} className="fj-btn-primary" style={{ fontSize: '13px' }}>
            {showForm ? 'Cancel' : '+ Add question'}
          </button>
        </div>
        {showForm && <NewQuizQuestionForm onDone={() => setShowForm(false)} />}
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {(['all', ...CONTENT_TOPICS] as const).map(t => (
          <button
            key={t}
            onClick={() => setTopicFilter(t)}
            style={{
              padding: '5px 12px', fontSize: '12px', fontWeight: 500, borderRadius: '9999px',
              border: '1px solid rgba(0,0,0,0.12)',
              background: topicFilter === t ? 'var(--color-blue)' : 'var(--color-white)',
              color: topicFilter === t ? '#fff' : 'rgba(0,0,0,0.6)', cursor: 'pointer',
            }}
          >
            {t === 'all' ? 'All topics' : t}
          </button>
        ))}
      </div>

      <div style={card}>
        {questions === undefined ? (
          <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '24px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>No quiz questions match.</div>
        ) : (
          <>
            {filtered.slice(0, CONTENT_LIST_LIMIT).map(q => <QuizQuestionRow key={q._id} q={q} />)}
            {filtered.length > CONTENT_LIST_LIMIT && (
              <div style={{ padding: '14px 24px', fontSize: '12px', color: 'rgba(0,0,0,0.4)', borderTop: rowBase.borderTop }}>
                Showing {CONTENT_LIST_LIMIT} of {filtered.length} — narrow by topic or search to see more.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function StudyContentTab() {
  const [mode, setMode] = useState<'flash' | 'quiz'>('flash')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'inline-flex', gap: '2px', padding: '2px', background: 'rgba(0,0,0,0.04)', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', width: 'fit-content' }}>
        {(['flash', 'quiz'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '6px 14px', fontSize: '12px', fontWeight: 600, borderRadius: '4px',
              background: mode === m ? 'var(--color-black-95)' : 'transparent',
              color: mode === m ? '#fff' : 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer',
            }}
          >
            {m === 'flash' ? 'Flashcards' : 'Quiz Questions'}
          </button>
        ))}
      </div>
      {mode === 'flash' ? <FlashCardsPanel /> : <QuizQuestionsPanel />}
    </div>
  )
}

export default function Admin() {
  const [active, setActive] = useState<Section>('overview')
  const { user } = useUser()
  const isAdmin = useQuery(api.admin.isCurrentUserAdmin)

  return (
    <>
      <SignedOut>
        <section style={{ padding: '80px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', color: 'var(--color-warm-500)', marginBottom: '24px' }}>
            Sign in to access the admin dashboard.
          </p>
          <SignInButton mode="modal">
            <button className="fj-btn-primary">Sign in with Google</button>
          </SignInButton>
        </section>
      </SignedOut>

      <SignedIn>
        {isAdmin === undefined ? (
          <section style={{ padding: '80px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>Loading…</p>
          </section>
        ) : !isAdmin ? (
          <section style={{ padding: '80px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', color: 'var(--color-warm-500)' }}>
              {user?.firstName ?? 'This account'} isn't authorized to view the admin dashboard.
            </p>
            <Link to="/" style={{ fontSize: '13px', color: 'var(--color-blue)' }}>← Back home</Link>
          </section>
        ) : (
          <>
            <section style={{ padding: '32px 24px 24px', background: 'var(--color-white)' }}>
              <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
                <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-1px', color: 'var(--color-black-95)', margin: '0 0 6px' }}>
                  Admin
                </h1>
                <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', margin: 0 }}>
                  Manage users, study content, partners, barber pages, and drop tickets for Claude.
                </p>
              </div>
            </section>

            <section style={{ padding: '0 24px 64px', background: 'var(--color-warm-white)' }}>
              <div style={{ maxWidth: '1080px', margin: '0 auto', paddingTop: '24px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {SECTIONS.map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setActive(id)}
                      style={{
                        padding: '7px 14px', fontSize: '13px', fontWeight: 500, borderRadius: '9999px',
                        border: 'var(--border-whisper)',
                        background: active === id ? 'var(--color-blue)' : 'var(--color-white)',
                        color: active === id ? '#fff' : 'rgba(0,0,0,0.6)', cursor: 'pointer',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {active === 'overview' && <OverviewTab />}
                {active === 'users' && <UsersTab />}
                {active === 'content' && <StudyContentTab />}
                {active === 'demos' && <DemosTab />}
                {active === 'tickets' && <TicketsTab />}
                {active === 'partners' && <PartnersTab />}
                {active === 'barber' && <BarberTab />}
                {active === 'waitlist' && <WaitlistTab />}
              </div>
            </section>
          </>
        )}
      </SignedIn>
    </>
  )
}
