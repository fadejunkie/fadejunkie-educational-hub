import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

/**
 * Returns whether the user has an active lifetime pass.
 * Used by all edu hub pages to gate content.
 */
export const getEduAccess = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", clerkId))
      .first()
    if (!user) return { hasAccess: false }
    return { hasAccess: !!user.lifetimePassPurchasedAt }
  },
})

/**
 * Admin-only: grant lifetime pass to a user by clerkId.
 * Run from the Convex dashboard after confirming payment.
 * TODO: Replace with Stripe webhook fulfillment.
 */
export const grantEduAccess = mutation({
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
 * Revoke lifetime pass (admin).
 */
export const revokeEduAccess = mutation({
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
