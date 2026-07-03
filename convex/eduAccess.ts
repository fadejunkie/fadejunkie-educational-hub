import { internalMutation, query } from "./_generated/server"
import { v } from "convex/values"
import { currentUser } from "./authz"

/**
 * Returns whether the signed-in user has an active lifetime pass.
 * Identity comes from the verified token; the clerkId arg is ignored (F1).
 */
export const getEduAccess = query({
  args: { clerkId: v.optional(v.string()) },
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
 */
export const grantEduAccess = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", clerkId))
      .first()
    if (!user) throw new Error(`No user found with clerkId: ${clerkId}`)
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
