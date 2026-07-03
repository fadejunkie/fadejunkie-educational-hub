import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { currentUser, upsertCurrentUser } from "./authz"

export const toggle = mutation({
  args: { clerkId: v.optional(v.string()), cardId: v.string(), topic: v.string() },
  handler: async (ctx, { cardId, topic }) => {
    const user = await upsertCurrentUser(ctx)
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

// Idempotent star — used by auto-star (never un-stars an existing card)
export const star = mutation({
  args: { clerkId: v.optional(v.string()), cardId: v.string(), topic: v.string() },
  handler: async (ctx, { cardId, topic }) => {
    const user = await upsertCurrentUser(ctx)
    if (!user) return

    const existing = await ctx.db.query("starredCards")
      .withIndex("by_user_card", q => q.eq("userId", user._id).eq("cardId", cardId))
      .first()
    if (existing) return

    await ctx.db.insert("starredCards", { userId: user._id, cardId, topic, createdAt: Date.now() })
  },
})

export const getStarred = query({
  args: { clerkId: v.optional(v.string()) },
  handler: async (ctx) => {
    const user = await currentUser(ctx)
    if (!user) return []
    const cards = await ctx.db.query("starredCards").withIndex("by_user", q => q.eq("userId", user._id)).collect()
    return cards.map(c => c.cardId)
  },
})
