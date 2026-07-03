# FadeJunkie.com — Security Audit

**Target:** `fadejunkie-educational-hub` (Vite + React + Convex + Clerk), the codebase deployed to **fadejunkie.com**
**Method:** Static source audit of the full Convex backend, Clerk integration, env handling, and Vercel config. No live probing performed.
**Date:** 2026-07-02
**Auditor:** Claude (Fable 5)

---

## TL;DR

The backend has a **systemic broken-authentication flaw**: every Convex query and mutation trusts a `clerkId` string passed in by the client and **never verifies it against the signed-in session**. There is no `convex/auth.config.ts`, so Convex does no JWT validation at all — the server literally cannot tell who is calling. Because the Convex deployment URL ships in the public JS bundle, an attacker can call any function directly with the Convex client SDK and supply **any user's `clerkId`**.

Concretely, an anonymous attacker can:
- **Grant themselves the paid $10 lifetime pass for free** (`grantEduAccess` is a public mutation).
- **Delete any user's account and all their data** (`deleteAccount`).
- **Read or wipe any user's quiz history, profile, and preferences** (`exportData`, `getUserProgress`, `resetProgress`, …).
- **Harvest the `clerkId` of every partner** via the public `listPartners`, which supplies the exact identifiers needed to target the attacks above — no guessing required.

This is the highest-severity class of web vulnerability (broken access control / IDOR) and it affects the entire data model. Everything else in this report is secondary to fixing the identity model.

---

## Severity summary

| # | Severity | Finding | File |
|---|----------|---------|------|
| 1 | **Critical** | No server-side identity — all functions trust client-supplied `clerkId` (IDOR across all data) | all of `convex/*` |
| 2 | **Critical** | Convex JWT validation not configured — `convex/auth.config.ts` missing (root cause of #1) | `convex/` |
| 3 | **Critical** | `grantEduAccess` / `revokeEduAccess` exported as **public** mutations — free paywall bypass | `convex/eduAccess.ts` |
| 4 | **Critical** | `deleteAccount` / `resetProgress` callable against any account — unauthenticated data destruction | `convex/userProfile.ts`, `convex/progress.ts` |
| 5 | **High** | Mass data exfiltration of any user's PII/progress; `listPartners` leaks `clerkId` (enables the whole chain) | `convex/progress.ts`, `convex/partners.ts` |
| 6 | **High** | Production served by a **development** Clerk instance (`pk_test_…`) | `.env.local`, `src/main.tsx` |
| 7 | **Medium** | No security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) | `vercel.json` |
| 8 | **Medium** | Arbitrary account creation / record pollution via client-supplied `clerkId` + `email` upsert | multiple mutations |
| 9 | **Medium** | No rate limiting or input validation on `waitlist.join` (spam, unvalidated email) | `convex/waitlist.ts` |
| 10 | **Low** | Payment fulfillment is manual/unenforced — no Stripe webhook; access granted by hand | `convex/eduAccess.ts` |

**Not findings (verified clean):** `.env.local` is correctly gitignored (`.env*.local`) and not committed; only `VITE_`-prefixed *publishable* values are exposed, which is by design. No `dangerouslySetInnerHTML` / `eval` / `innerHTML` XSS sinks in `src/`.

---

## Detailed findings

### 1 & 2 — Critical: Client-asserted identity, no JWT validation (root cause)

Every function follows this shape:

```ts
export const getUserProgress = query({
  args: { clerkId: v.string() },              // ← identity comes from the caller
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db.query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", clerkId))  // ← trusts it blindly
      .first()
    ...
```

`ctx.auth.getUserIdentity()` is **never called anywhere in the backend**, and there is **no `convex/auth.config.ts`**, so Convex is not configured to validate Clerk JWTs. The server has no trustworthy notion of "who is calling." The legitimate client passes `{ clerkId: user.id }` from Clerk's `useUser()` (see `src/hooks/useEduAccess.ts`), but an attacker is under no obligation to use the client — the Convex deployment URL is baked into the public bundle via `VITE_CONVEX_URL`, so `convexClient.query(api.progress.getUserProgress, { clerkId: "<victim>" })` works from anywhere.

**Impact:** Full horizontal privilege escalation (IDOR) over every table. Read and write access to any user's data by supplying their `clerkId`.

**Fix:** Configure `convex/auth.config.ts` for the Clerk issuer, and in every function derive the user from the **verified token** — not from args:

```ts
const identity = await ctx.auth.getUserIdentity()
if (!identity) throw new Error("Unauthenticated")
const user = await ctx.db.query("users")
  .withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject))
  .first()
```

Then **remove `clerkId` from every function's args**. This single change closes findings 1, 3, 4, 5, and 8 at the source.

---

### 3 — Critical: Public admin mutations = free paywall bypass

```ts
// convex/eduAccess.ts
export const grantEduAccess = mutation({          // ← PUBLIC, client-callable
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => { /* sets lifetimePassPurchasedAt */ }
})
export const revokeEduAccess = mutation({ ... })  // ← PUBLIC
```

The doc comment says "Run from the Convex dashboard," but the function is exported as a public `mutation`, so **any client can call it**. `getEduAccess` gates the paid Education Hub on `lifetimePassPurchasedAt`, so:

