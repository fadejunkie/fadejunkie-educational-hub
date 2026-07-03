# FadeJunkie Educational Hub — Agent Context

This is the source repo for **fadejunkie.com** — the Texas barber state board exam study platform.

## Project Overview

| Attribute | Value |
|-----------|-------|
| Stack | Vite + React + TypeScript + Convex + Clerk |
| Live URL | https://fadejunkie.com |
| GitHub | fadejunkie/fadejunkie-educational-hub |
| Deploy | `npx vercel --prod` from this directory |
| Vercel project | fadejunkie (prj_XPks98OKpI516syt1OtEhVWrjpUd) |

## Key Source Files

| File | Route | Purpose |
|------|-------|---------|
| `src/pages/EducationHub.tsx` | `/education` | Main hub landing page |
| `src/pages/Flash.tsx` | `/education/flash` | Flashcard study tool |
| `src/pages/Quiz.tsx` | `/education/quiz` | Practice quiz |
| `src/pages/PracticalExamGuide.tsx` | `/education/practical` | 11-section practical exam guide |
| `src/pages/Lander.tsx` | `/` | Public landing page |
| `src/data/studyData.ts` | — | All flashcard + quiz question data |
| `src/App.tsx` | — | Router config |

## Deploy Workflow

```bash
# Make changes, then:
npm run build          # verify build passes
npx vercel --prod      # deploy to fadejunkie.com
git add -A && git commit -m "..." && git push origin master
```

The `.vercel/project.json` is configured — just run `vercel --prod`.

## Current Feature State

### Flashcards (`/education/flash`)
- Topic pills filter the card deck
- **"All" pill is grayed out / disabled** (locked — topic-specific study only)
- Starred cards system (local state)
- Flip animation

### Quiz (`/education/quiz`)
- Setup screen: topic + question count selector
- **"All" topic pill is grayed out / disabled** (same as flashcards)
- Quiz + Results + breakdown by topic
- Saves session to Convex on completion

### Practical Exam Guide (`/education/practical`)
- 11 sections total
- **Sections 1–3 are active** (Pre-Exam Setup, Manicure, Professional Shave)
- **Sections 4–11 are grayed out / locked** (idx >= 3 in SECTIONS array)
- Left nav, mobile select dropdown, and Prev/Next nav all respect this lock

## Section Lock Logic

```
SECTIONS[0] = Pre-Exam Setup & Disinfection   ← ACTIVE
SECTIONS[1] = Manicure Service                ← ACTIVE
SECTIONS[2] = Professional Shave Service      ← ACTIVE
SECTIONS[3] = Blood Exposure Incident         ← LOCKED (gray)
SECTIONS[4] = Facial Service                  ← LOCKED
...
SECTIONS[10] = End of Exam Disinfection       ← LOCKED
```

To unlock more sections, change `isLocked = idx >= 3` to a higher threshold (e.g. `idx >= 5` to unlock sections 4–5).

## Convex Backend

- Deployment: **`dashing-armadillo-621`** (production). This is what `.env.local`
  (`CONVEX_DEPLOYMENT`, `VITE_CONVEX_URL`) points at and what fadejunkie.com queries.
  (The old `upbeat-pony-697` here was stale/wrong — always trust `.env.local`.)
- No dev/prod split: `npx convex dev --once` deploys straight to production.
- Auth: Clerk (`ConvexProviderWithClerk` after the P2 security cutover). See
  `SECURITY_AUDIT.md` + `.paul/RUNBOOK.md`.
- Tables: users, userRoles, barberPages, quizSessions, starredCards,
  studyPreferences, partnerProfiles, waitlist

## Topic List (studyData.ts)

Topics come from `TOPICS` export. "All" is always first. Subject topics include:
Sanitation & Safety, Anatomy & Physiology, Chemistry, Electricity, Infection Control,
Implements & Equipment, Haircutting & Styling, Chemical Services, Skin Care, Nails, Law & Rules

## Component Notes

- `PageMeta.tsx` — sets `<title>` + meta description + JSON-LD (useEffect-based)
- `GuestBanner.tsx` — banner for non-authenticated users
- `Nav.tsx` — top navigation bar
- `Footer.tsx` — site footer

## Rules

- **Always run `npm run build` before deploying** — catches TypeScript errors
- **Deploy via `npx vercel --prod`** from this directory (not from fadejunkie root)
- **Push to GitHub after every deploy** for source history
- Free tier must stay high quality — locked sections should look like "coming soon", not broken
