# FadeJunkie Educational Hub — Architecture

> Stack decisions, routing map, data flow, and environment setup.
> Update this file when any architectural decision changes.

---

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 19 + Vite | Fast DX, consistent with FJ ecosystem |
| Language | TypeScript | Type safety across Convex schema + UI |
| Styling | Tailwind v4 + CSS variables | Design token system per DESIGN_SYSTEM.md |
| Components | shadcn/ui (to be added Phase 2) | Accessible primitives, design-system friendly |
| Routing | React Router v7 | Simple, file-based mental model |
| Backend | Convex (dedicated project) | Real-time built-in — essential for Group Mode |
| Auth | Clerk (Google OAuth) | Native Convex integration, frictionless for students |
| Deploy (edu) | Vercel → fadejunkie.com | Main deployment |
| Deploy (merch) | Vercel → merch.fadejunkie.com | Separate project, separate deploy |
| Repo | github.com/fadejunkie/fadejunkie-educational-hub | Public |

---

## Project Structure

```
fadejunkie-educational-hub/
├── public/
│   ├── fj-logo-black.png       ← nav + footer logo
│   └── fj-logo-color.png       ← brand moments only
├── src/
│   ├── components/
│   │   ├── Nav.tsx              ← sticky nav, hamburger, two tabs
│   │   └── Footer.tsx           ← warm white footer
│   ├── lib/
│   │   └── cn.ts                ← Tailwind class merge utility
│   ├── pages/
│   │   ├── Lander.tsx           ← / (brand-first homepage)
│   │   ├── EducationHub.tsx     ← /education/* (Phase 2)
│   │   └── Partners.tsx         ← /partners (Phase 2)
│   ├── App.tsx                  ← route definitions
│   ├── main.tsx                 ← BrowserRouter entry
│   └── index.css                ← design tokens + .fj-* primitives
├── convex/                      ← added Phase 2
│   └── schema.ts
├── DESIGN_SYSTEM.md             ← design source of truth
├── BRAND.md                     ← voice, tone, anti-patterns
├── PRODUCT.md                   ← scope, north star, phases
├── ARCHITECTURE.md              ← this file
├── CONTENT.md                   ← question sourcing rules
├── AGENTS.md                    ← AI agent instructions
├── ROADMAP.md                   ← phase status tracker
├── PARTNERS.md                  ← partnership program
├── tailwind.config.ts           ← all design tokens in Tailwind
└── vite.config.ts               ← path alias (@/) + Tailwind plugin
```

---

## Routing Map

| Route | Component | Auth Required |
|---|---|---|
| `/` | `Lander` | No |
| `/education` | `EducationHub` (mode picker) | No |
| `/education/flashcards` | `Flashcards` (Phase 2) | No (save requires login) |
| `/education/quiz` | `Quiz` (Phase 2) | No (save requires login) |
| `/education/group` | `Group` (Phase 2) | Yes |
| `/partners` | `Partners` | No |

Merch lives at `merch.fadejunkie.com` — separate Vercel deployment, not a route.

---

## Nav Structure

**Desktop:** Logo | Education Hub · Partners · Merch | [Start Studying] CTA  
**Mobile hamburger tabs:** Education Hub · Partners + Merch link + [Start Studying] CTA

---

## Convex Setup (Phase 2)

```bash
npx convex dev   # starts local Convex dev server
npx convex deploy  # deploys to production
```

Convex project is **separate** from all client work. Do not reuse any existing
Convex deployment from fadejunkie client projects.

### Schema overview
```ts
// convex/schema.ts
users          — id, clerkId, displayName, createdAt
progress       — userId, questionId, result, timestamp
quiz_sessions  — userId, mode, score, topicBreakdown, completedAt
rooms          — roomCode, hostId, status, currentQuestionIdx, phase
room_players   — roomId, userId, displayName, score
room_answers   — roomId, questionId, userId, answer, isCorrect, answeredAt
```

---

## Environment Variables

```bash
# .env.local (never commit)
VITE_CONVEX_URL=         # Convex deployment URL
VITE_CLERK_PUBLISHABLE_KEY=  # Clerk publishable key
```

```bash
# Vercel environment (set in dashboard)
CONVEX_DEPLOY_KEY=       # for production Convex deploys
CLERK_SECRET_KEY=        # Clerk secret
```

---

## Path Alias

`@/` resolves to `src/` — configured in both `vite.config.ts` and `tsconfig.app.json`.

```ts
import { cn } from '@/lib/cn'
import Nav from '@/components/Nav'
```

---

## Key Rules

- Never import from `../../../` — always use `@/`
- Never add colors outside `DESIGN_SYSTEM.md` token set
- Never share Convex deployments with client projects
- Merch is always a separate Vercel deployment — never a route in this app
- Database migrations must be separate commits from code changes (learned from project_phoenix_v1)
