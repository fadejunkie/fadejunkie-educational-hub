# FadeJunkie Educational Hub — Roadmap

> Phase tracker. Update task status as work completes.
> Status: ✅ done · 🔄 in progress · ⬜ not started · 🚫 blocked

---

## Phase 1 — Lander ✅

**Goal:** Brand-first homepage live at fadejunkie.com. FadeJunkie identity established,
Education Hub and Partners navigation in place.

| Task | Status |
|---|---|
| Vite + React + TypeScript scaffold | ✅ |
| Tailwind v4 + design token system | ✅ |
| CSS variables from design system | ✅ |
| `DESIGN_SYSTEM.md` source of truth | ✅ |
| `BRAND.md`, `PRODUCT.md`, `ARCHITECTURE.md`, `CONTENT.md`, `AGENTS.md`, `PARTNERS.md` | ✅ |
| Nav — sticky, hamburger, Education Hub + Partners tabs | ✅ |
| Footer — warm white, logo, nav links | ✅ |
| Lander — hero, stats, brand pillars, education feature cards, partners teaser | ✅ |
| Page shells — EducationHub, Partners | ✅ |
| GitHub repo — fadejunkie/fadejunkie-educational-hub | ✅ |
| Vercel deployment → fadejunkie.com | ⬜ |

---

## Phase 2 — Study App ⬜

**Goal:** Working study tool with all three modes. Users can create accounts,
study flashcards, take solo quizzes, and join live group sessions.

### Setup
| Task | Status |
|---|---|
| Convex project creation (isolated, new deployment) | ⬜ |
| Clerk setup + Google OAuth | ⬜ |
| Convex + Clerk integration wired | ⬜ |
| CSV → `questions.json` import script | ⬜ |
| Convex schema deployed | ⬜ |

### Flashcard Mode (`/education/flashcards`)
| Task | Status |
|---|---|
| Question data loaded from `questions.json` | ⬜ |
| Flip card component with animation | ⬜ |
| Topic filter | ⬜ |
| Star / unstar card | ⬜ |
| "Starred only" mode | ⬜ |
| Progress saved to Convex (logged-in users) | ⬜ |

### Solo Quiz Mode (`/education/quiz`)
| Task | Status |
|---|---|
| Question count picker (20 / 50 / 100 / 150) | ⬜ |
| Topic filter (or full bank) | ⬜ |
| Timed question display | ⬜ |
| Score + per-topic breakdown at end | ⬜ |
| Session history saved to Convex | ⬜ |

### Group Mode (`/education/group`)
| Task | Status |
|---|---|
| Host creates room → generates 6-char code | ⬜ |
| Students join via room code | ⬜ |
| Live question sync via Convex Realtime | ⬜ |
| Answer submission + real-time scoreboard | ⬜ |
| End-of-game results screen | ⬜ |

### Education Hub landing (`/education`)
| Task | Status |
|---|---|
| Mode picker (Flashcards / Quiz / Group) | ⬜ |
| User progress summary (if logged in) | ⬜ |
| Weakness heatmap by topic | ⬜ |

---

## Phase 3 — Merch ⬜

**Goal:** Separate deployment at `merch.fadejunkie.com` showcasing FadeJunkie
apparel with links to fulfillment.

| Task | Status |
|---|---|
| Fulfillment partner decision (Printify / Fourthwall / other) | ⬜ |
| New Vercel project — merch.fadejunkie.com | ⬜ |
| Merch lander — product showcase | ⬜ |
| Brand-consistent design (same design system) | ⬜ |
| DNS configuration — merch subdomain | ⬜ |

---

## Phase 4 — Expansion ⬜

**Goal:** Grow beyond Texas, deepen platform features.

| Task | Status |
|---|---|
| Multi-state support (question bank expansion) | ⬜ |
| Barber school directory integration | ⬜ |
| Partner school portals | ⬜ |
| Mobile app evaluation | ⬜ |

---

## Decisions Log

| Date | Decision | Reason |
|---|---|---|
| 2026-04-21 | Convex over Supabase | Real-time subscriptions native — better for Group Mode |
| 2026-04-21 | Clerk for auth | Native Convex integration, Google OAuth frictionless for students |
| 2026-04-21 | Separate Convex deployment | Isolate edu product from client projects |
| 2026-04-21 | Separate Vercel deployment for merch | Different concern, different subdomain |
| 2026-04-21 | Lead with brand on lander | Education Hub is one product line, not the whole brand |
| 2026-04-21 | Hamburger: Education Hub + Partners tabs | Two primary navigation destinations |
| 2026-04-21 | Notion-inspired design system | Warm, readable, focused — right for study tool |
