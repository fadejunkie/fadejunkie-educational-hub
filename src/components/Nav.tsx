import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SignInButton, SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-react'

const NAV_LINKS = [
  { label: 'Education Hub', href: '/education', sub: 'Study for the Texas board' },
  { label: 'Partners',      href: '/partners',  sub: 'Schools, brands, distributors' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { user } = useUser()
  const { signOut } = useClerk()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setOpen(false); setMenuOpen(false) }, [pathname])

  const breadcrumb =
    pathname.startsWith('/education') ? 'Education Hub' :
    pathname === '/account' ? 'Account' :
    pathname === '/profile' ? 'Profile' : null

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(14px)',
      borderBottom: 'var(--border-whisper)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo + optional breadcrumb */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img
            src="/fj-logo-black.png"
            alt="FadeJunkie"
            style={{ height: '22px', width: 'auto', objectFit: 'contain', opacity: 0.88 }}
          />
          {breadcrumb && (
            <span style={{
              fontSize: '12px',
              color: 'rgba(0,0,0,0.38)',
              borderLeft: '1px solid rgba(0,0,0,0.12)',
              paddingLeft: '10px',
              marginLeft: '2px',
            }}>
              {breadcrumb}
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden-mobile">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: pathname.startsWith(link.href) ? 'var(--color-black-95)' : 'var(--color-warm-500)',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                transition: 'color 0.15s',
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

          <SignedOut>
            <SignInButton mode="modal">
              <button className="fj-btn-secondary" style={{ marginLeft: '8px', fontSize: '0.875rem' }}>
                Sign in
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            {/* Avatar dropdown */}
            <div ref={menuRef} style={{ position: 'relative', marginLeft: '8px' }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Account menu"
                style={{
                  width: '30px', height: '30px', borderRadius: '9999px',
                  background: 'rgba(0,0,0,0.08)',
                  border: menuOpen ? '1.5px solid var(--color-blue)' : '1px solid rgba(0,0,0,0.12)',
                  cursor: 'pointer', overflow: 'hidden', padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-warm-500)' }}>
                    {user?.firstName?.[0] ?? '?'}
                  </span>
                )}
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '220px',
                  background: '#fff', border: 'var(--border-whisper)', borderRadius: '10px',
                  boxShadow: 'var(--shadow-deep)', overflow: 'hidden', zIndex: 60,
                }}>
                  <div style={{ padding: '12px 14px', borderBottom: 'var(--border-whisper)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-black-95)' }}>
                      {user?.fullName ?? user?.firstName ?? 'Account'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)', marginTop: '1px' }}>
                      {user?.primaryEmailAddress?.emailAddress ?? ''}
                    </div>
                  </div>
                  {([
                    { label: 'Profile', href: '/profile' },
                    { label: 'Account Settings', href: '/account' },
                    { label: 'Starred cards', href: '/education/flash' },
                  ] as const).map(item => (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: 'block', padding: '10px 14px', fontSize: '13px',
                        color: 'var(--color-black-95)', textDecoration: 'none',
                        borderTop: 'var(--border-whisper)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-warm-white)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { signOut(); setMenuOpen(false) }}
                    style={{
                      display: 'block', width: '100%', padding: '10px 14px', fontSize: '13px',
                      color: '#c4492a', textAlign: 'left' as const, background: 'transparent',
                      border: 'none', borderTop: 'var(--border-whisper)', cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-warm-white)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </SignedIn>

          <Link to="/education" className="fj-btn-primary" style={{ marginLeft: '8px', fontSize: '0.875rem' }}>
            Start Studying
          </Link>
        </nav>

        {/* Mobile right — avatar + hamburger */}
        <div style={{ display: 'none', alignItems: 'center', gap: '10px' }} className="show-mobile">
          <SignedIn>
            <div style={{
              width: '26px', height: '26px', borderRadius: '9999px',
              background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.12)',
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-warm-500)' }}>
                  {user?.firstName?.[0] ?? '?'}
                </span>
              )}
            </div>
          </SignedIn>

          <button
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', gap: '4px' }}
          >
            {open ? (
              <div style={{ width: '22px', height: '22px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '10px', left: 0, right: 0, height: '1.5px', background: 'var(--color-black-95)', transform: 'rotate(45deg)' }} />
                <div style={{ position: 'absolute', top: '10px', left: 0, right: 0, height: '1.5px', background: 'var(--color-black-95)', transform: 'rotate(-45deg)' }} />
              </div>
            ) : (
              <>
                <div style={{ width: '22px', height: '1.5px', background: 'var(--color-black-95)' }} />
                <div style={{ width: '22px', height: '1.5px', background: 'var(--color-black-95)' }} />
                <div style={{ width: '22px', height: '1.5px', background: 'var(--color-black-95)' }} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#fff', borderBottom: 'var(--border-whisper)',
          boxShadow: '0 12px 28px rgba(0,0,0,0.06)', zIndex: 40,
        }}>
          <div style={{ padding: '8px 0' }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                style={{ display: 'block', padding: '14px 20px', borderTop: 'var(--border-whisper)', textDecoration: 'none' }}
              >
                <div style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.2px', color: 'var(--color-black-95)' }}>{link.label}</div>
                <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.38)', marginTop: '2px' }}>{link.sub}</div>
              </Link>
            ))}
            {([
              { label: 'Barber', sub: 'Coming soon', href: '/barber' as string | null },
              { label: 'Shop', sub: 'Coming soon', href: null as string | null },
            ]).map(item => (
              item.href ? (
                <Link key={item.label} to={item.href} onClick={() => setOpen(false)}
                  style={{ display: 'block', padding: '14px 20px', borderTop: 'var(--border-whisper)', textDecoration: 'none', opacity: 0.5 }}
                >
                  <div style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.2px', color: 'var(--color-black-95)' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.38)', marginTop: '2px' }}>{item.sub}</div>
                </Link>
              ) : (
                <div key={item.label} style={{ padding: '14px 20px', borderTop: 'var(--border-whisper)', opacity: 0.5 }}>
                  <div style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.2px', color: 'var(--color-black-95)' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.38)', marginTop: '2px' }}>{item.sub}</div>
                </div>
              )
            ))}

            <SignedOut>
              <div style={{ borderTop: 'var(--border-whisper)', padding: '14px 20px' }}>
                <SignInButton mode="modal">
                  <button className="fj-btn-primary" style={{ width: '100%', justifyContent: 'center' as const }}>
                    Sign in with Google
                  </button>
                </SignInButton>
              </div>
            </SignedOut>

            <SignedIn>
              <div style={{ borderTop: 'var(--border-whisper)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '9999px',
                  background: 'rgba(0,0,0,0.08)', border: 'var(--border-whisper)',
                  overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-warm-500)' }}>
                      {user?.firstName?.[0] ?? '?'}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-black-95)' }}>
                    {user?.fullName ?? user?.firstName ?? 'Account'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.38)' }}>
                    <Link to="/profile" onClick={() => setOpen(false)} style={{ color: 'var(--color-blue)', textDecoration: 'none' }}>Profile</Link>
                    {' · '}
                    <Link to="/account" onClick={() => setOpen(false)} style={{ color: 'var(--color-blue)', textDecoration: 'none' }}>Account</Link>
                    {' · '}
                    <button
                      onClick={() => { signOut(); setOpen(false) }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '11px', color: '#c4492a' }}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      )}

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
