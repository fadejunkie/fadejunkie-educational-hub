// Dev ticket inbox — Anthony's way to drop a bug/feature request for Claude
// without opening a session. Admin-gated end to end (this is a personal
// inbox, not a public feature-request box).

import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { requireAdmin } from "./authz"

const CATEGORY = v.union(v.literal("bug"), v.literal("feature"), v.literal("content"), v.literal("other"))
const PRIORITY = v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical"))
const STATUS   = v.union(v.literal("open"), v.literal("in_progress"), v.literal("done"), v.literal("wont_fix"))

export const submitTicket = mutation({
  args: {
    title:       v.string(),
    description: v.string(),
    category:    CATEGORY,
    priority:    PRIORITY,
    route:       v.optional(v.string()),
  },
  handler: async (ctx, { title, description, category, priority, route }) => {
    const admin = await requireAdmin(ctx)
    const title2 = title.trim()
    const description2 = description.trim()
    if (!title2) throw new Error("Title is required")
    if (title2.length > 200) throw new Error("Title too long")
    if (description2.length > 5000) throw new Error("Description too long")

    const now = Date.now()
    return await ctx.db.insert("devTickets", {
      createdBy: admin._id,
      title: title2,
      description: description2,
      category,
      priority,
      status: "open",
      route,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const listTickets = query({
  args: { status: v.optional(STATUS) },
  handler: async (ctx, { status }) => {
    await requireAdmin(ctx)
    const rows = status
      ? await ctx.db.query("devTickets").withIndex("by_status", q => q.eq("status", status)).collect()
      : await ctx.db.query("devTickets").collect()
    return rows.sort((a, b) => b.createdAt - a.createdAt)
  },
})

export const updateTicketStatus = mutation({
  args: { ticketId: v.id("devTickets"), status: STATUS },
  handler: async (ctx, { ticketId, status }) => {
    await requireAdmin(ctx)
    await ctx.db.patch(ticketId, { status, updatedAt: Date.now() })
  },
})

export const deleteTicket = mutation({
  args: { ticketId: v.id("devTickets") },
  handler: async (ctx, { ticketId }) => {
    await requireAdmin(ctx)
    await ctx.db.delete(ticketId)
  },
})