- Attacker calls `grantEduAccess({ clerkId: <their own id> })` → **$10 lifetime pass unlocked for free.**
- Attacker calls `revokeEduAccess({ clerkId: <victim> })` → **revokes a paying customer's access.**

**Fix:** Convert both to `internalMutation` (callable only from other server functions / the dashboard, never from a client). Real fulfillment should come from a Stripe webhook (see #10), not a client-reachable entry point.

---

### 4 — Critical: Unauthenticated account & data destruction

```ts
// convex/userProfile.ts
export const deleteAccount = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    // deletes the user + quizSessions, starredCards, studyPreferences,
    // partnerProfiles, userRoles, barberPages for that clerkId
  }
})
```

Because identity is client-asserted (#1), `deleteAccount({ clerkId: <victim> })` **hard-deletes any account and cascades to all of its data**, unauthenticated. `resetProgress` (`convex/progress.ts`) similarly wipes any user's quiz history and stars. These are irreversible.

**Fix:** Derive the target from the verified token (a user may only delete themselves). Same pattern as #1.

---

### 5 — High: Mass data exfiltration + `clerkId` harvesting

`exportData`, `getUserProgress`, `getMyProfile`, `getMyPreferences`, `getStarred`, `getBarberRole`, `getBarberPage`, `getMyPartnerProfile` all return a user's data keyed only on the client-supplied `clerkId` — so any of them dumps **any** user's data.

The chain is fully self-serve because of `listPartners`:

```ts
// convex/partners.ts — PUBLIC query, no args
export const listPartners = query({
  handler: async (ctx) =>
    ctx.db.query("partnerProfiles").withIndex("by_visible", q => q.eq("isVisible", true)).collect()
})
```

It returns **entire `partnerProfiles` documents, including the `clerkId` field**. An attacker calls `listPartners` → collects real `clerkId`s → feeds them into `deleteAccount` / `exportData` / `revokeEduAccess`. No guessing required.

**Fix:** After adopting token-based identity (#1), return only the fields the UI needs from `listPartners` (name, handle, avatar, type, description) — never `clerkId`/`userId`. Add a public projection type rather than returning raw rows.

---

### 6 — High: Development Clerk instance in production

`VITE_CLERK_PUBLISHABLE_KEY` is `pk_test_…`. A `pk_test` key means fadejunkie.com is authenticating real users against a **Clerk development instance**. Dev instances use a shared dev issuer, have relaxed controls, allow anyone to sign up, and are not meant to protect production users. (This matches the memory note that production is on Clerk dev keys.)

**Fix:** Provision the Clerk **production** instance, swap in `pk_live_…`, and set the matching issuer domain in `convex/auth.config.ts` (#2). Note: this does **not** fix the IDOR by itself — the backend must still validate the token — but it is a prerequisite for a trustworthy issuer.

---

### 7 — Medium: No security headers

`vercel.json` sets no headers. Missing at minimum: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY` (clickjacking), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`.

**Fix:** Add a `headers` block in `vercel.json` applying these to all routes; start CSP in report-only mode to avoid breaking Clerk/Convex, then enforce.

---

### 8 — Medium: Arbitrary account creation / record pollution

Several mutations upsert a `users` row from the client-supplied `clerkId` and `email` (`updateProfile`, `setPreference`, `setDefaultQuizLength`, `saveQuizSession`, `setPartnerVisibility`). With identity unverified, an attacker can create arbitrary user rows and set arbitrary emails, polluting the table and potentially colliding with a real user's future record.

**Fix:** Only create a user from a verified token identity; source `email` from the token claims, not from client args.

---

### 9 — Medium: No abuse controls on `waitlist.join`

```ts
export const join = mutation({
  args: { email: v.string(), role: v.string() },  // email never validated
  ...
})
```

No email-format validation, no rate limiting, no CAPTCHA. Trivial to flood the waitlist. `role` is a free-form string.

**Fix:** Validate email shape, constrain `role` to a union, and add basic rate limiting (Convex rate-limiter component or per-IP throttling at the edge).

---

### 10 — Low: Payment not enforced server-side

`grantEduAccess`'s own TODO says "Replace with Stripe webhook fulfillment." Access is currently granted by hand, so there is no verifiable link between a real Stripe payment and the `lifetimePassPurchasedAt` flag. Once #3 is fixed, fulfillment must move to a verified `checkout.session.completed` webhook (Convex HTTP action with `stripe.webhooks.constructEvent`).

---

## Recommended fix order

1. **Stop the bleeding (deploy today):** Convert `grantEduAccess`/`revokeEduAccess` to `internalMutation` (#3). Strip `clerkId`/`userId` from `listPartners` output (#5). These two are small, safe, and remove the free-money and easy-targeting paths immediately.
2. **Fix the root:** Add `convex/auth.config.ts`, switch every function to `ctx.auth.getUserIdentity()`, remove `clerkId` args (#1, #2, #4, #8).
3. **Trustworthy issuer:** Move Clerk to a production instance (#6).
4. **Perimeter:** Security headers (#7), waitlist hardening (#9), Stripe webhook fulfillment (#10).

The autonomous execution plan for all of this is in `.paul/` — see `.paul/PROJECT.md` and `.paul/AUTONOMY.md`.
