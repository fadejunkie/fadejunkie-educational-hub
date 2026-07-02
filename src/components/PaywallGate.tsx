import { SignInButton } from '@clerk/clerk-react'
import { useEduAccess } from '../hooks/useEduAccess'

/**
 * Gates tool pages (/flash, /quiz, /practical) for non-signed-in users.
 *
 * - Guest (not signed in)  → sign-in gate: "create a free account to access"
 * - Signed in (any tier)   → renders children (the tool handles freemium restrictions itself)
 *
 * The $15 lifetime upgrade prompt lives on /education hub, not on tool pages.
 */

function SignInGate() {
  return (
    <section style={{
      padding: '80px 24px',
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(0,117,222,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: 24,
        }}>
          📚
        </div>
        <h2 style={{
          fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 700,
          letterSpacing: '-0.6px', color: 'var(--color-black-95)',
          margin: '0 0 12px',
        }}>
          Sign in to start studying.
        </h2>
        <p style={{
          fontSize: 15, color: 'rgba(0,0,0,0.55)',
          margin: '0 0 28px', lineHeight: 1.55,
        }}>
          Free accounts get access to flashcards, quizzes, and the practical guide.
          Upgrade to $15 lifetime for full access.
        </p>
        <SignInButton mode="modal">
          <button style={{
            width: '100%', padding: '13px 0',
            fontSize: 15, fontWeight: 700,
            background: 'var(--color-black-95)', color: '#fff',
            border: 'none', borderRadius: 8, cursor: 'pointer',
            letterSpacing: '-0.2px',
          }}>
            Create free account →
          </button>
        </SignInButton>
        <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', marginTop: 14 }}>
          Already have an account?{' '}
          <SignInButton mode="modal">
            <span style={{ color: 'var(--color-blue)', cursor: 'pointer', textDecoration: 'underline' }}>
              Sign in
            </span>
          </SignInButton>
        </p>
      </div>
    </section>
  )
}

export default function PaywallGate({ children }: { children: React.ReactNode }) {
  const { loading, isSignedIn } = useEduAccess()

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

  if (!isSignedIn) {
    return <SignInGate />
  }

  return <>{children}</>
}
