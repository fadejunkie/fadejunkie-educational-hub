import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Education Hub', href: '/education' },
  { label: 'Partners',      href: '/partners'  },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(14px)',
      borderBottom: 'var(--border-whisper)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img
            src="/fj-logo-black.png"
            alt="FadeJunkie"
            style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
          />
        </Link>

        {/* Desktop links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden-mobile">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: pathname.startsWith(link.href)
                  ? 'var(--color-black-95)'
                  : 'var(--color-warm-500)',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-black-95)')}
              onMouseLeave={e => {
                if (!pathname.startsWith(link.href))
                  e.currentTarget.style.color = 'var(--color-warm-500)'
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://merch.fadejunkie.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'var(--color-warm-500)',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-black-95)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-warm-500)')}
          >
            Merch
          </a>
          <Link to="/education" className="fj-btn-primary" style={{ marginLeft: '8px', fontSize: '0.875rem' }}>
            Start Studying
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: 'var(--color-black-95)',
          }}
          className="show-mobile"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          borderTop: 'var(--border-whisper)',
          background: 'var(--color-white)',
          padding: '12px 24px 20px',
        }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                fontSize: '1rem',
                fontWeight: pathname.startsWith(link.href) ? 600 : 500,
                color: pathname.startsWith(link.href)
                  ? 'var(--color-black-95)'
                  : 'var(--color-warm-500)',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: 'var(--border-whisper)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://merch.fadejunkie.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            style={{
              display: 'block',
              fontSize: '1rem',
              fontWeight: 500,
              color: 'var(--color-warm-500)',
              textDecoration: 'none',
              padding: '12px 0',
              borderBottom: 'var(--border-whisper)',
            }}
          >
            Merch
          </a>
          <div style={{ paddingTop: '16px' }}>
            <Link
              to="/education"
              className="fj-btn-primary"
              onClick={() => setOpen(false)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Start Studying
            </Link>
          </div>
        </div>
      )}

      {/* Responsive helpers */}
      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @media (min-width: 641px) {
          .show-mobile   { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
