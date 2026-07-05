import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { currentUser, upsertCurrentUser } from "./authz"

// Get the current user's partner profile
export const getMyPartnerProfile = query({
  args: {},
  handler: async (ctx) => {
    const user = await currentUser(ctx)
    if (!user) return null
    return ctx.db.query("partnerProfiles").withIndex("by_user", q => q.eq("userId", user._id)).first()
  },
})

// Toggle partner visibility on/off — creates a profile record if none exists
export const setPartnerVisibility = mutation({
  args: {
    isVisible:   v.boolean(),
    name:        v.string(),
    email:       v.optional(v.string()),
    handle:      v.optional(v.string()),
    avatarUrl:   v.optional(v.string()),
    type:        v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { isVisible, name, handle, avatarUrl, type, description }) => {
    const user = await upsertCurrentUser(ctx)
    if (!user) throw new Error("Unauthenticated")

    const existing = await ctx.db.query("partnerProfiles").withIndex("by_user", q => q.eq("userId", user._id)).first()
    const now = Date.now()

    if (existing) {
      await ctx.db.patch(existing._id, { isVisible, name, handle, avatarUrl, type, description, updatedAt: now })
      return existing._id
    } else {
      return ctx.db.insert("partnerProfiles", {
        userId: user._id, clerkId: user.clerkId, name, handle, avatarUrl, type, description,
        isVisible, createdAt: now, updatedAt: now,
      })
    }
  },
})

// Public query — returns all visible partner profiles.
// Projects to public-safe fields only: never leak clerkId/userId (those enable
// account-takeover attacks against the per-user functions). See SECURITY_AUDIT.md F5.
export const listPartners = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("partnerProfiles")
      .withIndex("by_visible", q => q.eq("isVisible", true))
      .collect()
    return rows.map(p => ({
      _id:         p._id,
      name:        p.name,
      handle:      p.handle,
      avatarUrl:   p.avatarUrl,
      type:        p.type,
      description: p.description,
    }))
  },
})
