import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'

// ── Mini embeds ────────────────────────────────────────────────────────────

const FLASH_PREVIEW = [
  {
    q: 'Most effective way to sanitize metal implements between clients?',
    a: 'An EPA-registered hospital disinfectant, minimum 10 minutes contact.',
  },
  {
    q: 'What is the definition of disinfection?',
    a: 'Destroying most organisms on non-living surfaces using an EPA-registered chemical.',
  },
  {
    q: 'Which implements must be discarded after a single use?',
    a: 'Single-use items such as razors, neck strips, and cotton rounds.',
  },
]

function MiniFlashcardEmbed({ onMin }: { onMin: () => void }) {
  const [flipped, setFlipped] = useState(false)
  const [idx, setIdx] = useState(0)
  const card = FLASH_PREVIEW[idx]
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: 14, marginTop: 8 }}>
      {/* Embed header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: 1, color: 'var(--color-blue)', fontWeight: 700 }}>Live preview</span>
          <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)' }}>· Sanitation</span>
        </div>
        <button
          onClick={onMin}
          aria-label="Minimize"
          style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, width: 24, height: 24, fontSize: 14, lineHeight: 1, color: 'rgba(0,0,0,0.5)', cursor: 'pointer', padding: 0 }}
        >
          –
        </button>
      </div>
      {/* Card */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '26px 16px',
          background: flipped ? '#f4f3f1' : '#fff', minHeight: 120,
          display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <div>
          <div style={{ fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: 1, color: 'rgba(0,0,0,0.38)' }}>
            {flipped ? 'Answer' : 'Question'} · tap to flip
          </div>
          <div style={{ height: 8 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-black-95)', lineHeight: 1.35 }}>
            {flipped ? card.a : card.q}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>
        <span>{idx + 1} / 3</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx(Math.max(0, idx - 1)); setFlipped(false) }}
            disabled={idx === 0}
            style={{ padding: '4px 10px', fontSize: 12, border: '1px solid rgba(0,0,0,0.15)', borderRadius: 6, background: '#fff', cursor: idx === 0 ? 'default' : 'pointer', color: idx === 0 ? 'rgba(0,0,0,0.25)' : 'var(--color-black-95)' }}
          >←</button>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx(Math.min(2, idx + 1)); setFlipped(false) }}
            disabled={idx === 2}
            style={{ padding: '4px 10px', fontSize: 12, border: '1px solid rgba(0,0,0,0.15)', borderRadius: 6, background: '#fff', cursor: idx === 2 ? 'default' : 'pointer', color: idx === 2 ? 'rgba(0,0,0,0.25)' : 'var(--color-black-95)' }}
          >→</button>
          <Link to="/education/flash" style={{ padding: '4px 10px', fontSize: 12, background: 'var(--color-blue)', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>
            Open full
          </Link>
        </div>
      </div>
    </div>
  )
}

const QUIZ_PREVIEW: { q: string; choices: [string, string][]; correct: string }[] = [
  {
    q: 'Which is the most effective method for sanitizing metal implements?',
    choices: [['A', 'Wiping with isopropyl alcohol'], ['B', 'EPA-registered hospital disinfectant, 10 min'], ['C', 'Soap and warm water'], ['D', 'UV light only']],
    correct: 'B',
  },
  {
    q: 'How long must metal implements soak in disinfectant?',
    choices: [['A', '2 minutes'], ['B', '5 minutes'], ['C', '10 minutes'], ['D', '30 minutes']],
    correct: 'C',
  },
  {
    q: 'What should you do with a single-use razor after use?',
    choices: [['A', 'Wash and reuse'], ['B', 'Soak in disinfectant'], ['C', 'Store in a UV cabinet'], ['D', 'Discard immediately']],
    correct: 'D',
  },
]

