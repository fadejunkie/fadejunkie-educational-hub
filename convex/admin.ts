// Admin dashboard backend — every export here is gated by requireAdmin()
// (convex/authz.ts), which derives "admin" from the verified Clerk identity's
// users.isAdmin flag. Never accept an admin/role flag as a client argument.

import { internalMutation, mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { internal } from "./_generated/api"
import { requireAdmin, isAdmin as isAdminHelper } from "./authz"

/** Safe to call from any client — used to show/hide the /admin route in the nav. */
export const isCurrentUserAdmin = query({
  args: {},
  handler: async (ctx) => {
    return await isAdminHelper(ctx)
  },
})

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)

    const [users, quizSessions, waitlist, partnerProfiles, barberPages, tickets] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("quizSessions").collect(),
      ctx.db.query("waitlist").collect(),
      ctx.db.query("partnerProfiles").collect(),
      ctx.db.query("barberPages").collect(),
      ctx.db.query("devTickets").collect(),
    ])

    return {
      totalUsers: users.length,
      lifetimePassHolders: users.filter(u => !!u.lifetimePassPurchasedAt).length,
      quizSessionsCount: quizSessions.length,
      waitlistCount: waitlist.length,
      partnerProfilesCount: partnerProfiles.length,
      partnerProfilesVisible: partnerProfiles.filter(p => p.isVisible).length,
      barberPagesCount: barberPages.length,
      barberPagesLive: barberPages.filter(p => p.status === "live").length,
      openTicketsCount: tickets.filter(t => t.status === "open" || t.status === "in_progress").length,
    }
  },
})

/** Full user list. Admin-only, so the raw clerkId is fine to include here. */
export const listUsers = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, { search }) => {
    await requireAdmin(ctx)
    const users = await ctx.db.query("users").collect()
    const term = search?.trim().toLowerCase()
    const filtered = term
      ? users.filter(u =>
          u.email.toLowerCase().includes(term) ||
          (u.name ?? "").toLowerCase().includes(term))
      : users
    return filtered
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(u => ({
        _id:                     u._id,
        clerkId:                 u.clerkId,
        email:                   u.email,
        name:                    u.name,
        school:                  u.school,
        cohort:                  u.cohort,
        lifetimePassPurchasedAt: u.lifetimePassPurchasedAt,
        isAdmin:                 u.isAdmin === true,
        createdAt:               u.createdAt,
      }))
  },
})

export const grantAccess = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    await requireAdmin(ctx)
    await ctx.runMutation(internal.eduAccess.grantEduAccess, { clerkId })
  },
})

export const revokeAccess = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    await requireAdmin(ctx)
    await ctx.runMutation(internal.eduAccess.revokeEduAccess, { clerkId })
  },
})

export const listWaitlist = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    const rows = await ctx.db.query("waitlist").collect()
    return rows.sort((a, b) => b.createdAt - a.createdAt)
  },
})

/** All partner profiles (not just visible ones) — admin moderation view. */
export const listPartnerProfilesAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    const rows = await ctx.db.query("partnerProfiles").collect()
    return rows.sort((a, b) => b.updatedAt - a.updatedAt)
  },
})

export const setPartnerVisibilityAdmin = mutation({
  args: { partnerId: v.id("partnerProfiles"), isVisible: v.boolean() },
  handler: async (ctx, { partnerId, isVisible }) => {
    await requireAdmin(ctx)
    await ctx.db.patch(partnerId, { isVisible, updatedAt: Date.now() })
  },
})

export const listBarberPages = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    const pages = await ctx.db.query("barberPages").collect()
    const withOwner = await Promise.all(pages.map(async p => {
      const owner = await ctx.db.get(p.userId)
      return { ...p, ownerEmail: owner?.email ?? "unknown" }
    }))
    return withOwner.sort((a, b) => b.updatedAt - a.updatedAt)
  },
})

export const setBarberPageStatus = mutation({
  args: {
    pageId: v.id("barberPages"),
    status: v.union(v.literal("draft"), v.literal("live"), v.literal("offline")),
  },
  handler: async (ctx, { pageId, status }) => {
    await requireAdmin(ctx)
    await ctx.db.patch(pageId, { status, updatedAt: Date.now() })
  },
})

/**
 * One-time bootstrap: promote a user to admin by email. INTERNAL — not
 * client-callable. Run once from the Convex dashboard function runner or
 * `npx convex run admin:promoteAdmin '{"email":"you@example.com"}'` after
 * deploy. See .paul/RUNBOOK.md §E.
 */
export const promoteAdmin = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), email))
      .first()
    if (!user) throw new Error(`No user found with email: ${email}`)
    await ctx.db.patch(user._id, { isAdmin: true })
    return { success: true }
  },
})
