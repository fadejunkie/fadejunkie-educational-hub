import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { currentUser, upsertCurrentUser } from "./authz"

const DEFAULTS = { showExplanations: true, dailyReminder: false, autoStarMissed: true, defaultQuizLength: 20 }

export const getMyPreferences = query({
  args: {},
  handler: async (ctx) => {
    const user = await currentUser(ctx)
    if (!user) return DEFAULTS

    const prefs = await ctx.db.query("studyPreferences").withIndex("by_user", q => q.eq("userId", user._id)).first()
    if (!prefs) return DEFAULTS

    return {
      showExplanations:  prefs.showExplanations,
      dailyReminder:     prefs.dailyReminder,
      autoStarMissed:    prefs.autoStarMissed,
      defaultQuizLength: prefs.defaultQuizLength ?? DEFAULTS.defaultQuizLength,
    }
  },
})

export const setPreference = mutation({
  args: {
    email:   v.optional(v.string()),
    name:    v.optional(v.string()),
    key:     v.union(v.literal("showExplanations"), v.literal("dailyReminder"), v.literal("autoStarMissed")),
    value:   v.boolean(),
  },
  handler: async (ctx, { key, value }) => {
    const user = await upsertCurrentUser(ctx)
    if (!user) return

    const existing = await ctx.db.query("studyPreferences").withIndex("by_user", q => q.eq("userId", user._id)).first()
    if (existing) {
      await ctx.db.patch(existing._id, { [key]: value, updatedAt: Date.now() })
    } else {
      await ctx.db.insert("studyPreferences", { userId: user._id, ...DEFAULTS, [key]: value, updatedAt: Date.now() })
    }
  },
})

export const setDefaultQuizLength = mutation({
  args: {
    email:   v.optional(v.string()),
    name:    v.optional(v.string()),
    value:   v.union(v.literal(20), v.literal(50), v.literal(100)),
  },
  handler: async (ctx, { value }) => {
    const user = await upsertCurrentUser(ctx)
    if (!user) return

    const existing = await ctx.db.query("studyPreferences").withIndex("by_user", q => q.eq("userId", user._id)).first()
    if (existing) {
      await ctx.db.patch(existing._id, { defaultQuizLength: value, updatedAt: Date.now() })
    } else {
      await ctx.db.insert("studyPreferences", { userId: user._id, ...DEFAULTS, defaultQuizLength: value, updatedAt: Date.now() })
    }
  },
})
