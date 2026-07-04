import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, useUser, SignInButton } from '@clerk/clerk-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

type Section = 'overview' | 'users' | 'tickets' | 'partners' | 'barber' | 'waitlist'

const SECTIONS: [Section, string][] = [
  ['overview', 'Overview'],
  ['users', 'Users'],
  ['tickets', 'Dev Tickets'],
  ['partners', 'Partners'],
  ['barber', 'Barber Pages'],
  ['waitlist', 'Waitlist'],
]

const card: React.CSSProperties = {
  background: 'var(--color-white)',
  border: 'var(--border-whisper)',
  borderRadius: '12px',
  boxShadow: 'var(--shadow-card)',
  overflow: 'hidden',
}
const cardHeader: React.CSSProperties = { padding: '20px 24px', borderBottom: 'var(--border-whisper)' }
const rowBase: React.CSSProperties = { padding: '12px 24px', borderTop: 'var(--border-whisper)', fontSize: '13px' }

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
                  Manage users, partners, barber pages, and drop tickets for Claude.
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
