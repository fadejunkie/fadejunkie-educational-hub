import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const saveQuizSession = mutation({
  args: {
    clerkId:        v.string(),
    topic:          v.string(),
    count:          v.number(),
    correct:        v.number(),
    total:          v.number(),
    topicBreakdown: v.array(v.object({
      topic:   v.string(),
      correct: v.number(),
      total:   v.number(),
    })),
  },
  handler: async (ctx, { clerkId, topic, count, correct, total, topicBreakdown }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", clerkId))
      .first()
    if (!user) return

    await ctx.db.insert("quizSessions", {
      userId: user._id,
      topic,
      count,
      correct,
      total,
      topicBreakdown,
      completedAt: Date.now(),
    })
  },
})

export const getUserProgress = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", clerkId))
      .first()
    if (!user) return null

    const sessions = await ctx.db
      .query("quizSessions")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .collect()

    const starredCards = await ctx.db
      .query("starredCards")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .collect()

    const totalSeen   = sessions.reduce((sum, s) => sum + s.total, 0)
    const correctTotal = sessions.reduce((sum, s) => sum + s.correct, 0)
    const accuracy    = totalSeen > 0 ? Math.round((correctTotal / totalSeen) * 100) : 0

    // Per-topic accuracy across all sessions
    const topicMap: Record<string, { correct: number; total: number }> = {}
    for (const session of sessions) {
      for (const bd of session.topicBreakdown) {
        if (!topicMap[bd.topic]) topicMap[bd.topic] = { correct: 0, total: 0 }
        topicMap[bd.topic].correct += bd.correct
        topicMap[bd.topic].total   += bd.total
      }
    }
    const topicAccuracy = Object.entries(topicMap).map(([topic, { correct, total }]) => ({
      topic,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))

    // Most recent session
    const sorted = [...sessions].sort((a, b) => b.completedAt - a.completedAt)
    const last = sorted[0] ?? null
    const lastSession = last
      ? { completedAt: last.completedAt, score: last.correct, total: last.total, topic: last.topic }
      : null

    return {
      totalSeen,
      accuracy,
      sessions:      sessions.length,
      starred:       starredCards.length,
      topicAccuracy,
      lastSession,
    }
  },
})
