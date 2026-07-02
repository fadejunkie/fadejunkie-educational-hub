import { SignInButton } from '@clerk/clerk-react'
import { useEduAccess } from '../hooks/useEduAccess'

// Set VITE_LIFETIME_PASS_URL in .env.local to your Stripe Payment Link
const PASS_URL = import.meta.env.VITE_LIFETIME_PASS_URL as string | undefined

const FEATURES = [
  '300 Texas state board flashcards',
  'Practice quiz — 20 · 50 · 100 · 150 questions',
  '11-section Practical Exam Guide',
  'Progress tracking across all sessions',
  'Weak topic recommendations',
  'All topics unlocked (no filters blocked)',
]

function Paywall({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section style={{ padding: '64px 24px', minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 440, width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <span style={{
            display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--color-blue)',
            background: 'rgba(0,117,222,0.08)', borderRadius: 4, padding: '3px 8px', marginBottom: 16,
          }}>
            Lifetime Access Pass
          </span>
          <h1 style={{
            fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 700,
            letterSpacing: '-1px', lineHeight: 1.05,
            color: 'var(--color-black-95)', margin: '0 0 12px',
          }}>
            One payment.<br />Study forever.
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(0,0,0,0.55)', margin: 0, lineHeight: 1.55 }}>
            Get full access to every study tool — no monthly fees, no expiry.
          </p>
        </div>

        {/* Price card */}
        <div style={{
          background: 'var(--color-white)', border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 12, overflow: 'hidden', marginBottom: 20,
        }}>
          {/* Price row */}
          <div style={{
            padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.07)',
            display: 'flex', alignItems: 'baseline', gap: 6,
          }}>
            <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-1.5px', color: 'var(--color-black-95)' }}>$15</span>
            <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.45)' }}>one-time · lifetime access</span>
          </div>

          {/* Feature list */}
          <div style={{ padding: '16px 24px', display: 'grid', gap: 10 }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(0,0,0,0.75)' }}>
                <span style={{ color: '#2e8b57', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {isSignedIn ? (
          PASS_URL ? (
            <a
              href={PASS_URL}
              style={{
                display: 'block', textAlign: 'center', padding: '14px 0', fontSize: 15,
                fontWeight: 700, background: 'var(--color-black-95)', color: '#fff',
                borderRadius: 8, textDecoration: 'none', letterSpacing: '-0.2px',
              }}
            >
              Get Lifetime Access · $15 →
            </a>
          ) : (
            <div style={{
              padding: '14px 0', textAlign: 'center', fontSize: 14,
              color: 'rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.04)',
              borderRadius: 8, border: '1px dashed rgba(0,0,0,0.15)',
            }}>
              Payment link coming soon — email{' '}
              <a href="mailto:hello@fadejunkie.com" style={{ color: 'var(--color-blue)', textDecoration: 'none' }}>
                hello@fadejunkie.com
              </a>
            </div>
          )
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SignInButton mode="modal">
              <button style={{
                width: '100%', padding: '14px 0', fontSize: 15, fontWeight: 700,
                background: 'var(--color-black-95)', color: '#fff',
                border: 'none', borderRadius: 8, cursor: 'pointer', letterSpacing: '-0.2px',
              }}>
                Create free account →
              </button>
            </SignInButton>
            <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', textAlign: 'center', margin: 0 }}>
              Sign in first, then purchase the $15 lifetime pass.
            </p>
          </div>
        )}

        {/* Fine print */}
        <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          Account creation is always free. The $15 pass unlocks all study tools permanently.
        </p>
      </div>
    </section>
  )
}

/**
 * Wraps any edu hub page. Shows a paywall if the user doesn't have a lifetime pass.
 * Pass holders (and admins who've been granted access) see the real content.
 */
export default function PaywallGate({ children }: { children: React.ReactNode }) {
  const { hasAccess, loading, isSignedIn } = useEduAccess()

  if (loading) {
    return (
      <section style={{ padding: '80px 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--color-blue)', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </section>
    )
  }

  if (!hasAccess) {
    return <Paywall isSignedIn={isSignedIn} />
  }

  return <>{children}</>
}
