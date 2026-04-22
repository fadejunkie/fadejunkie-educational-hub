import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, useUser, useClerk, SignInButton } from '@clerk/clerk-react'

type Section = 'profile' | 'study' | 'data'

const STUDY_PREFS = [
  { label: 'Default quiz length', value: '50 questions', isToggle: false },
  { label: 'Show answer explanations', value: 'On', isToggle: true },
  { label: 'Daily reminder', value: 'Off', isToggle: true },
  { label: 'Auto-star missed questions', value: 'On', isToggle: true },
]

const DATA_ACTIONS = [
  { label: 'Export study data', sub: 'Download CSV', danger: false },
  { label: 'Reset progress', sub: 'Clear all answers', danger: false },
  { label: 'Delete account', sub: 'Permanent', danger: true },
]

export default function AccountSettings() {
  const [active, setActive] = useState<Section>('profile')
  const { user } = useUser()
  const { signOut } = useClerk()

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

                  {/* Fields */}
                  {[
                    ['Display name', user?.firstName ?? 'Not set'],
                    ['Email', user?.primaryEmailAddress?.emailAddress ?? 'Not set'],
                    ['School', 'Not set'],
                    ['Cohort', 'Not set'],
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
                      <span style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ color: value === 'Not set' ? 'rgba(0,0,0,0.38)' : 'var(--color-black-95)' }}>{value}</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-blue)', cursor: 'pointer' }}>Edit</span>
                      </span>
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
                  {STUDY_PREFS.map((pref, i) => (
                    <div key={pref.label} style={{
                      padding: '14px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: i === 0 ? 'none' : 'var(--border-whisper)',
                      fontSize: '13px',
                    }}>
                      <span style={{ color: 'var(--color-black-95)' }}>{pref.label}</span>
                      <span style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'rgba(0,0,0,0.6)', fontSize: '12px' }}>
                        {pref.value}
                        {pref.isToggle && (
                          <div style={{
                            width: '34px', height: '18px',
                            background: pref.value === 'On' ? 'var(--color-blue)' : 'rgba(0,0,0,0.12)',
                            borderRadius: '9999px', position: 'relative', cursor: 'pointer',
                          }}>
                            <div style={{
                              position: 'absolute', top: '2px',
                              [pref.value === 'On' ? 'right' : 'left']: '2px',
                              width: '14px', height: '14px',
                              background: '#fff', borderRadius: '9999px',
                              transition: 'left 0.15s, right 0.15s',
                            }} />
                          </div>
                        )}
                      </span>
                    </div>
                  ))}
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
                  {DATA_ACTIONS.map((action, i) => (
                    <div key={action.label} style={{
                      padding: '14px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: i === 0 ? 'none' : 'var(--border-whisper)',
                      cursor: 'pointer',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-warm-white)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: action.danger ? '#c4492a' : 'var(--color-black-95)' }}>
                          {action.label}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', marginTop: '2px' }}>{action.sub}</div>
                      </div>
                      <span style={{ color: 'rgba(0,0,0,0.38)', fontSize: '14px' }}>→</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile section switcher */}
              <div style={{ marginTop: '24px' }} className="show-mobile">
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {([
                    ['profile', 'Profile'],
                    ['study', 'Study'],
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
