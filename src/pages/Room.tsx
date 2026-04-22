import { Link } from 'react-router-dom'
import { ArrowLeft, Users, Hash, Lock } from 'lucide-react'

export default function Room() {
  return (
    <section style={{ padding: '48px 24px 80px', minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        <Link
          to="/education"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.875rem', fontWeight: 500,
            color: 'var(--color-warm-500)', textDecoration: 'none',
            marginBottom: '32px',
          }}
        >
          <ArrowLeft size={15} /> Education Hub
        </Link>

        <span className="fj-badge" style={{ marginBottom: '16px', display: 'inline-flex' }}>Group Mode</span>
        <h1 style={{
          fontSize: '2rem', fontWeight: 700, color: 'var(--color-black-95)',
          margin: '0 0 12px', letterSpacing: '-0.75px',
        }}>
          Study with your class.
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-warm-500)', margin: '0 0 40px', lineHeight: 1.6 }}>
          Host a live quiz, share a room code, and compete in real time.
          Built for barber school cohorts.
        </p>

        {/* Cards — locked */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          {/* Create Room */}
          <div style={{
            padding: '28px 24px',
            borderRadius: 'var(--radius-xl)',
            border: '1px dashed rgba(0,0,0,0.15)',
            background: 'rgba(0,0,0,0.015)',
            opacity: 0.55,
            position: 'relative',
          }}>
            <Lock size={14} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--color-warm-300)' }} />
            <div style={{
              width: '44px', height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
              color: 'var(--color-warm-300)',
            }}>
              <Users size={22} strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-black-95)', margin: '0 0 6px' }}>
              Create Room
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-warm-500)', lineHeight: 1.5, margin: 0 }}>
              Host a live session. Share a 6-character code with your class.
            </p>
          </div>

          {/* Join Room */}
          <div style={{
            padding: '28px 24px',
            borderRadius: 'var(--radius-xl)',
            border: '1px dashed rgba(0,0,0,0.15)',
            background: 'rgba(0,0,0,0.015)',
            opacity: 0.55,
            position: 'relative',
          }}>
            <Lock size={14} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--color-warm-300)' }} />
            <div style={{
              width: '44px', height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
              color: 'var(--color-warm-300)',
            }}>
              <Hash size={22} strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-black-95)', margin: '0 0 6px' }}>
              Join Room
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-warm-500)', lineHeight: 1.5, margin: 0 }}>
              Enter a room code to jump into a session your instructor started.
            </p>
          </div>
        </div>

        {/* Coming soon banner */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          background: 'var(--color-badge-bg)',
          border: '1px solid rgba(0,117,222,0.18)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 22px',
        }}>
          <div style={{
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: 'var(--color-blue)',
            flexShrink: 0,
            marginTop: '6px',
          }} />
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-black-95)', margin: '0 0 4px' }}>
              Coming in Phase 2
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-500)', lineHeight: 1.6, margin: 0 }}>
              Group Mode is powered by Convex real-time subscriptions. Rooms, live scoreboards,
              and PIN-based joins are all designed — just needs the backend wired up.
              In the meantime, use Flashcards or Solo Quiz.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
