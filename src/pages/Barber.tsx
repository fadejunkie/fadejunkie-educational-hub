import { useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { useUser, SignInButton } from '@clerk/clerk-react'
import { api } from '../../convex/_generated/api'
import {
  Scissors, Globe, Image, Calendar, MapPin, Share2,
  CheckCircle, ArrowRight, Zap, ClipboardList, Eye, Rocket,
  AlertCircle, Star, Lock,
} from 'lucide-react'

// ── What's included ────────────────────────────────────────────────────────
const INCLUDES = [
  { icon: <Globe size={20} strokeWidth={1.75} />, title: 'Your own page', body: 'A clean, mobile-ready page with your name, bio, and brand — live in minutes.' },
  { icon: <Scissors size={20} strokeWidth={1.75} />, title: 'Services + pricing', body: 'List your cuts, add-ons, and prices. Update anytime, no tech skills needed.' },
  { icon: <Image size={20} strokeWidth={1.75} />, title: 'Photo gallery', body: 'Show your work. Upload your best cuts and let the portfolio speak for itself.' },
  { icon: <Calendar size={20} strokeWidth={1.75} />, title: 'Booking link', body: 'Drop your Square, Booksy, or any booking URL. Clients tap, they book — done.' },
  { icon: <MapPin size={20} strokeWidth={1.75} />, title: 'Location + hours', body: 'Shop address, chair hours, walk-in availability. Everything a client needs to find you.' },
  { icon: <Share2 size={20} strokeWidth={1.75} />, title: 'Social links', body: 'Instagram, TikTok, YouTube — all in one place. One link in bio that does everything.' },
]

// ── Pricing tiers ──────────────────────────────────────────────────────────
const TIERS = [
  {
    name: 'Standard',
    price: '$10',
    period: '/mo',
    domain: 'yourname.fadejunkie.com',
    features: ['Your own barber page', 'Services + pricing', 'Photo gallery', 'Booking link', 'Location + hours', 'Social links'],
    cta: 'Start free for 7 days',
    highlight: false,
  },
  {
    name: 'Custom Domain',
    price: '$15',
    period: '/mo',
    domain: 'yourdomain.com',
    features: ['Everything in Standard', 'Bring your own domain', 'SSL certificate included', 'DNS setup guide'],
    cta: 'Start free for 7 days',
    highlight: true,
  },
]

// ── How it works ───────────────────────────────────────────────────────────
const STEPS = [
  { icon: <ClipboardList size={22} strokeWidth={1.75} />, step: '01', title: 'Fill the form', body: 'Name, services, photos, booking link, socials. Takes about 5 minutes.' },
  { icon: <Eye size={22} strokeWidth={1.75} />, step: '02', title: 'Preview your page', body: 'See exactly how it looks before anything goes live.' },
  { icon: <Rocket size={22} strokeWidth={1.75} />, step: '03', title: 'Deploy free for 7 days', body: 'Your page goes live at yourname.fadejunkie.com. No card needed to start.' },
]

// ── Logged-in hero ─────────────────────────────────────────────────────────
function AuthedHero({ onStart, loading }: { onStart: () => void; loading: boolean }) {
  return (
    <section className="fj-section" style={{ padding: '96px 24px 80px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ marginBottom: '24px' }}>
          <span className="fj-badge">
            <Star size={12} style={{ marginRight: '5px', display: 'inline' }} />
            7-Day Free Preview
          </span>
        </div>

        <h1 className="text-display-hero" style={{ color: 'var(--color-black-95)', margin: '0 0 24px' }}>
          Your barber page,<br />
          <span style={{ color: 'var(--color-blue)' }}>ready in minutes.</span>
        </h1>

        <p className="text-body-lg" style={{ color: 'var(--color-warm-500)', maxWidth: '500px', margin: '0 auto 16px', lineHeight: 1.65 }}>
          Fill a form. Preview your page. Deploy free for 7 days — no card required.
          After your trial, keep it live for just $10/month.
        </p>

        <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-300)', marginBottom: '40px' }}>
          Your link at <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-warm-500)' }}>yourname.fadejunkie.com</span> — permanent once deployed.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onStart}
            disabled={loading}
            className="fj-btn-primary"
            style={{ opacity: loading ? 0.7 : 1, fontSize: '1rem', padding: '14px 32px' }}
          >
            {loading ? 'Setting up…' : 'Build my page'}
            {!loading && <ArrowRight size={16} style={{ marginLeft: '8px' }} />}
          </button>
          <a href="#how-it-works" className="fj-btn-secondary" style={{ fontSize: '1rem', padding: '14px 24px' }}>
            See how it works
          </a>
        </div>
      </div>
    </section>
  )
}

// ── Logged-out hero ────────────────────────────────────────────────────────
function GuestHero({ email, setEmail, submitted, loading, onSubmit }: {
  email: string; setEmail: (v: string) => void;
  submitted: boolean; loading: boolean; onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <section className="fj-section" style={{ padding: '96px 24px 80px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ marginBottom: '24px' }}>
          <span className="fj-badge">
            <Zap size={12} style={{ marginRight: '5px', display: 'inline' }} />
            Coming Soon
          </span>
        </div>

        <h1 className="text-display-hero" style={{ color: 'var(--color-black-95)', margin: '0 0 24px' }}>
          Your barber page,<br />
          <span style={{ color: 'var(--color-blue)' }}>ten dollars a month.</span>
        </h1>

        <p className="text-body-lg" style={{ color: 'var(--color-warm-500)', maxWidth: '500px', margin: '0 auto 12px', lineHeight: 1.65 }}>
          Fill a form. Preview. Deploy to{' '}
          <span style={{ fontWeight: 600, color: 'var(--color-black-95)', fontFamily: 'monospace', fontSize: '0.95em' }}>
            yourname.fadejunkie.com
          </span>
          . Free for 7 days, then $10/month.
        </p>

        <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-300)', marginBottom: '40px' }}>
          Sign in to get started, or drop your email to be first when we launch.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <SignInButton mode="modal">
            <button className="fj-btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              Sign in to build your page <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </button>
          </SignInButton>
        </div>

        {submitted ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: 'var(--radius-xl)', background: 'rgba(0,117,222,0.07)', border: '1.5px solid var(--color-blue)', color: 'var(--color-blue)', fontSize: '0.9rem', fontWeight: 600 }}>
            <CheckCircle size={18} /> You're on the list.
          </div>
        ) : (
          <form onSubmit={onSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '400px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email" required placeholder="or drop your email for early access"
              value={email} onChange={e => setEmail(e.target.value)}
              style={{ flex: '1 1 200px', padding: '11px 16px', borderRadius: 'var(--radius-lg)', border: '1.5px solid rgba(0,0,0,0.14)', fontSize: '0.875rem', outline: 'none', background: 'var(--color-white)', color: 'var(--color-black-95)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--color-blue)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.14)')}
            />
            <button type="submit" disabled={loading} className="fj-btn-secondary" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saving…' : 'Notify me'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function Barber() {
  const { isSignedIn, user } = useUser()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [trialStarting, setTrialStarting] = useState(false)

  const joinWaitlist = useMutation(api.waitlist.join)
  const startTrial = useMutation(api.barber.startTrial)
  const barberRole = useQuery(
    api.barber.getBarberRole,
    isSignedIn ? { clerkId: user!.id } : 'skip'
  )

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try { await joinWaitlist({ email: email.trim(), role: 'barber' }); setSubmitted(true) }
    finally { setLoading(false) }
  }

  async function handleStartTrial() {
    if (!user) return
    setTrialStarting(true)
    try {
      await startTrial({ clerkId: user.id })
      window.location.href = '/build'
    } finally {
      setTrialStarting(false)
    }
  }

  const trialDaysLeft = barberRole?.trialEndsAt
    ? Math.max(0, Math.ceil((barberRole.trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <>
      {/* ── Hero — auth-aware ─────────────────────────────────────────── */}
      {isSignedIn && barberRole?.status === 'trial' ? (
        // Active trial — nudge them to build/manage
        <section className="fj-section" style={{ padding: '96px 24px 80px' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <span className="fj-badge" style={{ marginBottom: '24px', display: 'inline-flex' }}>
              <Star size={12} style={{ marginRight: '5px' }} />
              Trial active — {trialDaysLeft} days left
            </span>
            <h1 className="text-display-hero" style={{ color: 'var(--color-black-95)', margin: '0 0 24px' }}>
              Your page is waiting.
            </h1>
            <p className="text-body-lg" style={{ color: 'var(--color-warm-500)', marginBottom: '40px' }}>
              You have {trialDaysLeft} days left on your free preview. Finish building your page and go live.
            </p>
            <a href="/build" className="fj-btn-primary" style={{ fontSize: '1rem', padding: '14px 32px', display: 'inline-flex' }}>
              Continue building <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </a>
          </div>
        </section>
      ) : isSignedIn ? (
        <AuthedHero onStart={handleStartTrial} loading={trialStarting} />
      ) : (
        <GuestHero email={email} setEmail={setEmail} submitted={submitted} loading={loading} onSubmit={handleWaitlist} />
      )}

      {/* ── Price callout ─────────────────────────────────────────────── */}
      <section className="fj-section-alt" style={{ padding: '28px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-black-95)', letterSpacing: '-0.02em' }}>$10</span>
            <span style={{ color: 'var(--color-warm-500)', fontSize: '0.9rem' }}>/mo — fadejunkie subdomain</span>
          </div>
          <span style={{ color: 'var(--color-warm-300)' }}>·</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-black-95)', letterSpacing: '-0.02em' }}>$15</span>
            <span style={{ color: 'var(--color-warm-500)', fontSize: '0.9rem' }}>/mo — custom domain</span>
          </div>
          <span style={{ color: 'var(--color-warm-300)' }}>·</span>
          <span style={{ fontSize: '0.95rem', color: 'var(--color-warm-500)' }}>Free for 7 days. No card to start.</span>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="fj-section" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 48px' }}>
            <span className="fj-badge" style={{ marginBottom: '16px', display: 'inline-flex' }}>How it works</span>
            <h2 className="text-section" style={{ color: 'var(--color-black-95)', margin: '16px 0 0' }}>Form. Preview. Live.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {STEPS.map(s => (
              <div key={s.step} className="fj-card" style={{ padding: '32px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-badge-bg)', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-warm-300)' }}>{s.step}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-black-95)', margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-warm-500)', lineHeight: 1.6, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>

          {/* Slug permanence notice */}
          <div style={{ marginTop: '32px', padding: '20px 24px', borderRadius: 'var(--radius-xl)', background: 'rgba(255,170,0,0.06)', border: '1px solid rgba(255,170,0,0.25)', display: 'flex', gap: '14px', alignItems: 'flex-start', maxWidth: '680px', margin: '32px auto 0' }}>
            <AlertCircle size={18} strokeWidth={1.75} style={{ color: '#B45309', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#92400E', margin: '0 0 4px' }}>Your slug is permanent</p>
              <p style={{ fontSize: '0.875rem', color: '#92400E', lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
                The URL you deploy to — <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>yourname.fadejunkie.com</span> — cannot be changed after launch. Choose your slug carefully during setup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing tiers ────────────────────────────────────────────── */}
      <section className="fj-section-alt" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="fj-badge" style={{ marginBottom: '16px', display: 'inline-flex' }}>Pricing</span>
            <h2 className="text-section" style={{ color: 'var(--color-black-95)', margin: '16px 0 0' }}>Pick your plan.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {TIERS.map(tier => (
              <div key={tier.name} className="fj-card" style={{
                padding: '36px 32px',
                border: tier.highlight ? '2px solid var(--color-blue)' : undefined,
                position: 'relative',
              }}>
                {tier.highlight && (
                  <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-blue)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 14px', borderRadius: 'var(--radius-pill)' }}>
                    Most flexible
                  </span>
                )}
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-warm-500)' }}>{tier.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-black-95)', letterSpacing: '-0.02em' }}>{tier.price}</span>
                  <span style={{ color: 'var(--color-warm-500)', fontSize: '0.9rem' }}>{tier.period}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-warm-300)', marginBottom: '28px', fontFamily: 'monospace' }}>
                  {tier.domain}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {tier.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--color-warm-500)' }}>
                      <CheckCircle size={15} style={{ color: 'var(--color-blue)', flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                  {tier.highlight && (
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--color-warm-500)' }}>
                      <Lock size={15} style={{ color: 'var(--color-blue)', flexShrink: 0 }} /> Domain verification included
                    </li>
                  )}
                </ul>
                {isSignedIn ? (
                  <button onClick={handleStartTrial} disabled={trialStarting} className={tier.highlight ? 'fj-btn-primary' : 'fj-btn-secondary'} style={{ width: '100%', justifyContent: 'center', opacity: trialStarting ? 0.7 : 1 }}>
                    {tier.cta}
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button className={tier.highlight ? 'fj-btn-primary' : 'fj-btn-secondary'} style={{ width: '100%', justifyContent: 'center' }}>
                      {tier.cta}
                    </button>
                  </SignInButton>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included ──────────────────────────────────────────── */}
      <section className="fj-section" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ maxWidth: '560px', marginBottom: '48px' }}>
            <span className="fj-badge" style={{ marginBottom: '16px', display: 'inline-flex' }}>What's included</span>
            <h2 className="text-section" style={{ color: 'var(--color-black-95)', margin: '16px 0 20px' }}>Everything a barber needs. Nothing extra.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {INCLUDES.map(item => (
              <div key={item.title} className="fj-card" style={{ padding: '28px', display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.03)', color: 'var(--color-warm-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-black-95)', margin: '0 0 6px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-warm-500)', lineHeight: 1.6, margin: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
