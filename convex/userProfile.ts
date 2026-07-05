import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { currentUser, upsertCurrentUser } from "./authz"

export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const user = await currentUser(ctx)
    if (!user) return { school: undefined, cohort: undefined }
    return { school: user.school, cohort: user.cohort }
  },
})

// Deletes the SIGNED-IN user only. Identity from the verified token — a caller
// can never delete another account by passing its clerkId (F4).
export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await currentUser(ctx)
    if (!user) return

    const rowGroups = await Promise.all([
      ctx.db.query("quizSessions").withIndex("by_user", q => q.eq("userId", user._id)).collect(),
      ctx.db.query("starredCards").withIndex("by_user", q => q.eq("userId", user._id)).collect(),
      ctx.db.query("studyPreferences").withIndex("by_user", q => q.eq("userId", user._id)).collect(),
      ctx.db.query("partnerProfiles").withIndex("by_user", q => q.eq("userId", user._id)).collect(),
      ctx.db.query("userRoles").withIndex("by_user", q => q.eq("userId", user._id)).collect(),
      ctx.db.query("barberPages").withIndex("by_user", q => q.eq("userId", user._id)).collect(),
    ])

    for (const rows of rowGroups) {
      for (const row of rows) await ctx.db.delete(row._id)
    }

    await ctx.db.delete(user._id)
  },
})

export const updateProfile = mutation({
  args: {
    email:   v.optional(v.string()),
    name:    v.optional(v.string()),
    field:   v.union(v.literal("school"), v.literal("cohort")),
    value:   v.string(),
  },
  handler: async (ctx, { field, value }) => {
    const user = await upsertCurrentUser(ctx)
    if (!user) return
    await ctx.db.patch(user._id, { [field]: value.trim() === "" ? undefined : value.trim() })
  },
})
