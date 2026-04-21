# FadeJunkie Educational Hub — Product Alignment

> This file defines what this product is, what it isn't, and the decisions
> that govern scope. Read before adding any feature.

---

## What This Is

The FadeJunkie Educational Hub is a **free study tool for barber students**,
starting with Texas State Board exam preparation.

It is the first digital product released under the FadeJunkie brand. Its job is
to demonstrate that FadeJunkie builds things that actually help barbers — not just
sell them merch. It earns trust with the community before anything is monetized.

---

## What This Is Not

- Not a full LMS (no courses, no video, no instructor dashboard — yet)
- Not a booking tool
- Not a shop management platform
- Not a paid subscription product (free at launch, always)
- Not built for general cosmetology — Texas barber curriculum only for now

If a feature request doesn't directly help a barber student pass their state board
or study with their class, it belongs in a different product.

---

## The North Star

> A barber student in Texas can open fadejunkie.com on their phone, pick up
> exactly where they left off, and study for 10 minutes between clients —
> for free, forever.

Every product decision is measured against that sentence.

---

## Core Features (Phased)

### Phase 1 — Lander (complete)
- Brand-first homepage at fadejunkie.com
- Education Hub and Partners navigation
- Feature cards describing the study modes
- Routes established for Phase 2

### Phase 2 — Study App
**Flashcard Mode**
- Flip cards sourced from Milady curriculum (300 questions, 2 decks)
- Filter by topic (Life Skills, History, Anatomy, Tools, Sanitation, etc.)
- Star cards to build a personal weak-spot deck
- Progress tracked per user via Convex

**Solo Quiz Mode**
- Timed multiple-choice quiz (20 / 50 / 100 / 150 questions)
- Randomized from full question bank or by topic
- Scored at end with per-topic breakdown
- Session history saved to user profile

**Group Mode (Kahoot-style)**
- Host creates room → shares 6-character code
- Students join on their own device
- Questions displayed live, answers submitted in real time
- Live scoreboard after each question
- Powered by Convex Realtime subscriptions

### Phase 3 — Merch
- Separate deployment at merch.fadejunkie.com
- FadeJunkie apparel showcase
- Links to fulfillment partner (Printify / Fourthwall / TBD)
- Brand-consistent design using this same design system

### Phase 4 — Expansion (future)
- Additional states beyond Texas
- Barbering theory deep-dives
- Barber school directory integration
- Partner school portals

---

## Auth Model

- **Google OAuth via Clerk** — frictionless for students
- Account is required only to save progress and join group sessions
- Flashcards and solo quiz work without login (progress not saved)
- Group mode requires login to track scores

---

## Data Model (Convex — separate deployment)

| Table | Purpose |
|---|---|
| `users` | Clerk identity sync |
| `progress` | Per user, per question: correct / skip / wrong |
| `quiz_sessions` | Completed solo sessions — score, topic breakdown |
| `rooms` | Live group quiz rooms |
| `room_players` | Players in a room with live scores |
| `room_answers` | Per-question answer submissions |

---

## Content Rules

See `CONTENT.md` for full question sourcing and deck management rules.
Short version: Milady published materials only until a licensed curriculum
partner is established.

---

## Success Metrics (Phase 2 launch)

- 100 student accounts created in first 30 days
- 500 quiz sessions completed in first 60 days
- At least one barber school using Group Mode with a class
- Zero paid acquisition — all organic / barber school referrals
