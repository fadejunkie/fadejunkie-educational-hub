// School demo pipeline — Anthony's personal micro-CRM for tracking barber
// schools he wants to reach out to and get a demo booked with. Admin-gated
// end to end (not a public feature), same pattern as devTickets.ts.

import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { requireAdmin } from "./authz"

const STATUS = v.union(
  v.literal("not_contacted"),
  v.literal("contacted"),
  v.literal("demo_scheduled"),
  v.literal("demo_completed"),
  v.literal("closed_won"),
  v.literal("closed_lost"),
)

export const addSchool = mutation({
  args: {
    schoolName:   v.string(),
    contactName:  v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    status:       v.optional(STATUS),
    followUpBy:   v.optional(v.number()),
    demoDate:     v.optional(v.number()),
    notes:        v.optional(v.string()),
  },
  handler: async (ctx, { schoolName, contactName, contactEmail, contactPhone, status, followUpBy, demoDate, notes }) => {
    const admin = await requireAdmin(ctx)
    const name = schoolName.trim()
    if (!name) throw new Error("School name is required")
    if (name.length > 200) throw new Error("School name too long")

    const now = Date.now()
    return await ctx.db.insert("schoolDemos", {
      createdBy: admin._id,
      schoolName: name,
      contactName: contactName?.trim() || undefined,
      contactEmail: contactEmail?.trim() || undefined,
      contactPhone: contactPhone?.trim() || undefined,
      status: status ?? "not_contacted",
      followUpBy,
      demoDate,
      notes: notes?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const listSchools = query({
  args: { status: v.optional(STATUS) },
  handler: async (ctx, { status }) => {
    await requireAdmin(ctx)
    const rows = status
      ? await ctx.db.query("schoolDemos").withIndex("by_status", q => q.eq("status", status)).collect()
      : await ctx.db.query("schoolDemos").collect()
    // Soonest follow-up/demo date first, undated rows last, then newest first.
    return rows.sort((a, b) => {
      const aDate = a.demoDate ?? a.followUpBy
      const bDate = b.demoDate ?? b.followUpBy
      if (aDate != null && bDate != null) return aDate - bDate
      if (aDate != null) return -1
      if (bDate != null) return 1
      return b.createdAt - a.createdAt
    })
  },
})

export const updateSchool = mutation({
  args: {
    schoolId:     v.id("schoolDemos"),
    schoolName:   v.optional(v.string()),
    contactName:  v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    status:       v.optional(STATUS),
    followUpBy:   v.optional(v.union(v.number(), v.null())),
    demoDate:     v.optional(v.union(v.number(), v.null())),
    notes:        v.optional(v.string()),
  },
  handler: async (ctx, { schoolId, followUpBy, demoDate, ...rest }) => {
    await requireAdmin(ctx)
    const patch: Record<string, unknown> = { ...rest, updatedAt: Date.now() }
    if (followUpBy !== undefined) patch.followUpBy = followUpBy ?? undefined
    if (demoDate !== undefined) patch.demoDate = demoDate ?? undefined
    if (patch.schoolName !== undefined) {
      const name = (patch.schoolName as string).trim()
      if (!name) throw new Error("School name is required")
      patch.schoolName = name
    }
    await ctx.db.patch(schoolId, patch)
  },
})

export const deleteSchool = mutation({
  args: { schoolId: v.id("schoolDemos") },
  handler: async (ctx, { schoolId }) => {
    await requireAdmin(ctx)
    await ctx.db.delete(schoolId)
  },
})
