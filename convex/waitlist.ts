import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Basic RFC-5322-ish email shape check. Not exhaustive, but rejects garbage.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ALLOWED_ROLES = new Set(["barber", "barbershop", "student"])

export const join = mutation({
  args: { email: v.string(), role: v.string() },
  handler: async (ctx, { email, role }) => {
    // Validate + normalize (F9). Reject malformed input rather than store it.
    const normalized = email.trim().toLowerCase()
    if (normalized.length > 254 || !EMAIL_RE.test(normalized)) {
      throw new Error("Invalid email address")
    }
    if (!ALLOWED_ROLES.has(role)) {
      throw new Error("Invalid role")
    }

    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", q => q.eq("email", normalized))
      .first()
    if (existing) return { alreadyJoined: true }

    await ctx.db.insert("waitlist", { email: normalized, role, createdAt: Date.now() })
    return { success: true }
  },
})

export const count = query({
  handler: async (ctx) => {
    const entries = await ctx.db.query("waitlist").collect()
    return entries.length
  },
})
