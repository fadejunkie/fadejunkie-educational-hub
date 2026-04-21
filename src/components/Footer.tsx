import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: 'var(--border-whisper)',
      background: 'var(--color-warm-white)',
      padding: '40px 24px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/fj-logo-black.png" alt="FadeJunkie" style={{ height: '24px', width: 'auto' }} />
          <span style={{ fontSize: '0.875rem', color: 'var(--color-warm-500)' }}>
            © {new Date().getFullYear()} FadeJunkie. Built by barbers, for barbers.
          </span>
        </div>
        <nav style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Education Hub', href: '/education' },
            { label: 'Partners',      href: '/partners'  },
          ].map(l => (
            <Link
              key={l.href}
              to={l.href}
              style={{ fontSize: '0.875rem', color: 'var(--color-warm-500)', textDecoration: 'none' }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://merch.fadejunkie.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.875rem', color: 'var(--color-warm-500)', textDecoration: 'none' }}
          >
            Merch
          </a>
        </nav>
      </div>
    </footer>
  )
}
