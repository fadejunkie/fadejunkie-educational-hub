import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SignedIn, SignedOut, useUser, useClerk, SignInButton } from '@clerk/clerk-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useStudyPreferences } from '../hooks/useStudyPreferences'
import { QUIZ_COUNTS, type QuizCount } from '../data/studyData'

type Section = 'profile' | 'study' | 'partner' | 'data'

function toCsvValue(value: string | number): string {
  const str = String(value)
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map(row => row.map(toCsvValue).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function AccountSettings() {
  const [active, setActive] = useState<Section>('profile')
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const clerkId = user?.id ?? ''

  const partnerProfile = useQuery(api.partners.getMyPartnerProfile, clerkId ? { clerkId } : 'skip')
  const setPartnerVisibility = useMutation(api.partners.setPartnerVisibility)
  const [partnerSaving, setPartnerSaving] = useState(false)

  const { prefs, loading: prefsLoading, setPreference, setDefaultQuizLength } = useStudyPreferences()
  const [savingPref, setSavingPref] = useState<string | null>(null)
  const [savingQuizLength, setSavingQuizLength] = useState(false)

  // Profile fields (School / Cohort)
  const myProfile = useQuery(api.userProfile.getMyProfile, clerkId ? { clerkId } : 'skip')
  const updateProfileField = useMutation(api.userProfile.updateProfile)
  const [editingField, setEditingField] = useState<'school' | 'cohort' | null>(null)
  const [editValue, setEditValue] = useState('')
  const [savingField, setSavingField] = useState(false)

  function startEditing(field: 'school' | 'cohort', current: string) {
    setEditingField(field)
    setEditValue(current === 'Not set' ? '' : current)
  }

  async function saveField() {
    if (!editingField || !clerkId) return
    setSavingField(true)
    try {
      await updateProfileField({
        clerkId,
        email: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName ?? undefined,
        field: editingField,
        value: editValue,
      })
      setEditingField(null)
    } finally {
      setSavingField(false)
    }
  }

  async function changeQuizLength(value: QuizCount) {
    if (savingQuizLength || value === prefs.defaultQuizLength) return
    setSavingQuizLength(true)
    try {
      await setDefaultQuizLength(value)
    } finally {
      setSavingQuizLength(false)
    }
  }

  // Data & privacy
  const exportData = useQuery(api.progress.exportData, clerkId ? { clerkId } : 'skip')
  const resetProgressMutation = useMutation(api.progress.resetProgress)
  const [resetting, setResetting] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  function handleExport() {
    if (!exportData) return
    const rows: (string | number)[][] = [['Quiz Sessions'], ['Date', 'Topic', 'Correct', 'Total', 'Accuracy']]
    for (const s of exportData.sessions) {
      const accuracy = s.total > 0 ? `${Math.round((s.correct / s.total) * 100)}%` : '0%'
      rows.push([new Date(s.completedAt).toISOString().slice(0, 10), s.topic, s.correct, s.total, accuracy])
    }
    rows.push([])
    rows.push(['Starred Cards'])
    rows.push(['Topic', 'Card ID'])
    for (const c of exportData.starredCards) {
      rows.push([c.topic, c.cardId])
    }
    downloadCsv('fadejunkie-study-data.csv', rows)
  }

  async function handleReset() {
    if (!clerkId || resetting) return
    const confirmed = window.confirm('This will permanently clear all your quiz history and starred cards. This can\'t be undone. Continue?')
    if (!confirmed) return
    setResetting(true)
    try {
      await resetProgressMutation({ clerkId })
      setResetDone(true)
      setTimeout(() => setResetDone(false), 3000)
    } finally {
      setResetting(false)
    }
  }

  // Delete account
  const deleteAccountMutation = useMutation(api.userProfile.deleteAccount)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  async function handleDeleteAccount() {
    if (!clerkId || deleting || deleteConfirmText !== 'DELETE') return
    setDeleting(true)
    try {
      await deleteAccountMutation({ clerkId })
      await signOut()
      navigate('/')
    } catch {
      setDeleting(false)
    }
  }

  async function togglePref(key: 'showExplanations' | 'dailyReminder' | 'autoStarMissed') {
    if (savingPref) return
    setSavingPref(key)
    try {
      const next = !prefs[key]
      if (key === 'dailyReminder' && next && typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission()
      }
      await setPreference(key, next)
    } finally {
      setSavingPref(null)
    }
  }

  const isListed = partnerProfile?.isVisible ?? false

  async function togglePartner() {
    if (!clerkId || partnerSaving) return
    setPartnerSaving(true)
    try {
      await setPartnerVisibility({
        clerkId,
        isVisible: !isListed,
        name: user?.fullName ?? user?.firstName ?? 'FadeJunkie User',
        email: user?.primaryEmailAddress?.emailAddress,
        handle: partnerProfile?.handle,
        avatarUrl: user?.imageUrl ?? partnerProfile?.avatarUrl,
        type: partnerProfile?.type,
        description: partnerProfile?.description,
      })
    } finally {
      setPartnerSaving(false)
    }
  }

  return (
    <>
      <SignedOut>
        <section style={{ padding: '80px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', color: 'var(--color-warm-500)', marginBottom: '24px' }}>
            Sign in to manage your account settings.
          </p>
          <SignInButton mode="modal">
            <button className="fj-btn-primary">Sign in with Google</button>
          </SignInButton>
        </section>
      </SignedOut>

      <SignedIn>
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <section style={{ padding: '32px 24px 24px', background: 'var(--color-white)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Link to="/profile" style={{ fontSize: '13px', color: 'var(--color-warm-500)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '18px' }}>
              ← Profile
            </Link>
            <h1 style={{
              fontSize: 'clamp(30px, 5vw, 48px)',
              fontWeight: 700,
              letterSpacing: '-1.2px',
              color: 'var(--color-black-95)',
              margin: '0 0 8px',
            }}>
              Account settings
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', margin: 0 }}>
              Manage your profile, study preferences, and data.
            </p>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <section style={{ padding: '0 24px 64px', background: 'var(--color-warm-white)' }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            paddingTop: '32px',
          }}>
            {/* Side nav — desktop */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }} className="hidden-mobile">
              {([
                ['profile', 'Profile'],
                ['study', 'Study preferences'],
                ['partner', 'Partnership'],
                ['data', 'Data & privacy'],
              ] as [Section, string][]).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  style={{
                    padding: '10px 12px',
                    fontSize: '13px',
                    textAlign: 'left' as const,
                    borderRadius: '6px',
                    background: active === id ? 'var(--color-badge-bg)' : 'transparent',
                    color: active === id ? 'var(--color-blue)' : 'rgba(0,0,0,0.6)',
                    fontWeight: active === id ? 600 : 400,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Main content */}
            <div style={{ gridColumn: 'span 1' }} className="settings-main">

              {/* Profile section */}
              {active === 'profile' && (
                <div style={{
                  background: 'var(--color-white)',
                  border: 'var(--border-whisper)',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: 'var(--shadow-card)',
                }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px', color: 'var(--color-black-95)', margin: '0 0 4px' }}>Profile</h2>
                  <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', margin: '0 0 20px' }}>How you appear in group sessions.</p>

                  {/* Avatar row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '20px', borderBottom: 'var(--border-whisper)' }}>
                    <div style={{
                      width: '60px', height: '60px', borderRadius: '9999px',
                      background: 'rgba(0,0,0,0.08)', border: 'var(--border-whisper)',
                      overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {user?.imageUrl ? (
                        <img src={user.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-warm-500)' }}>
                          {user?.firstName?.[0] ?? '?'}
                        </span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-black-95)' }}>
                        {user?.fullName ?? user?.firstName ?? 'Your Name'}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.38)', marginTop: '2px' }}>
                        Signed in with Google
                      </div>
                    </div>
                  </div>

                  {/* Read-only fields */}
                  {[
                    ['Display name', user?.firstName ?? 'Not set'],
                    ['Email', user?.primaryEmailAddress?.emailAddress ?? 'Not set'],
                  ].map(([label, value]) => (
                    <div key={label} style={{
                      padding: '12px 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: 'var(--border-whisper)',
                      fontSize: '13px',
                    }}>
                      <span style={{ color: 'rgba(0,0,0,0.6)' }}>{label}</span>
                      <span style={{ color: value === 'Not set' ? 'rgba(0,0,0,0.38)' : 'var(--color-black-95)' }}>{value}</span>
                    </div>
                  ))}

                  {/* Editable fields: School / Cohort */}
                  {([
                    ['school', 'School', myProfile?.school ?? 'Not set'],
                    ['cohort', 'Cohort', myProfile?.cohort ?? 'Not set'],
                  ] as ['school' | 'cohort', string, string][]).map(([field, label, value]) => (
                    <div key={field} style={{
                      padding: '12px 0',
                      borderTop: 'var(--border-whisper)',
                      fontSize: '13px',
                    }}>
                      {editingField === field ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: 'rgba(0,0,0,0.6)', flexShrink: 0 }}>{label}</span>
                          <input
                            autoFocus
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveField()
                              if (e.key === 'Escape') setEditingField(null)
                            }}
                            placeholder={`Enter your ${label.toLowerCase()}`}
                            style={{
                              flex: 1, fontSize: '13px', padding: '5px 8px',
                              border: '1px solid var(--color-blue)', borderRadius: '6px',
                              outline: 'none',
                            }}
                          />
                          <button
                            onClick={saveField}
                            disabled={savingField}
                            style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-blue)', background: 'none', border: 'none', cursor: savingField ? 'wait' : 'pointer' }}
                          >
                            {savingField ? 'Saving…' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingField(null)}
                            disabled={savingField}
                            style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'rgba(0,0,0,0.6)' }}>{label}</span>
                          <span style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span style={{ color: value === 'Not set' ? 'rgba(0,0,0,0.38)' : 'var(--color-black-95)' }}>{value}</span>
                            <span
                              onClick={() => startEditing(field, value)}
                              style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-blue)', cursor: 'pointer' }}
                            >
                              Edit
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Study preferences */}
              {active === 'study' && (
                <div style={{
                  background: 'var(--color-white)',
                  border: 'var(--border-whisper)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                }}>
                  <div style={{ padding: '20px 24px', borderBottom: 'var(--border-whisper)' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px', color: 'var(--color-black-95)', margin: 0 }}>Study preferences</h2>
                  </div>

                  {/* Default quiz length */}
                  <div style={{
                    padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: '13px', flexWrap: 'wrap', gap: '10px',
                  }}>
                    <span style={{ color: 'var(--color-black-95)' }}>Default quiz length</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {QUIZ_COUNTS.map(n => (
                        <button
                          key={n}
                          onClick={() => changeQuizLength(n)}
                          disabled={savingQuizLength || prefsLoading}
                          style={{
                            padding: '5px 10px', fontSize: '12px', fontWeight: 600,
                            borderRadius: '9999px',
                            border: prefs.defaultQuizLength === n ? '1px solid var(--color-blue)' : '1px solid rgba(0,0,0,0.12)',
                            background: prefs.defaultQuizLength === n ? 'rgba(0,117,222,0.08)' : 'transparent',
                            color: prefs.defaultQuizLength === n ? 'var(--color-blue)' : 'rgba(0,0,0,0.6)',
                            cursor: savingQuizLength ? 'wait' : 'pointer',
                            opacity: prefsLoading ? 0.5 : 1,
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {([
                    ['showExplanations', 'Show answer explanations', 'See why an answer is correct after each question.'],
                    ['dailyReminder', 'Daily reminder', 'Get a browser notification if you haven’t studied yet today.'],
                    ['autoStarMissed', 'Auto-star missed questions', 'Quiz questions you get wrong are saved to your starred list.'],
                  ] as ['showExplanations' | 'dailyReminder' | 'autoStarMissed', string, string][]).map(([key, label, hint]) => (
                    <div key={key} style={{
                      padding: '14px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: 'var(--border-whisper)',
                      fontSize: '13px',
                    }}>
                      <span style={{ color: 'var(--color-black-95)' }}>
                        {label}
                        <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', marginTop: '2px', fontWeight: 400 }}>{hint}</div>
                      </span>
                      <button
                        onClick={() => togglePref(key)}
                        disabled={prefsLoading || savingPref === key}
                        aria-label={`Toggle ${label}`}
                        style={{
                          width: '34px', height: '18px', flexShrink: 0, padding: 0,
                          background: prefs[key] ? 'var(--color-blue)' : 'rgba(0,0,0,0.12)',
                          borderRadius: '9999px', position: 'relative', border: 'none',
                          cursor: savingPref === key ? 'wait' : 'pointer',
                          opacity: prefsLoading ? 0.5 : 1,
                          transition: 'background 0.15s',
                        }}
                      >
                        <div style={{
                          position: 'absolute', top: '2px',
                          [prefs[key] ? 'right' : 'left']: '2px',
                          width: '14px', height: '14px',
                          background: '#fff', borderRadius: '9999px',
                          transition: 'left 0.15s, right 0.15s',
                        }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Partnership */}
              {active === 'partner' && (
                <div style={{
                  background: 'var(--color-white)',
                  border: 'var(--border-whisper)',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: 'var(--shadow-card)',
                }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px', color: 'var(--color-black-95)', margin: '0 0 4px' }}>Partnership</h2>
                  <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', margin: '0 0 24px' }}>
                    List your shop, brand, or studio on the public Partners page.
                  </p>

                  {/* Toggle row */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px', borderRadius: '10px',
                    background: isListed ? 'rgba(0,117,222,0.05)' : 'var(--color-warm-white)',
                    border: isListed ? '1px solid rgba(0,117,222,0.2)' : 'var(--border-whisper)',
                    marginBottom: '16px',
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-black-95)', marginBottom: '2px' }}>
                        List me as a FadeJunkie partner
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>
                        {isListed ? 'You\'re visible on the Partners page.' : 'Your name and avatar will appear on the Partners page.'}
                      </div>
                    </div>
                    <button
                      onClick={togglePartner}
                      disabled={partnerSaving || partnerProfile === undefined}
                      aria-label="Toggle partner listing"
                      style={{
                        width: '44px', height: '24px', flexShrink: 0,
                        background: isListed ? 'var(--color-blue)' : 'rgba(0,0,0,0.15)',
                        borderRadius: '9999px', border: 'none', cursor: partnerSaving ? 'wait' : 'pointer',
                        position: 'relative', transition: 'background 0.2s',
                        opacity: partnerProfile === undefined ? 0.5 : 1,
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: '3px',
                        left: isListed ? '23px' : '3px',
                        width: '18px', height: '18px',
                        background: '#fff', borderRadius: '9999px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                      }} />
                    </button>
                  </div>

                  {/* Status chip */}
                  {isListed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '9999px', background: '#2e8b57', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.6)' }}>
                        Listed — visible on <Link to="/partners" style={{ color: 'var(--color-blue)', textDecoration: 'none', fontWeight: 600 }}>fadejunkie.com/partners</Link>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Data & privacy */}
              {active === 'data' && (
                <div style={{
                  background: 'var(--color-white)',
                  border: 'var(--border-whisper)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                }}>
                  <div style={{ padding: '20px 24px', borderBottom: 'var(--border-whisper)' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px', color: 'var(--color-black-95)', margin: 0 }}>Data & privacy</h2>
                  </div>

                  {/* Export study data */}
                  <div
                    onClick={handleExport}
                    style={{
                      padding: '14px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: 'none',
                      cursor: exportData ? 'pointer' : 'wait',
                      opacity: exportData ? 1 : 0.6,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-warm-white)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-black-95)' }}>Export study data</div>
                      <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', marginTop: '2px' }}>
                        {exportData ? 'Download CSV' : 'Loading…'}
                      </div>
                    </div>
                    <span style={{ color: 'rgba(0,0,0,0.38)', fontSize: '14px' }}>→</span>
                  </div>

                  {/* Reset progress */}
                  <div
                    onClick={handleReset}
                    style={{
                      padding: '14px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: 'var(--border-whisper)',
                      cursor: resetting ? 'wait' : 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-warm-white)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-black-95)' }}>Reset progress</div>
                      <div style={{ fontSize: '11px', color: resetDone ? '#2e8b57' : 'rgba(0,0,0,0.38)', marginTop: '2px' }}>
                        {resetting ? 'Clearing…' : resetDone ? 'Progress cleared' : 'Clear all answers'}
                      </div>
                    </div>
                    <span style={{ color: 'rgba(0,0,0,0.38)', fontSize: '14px' }}>→</span>
                  </div>

                  {/* Delete account */}
                  <div style={{ padding: '14px 24px', borderTop: 'var(--border-whisper)' }}>
                    {!showDeleteConfirm ? (
                      <div
                        onClick={() => setShowDeleteConfirm(true)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          margin: '-14px -24px',
                          padding: '14px 24px',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-warm-white)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: '#c4492a' }}>Delete account</div>
                          <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', marginTop: '2px' }}>Permanent</div>
                        </div>
                        <span style={{ color: 'rgba(0,0,0,0.38)', fontSize: '14px' }}>→</span>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#c4492a', marginBottom: '4px' }}>Delete account</div>
                        <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', marginBottom: '12px' }}>
                          This permanently deletes your quiz history, starred cards, preferences, and partner listing. Your sign-in itself isn't affected — you can create a fresh account by signing in again. This can't be undone.
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', marginBottom: '6px' }}>
                          Type <strong>DELETE</strong> to confirm:
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            autoFocus
                            value={deleteConfirmText}
                            onChange={e => setDeleteConfirmText(e.target.value)}
                            placeholder="DELETE"
                            style={{
                              flex: 1, fontSize: '13px', padding: '7px 10px',
                              border: '1px solid rgba(196,73,42,0.4)', borderRadius: '6px',
                              outline: 'none',
                            }}
                          />
                          <button
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirmText !== 'DELETE' || deleting}
                            style={{
                              padding: '7px 14px', fontSize: '12px', fontWeight: 600,
                              borderRadius: '6px', border: 'none', color: '#fff',
                              background: deleteConfirmText === 'DELETE' ? '#c4492a' : 'rgba(196,73,42,0.35)',
                              cursor: deleteConfirmText === 'DELETE' && !deleting ? 'pointer' : 'not-allowed',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {deleting ? 'Deleting…' : 'Delete permanently'}
                          </button>
                          <button
                            onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }}
                            disabled={deleting}
                            style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mobile section switcher */}
              <div style={{ marginTop: '24px' }} className="show-mobile">
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {([
                    ['profile', 'Profile'],
                    ['study', 'Study'],
                    ['partner', 'Partnership'],
                    ['data', 'Data'],
                  ] as [Section, string][]).map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setActive(id)}
                      style={{
                        padding: '6px 14px', fontSize: '12px', fontWeight: 500,
                        borderRadius: '9999px', border: 'var(--border-whisper)',
                        background: active === id ? 'var(--color-blue)' : 'var(--color-white)',
                        color: active === id ? '#fff' : 'rgba(0,0,0,0.6)',
                        cursor: 'pointer',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign out */}
              <div style={{ marginTop: '24px' }}>
                <button
                  onClick={() => signOut()}
                  className="fj-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' as const }}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </section>
      </SignedIn>

      <style>{`
        @media (min-width: 641px) {
          .settings-main { grid-column: span 1; }
        }
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 641px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}
