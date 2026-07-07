import { internalMutation, query } from "./_generated/server"
import { v } from "convex/values"
import { currentUser } from "./authz"

/**
 * Returns whether the signed-in user has an active lifetime pass.
 * Identity comes from the verified token (F1).
 */
export const getEduAccess = query({
  args: {},
  handler: async (ctx) => {
    const user = await currentUser(ctx)
    if (!user) return { hasAccess: false }
    return { hasAccess: !!user.lifetimePassPurchasedAt }
  },
})

/**
 * Admin-only: grant lifetime pass to a user by clerkId.
 * INTERNAL — not callable from any client. Run from the Convex dashboard,
 * via `npx convex run eduAccess:grantEduAccess`, or from the Stripe webhook
 * (see convex/http.ts / Phase 4). Never expose this to the browser.
 *
 * Creates the `users` row if it doesn't exist yet — a brand-new signup who
 * goes straight to checkout has no row (upsertCurrentUser only runs from a
 * handful of other mutations), and the webhook has no ctx.auth identity to
 * fall back on since Stripe calls it directly.
 */
export const grantEduAccess = internalMutation({
  args: { clerkId: v.string(), email: v.optional(v.string()) },
  handler: async (ctx, { clerkId, email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", clerkId))
      .first()
    if (!user) {
      await ctx.db.insert("users", {
        clerkId,
        email: email ?? "",
        createdAt: Date.now(),
        lifetimePassPurchasedAt: Date.now(),
      })
      return { success: true, created: true }
    }
    await ctx.db.patch(user._id, { lifetimePassPurchasedAt: Date.now() })
    return { success: true }
  },
})

/**
 * Revoke lifetime pass (admin). INTERNAL — not client-callable.
 */
export const revokeEduAccess = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", clerkId))
      .first()
    if (!user) throw new Error(`No user found with clerkId: ${clerkId}`)
    await ctx.db.patch(user._id, { lifetimePassPurchasedAt: undefined })
    return { success: true }
  },
})
