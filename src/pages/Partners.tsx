import { ArrowUpRight } from 'lucide-react'

// ── Partner data ───────────────────────────────────────────────────────────

interface Partner {
  name: string
  handle?: string
  location?: string
  type: string
  description: string
  href?: string
  initials: string
  accent: string // bg color for the logo tile
}

const SHOP_PARTNERS: Partner[] = [
  {
    name: "The Original Gentlemen's Parlor",
    handle: '@originalgentsparlor',
    location: 'Texas',
    type: 'Barber Shop',
    description: 'A classic barbershop bringing old-school craft and culture to every cut. Partnering with FadeJunkie to support student prep and community events.',
    initials: 'OGP',
    accent: '#1a1917',
  },
  {
    name: 'Fadetoven House of Fades',
    handle: '@fadetoven',
    location: 'Texas',
    type: 'Barber Shop',
    description: 'House of Fades — precision cuts and a deep love for the craft. Collaborating with FadeJunkie on education outreach and shop culture.',
    initials: 'FHF',
    accent: '#213183',
  },
]

const BRAND_PARTNERS: Partner[] = [
  {
    name: 'Wizardry Ink',
    handle: '@wizardryink',
    type: 'Tattoo Studio',
    description: 'Custom tattoo studio contributing to FadeJunkie\'s brand through collaborative content and cross-community marketing.',
    initials: 'WI',
    accent: '#391c57',
  },
  {
    name: 'Arquero Co.',
    handle: '@arquero.co',
    type: 'Brand',
    description: 'An emerging lifestyle brand aligned with FadeJunkie\'s aesthetic. Active partner in internal brand campaigns and creative direction.',
    initials: 'AQ',
    accent: '#523410',
  },
  {
    name: 'Lazydaze',
    handle: '@lazydaze',
    type: 'Brand',
    description: 'Culture-first brand bringing laid-back energy to FadeJunkie\'s ecosystem. Contributing to campaigns, drops, and community-driven content.',
    initials: 'LD',
    accent: '#2a9d99',
  },
]

// ── Partner card ───────────────────────────────────────────────────────────

function PartnerCard({ partner }: { partner: Partner }) {
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
      {/* Logo tile + name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-md)',
          background: partner.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontFamily: 'var(--font-sans)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '0.05em',
        }}>
          {partner.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: 'var(--color-black-95)',
            margin: '0 0 2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {partner.name}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="fj-badge">{partner.type}</span>
            {partner.location && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-300)' }}>
                {partner.location}
              </span>
            )}
          </div>
        </div>
        {partner.href && (
          <ArrowUpRight size={16} color="var(--color-warm-300)" style={{ flexShrink: 0 }} />
        )}
      </div>

      {/* Description */}
      <p style={{
        fontSize: '0.875rem',
        color: 'var(--color-warm-500)',
        lineHeight: 1.6,
        margin: 0,
      }}>
        {partner.description}
      </p>

      {/* Handle */}
      {partner.handle && (
        <p style={{
          fontSize: '0.8rem',
          fontWeight: 500,
          color: 'var(--color-warm-300)',
          margin: 0,
          letterSpacing: '0.01em',
        }}>
          {partner.handle}
        </p>
      )}
    </div>
  )
}

// ── Section header ─────────────────────────────────────────────────────────

function SectionLabel({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <span className="fj-badge" style={{ marginBottom: '12px', display: 'inline-flex' }}>
        {eyebrow}
      </span>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'var(--color-black-95)',
        margin: '0 0 8px',
        letterSpacing: '-0.5px',
      }}>
        {title}
      </h2>
      <p style={{ fontSize: '0.9375rem', color: 'var(--color-warm-500)', margin: 0, lineHeight: 1.6 }}>
        {sub}
      </p>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Partners() {
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

        {/* Shop Partners */}
        <div style={{ marginBottom: '64px' }}>
          <SectionLabel
            eyebrow="Shops"
            title="Community barbershops"
            sub="Local shops supporting FadeJunkie's education mission and connecting us to working barbers."
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {SHOP_PARTNERS.map(p => <PartnerCard key={p.name} partner={p} />)}
          </div>
        </div>

        {/* Brand Partners */}
        <div style={{ marginBottom: '64px' }}>
          <SectionLabel
            eyebrow="Brand Partners"
            title="Contributing brands"
            sub="Brands actively collaborating on internal marketing projects and growing alongside FadeJunkie."
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {BRAND_PARTNERS.map(p => <PartnerCard key={p.name} partner={p} />)}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'var(--color-warm-white)',
          border: 'var(--border-whisper)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-black-95)', margin: '0 0 6px' }}>
              Want to partner?
            </p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-warm-500)', margin: 0 }}>
              Schools, distributors, shops, and culture brands — reach out directly.
            </p>
          </div>
          <a
            href="mailto:partners@fadejunkie.com"
            className="fj-btn-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            Get in touch
          </a>
        </div>

      </div>
    </section>
  )
}
