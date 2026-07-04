// Authorization helpers — the single source of truth for "who is calling."
//
// Every function must derive the acting user from the VERIFIED Clerk token
// (ctx.auth.getUserIdentity()), never from a client-supplied argument. The
// `clerkId` args still present on some functions are vestigial and ignored;
// they are kept only so the existing client keeps compiling during the
// transition and will be removed in a follow-up cleanup.
//
// identity.subject === the Clerk user id (the same value the client stored as
// `clerkId`), so existing `by_clerk_id` lookups continue to resolve.

import type { QueryCtx, MutationCtx } from "./_generated/server"
import type { Doc } from "./_generated/dataModel"

/** The signed-in user's row, or null if unauthenticated / no row yet. */
export async function currentUser(ctx: QueryCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) return null
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject))
    .first()
}

/**
 * The signed-in user's row, creating it on first action. Returns null if the
 * caller is unauthenticated (callers should no-op in that case — the client
 * only invokes these mutations while signed in).
 */
export async function upsertCurrentUser(ctx: MutationCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) return null

  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject))
    .first()
  if (existing) return existing

  const userId = await ctx.db.insert("users", {
    clerkId:   identity.subject,
    email:     (identity.email as string | undefined) ?? "",
    name:      (identity.name as string | undefined) ?? undefined,
    createdAt: Date.now(),
  })
  return await ctx.db.get(userId)
}

/**
 * True if the signed-in caller has `isAdmin: true` on their user row.
 * Never trust a client-supplied admin flag — this is the only path.
 */
export async function isAdmin(ctx: QueryCtx): Promise<boolean> {
  const user = await currentUser(ctx)
  return user?.isAdmin === true
}

/**
 * Admin-gated user row, or throws. Use at the top of every admin.ts /
 * devTickets.ts query and mutation — there is no other authorization check
 * on those functions.
 */
export async function requireAdmin(ctx: QueryCtx): Promise<Doc<"users">> {
  const user = await currentUser(ctx)
  if (!user?.isAdmin) throw new Error("Not authorized")
  return user
}
