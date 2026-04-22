import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const join = mutation({
  args: { email: v.string(), role: v.string() },
  handler: async (ctx, { email, role }) => {
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", q => q.eq("email", email))
      .first()
    if (existing) return { alreadyJoined: true }
    await ctx.db.insert("waitlist", { email, role, createdAt: Date.now() })
    return { success: true }
  },
})

export const count = query({
  handler: async (ctx) => {
    const entries = await ctx.db.query("waitlist").collect()
    return entries.length
  },
})
