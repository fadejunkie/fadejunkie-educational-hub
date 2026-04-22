import { Link } from 'react-router-dom'
import { useState } from 'react'

const ROLES_LIVE = [
  { name: 'Student', status: 'Active Now', active: true, pct: 85,
    updates: ['300 TX board questions live', 'Group Mode entering beta', 'Flashcards v2 shipping next week'] },
  { name: 'School', status: 'Partnering', active: false, pct: 45,
    updates: ['2 Austin schools in pilot', 'Cohort dashboards in design', 'Bulk license pricing drafted'] },
  { name: 'Barber', status: 'Phase 2 · Soon', active: false, pct: 25,
    updates: ['Client-book discovery interviews', 'Pricing card prototype', 'Waitlist opened — 412 signups'] },
  { name: 'Shop', status: 'Phase 3 · Soon', active: false, pct: 10,
    updates: ['Mood-boarding drops with 2 brands', 'Supply-partner convos started', 'Shop-only merch samples ordered'] },
]

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
  const [hover, setHover] = useState<number | null>(null)
  const [pinned, setPinned] = useState<number | null>(null)
  const [mobileRoleOpen, setMobileRoleOpen] = useState<number | null>(null)
  const activeRole = pinned !== null ? pinned : hover

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
        .lander-roles-mobile { display: block; }
        .lander-roles-desktop { display: none; }

        @media (min-width: 768px) {
          .lander-mobile-only { display: none !important; }
          .lander-desktop-only { display: block !important; }
          .lander-mobile-flex { display: none !important; }
          .lander-desktop-flex { display: flex !important; }
          .lander-tool-list { display: none !important; }
          .lander-tool-cards { display: grid !important; }
          .lander-roles-mobile { display: none !important; }
          .lander-roles-desktop { display: flex !important; }
        }
      `}</style>

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

      {/* ── § 02 — Roles ────────────────────────────────────────────────── */}
      <section style={{ padding: '64px 24px', background: 'var(--color-white)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px', fontSize: '12px', color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase' as const, letterSpacing: '0.12em' }}>
            § 02 — Roles
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'stretch' }}>

            {/* Mobile — accordion */}
            <div className="lander-roles-mobile" style={{
              display: 'grid', gap: '1px',
              background: 'rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.1)',
            }}>
              {ROLES_LIVE.map((r, i) => {
                const isOpen = mobileRoleOpen === i
                return (
                  <div key={r.name} style={{ background: '#fff' }}>
                    <button
                      onClick={() => setMobileRoleOpen(isOpen ? null : i)}
                      style={{
                        width: '100%', textAlign: 'left', border: 'none',
                        background: 'transparent', padding: '16px 18px 14px',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.6px', color: 'var(--color-black-95)' }}>{r.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            fontSize: '10px', textTransform: 'uppercase' as const,
                            letterSpacing: '0.08em', fontWeight: 600,
                            color: r.active ? 'var(--color-blue)' : 'rgba(0,0,0,0.38)',
                          }}>{r.status}</div>
                          <span style={{ fontSize: '16px', color: 'rgba(0,0,0,0.4)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div style={{ height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${r.pct}%`, background: 'var(--color-black-95)', borderRadius: '2px' }} />
                      </div>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '4px 18px 18px', borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', paddingTop: '12px' }}>
                          <span style={{
                            width: '6px', height: '6px', borderRadius: '999px',
                            background: 'var(--color-blue)',
                            boxShadow: '0 0 0 3px rgba(0,117,222,0.2)',
                            flexShrink: 0,
                          }} />
                          <span style={{
                            fontSize: '10px', textTransform: 'uppercase' as const,
                            letterSpacing: '0.08em', fontWeight: 700, color: 'rgba(0,0,0,0.4)',
                          }}>Live List · last 3 updates</span>
                        </div>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {r.updates.map((u, j) => (
                            <div key={j} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: '8px', fontSize: '13px', lineHeight: 1.4 }}>
                              <span style={{ color: 'rgba(0,0,0,0.35)', fontFamily: 'ui-monospace, monospace', fontSize: '11px' }}>0{j + 1}</span>
                              <span style={{ color: 'rgba(0,0,0,0.75)' }}>{u}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Desktop — live card left + quadrant right */}
            <div className="lander-roles-desktop" style={{ display: 'flex', gap: '24px', alignItems: 'stretch', flex: 1 }}>

              {/* Live List panel — always visible, shows hovered role or defaults to Student */}
              {(() => {
                const idx = activeRole !== null ? activeRole : 0
                const r = ROLES_LIVE[idx]
                return (
                  <div style={{
                    width: '300px', flexShrink: 0,
                    background: 'var(--color-black-95)', color: '#fff',
                    borderRadius: '10px', padding: '22px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.6px' }}>{r.name}</div>
                        <div style={{
                          fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                          color: r.active ? 'var(--color-blue)' : 'rgba(255,255,255,0.5)',
                        }}>{r.status}</div>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${r.pct}%`, background: '#fff', borderRadius: '2px', transition: 'width 0.3s ease' }} />
                      </div>
                      <div style={{ height: '18px' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        <span style={{
                          width: '6px', height: '6px', borderRadius: '999px',
                          background: 'var(--color-blue)',
                          boxShadow: '0 0 0 3px rgba(0,117,222,0.25)', flexShrink: 0,
                        }} />
                        <span style={{ fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.08em', fontWeight: 700, color: 'rgba(255,255,255,0.45)' }}>
                          Live List · last 3 updates
                        </span>
                      </div>
                      <div style={{ display: 'grid', gap: '10px' }}>
                        {r.updates.map((u, j) => (
                          <div key={j} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: '8px', fontSize: '13px', lineHeight: 1.4 }}>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'ui-monospace, monospace', fontSize: '11px' }}>0{j + 1}</span>
                            <span style={{ color: 'rgba(255,255,255,0.88)' }}>{u}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginTop: '18px', fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                      Hover a role to explore
                    </div>
                  </div>
                )
              })()}

              {/* 2×2 Quadrant */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1px', background: 'rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.1)',
                  height: '100%',
                }}>
                  {ROLES_LIVE.map((r, i) => {
                    const isOn = activeRole === i
                    return (
                      <div
                        key={r.name}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => setPinned(pinned === i ? null : i)}
                        style={{
                          background: isOn ? 'var(--color-warm-white)' : '#fff',
                          padding: '24px 22px', cursor: 'pointer',
                          outline: isOn ? '2px solid var(--color-black-95)' : 'none',
                          outlineOffset: '-2px',
                          zIndex: isOn ? 2 : 1,
                          transition: 'background 0.1s',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                          <div style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 700, letterSpacing: '-0.8px', color: 'var(--color-black-95)' }}>
                            {r.name}
                          </div>
                          <div style={{
                            fontSize: '10px', textTransform: 'uppercase' as const,
                            letterSpacing: '0.08em', fontWeight: 600,
                            color: r.active ? 'var(--color-blue)' : 'rgba(0,0,0,0.38)',
                          }}>
                            {r.status}
                          </div>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${r.pct}%`, background: 'var(--color-black-95)', borderRadius: '2px' }} />
                        </div>
                        <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(0,0,0,0.38)' }}>
                          <span>{r.pct}% ready</span>
                          <span>{isOn ? (pinned === i ? 'Pinned ·' : '') + ' Hover for updates' : 'Hover for updates'}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
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
