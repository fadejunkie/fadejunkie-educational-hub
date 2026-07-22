import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { routeMeta } from '../data/routeMeta.mjs'

const TOOLS = [
  {
    icon: '/content/flashcard-icon.png',
    title: 'Flashcards',
    sub: '300 cards across 13 topics. Star, filter, drill.',
    href: '/education/flash',
    soon: null,
  },
  {
    icon: '/content/quiz-icon.png',
    title: 'Practice Quiz',
    sub: 'Timed. 20 · 50 · 100. See weak topics after.',
    href: '/education/quiz',
    soon: null,
  },
  {
    icon: '/content/group-study-icon.png',
    title: 'Group Mode',
    sub: 'Live 6-char room with your class.',
    href: null,
    soon: 'Coming Soon',
  },
]

// V3 — editorial / zine homepage. Desktop: "BUILT BY BARBERS." Mobile: "BUILT IN THE SHOP."
export default function Lander() {
  return (
    <>
      <style>{`
        /* ── Responsive show/hide ── */
        .lander-mobile-only { display: block; }
        .lander-desktop-only { display: none; }
        .lander-mobile-flex { display: flex; }
        .lander-desktop-flex { display: none; }
        .lander-tool-list { display: grid; }
        .lander-tool-cards { display: none !important; }

        @media (min-width: 768px) {
          .lander-mobile-only { display: none !important; }
          .lander-desktop-only { display: block !important; }
          .lander-mobile-flex { display: none !important; }
          .lander-desktop-flex { display: flex !important; }
          .lander-tool-list { display: none !important; }
          .lander-tool-cards { display: grid !important; }
        }
      `}</style>

      <PageMeta {...routeMeta['/']} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '48px 24px 40px', background: 'var(--color-warm-white)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Headline — full width */}
          <h1 style={{
            fontSize: 'clamp(60px, 11vw, 140px)',
            fontWeight: 700,
            letterSpacing: '-4px',
            lineHeight: 0.9,
            color: 'var(--color-black-95)',
            margin: '0 0 28px',
            textTransform: 'uppercase' as const,
          }}>
            BUILT BY<br />BARBERS.
          </h1>

          {/* Rule */}
          <div style={{ height: '1px', background: 'rgba(0,0,0,0.15)', marginBottom: '28px' }} />

          {/* Bottom row — text left, buttons right */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            flexWrap: 'wrap' as const,
          }}>
            <p style={{ fontSize: '15px', color: 'var(--color-black-95)', margin: 0, lineHeight: 1.55, maxWidth: '480px' }}>
              Creating a{' '}
              <span style={{ color: 'var(--color-blue)' }}>platform curated specifically for barbers.</span>
              {' '}Whether learning or teaching, we've got something for you.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexShrink: 0, flexWrap: 'wrap' as const }}>
              <Link to="/education" className="fj-btn-primary" style={{ fontSize: '0.9375rem' }}>
                Education Hub →
              </Link>
              <Link to="/partners" className="fj-btn-secondary" style={{ fontSize: '0.9375rem' }}>
                About →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── § 01 — The Tool (dark) ───────────────────────────────────────── */}
      <section style={{ padding: '64px 24px', background: 'var(--color-warm-dark)', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            fontSize: '12px', color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase' as const, letterSpacing: '0.12em', marginBottom: '16px',
          }}>
            § 01 — The Tool
          </div>

          {/* Mobile headline */}
          <h2 className="lander-mobile-only" style={{
            fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: 700,
            letterSpacing: '-0.8px', lineHeight: 1.1, color: '#fff', margin: '0 0 28px',
          }}>
            Pass your state board. For free.
          </h2>
          {/* Desktop headline */}
          <h2 className="lander-desktop-only" style={{
            fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700,
            letterSpacing: '-1.2px', lineHeight: 1.05, color: '#fff',
            margin: '0 0 36px', maxWidth: '720px',
          }}>
            Three ways to study. Pick what fits the 20 minutes you have.
          </h2>

          {/* Mobile — numbered list */}
          <div className="lander-tool-list" style={{ gap: 0 }}>
            {TOOLS.map((t, i) => (
              <div key={t.title} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.12)',
                opacity: t.soon ? 0.5 : 1,
              }}>
                <span style={{
                  fontSize: '11px', color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'ui-monospace, monospace', width: '24px', flexShrink: 0,
                }}>0{i + 1}</span>
                <img src={t.icon} alt={t.title} style={{ width: '28px', height: '28px', objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
                <span style={{ fontSize: '18px', fontWeight: 600, flex: 1, color: '#fff' }}>{t.title}</span>
                {t.href
                  ? <Link to={t.href} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '18px' }}>→</Link>
                  : <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px' }}>→</span>
                }
              </div>
            ))}
          </div>

          {/* Desktop — 3-col cards */}
          <div className="lander-tool-cards" style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}>
            {TOOLS.map((t) => (
              <div key={t.title} style={{
                position: 'relative', minHeight: '200px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px', padding: '24px',
              }}>
                {t.soon && (
                  <span style={{
                    position: 'absolute', top: '14px', right: '14px',
                    fontSize: '10px', textTransform: 'uppercase' as const,
                    color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em',
                  }}>{t.soon}</span>
                )}
                {/* Icon */}
                <img src={t.icon} alt={t.title} style={{ width: '40px', height: '40px', objectFit: 'contain', marginBottom: '18px', mixBlendMode: 'screen' }} />
                <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px', color: '#fff' }}>{t.title}</div>
                <div style={{ height: '8px' }} />
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{t.sub}</div>
                <div style={{ height: '20px' }} />
                {t.href ? (
                  <Link to={t.href} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' as const,
                    letterSpacing: '0.08em', color: '#fff',
                    borderBottom: '1px solid #fff', paddingBottom: '2px',
                    textDecoration: 'none',
                  }}>Open →</Link>
                ) : (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' as const,
                    letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)',
                  }}>Notify me</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── § 02 — What's Next ──────────────────────────────────────────── */}
      <section style={{ padding: '64px 24px', background: 'var(--color-white)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' as const }}>
          <div style={{ marginBottom: '20px', fontSize: '12px', color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase' as const, letterSpacing: '0.12em' }}>
            § 02 — What's Next
          </div>
          <h2 style={{
            fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700,
            letterSpacing: '-1px', lineHeight: 1.1, color: 'var(--color-black-95)',
            margin: '0 auto 16px', maxWidth: '640px',
          }}>
            Schools. Barbers. Shops. The roadmap keeps growing.
          </h2>
          <p style={{
            fontSize: '15px', color: 'rgba(0,0,0,0.6)', margin: '0 auto 28px',
            lineHeight: 1.6, maxWidth: '480px',
          }}>
            See what's built, what's in progress, and where FadeJunkie is headed next.
          </p>
          <Link to="/growth" className="fj-btn-primary" style={{ fontSize: '0.9375rem' }}>
            Read More →
          </Link>
        </div>
      </section>

      {/* ── § 03 — Partners (dark) ───────────────────────────────────────── */}
      <section style={{ padding: '0', background: 'var(--color-warm-dark)', color: '#fff' }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          minHeight: '180px', padding: '40px 24px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', gap: '20px',
        }}>
          <div>
            <h2 style={{
              fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700,
              letterSpacing: '-1px', color: '#fff', margin: '0 0 8px',
            }}>
              Schools. Shops. Brands.
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              Let's work together.
            </p>
          </div>
          <a
            href="mailto:partners@fadejunkie.com"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '10px 20px', fontSize: '14px', fontWeight: 600, borderRadius: '4px',
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.6)',
              textDecoration: 'none', whiteSpace: 'nowrap' as const,
            }}
          >
            partners@fadejunkie.com
          </a>
        </div>
      </section>
    </>
  )
}
