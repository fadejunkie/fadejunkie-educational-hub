# FadeJunkie Educational Hub — CLAUDE.md
> **Scope:** Source repo for fadejunkie.com — Texas barber state board exam study platform (Tier 2)
> **Parent:** `~/CLAUDE.md` (workspace router)
> **Verified:** 2026-07-05

Live product, separate repo from the `~/fadejunkie` client workspace. This is the ONLY live feature on fadejunkie.com — barber routes are blocked via middleware.

## Stack (verified against package.json)

React 19 + Vite + TypeScript + Convex + Clerk (`@clerk/clerk-react`) + Stripe + Tailwind 4 + react-router-dom 7.

| Attribute | Value |
|-----------|-------|
| Live URL | https://fadejunkie.com |
| Convex prod | `dashing-armadillo-621` |
| Vercel project | fadejunkie (`prj_XPks98OKpI516syt1OtEhVWrjpUd`) |
| Runbook | `.paul/RUNBOOK.md` (PAUL project — see also `.paul/STATE.md`, `SECURITY_AUDIT.md`) |

## CRITICAL: No Dev/Prod Split

**`.env.local` points straight at production** (`CONVEX_DEPLOYMENT=production:dashing-armadillo-621`). There is no dev deployment.

- **Read `.env.local` before running ANY `npx convex` command here.** `npx convex dev --once` deploys straight to production.
- Always trust `.env.local` for the deployment ID — older docs referencing `upbeat-pony-697` are wrong.

## Security Hard Rules (IDOR hardening shipped Jul 4, 2026)

- **Identity comes from `ctx.auth.getUserIdentity()` ONLY** — never from a client-supplied `clerkId` argument. Helpers live in `convex/authz.ts`; use them for every authenticated query/mutation.
- **Stripe webhook** (`convex/http.ts`) uses `stripe.webhooks.constructEventAsync` (not sync `constructEvent` — Convex edge runtime) with `process.env.STRIPE_WEBHOOK_SECRET` (uppercase) set in the **Convex dashboard env**, not `.env.local`.
- Stripe keys via `process.env.STRIPE_SECRET_KEY` — never hardcoded (workspace rule).
- Clerk auth wired via `ConvexProviderWithClerk`; `convex/auth.config.ts` defines the trusted JWT issuer.

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # tsc -b && vite build — ALWAYS run before deploying
npm run lint         # ESLint
npx vercel --prod    # deploy to fadejunkie.com (run from THIS directory)
```

After every deploy: `git add -A && git commit && git push origin master`.

## Layout

| Path | Purpose |
|------|---------|
| `src/pages/` | Routes: `Lander` (/), `EducationHub`, `Flash`, `Quiz`, `PracticalExamGuide`, `Admin`, `Profile`, `AccountSettings`, `Partners`, `Barber`, `Room` |
| `src/App.tsx` | Router config |
| `src/data/studyData.ts` | All flashcard + quiz question data (`TOPICS` export) |
| `convex/` | Backend — `authz.ts` (identity helpers), `http.ts` (Stripe webhook), `auth.config.ts` |
| `.paul/` | PAUL project state, runbook, phase docs |

Convex tables: users, userRoles, barberPages, quizSessions, starredCards, studyPreferences, partnerProfiles, waitlist.

## Gotchas

- **Feature gating by code, not data:** locked practical-exam sections use `isLocked = idx >= N` in `PracticalExamGuide.tsx`; "All" topic pills in Flash/Quiz are disabled in-component. Locked content must look "coming soon", never broken.
- `PageMeta.tsx` sets title/meta/JSON-LD via useEffect.
- Current status, open items, admin/dev-ticket details: `memory/projects/fadejunkie-edu-hub.md` (not this file).
