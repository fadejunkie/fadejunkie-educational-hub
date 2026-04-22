import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

const TRIAL_DAYS = 7

export const startTrial = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", clerkId)).first()
    if (!user) throw new Error("User not found")

    const existing = await ctx.db.query("userRoles")
      .withIndex("by_user_role", q => q.eq("userId", user._id).eq("role", "barber"))
      .first()
    if (existing) return existing

    const now = Date.now()
    const trialEndsAt = now + TRIAL_DAYS * 24 * 60 * 60 * 1000

    const id = await ctx.db.insert("userRoles", {
      userId: user._id,
      role: "barber",
      status: "trial",
      tier: "standard",
      trialStartedAt: now,
      trialEndsAt,
      createdAt: now,
    })
    return await ctx.db.get(id)
  },
})

export const getBarberRole = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", clerkId)).first()
    if (!user) return null
    return ctx.db.query("userRoles")
      .withIndex("by_user_role", q => q.eq("userId", user._id).eq("role", "barber"))
      .first()
  },
})

export const getBarberPage = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", clerkId)).first()
    if (!user) return null
    return ctx.db.query("barberPages").withIndex("by_user", q => q.eq("userId", user._id)).first()
  },
})
