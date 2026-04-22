import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react'
import { ALL_QUIZ_QUESTIONS, TOPICS, QUIZ_COUNTS, type Topic, type QuizCount } from '../data/studyData'

// Shared mode toggle (mirrors Flash.tsx)
function ModeToggle({ mode }: { mode: 'flash' | 'quiz' }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '2px', padding: '2px',
      background: 'rgba(0,0,0,0.04)', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)',
    }}>
      {(['Flashcards', 'Quiz'] as const).map(label => {
        const active = (label === 'Flashcards') === (mode === 'flash')
        return (
          <Link
            key={label}
            to={label === 'Flashcards' ? '/education/flash' : '/education/quiz'}
            style={{
              padding: '4px 10px', fontSize: '11px', fontWeight: 600, borderRadius: '4px',
              background: active ? 'var(--color-black-95)' : 'transparent',
              color: active ? '#fff' : 'rgba(0,0,0,0.6)',
              letterSpacing: '0.2px', textDecoration: 'none',
              transition: 'background 0.12s',
            }}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}

type Phase = 'setup' | 'quiz' | 'results'

interface Answer {
  questionId: number
  selected: number  // -1 = skipped/timed out
  correct: boolean
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Quiz() {
  const [searchParams] = useSearchParams()
  const initialTopic = (searchParams.get('topic') as Topic) ?? 'All'
  const [phase, setPhase] = useState<Phase>('setup')
  const [topic, setTopic] = useState<Topic>(initialTopic)
  const [count, setCount] = useState<QuizCount>(20)
  const [questions, setQuestions] = useState(ALL_QUIZ_QUESTIONS)
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])

  const currentQ = questions[qIndex]
  const progress = ((qIndex) / questions.length) * 100

  // Breakdown by topic for results
  const breakdown = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {}
    answers.forEach(ans => {
      const q = ALL_QUIZ_QUESTIONS.find(q => q.id === ans.questionId)
      if (!q) return
      if (!map[q.topic]) map[q.topic] = { correct: 0, total: 0 }
      map[q.topic].total++
      if (ans.correct) map[q.topic].correct++
    })
    return map
  }, [answers])

  const score = answers.filter(a => a.correct).length
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  function startQuiz() {
    const pool = topic === 'All'
      ? ALL_QUIZ_QUESTIONS
      : ALL_QUIZ_QUESTIONS.filter(q => q.topic === topic)
    const chosen = shuffle(pool).slice(0, Math.min(count, pool.length))
    setQuestions(chosen)
    setQIndex(0)
    setAnswers([])
    setSelected(null)
    setAnswered(false)
    setPhase('quiz')
  }

  function handleSelect(idx: number) {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const correct = idx === currentQ.answer
    setAnswers(prev => [...prev, { questionId: currentQ.id, selected: idx, correct }])
  }

  function nextQuestion() {
    if (qIndex + 1 >= questions.length) {
      setPhase('results')
    } else {
      setQIndex(i => i + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  function reset() {
    setPhase('setup')
    setSelected(null)
    setAnswered(false)
    setAnswers([])
    setQIndex(0)
  }

  const scoreColor = pct >= 80 ? '#1aae39' : pct >= 60 ? '#dd8800' : '#cc3300'

  // ── Setup screen ──────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <section style={{ padding: '0 0 80px', minHeight: 'calc(100vh - 60px)' }}>
        {/* Compact top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 20px', borderBottom: '1px solid rgba(0,0,0,0.1)',
          background: 'var(--color-white)', position: 'sticky', top: '56px', zIndex: 10,
        }}>
          <Link to="/education" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-warm-500)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
            ← Hub
          </Link>
          <div style={{ width: '1px', height: '18px', background: 'rgba(0,0,0,0.12)' }} />
          <ModeToggle mode="quiz" />
        </div>

        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '48px 24px 0' }}>
          <h1 style={{
            fontSize: '2rem', fontWeight: 700, color: 'var(--color-black-95)',
            margin: '0 0 8px', letterSpacing: '-0.75px',
          }}>
            Practice Quiz
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-warm-500)', margin: '0 0 36px', lineHeight: 1.6 }}>
            Timed and scored. Simulate test day.
          </p>

          {/* Topic */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-black-95)', margin: '0 0 12px' }}>
              Topic
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {TOPICS.filter(t => t === 'All' || ALL_QUIZ_QUESTIONS.some(q => q.topic === t)).map(t => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid',
                    borderColor: topic === t ? 'var(--color-blue)' : 'rgba(0,0,0,0.12)',
                    background: topic === t ? 'var(--color-blue)' : 'transparent',
                    color: topic === t ? 'var(--color-white)' : 'var(--color-warm-500)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-black-95)', margin: '0 0 12px' }}>
              Questions
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {QUIZ_COUNTS.map(n => {
                const available = topic === 'All'
                  ? ALL_QUIZ_QUESTIONS.length
                  : ALL_QUIZ_QUESTIONS.filter(q => q.topic === topic).length
                const disabled = n > available
                return (
                  <button
                    key={n}
                    onClick={() => !disabled && setCount(n)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid',
                      borderColor: count === n ? 'var(--color-blue)' : 'rgba(0,0,0,0.12)',
                      background: count === n ? 'rgba(0,117,222,0.08)' : 'transparent',
                      color: disabled
                        ? 'var(--color-warm-300)'
                        : count === n ? 'var(--color-blue)' : 'var(--color-warm-500)',
                      fontSize: '1rem',
                      fontWeight: count === n ? 700 : 500,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.45 : 1,
                    }}
                  >
                    {n}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            className="fj-btn-primary"
            onClick={startQuiz}
            style={{ width: '100%', justifyContent: 'center', padding: '12px 24px', fontSize: '1rem' }}
          >
            Start {count}-question Quiz
          </button>
        </div>
      </section>
    )
  }

  // ── Results screen ────────────────────────────────────────────────────────
  if (phase === 'results') {
    // Find weak spot: the topic with the lowest accuracy (minimum 1 question)
    const weakSpot = Object.entries(breakdown)
      .map(([topic, { correct, total }]) => ({ topic, pct: Math.round((correct / total) * 100), missed: total - correct }))
      .filter(t => t.missed > 0)
      .sort((a, b) => a.pct - b.pct)[0] ?? null

    return (
      <section style={{ padding: '48px 24px 80px', minHeight: 'calc(100vh - 60px)' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <span className="fj-badge" style={{ marginBottom: '24px', display: 'inline-flex' }}>Quiz Complete</span>

          {/* Score */}
          <div style={{
            background: 'var(--color-white)', border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-deep)',
            padding: '40px', textAlign: 'center', marginBottom: '20px',
          }}>
            <Trophy size={36} color={scoreColor} style={{ marginBottom: '16px' }} />
            <div style={{ fontSize: '4rem', fontWeight: 700, color: scoreColor, lineHeight: 1, letterSpacing: '-2px', marginBottom: '8px' }}>
              {score}<span style={{ fontSize: '2rem', color: 'rgba(0,0,0,0.3)' }}>/{questions.length}</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: scoreColor, marginBottom: '8px' }}>{pct}%</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-300)', margin: 0 }}>
              {pct >= 80 ? 'Strong score — keep it up.' : pct >= 60 ? 'Good effort. Review the missed topics.' : 'Keep studying — you\'ve got this.'}
            </p>
          </div>

          {/* Weak spot callout */}
          {weakSpot && (
            <div style={{
              background: '#fdf4f0', border: '1px solid rgba(196,73,42,0.2)',
              borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '20px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#c4492a', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '4px' }}>
                Weak spot
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-black-95)', letterSpacing: '-0.2px' }}>
                {weakSpot.topic} — {weakSpot.pct}%
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', marginTop: '2px' }}>
                {weakSpot.missed} question{weakSpot.missed !== 1 ? 's' : ''} missed. Drill this next.
              </div>
              <Link
                to={`/education/flash?topic=${encodeURIComponent(weakSpot.topic)}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  marginTop: '12px', fontSize: '12px', fontWeight: 700,
                  color: '#c4492a', textDecoration: 'none',
                  borderBottom: '1px solid rgba(196,73,42,0.3)', paddingBottom: '1px',
                }}
              >
                Drill these with flashcards →
              </Link>
            </div>
          )}

          {/* Topic breakdown */}
          {Object.keys(breakdown).length > 1 && (
            <div style={{
              background: 'var(--color-white)', border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '20px',
            }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--color-warm-300)', margin: '0 0 16px' }}>
                By Topic
              </p>
              {Object.entries(breakdown).map(([t, { correct, total: tot }]) => {
                const tPct = Math.round((correct / tot) * 100)
                const barColor = tPct >= 80 ? '#1aae39' : tPct >= 60 ? '#dd8800' : '#cc3300'
                return (
                  <div key={t} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-black-95)' }}>{t}</span>
                      <span style={{ fontSize: '0.85rem', color: tPct < 60 ? '#c4492a' : 'var(--color-warm-500)', fontVariantNumeric: 'tabular-nums' }}>{tPct}%</span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(0,0,0,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${tPct}%`, background: barColor, borderRadius: '99px', transition: 'width 0.4s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="fj-btn-primary" onClick={startQuiz} style={{ flex: 1, justifyContent: 'center', gap: '8px' }}>
              <RotateCcw size={15} /> Try Again
            </button>
            <button className="fj-btn-secondary" onClick={reset} style={{ flex: 1, justifyContent: 'center' }}>
              New Quiz
            </button>
          </div>
        </div>
      </section>
    )
  }

  // ── Quiz screen ───────────────────────────────────────────────────────────
  return (
    <section style={{ padding: '0 0 80px', minHeight: 'calc(100vh - 60px)' }}>
      {/* Minimal active quiz top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', borderBottom: '1px solid rgba(0,0,0,0.1)',
        background: 'var(--color-white)', position: 'sticky', top: '56px', zIndex: 10,
      }}>
        <button onClick={reset} style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-warm-500)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          Exit quiz
        </button>
        <span style={{ fontSize: '12px', color: 'var(--color-warm-300)' }}>
          Q {qIndex + 1} of {questions.length} · {currentQ?.topic}
        </span>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 24px 0' }}>

        {/* Progress header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-black-95)' }}>
            Q {qIndex + 1} <span style={{ color: 'var(--color-warm-300)', fontWeight: 400 }}>of {questions.length}</span>
          </span>
          <span className="fj-badge">{currentQ.topic}</span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: '4px',
          background: 'rgba(0,0,0,0.07)',
          borderRadius: '99px',
          marginBottom: '32px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'var(--color-blue)',
            borderRadius: '99px',
            transition: 'width 0.3s',
          }} />
        </div>

        {/* Question */}
        <div style={{
          background: 'var(--color-white)',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-card)',
          padding: '32px',
          marginBottom: '20px',
        }}>
          <p style={{
            fontSize: '1.15rem',
            fontWeight: 600,
            color: 'var(--color-black-95)',
            lineHeight: 1.55,
            margin: 0,
            letterSpacing: '-0.15px',
          }}>
            {currentQ.question}
          </p>
        </div>

        {/* Choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {currentQ.choices.map((choice: string, idx: number) => {
            const isCorrect = idx === currentQ.answer
            const isSelected = selected === idx

            let bg = 'var(--color-white)'
            let border = '1px solid rgba(0,0,0,0.10)'
            let color = 'var(--color-black-95)'
            let icon = null

            if (answered) {
              if (isCorrect) {
                bg = 'rgba(26,174,57,0.08)'
                border = '1.5px solid #1aae39'
                color = '#0f7a28'
                icon = <CheckCircle2 size={18} color="#1aae39" />
              } else if (isSelected && !isCorrect) {
                bg = 'rgba(204,51,0,0.06)'
                border = '1.5px solid #cc3300'
                color = '#991a00'
                icon = <XCircle size={18} color="#cc3300" />
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  border,
                  background: bg,
                  color,
                  fontSize: '0.9375rem',
                  fontWeight: isSelected || (answered && isCorrect) ? 600 : 400,
                  textAlign: 'left',
                  cursor: answered ? 'default' : 'pointer',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => {
                  if (!answered) e.currentTarget.style.background = 'rgba(0,0,0,0.02)'
                }}
                onMouseLeave={e => {
                  if (!answered) e.currentTarget.style.background = 'var(--color-white)'
                }}
              >
                <span>{choice}</span>
                {icon}
              </button>
            )
          })}
        </div>

        {/* Explanation + Next */}
        {answered && (
          <div style={{ animation: 'fadeUp 0.2s ease-out' }}>
            <div style={{
              background: 'var(--color-warm-white)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              marginBottom: '16px',
            }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-black-95)', margin: '0 0 6px' }}>
                Explanation
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-500)', lineHeight: 1.6, margin: 0 }}>
                {currentQ.explanation}
              </p>
            </div>

            <button
              className="fj-btn-primary"
              onClick={nextQuestion}
              style={{ width: '100%', justifyContent: 'center', padding: '12px 24px', fontSize: '1rem' }}
            >
              {qIndex + 1 >= questions.length ? 'See Results' : 'Next Question'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
