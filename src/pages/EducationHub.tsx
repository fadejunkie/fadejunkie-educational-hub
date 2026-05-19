import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import PageMeta from '../components/PageMeta'
import GuestBanner from '../components/GuestBanner'

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: 1, color: 'var(--color-blue)', fontWeight: 700 }}>Live preview</span>
          <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)' }}>· Sanitation</span>
        </div>
        <button onClick={onMin} aria-label="Minimize" style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, width: 24, height: 24, fontSize: 14, lineHeight: 1, color: 'rgba(0,0,0,0.5)', cursor: 'pointer', padding: 0 }}>–</button>
      </div>
      <div onClick={() => setFlipped(f => !f)} style={{ border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '26px 16px', background: flipped ? '#f4f3f1' : '#fff', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer' }}>
        <div>
          <div style={{ fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: 1, color: 'rgba(0,0,0,0.38)' }}>{flipped ? 'Answer' : 'Question'} · tap to flip</div>
          <div style={{ height: 8 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-black-95)', lineHeight: 1.35 }}>{flipped ? card.a : card.q}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>
        <span>{idx + 1} / 3</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={(e) => { e.stopPropagation(); setIdx(Math.max(0, idx - 1)); setFlipped(false) }} disabled={idx === 0} style={{ padding: '4px 10px', fontSize: 12, border: '1px solid rgba(0,0,0,0.15)', borderRadius: 6, background: '#fff', cursor: idx === 0 ? 'default' : 'pointer', color: idx === 0 ? 'rgba(0,0,0,0.25)' : 'var(--color-black-95)' }}>←</button>
          <button onClick={(e) => { e.stopPropagation(); setIdx(Math.min(2, idx + 1)); setFlipped(false) }} disabled={idx === 2} style={{ padding: '4px 10px', fontSize: 12, border: '1px solid rgba(0,0,0,0.15)', borderRadius: 6, background: '#fff', cursor: idx === 2 ? 'default' : 'pointer', color: idx === 2 ? 'rgba(0,0,0,0.25)' : 'var(--color-black-95)' }}>→</button>
          <Link to="/education/flash" style={{ padding: '4px 10px', fontSize: 12, background: 'var(--color-blue)', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>Open full</Link>
        </div>
      </div>
    </div>
  )
}

const QUIZ_PREVIEW: { q: string; choices: [string, string][]; correct: string }[] = [
  { q: 'Which is the most effective method for sanitizing metal implements?', choices: [['A', 'Wiping with isopropyl alcohol'], ['B', 'EPA-registered hospital disinfectant, 10 min'], ['C', 'Soap and warm water'], ['D', 'UV light only']], correct: 'B' },
  { q: 'How long must metal implements soak in disinfectant?', choices: [['A', '2 minutes'], ['B', '5 minutes'], ['C', '10 minutes'], ['D', '30 minutes']], correct: 'C' },
  { q: 'What should you do with a single-use razor after use?', choices: [['A', 'Wash and reuse'], ['B', 'Soak in disinfectant'], ['C', 'Store in a UV cabinet'], ['D', 'Discard immediately']], correct: 'D' },
]

function MiniQuizEmbed({ onMin }: { onMin: () => void }) {
  const [step, setStep] = useState(0)
  const [picks, setPicks] = useState<string[]>([])
  const q = QUIZ_PREVIEW[step]
  const currentPick = picks[step] ?? null
  const revealed = currentPick !== null

  function pickAnswer(letter: string) { if (revealed) return; const next = [...picks]; next[step] = letter; setPicks(next) }
  function advance() { if (step < 2) setStep(step + 1); else setStep(3) }

  const score = picks.filter((p, i) => p === QUIZ_PREVIEW[i].correct).length
  const pct = Math.round((score / 3) * 100)

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
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', color: score >= 2 ? '#2e8b57' : '#c4492a' }}>{score} / 3</div>
          <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)', marginTop: 4 }}>{pct}% · Sanitation preview</div>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.38)', marginTop: 8 }}>{score === 3 ? 'Perfect! You nailed it.' : score === 2 ? 'Almost there — one more push.' : "Keep drilling — you've got this."}</div>
        </div>
        <Link to="/education/quiz" style={{ display: 'block', textAlign: 'center', padding: '9px 0', fontSize: 13, background: 'var(--color-blue)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Start Studying →</Link>
      </div>
    )
  }

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
            <div key={l} onClick={() => pickAnswer(l)} style={{ padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center', border: `1px solid ${isCorrect ? '#2e8b57' : isWrong ? '#c4492a' : isPicked ? 'var(--color-blue)' : 'rgba(0,0,0,0.12)'}`, background: isCorrect ? 'rgba(46,139,87,0.08)' : isWrong ? 'rgba(196,73,42,0.08)' : isPicked ? 'rgba(0,117,222,0.06)' : '#fff', borderRadius: 6, cursor: revealed ? 'default' : 'pointer' }}>
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
          <button onClick={advance} style={{ padding: '6px 16px', fontSize: 12, background: 'var(--color-blue)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>{step < 2 ? 'Next →' : 'See results →'}</button>
        </div>
      )}
    </div>
  )
}

// ── Mode embed list (mobile) ───────────────────────────────────────────────

type ModeKey = 'flash' | 'quiz' | null

function ModeEmbedList() {
  const [open, setOpen] = useState<ModeKey>(null)
  const rows: { key: ModeKey; t: string; s: string; icon: string; Embed?: React.ComponentType<{ onMin: () => void }>; soon?: boolean; href?: string }[] = [
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
          <div key={r.t} style={{ background: '#fff', border: `1px solid ${isOpen ? 'var(--color-blue)' : 'rgba(0,0,0,0.1)'}`, borderRadius: 10, overflow: 'hidden' }}>
            <div onClick={() => { if (!r.soon && r.key) setOpen(isOpen ? null : r.key) }} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14, cursor: r.soon ? 'default' : 'pointer', background: isOpen ? 'rgba(0,117,222,0.05)' : 'transparent' }}>
              <img src={r.icon} alt={r.t} style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0, opacity: r.soon ? 0.4 : 1, mixBlendMode: 'multiply' as const }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: r.soon ? 'rgba(0,0,0,0.35)' : 'var(--color-black-95)' }}>{r.t}</div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>{r.s}</div>
              </div>
              {r.soon ? (
                <a href="mailto:hello@fadejunkie.com?subject=Group%20Mode%20Waitlist&body=Add%20me%20to%20the%20Group%20Mode%20waitlist!" onClick={(e) => e.stopPropagation()} style={{ fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(0,0,0,0.5)', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontFamily: 'inherit' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(0,0,0,0.75)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(0,0,0,0.5)')}>Notify me</a>
              ) : (
                <span style={{ fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 700, color: isOpen ? 'var(--color-blue)' : 'rgba(0,0,0,0.38)' }}>{isOpen ? 'Open ▴' : 'Try here ▾'}</span>
              )}
            </div>
            {isOpen && Embed && (<div style={{ padding: '0 14px 14px' }}><Embed onMin={() => setOpen(null)} /></div>)}
          </div>
        )
      })}
    </div>
  )
}

