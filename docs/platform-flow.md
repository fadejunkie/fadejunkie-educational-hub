# FadeJunkie Platform Flow
_Last updated: April 2026 — covers Auth, Payment, Design (Page Builder), and Site flows_

---

## Finalized Stack

| Layer | Decision | Notes |
|-------|----------|-------|
| **Auth** | Clerk | Google OAuth + email/password, prebuilt UI, webhooks to Convex |
| **Backend** | Convex | New deployment for this project (separate from FJ main app) |
| **Hosting** | Vercel Pro | $20/mo flat — wildcard subdomain support for `*.fadejunkie.com` |
| **Barber pages** | Subdomains from day one | `{slug}.fadejunkie.com` via wildcard DNS + Vercel routing middleware |
| **Image pipeline** | Vercel function + Sharp → Convex | Upload hits `/api/upload`, Sharp resizes/compresses, result stored in Convex file storage |
| **Payments** | Stripe | Per-role subscriptions, Customer Portal for self-serve billing |

---

## Mental Model

FadeJunkie is a **multi-role platform** — not a single-product SaaS. One account can hold multiple roles simultaneously. Each role is a separate subscription. The UI adapts to what the user has active and lets them freely toggle context.

```
Account
  └── Role: Student     (always free)
  └── Role: Barber      ($10/mo — Barber Page subscription)
  └── Role: Barbershop  (future — separate subscription)
```

Billing & Usage shows all active subscriptions stacked. You manage each independently. Adding a role = subscribing to that product.

---

## 1. Auth Flow

### Entry points
- Nav "Sign in" button (any page)
- Lander role card click → unauthenticated → redirect to /login with `returnTo` param
- /barber page "Get early access" (email collect now, full auth at launch)

### Sign Up
```
/signup
  ├── Google OAuth (primary)
  └── Email + Password

POST /auth/callback
  └── New user? → /onboarding/role
  └── Returning user? → /dashboard (role-aware redirect)
```

### Role Onboarding (`/onboarding/role`)
- Shown only on first login
- User picks which roles they want to activate
- **Student** — checked by default, always free, no payment
- **Barber** — unchecked by default, selecting it triggers payment flow inline before proceeding
- **Barbershop** — shown as "Coming Soon", non-selectable
- Can select multiple. Student + Barber = valid starting state.
- Submitting → provisions roles → redirects to `/dashboard`

### Sign In (returning user)
```
/login
  └── Authenticate
  └── Load user roles from DB
  └── Redirect → /dashboard (last active role context) or `returnTo`
```

### Session / Role Context
- Active role context is stored in session (Student | Barber | Barbershop)
- Nav role switcher is visible once logged in — toggles context on the fly
- Switching role context changes: dashboard, nav links, available features
- Does NOT require logging out

---

## 2. Payment Flow

### Subscription Model
| Role | Product | Price | Notes |
|------|---------|-------|-------|
| Student | Education Hub | Free | Always active, no payment |
| Barber | Barber Page | $10/mo | Stripe subscription |
| Barbershop | Shop Tools | TBD | Not yet launched |

### Adding Barber Subscription
```
Trigger: User selects Barber role (onboarding OR Account > Billing > Add)

/checkout/barber
  └── Stripe Checkout session created
  └── User enters card details
  └── Success → subscription created → role provisioned → /build/start
  └── Failure → back to /checkout/barber with error
```

### Billing & Usage Tab (`/account/billing`)
Layout: **stacked subscription cards**, one per active product.

Each card shows:
- Product name + role badge
- Price per period + renewal date
- Usage metrics (role-specific — e.g., Barber Page shows "1 page active")
- Status pill: Active / Past Due / Canceled
- `Manage` button → Stripe Customer Portal (update card, cancel)
- `Add subscription` CTA at the bottom → opens role picker for unsubscribed roles

### Cancellation
- Handled via Stripe Customer Portal
- On cancel: role remains active until period end
- After period end: role deprovisioned, Barber Page goes offline (not deleted — data kept 90 days)
- Resubscribing restores the page

### Stripe Webhooks (backend handles)
- `customer.subscription.created` → provision role
- `customer.subscription.deleted` → deprovision role
- `invoice.payment_failed` → flag account, email user
- `invoice.paid` → renew subscription, restore if was suspended

---

## 3. Design Flow (Barber Page Builder)

Gate: Must have active Barber subscription to access `/build`.

### Route sequence
```
/build                  → redirect to /build/start
/build/start            → intro + slug picker (permanent warning)
/build/form             → fill page content
/build/preview          → live preview of generated page
/build/confirm          → final slug lock confirmation
/build/success          → page is live 🎉

After launch:
/dashboard/barber       → edit page content (slug locked, content editable)
```

### Step 1 — `/build/start` (Slug Selection)
- User picks their slug: `[input].fadejunkie.com`
- Live availability check (debounced API call)
- **Permanent warning is prominent here**, not buried**:
  > "Your URL cannot be changed after you deploy. Choose carefully — this is your permanent barber link."
- Slug rules: lowercase, alphanumeric + hyphens, 3–30 chars, no reserved words
- `Continue →` locks nothing yet (slug confirmed only at /build/confirm)

### Step 2 — `/build/form` (Content Entry)
Multi-section form, save-as-you-go (draft state in DB):

| Section | Fields |
|---------|--------|
| Identity | Name, tagline (1 line), short bio |
| Services | Add rows: service name + price. Up to 20 rows. |
| Gallery | Photo upload (up to 12 images). Drag to reorder. |
| Booking | Booking URL (Square, Booksy, StyleSeat, etc.) |
| Location | Shop name, address, hours (per-day toggle) |
| Socials | Instagram, TikTok, YouTube, X — any combination |

