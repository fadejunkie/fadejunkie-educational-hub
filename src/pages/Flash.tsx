import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { RotateCcw, Star } from 'lucide-react'
import { ALL_FLASH_CARDS, TOPICS, type Topic } from '../data/studyData'

// Mode toggle shared between Flashcards and Quiz pages
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

export default function Flash() {
  const [searchParams] = useSearchParams()
  const initialTopic = (searchParams.get('topic') as Topic) ?? 'All'
  const [topic, setTopic] = useState<Topic>(initialTopic)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [starred, setStarred] = useState<Set<number>>(new Set())
  const [starredOnly, setStarredOnly] = useState(false)

  const deck = useMemo(() => {
    let cards = topic === 'All' ? ALL_FLASH_CARDS : ALL_FLASH_CARDS.filter(c => c.topic === topic)
    if (starredOnly) cards = cards.filter(c => starred.has(c.id))
    return cards
  }, [topic, starredOnly, starred])

  const card = deck[index] ?? null
  const total = deck.length

  function go(dir: -1 | 1) {
    setFlipped(false)
    setTimeout(() => {
      setIndex(i => Math.max(0, Math.min(total - 1, i + dir)))
    }, 150)
  }

  function handleTopicChange(t: Topic) {
    setTopic(t)
    setIndex(0)
    setFlipped(false)
  }

  function toggleStar() {
    if (!card) return
    setStarred(prev => {
      const next = new Set(prev)
      next.has(card.id) ? next.delete(card.id) : next.add(card.id)
      return next
    })
  }

  function restart() {
    setIndex(0)
    setFlipped(false)
  }

  const isStarred = card ? starred.has(card.id) : false
  const availableTopics = TOPICS.filter(t => t === 'All' || ALL_FLASH_CARDS.some(c => c.topic === t))

  return (
    <section style={{ padding: '0 0 80px', minHeight: 'calc(100vh - 60px)' }}>

      {/* ── Compact top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 20px', borderBottom: '1px solid rgba(0,0,0,0.1)',
        background: 'var(--color-white)', position: 'sticky', top: '56px', zIndex: 10,
      }}>
        <Link to="/education" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-warm-500)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
          ← Hub
        </Link>
        <div style={{ width: '1px', height: '18px', background: 'rgba(0,0,0,0.12)' }} />
        <ModeToggle mode="flash" />
        <div style={{ flex: 1 }} />
        {/* Starred toggle */}
        <button
          onClick={() => { setStarredOnly(s => !s); setIndex(0); setFlipped(false) }}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '99px',
            border: starredOnly ? '1px solid rgba(245,196,0,0.5)' : '1px solid rgba(0,0,0,0.12)',
            background: starredOnly ? 'rgba(255,196,0,0.08)' : 'transparent',
            color: starredOnly ? '#b07a00' : 'rgba(0,0,0,0.5)', cursor: 'pointer',
          }}
        >
          <Star size={12} fill={starredOnly ? '#f5c400' : 'none'} stroke={starredOnly ? '#f5c400' : 'currentColor'} />
          {starredOnly ? `Starred (${starred.size})` : starred.size > 0 ? `★ ${starred.size}` : 'Starred only'}
        </button>
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 24px 0' }}>

        {/* Topic pills — mirrors Quiz setup */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-black-95)', margin: '0 0 12px' }}>
            Topic
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {availableTopics.map(t => (
              <button
                key={t}
                onClick={() => handleTopicChange(t)}
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

        {/* Empty state */}
        {total === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--color-warm-300)' }}>
            <Star size={32} style={{ marginBottom: '16px', opacity: 0.4 }} />
            <p style={{ fontSize: '1rem', margin: 0 }}>
              {starredOnly ? 'No starred cards yet — star a card while studying.' : 'No cards in this topic.'}
            </p>
            {starredOnly && (
              <button
                onClick={() => setStarredOnly(false)}
                style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--color-blue)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500 }}
              >
                Show all cards
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            {/* Progress bar */}
            <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${((index + 1) / total) * 100}%`, background: 'var(--color-blue)', borderRadius: '99px', transition: 'width 0.25s' }} />
            </div>

            {/* Progress counter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-black-95)' }}>
                Card {index + 1} <span style={{ color: 'var(--color-warm-300)', fontWeight: 400 }}>of {total}</span>
              </span>
              <span className="fj-badge">{card?.topic}</span>
            </div>

            {/* Flip card */}
            <div
              style={{ perspective: '1400px', cursor: 'pointer', width: '100%' }}
              onClick={() => setFlipped(f => !f)}
            >
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
                  <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-black-95)', lineHeight: 1.55, margin: 0, letterSpacing: '-0.15px' }}>{card?.question}</p>
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
                  <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-black-95)', lineHeight: 1.65, margin: 0 }}>{card?.answer}</p>
                </div>
              </div>
            </div>

            {/* Controls row — mirrors Quiz button style */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
              {/* Star */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleStar() }}
                title={isStarred ? 'Unstar' : 'Star'}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid', borderColor: isStarred ? 'rgba(245,196,0,0.5)' : 'rgba(0,0,0,0.1)',
                  background: isStarred ? 'rgba(255,196,0,0.08)' : 'var(--color-white)', cursor: 'pointer',
                  color: isStarred ? '#b07a00' : 'rgba(0,0,0,0.4)',
                }}
              >
                <Star size={16} fill={isStarred ? '#f5c400' : 'none'} stroke={isStarred ? '#f5c400' : 'currentColor'} />
              </button>

              {/* Prev */}
              <button
                onClick={() => go(-1)} disabled={index === 0}
                style={{
                  flex: 1, height: '40px', borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-white)',
                  color: index === 0 ? 'var(--color-warm-300)' : 'var(--color-black-95)',
                  cursor: index === 0 ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 600,
                }}
              >←</button>

              {/* Counter */}
              <span style={{ fontSize: '13px', fontWeight: 600, fontVariantNumeric: 'tabular-nums', minWidth: '52px', textAlign: 'center', color: 'var(--color-black-95)', flexShrink: 0 }}>
                {index + 1} / {total}
              </span>

              {/* Next */}
              <button
                onClick={() => go(1)} disabled={index === total - 1}
                style={{
                  flex: 1, height: '40px', borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid', borderColor: index === total - 1 ? 'rgba(0,0,0,0.1)' : 'var(--color-blue)',
                  background: index === total - 1 ? 'var(--color-white)' : 'var(--color-blue)',
                  color: index === total - 1 ? 'var(--color-warm-300)' : '#fff',
                  cursor: index === total - 1 ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 600,
                }}
              >→</button>

              {/* Restart */}
              <button
                onClick={restart} title="Restart"
                style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-white)',
                  color: 'rgba(0,0,0,0.4)', cursor: 'pointer',
                }}
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
