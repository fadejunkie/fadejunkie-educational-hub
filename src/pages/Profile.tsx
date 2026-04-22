import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, useUser, SignInButton } from '@clerk/clerk-react'

const MOCK_STATS = [
  { value: '421', label: 'Questions seen' },
  { value: '328', label: 'Correct' },
  { value: '78%', label: 'Accuracy' },
  { value: '12',  label: 'Sessions' },
]

const MOCK_ACTIVITY = [
  { date: '2d ago', score: '38/50', topic: 'Sanitation + Tools' },
  { date: '5d ago', score: '44/50', topic: 'Mixed' },
  { date: '1w ago', score: '17/20', topic: 'Anatomy' },
]

const MOCK_MASTERY = [
  { topic: 'Sanitation', pct: 88 },
  { topic: 'Anatomy', pct: 75 },
  { topic: 'Tools', pct: 70 },
  { topic: 'History', pct: 68 },
  { topic: 'Diseases', pct: 55 },
  { topic: 'Microbiology', pct: 42 },
]

export default function Profile() {
  const { user } = useUser()

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
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-black-95)' }}>12 starred cards</div>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {MOCK_STATS.map(stat => (
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
              </div>
            </div>
          </div>
        </section>

        {/* ── Recent activity ─────────────────────────────────────────────── */}
        <section style={{ padding: '32px 24px', background: 'var(--color-white)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '40px',
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                  Recent activity
                </div>
                {MOCK_ACTIVITY.map(item => (
                  <div key={item.date} style={{
                    padding: '12px 0',
                    borderTop: 'var(--border-whisper)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-black-95)' }}>{item.score}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', marginTop: '1px' }}>{item.topic}</div>
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)' }}>{item.date}</div>
                  </div>
                ))}
              </div>

              {/* Topic mastery */}
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                  Topic mastery
                </div>
                {MOCK_MASTERY.map(item => (
                  <div key={item.topic} style={{ padding: '8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--color-black-95)' }}>{item.topic}</span>
                      <span style={{
                        fontVariantNumeric: 'tabular-nums',
                        color: item.pct < 60 ? '#c4492a' : 'rgba(0,0,0,0.6)',
                        fontWeight: 500,
                      }}>
                        {item.pct}%
                      </span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${item.pct}%`,
                        background: item.pct < 60 ? '#c4492a' : 'var(--color-blue)',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </SignedIn>
    </>
  )
}
