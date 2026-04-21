import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Users, Trophy } from 'lucide-react'

// ── Brand stats ────────────────────────────────────────────────────────────
const STATS = [
  { value: '300+', label: 'Practice questions' },
  { value: '3',    label: 'Study modes' },
  { value: 'Free', label: 'Always, for barbers' },
]

// ── Feature cards ──────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <BookOpen size={22} strokeWidth={1.75} />,
    badge: 'Flashcards',
    title: 'Study at your own pace',
    body: 'Flip through Milady-sourced questions by topic. Star the ones that trip you up and drill them until they stick.',
  },
  {
    icon: <Trophy size={22} strokeWidth={1.75} />,
    badge: 'Practice Quiz',
    title: 'Simulate the real exam',
    body: 'Timed, scored, randomized. Pick 20, 50, or 100 questions and see exactly where you stand before test day.',
  },
  {
    icon: <Users size={22} strokeWidth={1.75} />,
    badge: 'Group Mode',
    title: 'Study with your class',
    body: 'Host a live quiz, share a room code, and compete in real time. The fastest way to lock in a whole cohort.',
    comingSoon: true,
  },
]

export default function Lander() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="fj-section" style={{ padding: '96px 24px 80px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>

          {/* Badge */}
          <div style={{ marginBottom: '24px' }}>
            <span className="fj-badge">By Barbers, For Barbers</span>
          </div>

          {/* Headline */}
          <h1
            className="text-display-hero"
            style={{ color: 'var(--color-black-95)', margin: '0 0 24px' }}
          >
            The brand built<br />inside the chair.
          </h1>

          {/* Sub */}
          <p
            className="text-body-lg"
            style={{
              color: 'var(--color-warm-500)',
              maxWidth: '560px',
              margin: '0 auto 40px',
            }}
          >
            FadeJunkie is a barber culture brand created by barbers to empower barbers —
            through tools, resources, and community built for the craft.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/education" className="fj-btn-primary" style={{ gap: '8px' }}>
              Explore Education Hub <ArrowRight size={16} />
            </Link>
            <a
              href="https://merch.fadejunkie.com"
              target="_blank"
              rel="noopener noreferrer"
              className="fj-btn-secondary"
            >
              Shop Merch
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section className="fj-section-alt" style={{ padding: '32px 24px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: '64px',
          flexWrap: 'wrap',
        }}>
          {STATS.map(s => (
            <div key={s.value} style={{ textAlign: 'center' }}>
              <div
                className="text-subhead-lg"
                style={{ color: 'var(--color-black-95)', lineHeight: 1.1 }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-warm-500)', marginTop: '4px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What is FadeJunkie ───────────────────────────────────────────── */}
      <section className="fj-section" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
            <span className="fj-badge" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              The Brand
            </span>
            <h2 className="text-section" style={{ color: 'var(--color-black-95)', margin: '16px 0 20px' }}>
              More than merch.
            </h2>
            <p className="text-body-lg" style={{ color: 'var(--color-warm-500)' }}>
              FadeJunkie started as a culture brand — streetwear for the shop, built with the same obsession
              barbers bring to every fade. We're growing it into a full platform: tools that help barbers
              study, earn, and connect.
            </p>
          </div>

          {/* Two-col brand pillars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {[
              {
                label: 'Culture',
                title: 'Built inside the shop',
                body: 'Not a startup that discovered barbers. A brand that came from the culture — the grind, the craft, the community.',
              },
              {
                label: 'Tools',
                title: 'Built for the craft',
                body: 'State board prep, booking tools, resources for students and working pros. We build what barbers actually need.',
              },
              {
                label: 'Community',
                title: 'Built with the industry',
                body: 'Schools, distributors, platform partners. FadeJunkie connects the ecosystem around the barber at its center.',
              },
            ].map(p => (
              <div key={p.title} className="fj-card" style={{ padding: '28px' }}>
                <span className="fj-badge" style={{ marginBottom: '16px' }}>{p.label}</span>
                <h3 className="text-card-title" style={{ color: 'var(--color-black-95)', margin: '0 0 10px' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '1rem', color: 'var(--color-warm-500)', lineHeight: 1.6, margin: 0 }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Education Hub feature ────────────────────────────────────────── */}
      <section className="fj-section-alt" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
            <span className="fj-badge" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              First Digital Product
            </span>
            <h2 className="text-section" style={{ color: 'var(--color-black-95)', margin: '16px 0 20px' }}>
              Pass your Texas State Board.
            </h2>
            <p className="text-body-lg" style={{ color: 'var(--color-warm-500)' }}>
              Free study tools built from Texas barber curriculum and Milady-published materials.
              Flashcards, timed quizzes, and live group sessions — for students and schools.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '40px',
          }}>
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="fj-card"
                style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}
              >
                {f.comingSoon && (
                  <span className="fj-badge" style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(0,0,0,0.05)',
                    color: 'var(--color-warm-500)',
                  }}>
                    Coming Soon
                  </span>
                )}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-badge-bg)',
                  color: 'var(--color-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  {f.icon}
                </div>
                <span className="fj-badge" style={{ marginBottom: '12px' }}>{f.badge}</span>
                <h3 className="text-card-title" style={{ color: 'var(--color-black-95)', margin: '12px 0 10px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '1rem', color: 'var(--color-warm-500)', lineHeight: 1.6, margin: 0 }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/education" className="fj-btn-primary">
              Open Education Hub <ArrowRight size={16} style={{ marginLeft: '4px' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Partners teaser ──────────────────────────────────────────────── */}
      <section className="fj-section" style={{ padding: '80px 24px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center',
        }}>
          <div>
            <span className="fj-badge" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              Partners
            </span>
            <h2 className="text-section" style={{ color: 'var(--color-black-95)', margin: '16px 0 20px' }}>
              Built with the industry.
            </h2>
            <p className="text-body-lg" style={{ color: 'var(--color-warm-500)', marginBottom: '32px' }}>
              We partner with barber schools, distributors, and platform brands to bring
              real resources to real barbers. If you serve the industry, let's talk.
            </p>
            <Link to="/partners" className="fj-btn-secondary">
              View Partners
            </Link>
          </div>
          <div style={{
            background: 'var(--color-warm-white)',
            border: 'var(--border-whisper)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px',
            textAlign: 'center',
          }}>
            <p className="text-subhead" style={{ color: 'var(--color-black-95)', margin: '0 0 12px' }}>
              Interested in partnering?
            </p>
            <p style={{ color: 'var(--color-warm-500)', marginBottom: '24px', fontSize: '1rem' }}>
              Schools, distributors, and barber brands —<br />reach us directly.
            </p>
            <a
              href="mailto:partners@fadejunkie.com"
              className="fj-btn-primary"
              style={{ display: 'inline-flex' }}
            >
              Get in touch
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