- Auto-save every 30s + on field blur
- Progress bar at top (sections complete / total)
- `Preview →` navigates to /build/preview (can return to edit)

### Step 3 — `/build/preview`
- Renders the actual barber page component with form data
- Full-page preview, scrollable
- "This is exactly what your clients will see"
- Two CTAs: `← Edit` | `Deploy my page →`

### Step 4 — `/build/confirm` (Slug Lock)
- Summary card: chosen slug, subscription charge ($10/mo)
- Final amber warning about slug permanence (same style as /barber page warning)
- Checkbox: "I understand my URL cannot be changed"
- `Deploy` button → triggers:
  1. Slug locked in DB
  2. Page record created (status: live)
  3. Subdomain DNS provisioned (or wildcard catch handled by routing layer)
  4. Stripe subscription starts (if not already active)

### Step 5 — `/build/success`
- Confetti or subtle animation
- `yourname.fadejunkie.com` displayed large with copy button
- Share to Instagram / copy link CTAs
- `Go to my dashboard →`

### Post-Launch Editing (`/dashboard/barber`)
- All content sections editable (name, services, gallery, etc.)
- Slug shown as read-only with lock icon and tooltip
- Changes auto-save and publish instantly (no redeploy step)
- View live page link always visible

---

## 4. Site Flow (All Routes)

### Public Routes (no auth required)
```
/                           Lander — role picker hero
/barber                     Barber coming soon + waitlist
/education                  Education Hub selector
/education/flash            Flashcard study mode
/education/quiz             Solo quiz mode
/education/room             Group mode (coming soon placeholder)
/partners                   Partner showcase
/login                      Sign in
/signup                     Create account
```

### Auth Routes (redirect to /dashboard if already logged in)
```
/login
/signup
/onboarding/role            First-time role selection
/auth/callback              OAuth return URL
```

### Protected Routes (require session)
```
/dashboard                  → redirects based on active role context
/dashboard/student          Student home: study streak, recent sessions, quick launch
/dashboard/barber           Barber home: page preview, edit link, view stats
/dashboard/barbershop       Barbershop home (future)

/build/*                    Page builder (Barber subscriber only)
  /build/start
  /build/form
  /build/preview
  /build/confirm
  /build/success

/account                    → redirects to /account/profile
/account/profile            Name, email, avatar, password
/account/billing            Stacked subscription cards + usage
/account/notifications      Email prefs (future)
```

### Public Barber Pages (generated, served from routing layer)
```
/{slug}                     Public barber profile page
                            Served at fadejunkie.com/{slug} OR
                            {slug}.fadejunkie.com (subdomain — preferred)
```

Note: Subdomain routing requires wildcard DNS (`*.fadejunkie.com → app`) + middleware to detect subdomain and render the right barber page. This is the preferred end state. Path-based (`fadejunkie.com/barbers/{slug}`) is easier to ship first.

---

## 5. Nav & Role Switcher Behavior

### Logged-out nav
```
Logo | Education | Partners | Barber (→ /barber)    [Sign in] [Get started]
```

### Logged-in nav
```
Logo | [Role context tabs: Student · Barber · Barbershop]    [Avatar → account menu]
```

- Role tabs only show roles the user is **subscribed to**
- Student is always visible (always free)
- Barber tab appears after subscribing to Barber Page
- Clicking a tab switches active role context — changes dashboard, sidebar, available features
- Non-subscribed roles show a `+` tab: "Add Barber →" which starts the payment flow

### Account menu (avatar dropdown)
```
[Name + email]
─────────────
Switch to Student
Switch to Barber
─────────────
Account settings
Billing & Usage
─────────────
Sign out
```

---

## 6. Route Guard Logic (frontend)

```
requireAuth(route)
  → no session → /login?returnTo={route}

requireRole(role, route)
  → no session → /login
  → session but role not active → /account/billing (with "add {role}" prompt)

requireBuilder(route)
  → no session → /login
  → no barber subscription → /barber (coming soon or upgrade prompt)
  → has subscription, no page built → /build/start
  → has page built → /dashboard/barber
```

---

## 7. Data Model (simplified)

```
User
  id, email, name, avatar, createdAt

UserRole
  userId, role (student|barber|barbershop), status (active|suspended|canceled)
  stripeSubscriptionId (null for student)

BarberPage
  id, userId, slug (unique, immutable after deploy)
  status (draft|live|offline)
  name, tagline, bio
  services: [{name, price}]
  gallery: [imageUrl]
  bookingUrl
  location: {name, address, hours}
  socials: {instagram, tiktok, youtube, x}
  createdAt, deployedAt, updatedAt

WaitlistEntry
  email, role (barber|barbershop), createdAt
```

---

## Open Questions / Decisions Needed

| # | Question | Options |
|---|----------|---------|
| 1 | Subdomain vs path routing for barber pages? | ~~Path-based first~~ → **Subdomains from day one** (`{slug}.fadejunkie.com`) |
| 2 | Auth provider? | ~~Convex Auth, NextAuth~~ → **Clerk** |
| 3 | Page builder backend? | ~~Firebase, Supabase~~ → **Convex** (new deployment) |
| 4 | Image hosting for barber gallery? | ~~Cloudinary, Convex file storage, or S3~~ → **Vercel function + Sharp → Convex file storage** |
| 5 | Slug reservation strategy? | **Lock at Deploy only** (`/build/confirm`) — no hold system needed |
| 6 | What happens to the page when sub cancels? | **Offline, data + slug kept forever** — resubscribing restores instantly, slug never freed |
