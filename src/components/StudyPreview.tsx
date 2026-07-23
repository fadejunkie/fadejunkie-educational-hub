// Shared presentational pieces for flashcards + quiz questions — extracted
// verbatim from Flash.tsx / Quiz.tsx so the admin Study Content preview
// renders EXACTLY what students see on the live pages, with no drift.
// Flash.tsx and Quiz.tsx import these instead of inlining the markup.

import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react'

// ── Flashcard flip visual (Flash.tsx) ───────────────────────────────────

export function FlashCardVisual({
  question,
  answer,
  flipped,
  onFlip,
}: {
  question: string
  answer: string
  flipped: boolean
  onFlip: () => void
}) {
  return (
    <div style={{ perspective: '1400px', cursor: 'pointer', width: '100%' }} onClick={onFlip}>
      <div style={{
        position: 'relative',
        height: '300px',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Front — Question */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          background: 'var(--color-white)', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '40px 32px', textAlign: 'center',
        }}>
          <span style={{ position: 'absolute', top: '18px', right: '18px', fontSize: '0.7rem', color: 'var(--color-warm-300)' }}>Question</span>
          <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-black-95)', lineHeight: 1.55, margin: 0, letterSpacing: '-0.15px' }}>{question}</p>
          <div style={{ position: 'absolute', bottom: '18px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-warm-300)' }}>
            <RotateCcw size={12} /> tap to flip
          </div>
        </div>

        {/* Back — Answer */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)', background: 'var(--color-warm-white)',
          border: '1px solid rgba(0,0,0,0.08)', borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '40px 32px', textAlign: 'center',
        }}>
          <span style={{ position: 'absolute', top: '18px', right: '18px', fontSize: '0.7rem', color: 'var(--color-blue)', fontWeight: 600, letterSpacing: '0.06em' }}>Answer</span>
          <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-black-95)', lineHeight: 1.65, margin: 0 }}>{answer}</p>
        </div>
      </div>
    </div>
  )
}

// ── Quiz question card (Quiz.tsx) ───────────────────────────────────────

export function QuizQuestionCard({ question }: { question: string }) {
  return (
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
        {question}
      </p>
    </div>
  )
}

export function QuizChoices({
  choices,
  answer,
  selected,
  answered,
  onSelect,
}: {
  choices: string[]
  answer: number
  selected: number | null
  answered: boolean
  onSelect: (idx: number) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
      {choices.map((choice, idx) => {
        const isCorrect = idx === answer
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
            onClick={() => onSelect(idx)}
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
  )
}

export function QuizExplanation({ explanation }: { explanation: string }) {
  return (
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
        {explanation}
      </p>
    </div>
  )
}
