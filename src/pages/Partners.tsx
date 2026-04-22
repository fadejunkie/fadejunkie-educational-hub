import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Link } from 'react-router-dom'
import { SignedIn } from '@clerk/clerk-react'

// ── Partner card ───────────────────────────────────────────────────────────

interface PartnerRow {
  _id: string
  name: string
  handle?: string
  avatarUrl?: string
  type?: string
  description?: string
}

function PartnerCard({ p }: { p: PartnerRow }) {
  const initials = p.name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
  return (
    <div
      className="fj-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'box-shadow 0.15s, transform 0.15s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = 'var(--shadow-deep)'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = ''
        el.style.transform = ''
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '48px', height: '48px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden',
        }}>
          {p.avatarUrl ? (
            <img src={p.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-warm-500)', letterSpacing: '0.05em' }}>
              {initials}
            </span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '0.9375rem', fontWeight: 700,
            color: 'var(--color-black-95)', margin: '0 0 4px',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {p.name}
          </p>
          {p.type && <span className="fj-badge">{p.type}</span>}
        </div>
      </div>

      {p.description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-500)', lineHeight: 1.6, margin: 0 }}>
          {p.description}
        </p>
      )}

      {p.handle && (
        <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-warm-300)', margin: 0 }}>
          {p.handle}
        </p>
      )}
    </div>
  )
}

// ── Coming soon state ──────────────────────────────────────────────────────

function ComingSoon() {
  return (
    <div style={{
      border: '1.5px dashed rgba(0,0,0,0.12)',
      borderRadius: '16px',
      padding: '72px 24px',
      textAlign: 'center',
      background: 'var(--color-warm-white)',
    }}>
      <div style={{ fontSize: '32px', marginBottom: '16px' }}>✂️</div>
      <h2 style={{
        fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.4px',
        color: 'var(--color-black-95)', margin: '0 0 8px',
      }}>
        Coming soon
      </h2>
      <p style={{ fontSize: '0.9375rem', color: 'var(--color-warm-500)', margin: '0 0 28px', maxWidth: '380px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
        No partners listed yet. Be the first shop, brand, or studio to appear here.
      </p>
      <SignedIn>
        <Link to="/account" className="fj-btn-primary">
          List me as a partner →
        </Link>
      </SignedIn>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Partners() {
  const partners = useQuery(api.partners.listPartners)

  return (
    <section style={{ padding: '72px 24px 96px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ maxWidth: '600px', marginBottom: '64px' }}>
          <span className="fj-badge" style={{ marginBottom: '16px', display: 'inline-flex' }}>
            Partners
          </span>
          <h1
            className="text-display-2"
            style={{ color: 'var(--color-black-95)', margin: '0 0 16px' }}
          >
            Built with the industry.
          </h1>
          <p
            className="text-body-lg"
            style={{ color: 'var(--color-warm-500)', margin: 0, maxWidth: '480px' }}
          >
            Shops, studios, and brands contributing to what FadeJunkie is becoming.
          </p>
        </div>

        {/* Partner grid or coming soon */}
        {partners === undefined ? (
          // Loading
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '13px', color: 'rgba(0,0,0,0.38)' }}>Loading…</span>
          </div>
        ) : partners.length === 0 ? (
          <ComingSoon />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '64px',
          }}>
            {partners.map(p => <PartnerCard key={p._id} p={p as PartnerRow} />)}
          </div>
        )}

        {/* CTA */}
        <div style={{
          marginTop: partners && partners.length > 0 ? '0' : '48px',
          background: 'var(--color-warm-white)',
          border: 'var(--border-whisper)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap' as const,
        }}>
          <div>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-black-95)', margin: '0 0 6px' }}>
              Want to partner?
            </p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-warm-500)', margin: 0 }}>
              Schools, distributors, shops, and culture brands — reach out directly.
            </p>
          </div>
          <a href="mailto:partners@fadejunkie.com" className="fj-btn-primary" style={{ whiteSpace: 'nowrap' as const }}>
            Get in touch
          </a>
        </div>

      </div>
    </section>
  )
}
