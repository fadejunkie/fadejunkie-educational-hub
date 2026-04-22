import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const toggle = mutation({
  args: { clerkId: v.string(), cardId: v.string(), topic: v.string() },
  handler: async (ctx, { clerkId, cardId, topic }) => {
    const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", clerkId)).first()
    if (!user) return { starred: false }

    const existing = await ctx.db.query("starredCards")
      .withIndex("by_user_card", q => q.eq("userId", user._id).eq("cardId", cardId))
      .first()

    if (existing) {
      await ctx.db.delete(existing._id)
      return { starred: false }
    } else {
      await ctx.db.insert("starredCards", { userId: user._id, cardId, topic, createdAt: Date.now() })
      return { starred: true }
    }
  },
})

export const getStarred = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", clerkId)).first()
    if (!user) return []
    const cards = await ctx.db.query("starredCards").withIndex("by_user", q => q.eq("userId", user._id)).collect()
    return cards.map(c => c.cardId)
  },
})