function MiniQuizEmbed({ onMin }: { onMin: () => void }) {
  const [step, setStep] = useState(0)           // 0-2 = questions, 3 = results
  const [picks, setPicks] = useState<string[]>([])

  const q = QUIZ_PREVIEW[step]
  const currentPick = picks[step] ?? null
  const revealed = currentPick !== null

  function pickAnswer(letter: string) {
    if (revealed) return
    const next = [...picks]
    next[step] = letter
    setPicks(next)
  }

  function advance() {
    if (step < 2) setStep(step + 1)
    else setStep(3)
  }

  const score = picks.filter((p, i) => p === QUIZ_PREVIEW[i].correct).length
  const pct = Math.round((score / 3) * 100)

  // Results card
  if (step === 3) {
    return (
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: 14, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: 1, color: 'var(--color-blue)', fontWeight: 700 }}>Mini quiz</span>
            <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)' }}>· Sanitation</span>
          </div>
          <button onClick={onMin} aria-label="Minimize" style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, width: 24, height: 24, fontSize: 14, lineHeight: 1, color: 'rgba(0,0,0,0.5)', cursor: 'pointer', padding: 0 }}>–</button>
        </div>
        <div style={{ textAlign: 'center', padding: '20px 0 24px' }}>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', color: score >= 2 ? '#2e8b57' : '#c4492a' }}>
            {score} / 3
          </div>
          <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)', marginTop: 4 }}>{pct}% · Sanitation preview</div>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.38)', marginTop: 8 }}>
            {score === 3 ? 'Perfect! You nailed it.' : score === 2 ? 'Almost there — one more push.' : 'Keep drilling — you\'ve got this.'}
          </div>
        </div>
        <Link
          to="/education/quiz"
          style={{ display: 'block', textAlign: 'center', padding: '9px 0', fontSize: 13, background: 'var(--color-blue)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}
        >
          Start Studying →
        </Link>
      </div>
    )
  }

  // Question card
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: 14, marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: 1, color: 'var(--color-blue)', fontWeight: 700 }}>Mini quiz</span>
          <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)' }}>· Sanitation · {step + 1}/3</span>
        </div>
        <button onClick={onMin} aria-label="Minimize" style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, width: 24, height: 24, fontSize: 14, lineHeight: 1, color: 'rgba(0,0,0,0.5)', cursor: 'pointer', padding: 0 }}>–</button>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, color: 'var(--color-black-95)' }}>{q.q}</div>
      <div style={{ height: 10 }} />
      <div style={{ display: 'grid', gap: 6 }}>
        {q.choices.map(([l, t]) => {
          const isPicked = currentPick === l
          const isCorrect = revealed && l === q.correct
          const isWrong = revealed && isPicked && l !== q.correct
          return (
            <div
              key={l}
              onClick={() => pickAnswer(l)}
              style={{
                padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center',
                border: `1px solid ${isCorrect ? '#2e8b57' : isWrong ? '#c4492a' : isPicked ? 'var(--color-blue)' : 'rgba(0,0,0,0.12)'}`,
                background: isCorrect ? 'rgba(46,139,87,0.08)' : isWrong ? 'rgba(196,73,42,0.08)' : isPicked ? 'rgba(0,117,222,0.06)' : '#fff',
                borderRadius: 6, cursor: revealed ? 'default' : 'pointer',
              }}
            >
              <div style={{ width: 22, height: 22, borderRadius: 999, background: 'rgba(0,0,0,0.06)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{l}</div>
              <div style={{ fontSize: 12, flex: 1 }}>{t}</div>
              {isCorrect && <span style={{ fontSize: 11, color: '#2e8b57', fontWeight: 700 }}>✓</span>}
              {isWrong && <span style={{ fontSize: 11, color: '#c4492a', fontWeight: 700 }}>✗</span>}
            </div>
          )
        })}
      </div>
      {revealed && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <button
            onClick={advance}
            style={{ padding: '6px 16px', fontSize: 12, background: 'var(--color-blue)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}
          >
            {step < 2 ? 'Next →' : 'See results →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Shared expandable row list (mobile) ──────────────────────────────────

type ModeKey = 'flash' | 'quiz' | null

function ModeEmbedList() {
  const [open, setOpen] = useState<ModeKey>(null)

  const rows: { key: ModeKey; t: string; s: string; icon: string; Embed?: React.ComponentType<{ onMin: () => void }>; soon?: boolean }[] = [
    { key: 'flash', t: 'Flashcards', s: '300 cards · 17 topics', icon: '/content/flashcard-icon.png', Embed: MiniFlashcardEmbed },
    { key: 'quiz', t: 'Practice Quiz', s: '20 · 50 · 100 · 150', icon: '/content/quiz-icon.png', Embed: MiniQuizEmbed },
    { key: null, t: 'Group Mode', s: 'Live · with your class', icon: '/content/group-study-icon.png', soon: true },
  ]

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {rows.map((r) => {
        const isOpen = open === r.key && r.key !== null
        const Embed = r.Embed
        return (
          <div
            key={r.t}
            style={{
              background: '#fff',
              border: `1px solid ${isOpen ? 'var(--color-blue)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <div
              onClick={() => { if (!r.soon && r.key) setOpen(isOpen ? null : r.key) }}
              style={{
                padding: 14, display: 'flex', alignItems: 'center', gap: 14,
                cursor: r.soon ? 'default' : 'pointer',
                background: isOpen ? 'rgba(0,117,222,0.05)' : 'transparent',
              }}
            >
              <img src={r.icon} alt={r.t} style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0, opacity: r.soon ? 0.4 : 1 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: r.soon ? 'rgba(0,0,0,0.35)' : 'var(--color-black-95)' }}>{r.t}</div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>{r.s}</div>
              </div>
              {r.soon ? (
                <span style={{ fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(0,0,0,0.38)' }}>Soon</span>
              ) : (
                <span style={{ fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 700, color: isOpen ? 'var(--color-blue)' : 'rgba(0,0,0,0.38)' }}>
                  {isOpen ? 'Open ▴' : 'Try here ▾'}
                </span>
              )}
            </div>
            {isOpen && Embed && (
              <div style={{ padding: '0 14px 14px' }}>
                <Embed onMin={() => setOpen(null)} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Desktop embed panel (2-col layout) ──────────────────────────────────

type DesktopKey = 'flash' | 'quiz' | null

function ModeEmbedDesktop() {
  const [open, setOpen] = useState<DesktopKey>('flash')

  const rows: { key: DesktopKey; t: string; s: string; icon: string; Embed?: React.ComponentType<{ onMin: () => void }>; soon?: boolean }[] = [
    { key: 'flash', t: 'Flashcards', s: '300 cards across 17 topics. Star, filter, drill.', icon: '/content/flashcard-icon.png', Embed: MiniFlashcardEmbed },
    { key: 'quiz', t: 'Practice Quiz', s: 'Timed. 20 · 50 · 100 · 150. See weak topics after.', icon: '/content/quiz-icon.png', Embed: MiniQuizEmbed },
    { key: null, t: 'Group Mode', s: 'Live 6-char room with your class.', icon: '/content/group-study-icon.png', soon: true },
  ]

  const activeRow = rows.find(r => r.key === open)
  const Embed = activeRow?.Embed

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'flex-start' }}>
      {/* Left: rows */}
      <div style={{ display: 'grid', gap: 10 }}>
        {rows.map((r) => {
          const isOpen = open === r.key && r.key !== null
          return (
            <div
              key={r.t}
              onClick={() => { if (!r.soon && r.key) setOpen(r.key) }}
              style={{
                background: '#fff',
                border: `1px solid ${isOpen ? 'var(--color-blue)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 12, padding: 22, display: 'flex', gap: 16, alignItems: 'flex-start',
                cursor: r.soon ? 'default' : 'pointer',
                boxShadow: isOpen ? '0 0 0 3px rgba(0,117,222,0.1)' : 'none',
                position: 'relative',
                opacity: r.soon ? 0.55 : 1,
                transition: 'box-shadow 0.15s, border-color 0.15s',
              }}
            >
              <img src={r.icon} alt={r.t} style={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.2px', color: r.soon ? 'rgba(0,0,0,0.35)' : 'var(--color-black-95)' }}>{r.t}</div>
                <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', marginTop: 4 }}>{r.s}</div>
                {!r.soon && (
                  <div style={{ marginTop: 10, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontWeight: 700, color: isOpen ? 'var(--color-blue)' : 'rgba(0,0,0,0.38)' }}>
                    {isOpen ? 'showing preview →' : 'Try inline →'}
                  </div>
                )}
              </div>
              {r.soon && (
                <span style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.38)', letterSpacing: '0.06em' }}>
                  Coming Soon
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Right: widget panel */}
      <div style={{ position: 'sticky', top: 88 }}>
        {Embed ? (
          <Embed onMin={() => setOpen(null)} />
        ) : (
          <div
            style={{
              background: '#fafaf9', border: '1.5px dashed rgba(0,0,0,0.12)', borderRadius: 12,
              padding: 40, textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)' }}>Pick a mode on the left to preview it here →</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Topic heatmap data ────────────────────────────────────────────────────

const TOPICS = [
  'Anatomy', 'Hair Science', 'Chemical Services', 'Skin Science',
  'Haircutting', 'Science & Chemistry', 'Life Skills', 'Sanitation',
  'Disorders', 'Shaving', 'Business', 'Tools & Equipment',
  'History',
]

const TOPIC_ROWS = [
  { name: 'Anatomy',             count: 36 },
  { name: 'Hair Science',        count: 33 },
  { name: 'Chemical Services',   count: 31 },
  { name: 'Skin Science',        count: 29 },
  { name: 'Haircutting',         count: 29 },
  { name: 'Science & Chemistry', count: 27 },
  { name: 'Life Skills',         count: 24 },
  { name: 'Sanitation',          count: 22 },
  { name: 'Disorders',           count: 20 },
  { name: 'Shaving',             count: 16 },
  { name: 'Business',            count: 16 },
  { name: 'Tools & Equipment',   count: 13 },
  { name: 'History',             count: 4  },
]

const PROGRESS_STATS = [
  { value: '142', label: 'Questions seen' },
  { value: '78%', label: 'Accuracy' },
  { value: '6', label: 'Sessions' },
  { value: '12', label: 'Starred' },
]

// ── Page ─────────────────────────────────────────────────────────────────

export default function EducationHub() {
  return (
    <>
      {/* ── Anonymous banner ────────────────────────────────────────────── */}
      <SignedOut>
        <div style={{
          background: 'var(--color-badge-bg)',
          padding: '10px 24px',
          fontSize: '13px',
          color: 'var(--color-badge-text)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span>Studying as guest · progress won't save</span>
          <SignInButton mode="modal">
            <button style={{ fontWeight: 600, color: 'var(--color-badge-text)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit', whiteSpace: 'nowrap' as const }}>
              Sign in →
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '56px 24px 32px', background: 'var(--color-white)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <span className="fj-badge" style={{ marginBottom: '14px', display: 'inline-flex' }}>
            For Texas Barber Students
          </span>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' as const }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(30px, 5vw, 54px)',
                fontWeight: 700,
                letterSpacing: '-1.5px',
                lineHeight: 1.02,
                color: 'var(--color-black-95)',
                margin: '0 0 12px',
              }}>
                300 state board<br />questions. Free.
              </h1>
              <p style={{ fontSize: '15px', color: 'rgba(0,0,0,0.6)', margin: 0 }}>
                Try a card or a question right here — no signup needed.
              </p>
            </div>
            <div className="edu-hero-ctas" style={{ display: 'flex', gap: '10px', flexShrink: 0, flexWrap: 'wrap' as const }}>
              <Link to="/education/flash" className="fj-btn-secondary" style={{ fontSize: '0.9375rem' }}>
                All Flashcards
              </Link>
              <Link to="/education/quiz" className="fj-btn-primary" style={{ fontSize: '0.9375rem' }}>
                Full Practice Quiz →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mode list — mobile ───────────────────────────────────────────── */}
      <section style={{ padding: '24px 24px 40px', background: 'var(--color-warm-white)' }} className="edu-mobile-section">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
            Three ways to study · try inline
          </div>
          <ModeEmbedList />
        </div>
      </section>

      {/* ── Mode list — desktop ──────────────────────────────────────────── */}
      <section style={{ padding: '40px 24px', background: 'var(--color-warm-white)' }} className="edu-desktop-section">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.8px', margin: '0 0 24px', color: 'var(--color-black-95)' }}>
            Three ways to study. Try any of them right here.
          </h2>
          <ModeEmbedDesktop />
        </div>
      </section>

      {/* ── Topic browser (dark) ─────────────────────────────────────────── */}
      <section style={{ padding: '40px 24px 48px', background: 'var(--color-warm-dark)', color: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            Browse by topic · 17 topics · 300 cards
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
            gap: '1px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            {TOPIC_ROWS.map((t) => (
              <div key={t.name} style={{
                background: 'var(--color-warm-dark)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{t.name}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{t.count} cards</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <Link to={`/education/flash?topic=${encodeURIComponent(t.name)}`} style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    padding: '5px 12px', fontSize: '12px', fontWeight: 600, borderRadius: '4px',
                    background: 'transparent', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.35)',
                    textDecoration: 'none',
                  }}>Flip</Link>
                  <Link to={`/education/quiz?topic=${encodeURIComponent(t.name)}`} className="fj-btn-primary" style={{ fontSize: '12px', padding: '5px 12px' }}>
                    Quiz →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Progress (signed-in only) ───────────────────────────────────── */}
      <SignedIn>
        <section style={{ padding: '40px 24px', background: 'var(--color-warm-white)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '32px',
            }}>
              {/* Stats grid */}
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  Your Progress
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {PROGRESS_STATS.map(stat => (
                    <div key={stat.label} style={{
                      background: 'var(--color-white)', border: 'var(--border-whisper)',
                      borderRadius: '10px', padding: '14px 16px',
                      boxShadow: 'var(--shadow-card)',
                    }}>
                      <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--color-black-95)' }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.6)', marginTop: '2px' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <div style={{
                    background: 'var(--color-white)', border: 'var(--border-whisper)',
                    borderRadius: '10px', padding: '14px 16px', boxShadow: 'var(--shadow-card)',
                    fontSize: '12px', color: 'rgba(0,0,0,0.6)',
                  }}>
                    Last session · 2d ago
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-black-95)', marginTop: '2px' }}>38 / 50 · Sanitation + Tools</div>
                  </div>
                </div>
              </div>

              {/* Topic heatmap */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Topic Mastery
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)' }}>Darker = stronger. Click to drill.</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {TOPICS.map((topic, i) => {
                    const opacity = 0.08 + ((i * 37) % 92) / 100
                    return (
                      <Link key={topic} to={`/education/flash?topic=${encodeURIComponent(topic)}`} style={{
                        aspectRatio: '1',
                        background: `rgba(0, 117, 222, ${opacity})`,
                        borderRadius: '5px',
                        padding: '6px',
                        fontSize: '9px',
                        color: opacity > 0.5 ? '#fff' : 'rgba(0,0,0,0.8)',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'flex-end',
                        textDecoration: 'none',
                        lineHeight: 1.2,
                      }}>
                        {topic}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </SignedIn>

      <style>{`
        .edu-mobile-section { display: block; }
        .edu-desktop-section { display: none; }
        .edu-hero-ctas { display: none; }
        @media (min-width: 768px) {
          .edu-mobile-section { display: none; }
          .edu-desktop-section { display: block; }
          .edu-hero-ctas { display: flex; }
        }
      `}</style>
    </>
  )
}
