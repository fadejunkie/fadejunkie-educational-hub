import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { routeMeta } from '../data/routeMeta.mjs'

const meta = routeMeta['/guide/texas-barber-license-renewal']

// Renders the exact same copy that scripts/prerender-meta.mjs bakes into the
// static crawler-facing shell (single source of truth in routeMeta.mjs) — so
// what a user sees and what an AI crawler sees can never drift apart.
// Mirrors TexasBarberExamGuide.tsx's pattern exactly.
export default function TexasBarberLicenseRenewalGuide() {
  return (
    <>
      <PageMeta {...meta} />
      <section style={{ padding: '48px 24px 64px', background: 'var(--color-white)' }}>
        <div
          className="fj-article"
          style={{ maxWidth: '720px', margin: '0 auto', color: 'var(--color-black-95)', lineHeight: 1.65, fontSize: 16 }}
          dangerouslySetInnerHTML={{ __html: meta.staticContent ?? '' }}
        />
        <div style={{ maxWidth: '720px', margin: '32px auto 0', paddingTop: 24, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <Link to="/education" className="fj-btn-primary" style={{ fontSize: '0.9375rem' }}>
            Start Studying →
          </Link>
        </div>
      </section>
      <style>{`
        .fj-article h1 { font-size: clamp(28px, 5vw, 42px); font-weight: 700; letter-spacing: -1px; line-height: 1.08; margin: 0 0 20px; }
        .fj-article h2 { font-size: clamp(20px, 3vw, 26px); font-weight: 700; letter-spacing: -0.5px; margin: 36px 0 12px; }
        .fj-article p { margin: 0 0 16px; }
        .fj-article ul, .fj-article ol { margin: 0 0 16px; padding-left: 22px; }
        .fj-article li { margin-bottom: 6px; }
        .fj-article a { color: var(--color-blue); }
        .fj-article strong { font-weight: 700; }
      `}</style>
    </>
  )
}