// ── Mode embed panel (desktop) ────────────────────────────────────────────

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
      <div style={{ display: 'grid', gap: 10 }}>
        {rows.map((r) => {
          const isOpen = open === r.key && r.key !== null
          return (
            <div key={r.t} onClick={() => { if (!r.soon && r.key) setOpen(r.key) }} style={{ background: '#fff', border: `1px solid ${isOpen ? 'var(--color-blue)' : 'rgba(0,0,0,0.1)'}`, borderRadius: 12, padding: 22, display: 'flex', gap: 16, alignItems: 'flex-start', cursor: r.soon ? 'default' : 'pointer', boxShadow: isOpen ? '0 0 0 3px rgba(0,117,222,0.1)' : 'none', position: 'relative', opacity: r.soon ? 0.55 : 1, transition: 'box-shadow 0.15s, border-color 0.15s' }}>
              <img src={r.icon} alt={r.t} style={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0, mixBlendMode: 'multiply' as const }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.2px', color: r.soon ? 'rgba(0,0,0,0.35)' : 'var(--color-black-95)' }}>{r.t}</div>
                <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', marginTop: 4 }}>{r.s}</div>
                {!r.soon && (<div style={{ marginTop: 10, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontWeight: 700, color: isOpen ? 'var(--color-blue)' : 'rgba(0,0,0,0.38)' }}>{isOpen ? 'showing preview →' : 'Try inline →'}</div>)}
              </div>
              {r.soon && (<a href="mailto:hello@fadejunkie.com?subject=Group%20Mode%20Waitlist&body=Add%20me%20to%20the%20Group%20Mode%20waitlist!" onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(0,0,0,0.5)', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontFamily: 'inherit' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(0,0,0,0.75)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(0,0,0,0.5)')}>Notify me</a>)}
            </div>
          )
        })}
      </div>
      <div style={{ position: 'sticky', top: 88 }}>
        {Embed ? (<Embed onMin={() => setOpen(null)} />) : (
          <div style={{ background: '#fafaf9', border: '1.5px dashed rgba(0,0,0,0.12)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)' }}>Pick a mode on the left to preview it here →</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Shared data ───────────────────────────────────────────────────────────

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

function elapsed(ms: number): string {
  const diff = Date.now() - ms
  const d = Math.floor(diff / 86400000)
  const h = Math.floor(diff / 3600000)
  const m = Math.floor(diff / 60000)
  if (d >= 1) return `${d}d ago`
  if (h >= 1) return `${h}h ago`
  if (m >= 1) return `${m}m ago`
  return 'just now'
}

// ── Topic browser (shared) ────────────────────────────────────────────────

function TopicBrowserSection() {
  return (
    <section style={{ padding: '40px 24px 48px', background: 'var(--color-warm-dark)', color: '#fff' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
          Browse by topic · 13 topics · 300 cards
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.12)' }}>
          {TOPIC_ROWS.map((t) => (
            <div key={t.name} style={{ background: 'var(--color-warm-dark)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{t.name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{t.count} cards</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <Link to={`/education/flash?topic=${encodeURIComponent(t.name)}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '5px 12px', fontSize: '12px', fontWeight: 600, borderRadius: '4px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', textDecoration: 'none' }}>Flip</Link>
                <Link to={`/education/quiz?topic=${encodeURIComponent(t.name)}`} className="fj-btn-primary" style={{ fontSize: '12px', padding: '5px 12px' }}>Quiz →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Practical Exam Guide callout ──────────────────────────────────────────

function PracticalExamCallout() {
  return (
    <section style={{ padding: '32px 24px', background: 'var(--color-white)', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ background: 'var(--color-warm-white)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' as const }}>
          <div>
            <span className="fj-badge" style={{ display: 'inline-flex', marginBottom: 10 }}>New Feature</span>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--color-black-95)', margin: '0 0 6px' }}>TDLR Barber Practical Exam Guide</div>
            <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.55)', margin: 0 }}>11 sections · Materials checklist + step-by-step for every service on the Texas Class A Barber Practical Exam.</div>
          </div>
          <Link to="/education/practical" className="fj-btn-primary" style={{ fontSize: 14, padding: '10px 22px', flexShrink: 0 }}>Open Exam Guide →</Link>
        </div>
      </div>
    </section>
  )
}

// ── Signed-in hub ─────────────────────────────────────────────────────────

function SignedInHub() {
  const { user } = useUser()
  const progress = useQuery(
    api.progress.getUserProgress,
    user ? { clerkId: user.id } : 'skip'
  )

  const firstName = user?.firstName ?? ''
  const h = new Date().getHours()
  const timeLabel = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'

  const hasHistory = progress !== undefined && progress !== null && progress.sessions > 0

  // Weak topics: accuracy < 70%, sorted ascending, max 5
  const weakTopics = progress?.topicAccuracy
    ? [...progress.topicAccuracy]
        .filter(t => t.accuracy < 70)
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 5)
    : []

  const allStrong = hasHistory && weakTopics.length === 0

  return (
    <>
      {/* ── Resume hero ─────────────────────────────────────────────────── */}
      <section style={{ padding: '52px 24px 36px', background: 'var(--color-white)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.38)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {timeLabel}{firstName ? `, ${firstName}` : ''}
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 700, letterSpacing: '-1.4px', lineHeight: 1.04, color: 'var(--color-black-95)', margin: '0 0 20px' }}>
            {hasHistory ? 'Ready to keep going?' : "Let's start studying."}
          </h1>

          {/* Last session pill */}
          {progress?.lastSession && (
            <div style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', rowGap: '4px', gap: 10, background: 'var(--color-warm-white)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '8px 14px', marginBottom: 20, fontSize: 13 }}>
              <span style={{ color: 'rgba(0,0,0,0.4)' }}>Last session</span>
              <span style={{ color: 'rgba(0,0,0,0.2)' }}>·</span>
              <span style={{ fontWeight: 600, color: 'var(--color-black-95)' }}>{progress.lastSession.topic}</span>
              <span style={{ color: 'rgba(0,0,0,0.2)' }}>·</span>
              <span style={{ color: 'rgba(0,0,0,0.5)' }}>{progress.lastSession.score}/{progress.lastSession.total}</span>
              <span style={{ color: 'rgba(0,0,0,0.2)' }}>·</span>
              <span style={{ color: 'rgba(0,0,0,0.38)', fontSize: 12 }}>{elapsed(progress.lastSession.completedAt)}</span>
            </div>
          )}

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            {progress?.lastSession ? (
              <Link to={`/education/quiz?topic=${encodeURIComponent(progress.lastSession.topic)}`} className="fj-btn-primary" style={{ fontSize: '0.9375rem' }}>
                Continue {progress.lastSession.topic} →
              </Link>
            ) : (
              <Link to="/education/quiz" className="fj-btn-primary" style={{ fontSize: '0.9375rem' }}>
                Start a quiz →
              </Link>
            )}
            <Link to="/education/flash" className="fj-btn-secondary" style={{ fontSize: '0.9375rem' }}>
              All Flashcards
            </Link>
            {hasHistory && (
              <Link to="/education/quiz" className="fj-btn-secondary" style={{ fontSize: '0.9375rem' }}>
                New session
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <section style={{ padding: '16px 24px', background: 'var(--color-warm-white)', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
          {[
            { value: progress ? String(progress.totalSeen) : '—', label: 'seen' },
            { value: progress ? `${progress.accuracy}%` : '—', label: 'accuracy' },
            { value: progress ? String(progress.sessions) : '—', label: 'sessions' },
            { value: progress ? String(progress.starred) : '—', label: 'starred' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '8px 16px', display: 'flex', gap: 6, alignItems: 'baseline' }}>
              <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--color-black-95)' }}>{s.value}</span>
              <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Needs work ──────────────────────────────────────────────────── */}
      {weakTopics.length > 0 && (
        <section style={{ padding: '32px 24px 8px', background: 'var(--color-warm-white)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Needs work · drill these first
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {weakTopics.map(({ topic, accuracy }) => (
                <div key={topic} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-black-95)', marginBottom: 6 }}>{topic}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 100, height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 2, flexShrink: 0 }}>
                        <div style={{ width: `${accuracy}%`, height: '100%', background: accuracy < 50 ? '#c4492a' : '#d4882a', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: accuracy < 50 ? '#c4492a' : '#b8763a' }}>{accuracy}%</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <Link to={`/education/flash?topic=${encodeURIComponent(topic)}`} style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 6, background: 'transparent', border: '1px solid rgba(0,0,0,0.15)', color: 'var(--color-black-95)', textDecoration: 'none' }}>Flip</Link>
                    <Link to={`/education/quiz?topic=${encodeURIComponent(topic)}`} className="fj-btn-primary" style={{ fontSize: 12, padding: '6px 14px' }}>Quiz →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All strong message */}
      {allStrong && (
        <section style={{ padding: '24px 24px 8px', background: 'var(--color-warm-white)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>✓</span>
              All topics above 70% — keep drilling to push higher.
            </div>
          </div>
        </section>
      )}

      {/* First session nudge */}
      {progress !== undefined && !hasHistory && (
        <section style={{ padding: '24px 24px 8px', background: 'var(--color-warm-white)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>
              Complete your first session to track accuracy and see which topics need work.
            </div>
          </div>
        </section>
      )}

      {/* ── Practical Exam Guide callout ─────────────────────────────────── */}
      <PracticalExamCallout />

      {/* ── Topic browser ────────────────────────────────────────────────── */}
      <div style={{ marginTop: weakTopics.length > 0 || allStrong || (progress !== undefined && !hasHistory) ? 24 : 0 }}>
        <TopicBrowserSection />
      </div>

      {/* ── Study tools (below fold for returning users) ─────────────────── */}
      <section style={{ padding: '40px 24px 48px', background: 'var(--color-warm-white)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Study tools
          </div>
          <div className="edu-mobile-section"><ModeEmbedList /></div>
          <div className="edu-desktop-section"><ModeEmbedDesktop /></div>
        </div>
      </section>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function EducationHub() {
  return (
    <>
      <PageMeta
        title="Texas Barber Exam Study Hub — FadeJunkie"
        description="Flashcards, solo practice quizzes, and live group study for Texas barber state board prep. 300+ questions from the Milady curriculum. Free."
        canonical="https://fadejunkie.com/education"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: 'Texas Barber State Board Exam Study Hub',
          description: 'Free interactive study tool covering all Texas barber state board exam topics: anatomy, sanitation, tools, life skills, and more.',
          url: 'https://fadejunkie.com/education',
          provider: { '@type': 'Organization', name: 'FadeJunkie', url: 'https://fadejunkie.com' },
          educationalLevel: 'Vocational',
          teaches: 'Texas Barber State Board Exam',
          isAccessibleForFree: true,
          inLanguage: 'en',
        }}
      />
      {/* ── Guest experience ──────────────────────────────────────────────── */}
      <SignedOut>
        {/* Animated ticker banner */}
        <GuestBanner />

        {/* Hero */}
        <section style={{ padding: '56px 24px 32px', background: 'var(--color-white)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <span className="fj-badge" style={{ marginBottom: '14px', display: 'inline-flex' }}>For Texas Barber Students</span>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' as const }}>
              <div>
                <h1 style={{ fontSize: 'clamp(30px, 5vw, 54px)', fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1.02, color: 'var(--color-black-95)', margin: '0 0 12px' }}>
                  300 state board<br />questions. Free.
                </h1>
                <p style={{ fontSize: '15px', color: 'rgba(0,0,0,0.6)', margin: 0 }}>Try a card or a question right here — no signup needed.</p>
              </div>
              <div className="edu-hero-ctas" style={{ display: 'flex', gap: '10px', flexShrink: 0, flexWrap: 'wrap' as const }}>
                <Link to="/education/flash" className="fj-btn-secondary" style={{ fontSize: '0.9375rem' }}>All Flashcards</Link>
                <Link to="/education/quiz" className="fj-btn-primary" style={{ fontSize: '0.9375rem' }}>Full Practice Quiz →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mode list — mobile */}
        <section style={{ padding: '24px 24px 40px', background: 'var(--color-warm-white)' }} className="edu-mobile-section">
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Three ways to study · try inline</div>
            <ModeEmbedList />
          </div>
        </section>

        {/* Mode list — desktop */}
        <section style={{ padding: '40px 24px', background: 'var(--color-warm-white)' }} className="edu-desktop-section">
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.8px', margin: '0 0 24px', color: 'var(--color-black-95)' }}>Three ways to study. Try any of them right here.</h2>
            <ModeEmbedDesktop />
          </div>
        </section>

        {/* Practical Exam Guide callout */}
        <PracticalExamCallout />

        {/* Topic browser */}
        <TopicBrowserSection />
      </SignedOut>

      {/* ── Signed-in experience ──────────────────────────────────────────── */}
      <SignedIn>
        <SignedInHub />
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
