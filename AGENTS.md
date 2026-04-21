# FadeJunkie Educational Hub — Agent Instructions

> This file governs how AI agents (Claude Code, Lobe, Ink, etc.) interact
> with this codebase. Read before touching anything.

---

## Source of Truth Hierarchy

When there is any conflict between files, this is the order of authority:

1. `PRODUCT.md` — scope decisions, what gets built
2. `BRAND.md` — voice, tone, copy decisions
3. `DESIGN_SYSTEM.md` — all visual/UI decisions
4. `ARCHITECTURE.md` — stack and structural decisions
5. `CONTENT.md` — question and data decisions
6. `ROADMAP.md` — what phase we're in, what's next

**If the user asks for something that conflicts with these files, flag the conflict
before building. Don't silently override the source of truth.**

---

## What You Can Do Without Asking

- Fix TypeScript/lint errors
- Add new pages or components that follow existing patterns
- Update copy if it passes the BRAND.md sentence test
- Add questions to `CONTENT.md` taxonomy if sourced correctly
- Update `ROADMAP.md` task status when work is complete

---

## What You Must Ask Before Doing

- Adding any color not in `DESIGN_SYSTEM.md`
- Changing the nav structure (tabs, CTA label, routes)
- Adding a new npm dependency
- Changing the Convex schema
- Changing the auth flow
- Adding a new page that isn't in `PRODUCT.md`
- Changing the merch deployment strategy

---

## What You Must Never Do

- Add blue-gray tones — all neutrals must have warm/yellow-brown undertones
- Use inline hardcoded hex values — always use CSS variables or Tailwind tokens
- Share the Convex deployment with any client project
- Add cosmetology content that isn't Texas barber curriculum
- Generate question content with AI — Milady sources only (see `CONTENT.md`)
- Modify `questions.json` directly — edit source CSVs and re-run the import script
- Commit `.env.local` or any file containing secrets
- Add features outside the current phase without updating `ROADMAP.md` and `PRODUCT.md`

---

## Design Rules (summary — full spec in DESIGN_SYSTEM.md)

- All colors from `--color-*` CSS variables or Tailwind `fj-*` tokens
- Typography via `.text-display-hero`, `.text-section`, `.text-subhead`, etc.
- Cards use `.fj-card` or `.fj-card-hero`
- Buttons use `.fj-btn-primary` or `.fj-btn-secondary`
- Badges use `.fj-badge`
- Sections alternate `.fj-section` (white) and `.fj-section-alt` (warm white)
- `cn()` from `@/lib/cn` for all class merging
- Import paths always use `@/` alias — never relative `../../../`

---

## Voice Rules (summary — full spec in BRAND.md)

- Direct, no filler, no corporate language
- "Barbers" not "learners" or "users"
- Specific over vague: "300 Texas state board questions" not "comprehensive resources"
- Run all copy through the sentence test: "Would a barber roll their eyes at this?"

---

## Phase Awareness

Check `ROADMAP.md` before starting any build work. The current phase dictates
what's in scope. Building Phase 3 features during Phase 2 is out of scope.

---

## Convex + Clerk

- Convex project is **isolated** — do not reuse client project deployments
- Clerk handles all auth — do not implement custom auth
- All Convex mutations must handle errors explicitly — no silent failures
- Database migrations in separate commits from code (see ARCHITECTURE.md)

---

## When You Finish Work

1. Confirm build passes: `npm run build`
2. Update `ROADMAP.md` task status
3. If architectural decisions changed, update `ARCHITECTURE.md`
4. If new content rules were established, update `CONTENT.md`
