import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--color-warm-white)',
      borderTop: 'var(--border-whisper)',
      padding: '28px 20px 24px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Nametag logo */}
        <img
          src="/fj-nametag-black.png"
          alt="fadejunkie"
          style={{ height: '60px', width: 'auto', objectFit: 'contain', alignSelf: 'flex-start', opacity: 0.9 }}
        />

        {/* Links row */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '11px', color: 'rgba(0,0,0,0.6)', alignItems: 'center' }}>
          <Link to="/education" style={{ color: 'rgba(0,0,0,0.6)', textDecoration: 'none' }}>Education Hub</Link>
          <Link to="/partners" style={{ color: 'rgba(0,0,0,0.6)', textDecoration: 'none' }}>Partners</Link>
          <span style={{ color: 'rgba(0,0,0,0.38)' }}>Barber · Soon</span>
          <a
            href="mailto:partners@fadejunkie.com"
            style={{ color: 'rgba(0,0,0,0.6)', textDecoration: 'none', marginLeft: 'auto' }}
          >
            partners@fadejunkie.com
          </a>
        </div>

        {/* Copyright */}
        <div style={{
          fontSize: '10px',
          color: 'rgba(0,0,0,0.38)',
          borderTop: 'var(--border-whisper)',
          paddingTop: '10px',
        }}>
          © {new Date().getFullYear()} FadeJunkie
        </div>
      </div>
    </footer>
  )
}
