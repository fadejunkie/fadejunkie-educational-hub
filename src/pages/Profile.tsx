import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, useUser, SignInButton } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useEduAccess } from '../hooks/useEduAccess'

const PASS_URL = import.meta.env.VITE_LIFETIME_PASS_URL as string | undefined

function elapsed(ms: number): string {
  const diff = Date.now() - ms
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (d >= 1) return `${d}d ago`
  if (h >= 1) return `${h}h ago`
  return `${m}m ago`
}

function LockedSection({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const checkoutUrl = PASS_URL && user?.id
    ? `${PASS_URL}?client_reference_id=${encodeURIComponent(user.id)}`
    : undefined

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' }}>
        {children}
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: 24, textAlign: 'center',
        background: 'rgba(255,255,255,0.6)', borderRadius: 10,
      }}>
        <div style={{ fontSize: 20 }}>🔒</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-black-95)' }}>
          Unlock your full profile
        </div>
        <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.55)', maxWidth: 240, lineHeight: 1.4 }}>
          See your real stats, activity, and topic mastery with lifetime access.
        </div>
        {checkoutUrl ? (
          <a href={checkoutUrl} className="fj-btn-primary" style={{ fontSize: 12, padding: '7px 14px', textDecoration: 'none', marginTop: 4 }}>
            Unlock — $15 lifetime
          </a>
        ) : (
          <Link to="/education" className="fj-btn-primary" style={{ fontSize: 12, padding: '7px 14px', textDecoration: 'none', marginTop: 4 }}>
            Unlock — $15 lifetime
          </Link>
        )}
      </div>
    </div>
  )
}

function ProfileContent({ locked }: { locked: boolean }) {
  const { user } = useUser()
  const progress = useQuery(
    api.progress.getUserProgress,
    user ? {} : 'skip'
  )

  const stats = [
    { value: progress ? String(progress.totalSeen)    : '—', label: 'Questions seen' },
    { value: progress ? String(progress.correctTotal) : '—', label: 'Correct' },
    { value: progress ? `${progress.accuracy}%`       : '—', label: 'Accuracy' },
    { value: progress ? String(progress.sessions)     : '—', label: 'Sessions' },
  ]

  const starredCount = progress?.starred ?? null

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '32px 24px 24px', background: 'var(--color-white)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '40px',
            alignItems: 'start',
          }}>
            {/* Left — identity */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '9999px',
                  background: 'rgba(0,0,0,0.08)', border: 'var(--border-whisper)',
                  overflow: 'hidden', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-warm-500)' }}>
                      {user?.firstName?.[0] ?? '?'}
                    </span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-black-95)', letterSpacing: '-0.3px' }}>
                    {user?.fullName ?? user?.firstName ?? 'Barber Student'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.38)', marginTop: '2px' }}>
                    Member since 2026
                  </div>
                </div>
              </div>

              {/* Starred CTA */}
              <div style={{
                background: 'var(--color-white)',
                border: 'var(--border-whisper)',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: 'var(--shadow-card)',
              }}>
                <span style={{ fontSize: '18px' }}>★</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-black-95)' }}>
                    {starredCount !== null ? `${starredCount} starred card${starredCount !== 1 ? 's' : ''}` : '— starred cards'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', marginTop: '1px' }}>Jump into starred-only mode</div>
                </div>
                <Link to="/education/flash" className="fj-btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                  Drill
                </Link>
              </div>

              <div style={{ marginTop: '16px' }}>
                <Link
                  to="/account"
                  style={{ fontSize: '13px', color: 'var(--color-blue)', textDecoration: 'none' }}
                >
                  Account Settings →
                </Link>
              </div>
            </div>

            {/* Right — stats grid */}
            <div>
              {(() => {
                const grid = (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {stats.map(stat => (
                      <div key={stat.label} style={{
                        background: 'var(--color-warm-white)',
                        border: 'var(--border-whisper)',
                        borderRadius: '10px',
                        padding: '14px 16px',
                      }}>
                        <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--color-black-95)' }}>
                          {stat.value}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.6)', marginTop: '2px' }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )
                return locked ? <LockedSection>{grid}</LockedSection> : grid
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* ── Recent activity ─────────────────────────────────────────────── */}
      <section style={{ padding: '32px 24px', background: 'var(--color-white)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {(() => {
            const activity = (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '40px',
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Recent activity
              </div>
              {progress?.recentSessions && progress.recentSessions.length > 0 ? (
                progress.recentSessions.map((item, i) => (
                  <div key={i} style={{
                    padding: '12px 0',
                    borderTop: 'var(--border-whisper)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-black-95)' }}>
                        {item.score}/{item.total}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', marginTop: '1px' }}>{item.topic}</div>
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)' }}>{elapsed(item.completedAt)}</div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '13px', color: 'rgba(0,0,0,0.38)', paddingTop: '12px', borderTop: 'var(--border-whisper)' }}>
                  No sessions yet
                </div>
              )}
            </div>

            {/* Topic mastery */}
            <div>
              <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Topic mastery
              </div>
              {progress?.topicAccuracy && progress.topicAccuracy.length > 0 ? (
                [...progress.topicAccuracy]
                  .sort((a, b) => b.accuracy - a.accuracy)
                  .map(item => (
                    <div key={item.topic} style={{ padding: '8px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--color-black-95)' }}>{item.topic}</span>
                        <span style={{
                          fontVariantNumeric: 'tabular-nums',
                          color: item.accuracy < 60 ? '#c4492a' : 'rgba(0,0,0,0.6)',
                          fontWeight: 500,
                        }}>
                          {item.accuracy}%
                        </span>
                      </div>
                      <div style={{ height: '5px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${item.accuracy}%`,
                          background: item.accuracy < 60 ? '#c4492a' : 'var(--color-blue)',
                          borderRadius: '3px',
                          transition: 'width 0.3s ease',
                        }} />
                      </div>
                    </div>
                  ))
              ) : (
                <div style={{ fontSize: '13px', color: 'rgba(0,0,0,0.38)', paddingTop: '8px' }}>
                  Complete a quiz to see topic mastery
                </div>
              )}
            </div>
          </div>
            )
            return locked ? <LockedSection>{activity}</LockedSection> : activity
          })()}
        </div>
      </section>
    </>
  )
}

export default function Profile() {
  return (
    <>
      <SignedOut>
        <section style={{ padding: '80px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', color: 'var(--color-warm-500)', marginBottom: '24px' }}>
            Sign in to view your profile and study history.
          </p>
          <SignInButton mode="modal">
            <button className="fj-btn-primary">Sign in with Google</button>
          </SignInButton>
        </section>
      </SignedOut>

      <SignedIn>
        <ProfileGate />
      </SignedIn>
    </>
  )
}

function ProfileGate() {
  const { hasAccess, loading } = useEduAccess()

  if (loading) {
    return (
      <section style={{ padding: '80px 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '2px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--color-blue)',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </section>
    )
  }

  return <ProfileContent locked={!hasAccess} />
}
