import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Get the current user's partner profile
export const getMyPartnerProfile = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", clerkId)).first()
    if (!user) return null
    return ctx.db.query("partnerProfiles").withIndex("by_user", q => q.eq("userId", user._id)).first()
  },
})

// Toggle partner visibility on/off — creates a profile record if none exists
export const setPartnerVisibility = mutation({
  args: {
    clerkId:     v.string(),
    isVisible:   v.boolean(),
    name:        v.string(),
    email:       v.optional(v.string()),
    handle:      v.optional(v.string()),
    avatarUrl:   v.optional(v.string()),
    type:        v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { clerkId, isVisible, name, email, handle, avatarUrl, type, description }) => {
    // Upsert user record — create it if this is their first action
    let user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", clerkId)).first()
    if (!user) {
      const userId = await ctx.db.insert("users", {
        clerkId,
        email: email ?? "",
        name,
        avatar: avatarUrl,
        createdAt: Date.now(),
      })
      user = await ctx.db.get(userId)
    }
    if (!user) throw new Error("Failed to create user")

    const existing = await ctx.db.query("partnerProfiles").withIndex("by_user", q => q.eq("userId", user._id)).first()
    const now = Date.now()

    if (existing) {
      await ctx.db.patch(existing._id, { isVisible, name, handle, avatarUrl, type, description, updatedAt: now })
      return existing._id
    } else {
      return ctx.db.insert("partnerProfiles", {
        userId: user._id, clerkId, name, handle, avatarUrl, type, description,
        isVisible, createdAt: now, updatedAt: now,
      })
    }
  },
})

// Public query — returns all visible partner profiles
export const listPartners = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("partnerProfiles")
      .withIndex("by_visible", q => q.eq("isVisible", true))
      .collect()
  },
})
