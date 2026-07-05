import { useEffect, useRef, useState } from 'react'

const TITLES = [
  'Cover',
  'The Problem',
  'The Product',
  'How It Works',
  'Business Model',
  'Barber Pages',
  'Why It Compounds',
  'Already Built',
  "What's Ahead",
  'Get Involved',
]

export default function Growth() {
  const deckRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLElement | null)[]>([])
  const currentRef = useRef(0)
  const [current, setCurrent] = useState(0)

  const setSlideRef = (i: number) => (el: HTMLElement | null) => {
    slideRefs.current[i] = el
  }

  function goTo(i: number) {
    const slides = slideRefs.current.filter(Boolean) as HTMLElement[]
    const clamped = Math.max(0, Math.min(slides.length - 1, i))
    slides[clamped]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    document.body.classList.add('growth-lock')
    const slides = slideRefs.current.filter(Boolean) as HTMLElement[]

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            const idx = slides.indexOf(e.target as HTMLElement)
            currentRef.current = idx
            setCurrent(idx)
          }
        })
      },
      { root: deckRef.current, threshold: [0.6] },
    )
    slides.forEach((s) => io.observe(s))

    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        goTo(currentRef.current + 1)
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        goTo(currentRef.current - 1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        goTo(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        goTo(slides.length - 1)
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.classList.remove('growth-lock')
      io.disconnect()
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const pad = (n: number) => (n < 10 ? '0' + n : '' + n)

  return (
    <div className="growth-page">
      <style>{`
        body.growth-lock { overflow: hidden; }

        .growth-page {
          position: fixed; inset: 0; z-index: 10;
          background: var(--color-white);
          color: var(--color-black-95);
        }
        .growth-deck {
          height: 100vh; width: 100vw;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
        @media (prefers-reduced-motion: reduce) { .growth-deck { scroll-behavior: auto; } }

        .growth-slide {
          height: 100vh; width: 100%;
          scroll-snap-align: start;
          display: flex; flex-direction: column; justify-content: center;
          padding: clamp(28px, 6vw, 96px) clamp(24px, 8vw, 120px);
        }

        .g-home {
          position: fixed; top: 20px; left: clamp(20px, 5vw, 40px); z-index: 30;
          font-size: 13px; font-weight: 600; letter-spacing: -0.01em;
          color: var(--color-black-95); text-decoration: none;
          opacity: 0.55; transition: opacity 0.15s ease;
        }
        .g-home:hover { opacity: 1; }
        .growth-slide--dark .g-home { color: var(--color-white); }

        .g-eyebrow {
          font-size: 12px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--color-warm-500); margin: 0 0 14px;
        }
        .growth-slide--dark .g-eyebrow { color: rgba(255,255,255,0.6); }

        .g-teeth {
          width: 96px; height: 10px; margin-bottom: 22px; opacity: 0.6;
          background-image: repeating-linear-gradient(to right, var(--color-warm-300) 0, var(--color-warm-300) 1.5px, transparent 1.5px, transparent 7px);
        }
        .growth-slide--dark .g-teeth {
          opacity: 1;
          background-image: repeating-linear-gradient(to right, rgba(255,255,255,0.45) 0, rgba(255,255,255,0.45) 1.5px, transparent 1.5px, transparent 7px);
        }

        .g-h1 {
          font-size: clamp(32px, 5vw, 60px); line-height: 1.04; letter-spacing: -0.045em;
          font-weight: 700; margin: 0 0 22px; max-width: 16ch; text-wrap: balance;
        }
        .g-wordmark {
          font-size: clamp(42px, 7.5vw, 88px); line-height: 0.95; letter-spacing: -0.05em;
          font-weight: 700; margin: 0 0 18px;
        }
        .g-wordmark span { color: #3d9dff; }
        .g-body {
          font-size: clamp(15.5px, 1.3vw, 18.5px); line-height: 1.55; font-weight: 400;
          color: var(--color-warm-500); max-width: 60ch; margin: 0 0 14px;
        }
        .growth-slide--dark .g-body { color: rgba(255,255,255,0.72); }
        .g-body strong { color: var(--color-black-95); font-weight: 600; }
        .growth-slide--dark .g-body strong { color: var(--color-white); }

        .g-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(24px, 4vw, 64px); align-items: start; max-width: 1180px; }
        @media (max-width: 780px) { .g-grid-2 { grid-template-columns: 1fr; } }

        .g-feature-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 900px; }
        @media (max-width: 700px) { .g-feature-grid { grid-template-columns: 1fr; } }
        .g-card {
          background: var(--color-white); border: var(--border-whisper);
          border-radius: var(--radius-md); padding: 20px 22px; box-shadow: var(--shadow-card);
        }
        .g-card h3 { font-size: 16px; font-weight: 600; letter-spacing: -0.01em; margin: 0 0 6px; }
        .g-card p { font-size: 14.5px; line-height: 1.5; color: var(--color-warm-500); margin: 0; }

        .g-plain { list-style: none; margin: 8px 0 0; padding: 0; max-width: 640px; }
        .g-plain li {
          position: relative; padding-left: 22px; margin-bottom: 13px;
          font-size: clamp(15px, 1.2vw, 17.5px); line-height: 1.5; color: var(--color-warm-500);
        }
        .g-plain li::before {
          content: ""; position: absolute; left: 0; top: 0.55em;
          width: 7px; height: 7px; border-radius: 50%; background: var(--color-blue);
        }
        .g-plain li strong { color: var(--color-black-95); font-weight: 600; }

        .g-cover-meta {
          display: flex; gap: 28px; flex-wrap: wrap; margin-top: 40px;
          font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
        .g-cover-meta a { color: inherit; }

        .g-flow { display: flex; align-items: stretch; gap: 0; max-width: 1160px; flex-wrap: wrap; margin-top: 14px; }
        .g-flow-step {
          flex: 1 1 220px; background: var(--color-white); border: var(--border-whisper);
          border-radius: var(--radius-md); padding: 22px 20px; min-width: 200px;
        }
        .g-flow-step .n { font-size: 13px; font-weight: 700; color: var(--color-blue); margin-bottom: 10px; letter-spacing: 0.02em; }
        .g-flow-step h4 { font-size: 15.5px; font-weight: 600; margin: 0 0 6px; }
        .g-flow-step p { font-size: 13.5px; line-height: 1.45; color: var(--color-warm-500); margin: 0; }
        .g-flow-arrow { display: flex; align-items: center; justify-content: center; color: var(--color-warm-300); font-size: 20px; padding: 0 6px; flex: 0 0 auto; }
        @media (max-width: 900px) { .g-flow-arrow { display: none; } }

        .g-flywheel-wrap { display: flex; gap: 40px; align-items: center; flex-wrap: wrap; margin-top: 6px; }
        .g-flywheel svg { width: min(300px, 26vw, 34vh); height: auto; min-width: 220px; display: block; }
        .g-flywheel-legend { max-width: 380px; }
        .g-flywheel-legend .item { margin-bottom: 14px; display: flex; gap: 10px; align-items: baseline; }
        .g-flywheel-legend .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-blue); flex: 0 0 auto; transform: translateY(-1px); }
        .g-flywheel-legend p { margin: 0; font-size: 14.5px; line-height: 1.5; color: var(--color-warm-500); }
        .g-flywheel-legend p strong { color: var(--color-black-95); }

        .g-check-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 32px; max-width: 900px; margin-top: 10px; }
        @media (max-width: 700px) { .g-check-grid { grid-template-columns: 1fr; } }
        .g-check-item { display: flex; gap: 12px; align-items: flex-start; }
        .g-check-mark {
          flex: 0 0 auto; width: 20px; height: 20px; border-radius: 50%;
          background: var(--color-blue); color: var(--color-white);
          display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; margin-top: 2px;
        }
        .g-check-item p { margin: 0; font-size: 15px; line-height: 1.45; color: var(--color-warm-500); }
        .g-check-item p strong { color: var(--color-black-95); }

        .g-navbar {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 30;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px clamp(20px, 5vw, 56px);
        }
        .g-dots { display: flex; gap: 9px; }
        .g-dot {
          width: 7px; height: 7px; border-radius: 50%; background: var(--color-warm-300); opacity: 0.5;
          border: none; padding: 0; cursor: pointer; transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .g-dot:hover { opacity: 0.85; }
        .g-dot[aria-current="true"] { opacity: 1; background: var(--color-blue); transform: scale(1.35); }
        .g-navbtns { display: flex; gap: 8px; align-items: center; }
        .g-navbtn {
          width: 38px; height: 38px; border-radius: 50%; background: var(--color-white);
          border: var(--border-whisper); color: var(--color-black-95); font-size: 15px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .g-navbtn:hover { border-color: var(--color-blue); color: var(--color-blue); }
        .g-navbtn:disabled { opacity: 0.35; cursor: default; }
        .g-counter { font-variant-numeric: tabular-nums; font-size: 12.5px; color: var(--color-warm-300); min-width: 44px; text-align: center; }
        @media (max-width: 560px) { .g-dots { display: none; } }
      `}</style>

      <a href="/" className="g-home">← fadejunkie.com</a>

      <div className="growth-deck" ref={deckRef}>
        {/* 1 — Cover */}
        <section
          className="growth-slide fj-section-dark growth-slide--dark"
          ref={setSlideRef(0)}
        >
          <div className="g-teeth" />
          <span className="fj-badge">FadeJunkie · Growth Overview</span>
          <h1 className="g-wordmark">
            Built by barbers.
            <br />
            <span>For barbers.</span>
          </h1>
          <p className="g-body" style={{ maxWidth: '46ch', color: 'rgba(255,255,255,0.72)' }}>
            The Educational Hub is our first product — a study app that helps barber
            students pass their state board exam. It's the first step toward
            something bigger.
          </p>
          <div className="g-cover-meta">
            <span>fadejunkie.com</span>
            <span>Texas</span>
            <span>2026</span>
          </div>
        </section>

        {/* 2 — The Problem */}
        <section className="growth-slide fj-section" ref={setSlideRef(1)}>
          <div className="g-eyebrow">The problem</div>
          <div className="g-teeth" />
          <h1 className="g-h1">Studying for the state board exam wasn't built with barbers in mind.</h1>
          <ul className="g-plain">
            <li><strong>The license is mandatory.</strong> Every barber has to pass a state board exam before they can legally get paid to cut hair.</li>
            <li><strong>The tools don't fit.</strong> Most exam-prep apps are built for cosmetology schools — different exam, different content, wrong world entirely.</li>
            <li><strong>The good ones cost a monthly fee.</strong> Barber students are already paying for school. Another subscription doesn't help.</li>
            <li><strong>Real studying happens in 10-minute gaps</strong> between clients and classes, on a phone — not sitting down at a laptop.</li>
          </ul>
        </section>

        {/* 3 — The Product */}
        <section className="growth-slide fj-section-alt" ref={setSlideRef(2)}>
          <div className="g-eyebrow">The product</div>
          <div className="g-teeth" />
          <h1 className="g-h1" style={{ maxWidth: '14ch' }}>One app that actually gets it.</h1>
          <p className="g-body">
            <strong>fadejunkie.com/education</strong> is a study tool built specifically
            for the Texas barber state board exam — live right now.
          </p>
          <div className="g-feature-grid" style={{ marginTop: 10 }}>
            <div className="g-card"><h3>Flashcards</h3><p>Flip through real exam topics. Star the ones you keep missing so you study smarter, not longer.</p></div>
            <div className="g-card"><h3>Practice Quiz</h3><p>Timed, scored, and broken down by topic afterward — so you know exactly what to review next.</p></div>
            <div className="g-card"><h3>Practical Exam Guide</h3><p>An 11-part, step-by-step walkthrough of the hands-on portion of the exam.</p></div>
            <div className="g-card"><h3>Study Together</h3><p>A live group room — a whole class can quiz each other in real time, like a game.</p></div>
          </div>
        </section>

        {/* 4 — How It Works */}
        <section className="growth-slide fj-section" ref={setSlideRef(3)}>
          <div className="g-eyebrow">How it works</div>
          <div className="g-teeth" />
          <h1 className="g-h1" style={{ maxWidth: '15ch' }}>No manuals. Just sign in and study.</h1>
          <div className="g-flow">
            <div className="g-flow-step"><div className="n">STEP 1</div><h4>Sign in with Google</h4><p>One tap. No new password to remember.</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-step"><div className="n">STEP 2</div><h4>Pick a study mode</h4><p>Flashcards, Practice Quiz, or the Practical Guide.</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-step"><div className="n">STEP 3</div><h4>Progress saves itself</h4><p>Pick up exactly where you left off, on any device.</p></div>
            <div className="g-flow-arrow">→</div>
            <div className="g-flow-step"><div className="n">STEP 4</div><h4>Walk in ready</h4><p>Know your weak spots before exam day does.</p></div>
          </div>
        </section>

        {/* 5 — Business Model */}
        <section className="growth-slide fj-section-alt" ref={setSlideRef(4)}>
          <div className="g-eyebrow">How we make money</div>
          <div className="g-teeth" />
          <h1 className="g-h1">$15. One time.<br />Yours for good.</h1>
          <p className="g-body">
            Students pay once — never a monthly bill. <strong>$15 unlocks every study
            tool for as long as they need it</strong>, through school and beyond.
          </p>
          <p className="g-body">
            It's priced low on purpose. The goal isn't to squeeze students for
            revenue — it's to earn their trust early, cheaply, so they stick with
            FadeJunkie for everything that comes next.
          </p>
        </section>

        {/* 6 — Barber Pages */}
        <section className="growth-slide fj-section" ref={setSlideRef(5)}>
          <div className="g-eyebrow">What we're building next</div>
          <div className="g-teeth" />
          <div className="g-grid-2">
            <div><h1 className="g-h1" style={{ maxWidth: '13ch' }}>After the exam, barbers need a page — not just a license.</h1></div>
            <div>
              <p className="g-body">
                Once a student passes and starts working, they need somewhere to
                send new clients: their services, their prices, photos of their
                work, and a way to book an appointment.
              </p>
              <p className="g-body">
                We're building simple, hosted pages for working barbers — <strong>free
                to start</strong>, with a paid option for barbers who want their own web
                address. This is in progress right now, built on the same
                foundation as the study app.
              </p>
              <span className="fj-badge">In progress</span>
            </div>
          </div>
        </section>

        {/* 7 — Why It Compounds */}
        <section className="growth-slide fj-section-alt" ref={setSlideRef(6)}>
          <div className="g-eyebrow">Why it compounds</div>
          <div className="g-teeth" />
          <h1 className="g-h1" style={{ maxWidth: '15ch' }}>One brand. Two products. One flywheel.</h1>
          <div className="g-flywheel-wrap">
            <div className="g-flywheel">
              <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="150" cy="150" r="108" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" strokeDasharray="2 7" />
                <circle cx="150" cy="42" r="40" fill="#fff" stroke="#0075de" strokeWidth="1.5" />
                <text x="150" y="38" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#17130f">STUDY</text>
                <text x="150" y="50" textAnchor="middle" fontSize="9" fill="#615d59">$15 pass</text>

                <circle cx="258" cy="150" r="40" fill="#fff" stroke="#0075de" strokeWidth="1.5" />
                <text x="258" y="146" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#17130f">GRADUATE</text>
                <text x="258" y="158" textAnchor="middle" fontSize="9" fill="#615d59">starts working</text>

                <circle cx="150" cy="258" r="40" fill="#fff" stroke="#0075de" strokeWidth="1.5" />
                <text x="150" y="254" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#17130f">BUILD A PAGE</text>
                <text x="150" y="266" textAnchor="middle" fontSize="9" fill="#615d59">revenue</text>

                <circle cx="42" cy="150" r="40" fill="#fff" stroke="#0075de" strokeWidth="1.5" />
                <text x="42" y="146" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#17130f">REFER</text>
                <text x="42" y="158" textAnchor="middle" fontSize="9" fill="#615d59">new students</text>

                <path d="M 182 55 A 108 108 0 0 1 246 118" stroke="#0075de" strokeWidth="1.5" markerEnd="url(#g-arrow)" />
                <path d="M 246 182 A 108 108 0 0 1 182 245" stroke="#0075de" strokeWidth="1.5" markerEnd="url(#g-arrow)" />
                <path d="M 118 245 A 108 108 0 0 1 54 182" stroke="#0075de" strokeWidth="1.5" markerEnd="url(#g-arrow)" />
                <path d="M 54 118 A 108 108 0 0 1 118 55" stroke="#0075de" strokeWidth="1.5" markerEnd="url(#g-arrow)" />
                <defs>
                  <marker id="g-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                    <path d="M0,0 L7,3.5 L0,7 Z" fill="#0075de" />
                  </marker>
                </defs>
              </svg>
            </div>
            <div className="g-flywheel-legend">
              <div className="item"><span className="dot" /><p>A student pays <strong>$15</strong> and studies with us — cheap, low-risk, builds trust.</p></div>
              <div className="item"><span className="dot" /><p>They <strong>graduate</strong> and start cutting hair for real clients.</p></div>
              <div className="item"><span className="dot" /><p>They need a professional <strong>page</strong> — that's where the business grows with them.</p></div>
              <div className="item"><span className="dot" /><p>They tell their classmates, who <strong>refer</strong> the next wave of students.</p></div>
            </div>
          </div>
        </section>

        {/* 8 — Already Built */}
        <section className="growth-slide fj-section" ref={setSlideRef(7)}>
          <div className="g-eyebrow">Not just an idea</div>
          <div className="g-teeth" />
          <h1 className="g-h1" style={{ maxWidth: '14ch' }}>This is already live.</h1>
          <div className="g-check-grid">
            <div className="g-check-item"><span className="g-check-mark">✓</span><p>Real students can <strong>sign in with Google</strong> right now at fadejunkie.com.</p></div>
            <div className="g-check-item"><span className="g-check-mark">✓</span><p><strong>Payments are wired up and working</strong> — the $15 pass really works, end to end.</p></div>
            <div className="g-check-item"><span className="g-check-mark">✓</span><p>We built our own <strong>admin dashboard</strong> to run the whole site day to day.</p></div>
            <div className="g-check-item"><span className="g-check-mark">✓</span><p>We had the whole system <strong>security-checked and fixed</strong> before real money moved through it.</p></div>
          </div>
        </section>

        {/* 9 — What's Ahead */}
        <section className="growth-slide fj-section-alt" ref={setSlideRef(8)}>
          <div className="g-eyebrow">What's ahead</div>
          <div className="g-teeth" />
          <h1 className="g-h1" style={{ maxWidth: '15ch' }}>Texas is the start, not the ceiling.</h1>
          <ul className="g-plain">
            <li><strong>More states</strong> beyond Texas, once the Texas exam content is proven out.</li>
            <li><strong>Partnerships with barber schools</strong> for live, in-classroom study sessions.</li>
            <li><strong>Finishing the barber page product</strong>, including custom web addresses for working barbers.</li>
            <li><strong>Growing the FadeJunkie merch line</strong> alongside the tools, under the same brand.</li>
          </ul>
        </section>

        {/* 10 — Closing */}
        <section
          className="growth-slide fj-section-dark growth-slide--dark"
          ref={setSlideRef(9)}
        >
          <div className="g-teeth" />
          <div className="g-eyebrow">Let's talk</div>
          <h1 className="g-h1" style={{ maxWidth: '14ch', color: 'inherit' }}>
            Built from inside the shop. Growing from the ground up.
          </h1>
          <p className="g-body" style={{ maxWidth: '52ch', color: 'rgba(255,255,255,0.72)' }}>
            We're looking for people who want to help barbers the same way we do —
            schools, partners, and investors who believe the barber community
            deserves better tools than it's been given.
          </p>
          <div className="g-cover-meta">
            <a href="/">fadejunkie.com</a>
            <a href="mailto:partners@fadejunkie.com">partners@fadejunkie.com</a>
          </div>
        </section>
      </div>

      <div className="g-navbar">
        <div className="g-navbtns">
          <button className="g-navbtn" onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Previous slide">‹</button>
          <span className="g-counter">{pad(current + 1)} / {pad(TITLES.length)}</span>
          <button className="g-navbtn" onClick={() => goTo(current + 1)} disabled={current === TITLES.length - 1} aria-label="Next slide">›</button>
        </div>
        <div className="g-dots" role="tablist" aria-label="Slide navigation">
          {TITLES.map((t, i) => (
            <button
              key={t}
              className="g-dot"
              aria-current={current === i}
              aria-label={`Go to slide ${i + 1}: ${t}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
