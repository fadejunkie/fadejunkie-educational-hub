import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // ── Users ─────────────────────────────────────────────────────────────────
  users: defineTable({
    clerkId:   v.string(),
    email:     v.string(),
    name:      v.optional(v.string()),
    avatar:    v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // ── User roles ────────────────────────────────────────────────────────────
  userRoles: defineTable({
    userId:               v.id("users"),
    role:                 v.union(v.literal("student"), v.literal("barber"), v.literal("barbershop")),
    status:               v.union(v.literal("active"), v.literal("trial"), v.literal("suspended"), v.literal("canceled")),
    tier:                 v.optional(v.union(v.literal("standard"), v.literal("custom_domain"))),
    stripeSubscriptionId: v.optional(v.string()),
    stripeCustomerId:     v.optional(v.string()),
    trialStartedAt:       v.optional(v.number()),
    trialEndsAt:          v.optional(v.number()),
    currentPeriodEnd:     v.optional(v.number()),
    createdAt:            v.number(),
  })
    .index("by_user",      ["userId"])
    .index("by_user_role", ["userId", "role"]),

  // ── Barber pages ──────────────────────────────────────────────────────────
  barberPages: defineTable({
    userId:       v.id("users"),
    slug:         v.string(),
    status:       v.union(v.literal("draft"), v.literal("live"), v.literal("offline")),
    customDomain: v.optional(v.string()),
    name:         v.optional(v.string()),
    tagline:      v.optional(v.string()),
    bio:          v.optional(v.string()),
    services:     v.optional(v.array(v.object({ name: v.string(), price: v.string() }))),
    gallery:      v.optional(v.array(v.string())),
    bookingUrl:   v.optional(v.string()),
    location:     v.optional(v.object({
      shopName: v.optional(v.string()),
      address:  v.optional(v.string()),
      hours:    v.optional(v.string()),
    })),
    socials:      v.optional(v.object({
      instagram: v.optional(v.string()),
      tiktok:    v.optional(v.string()),
      youtube:   v.optional(v.string()),
      x:         v.optional(v.string()),
    })),
    deployedAt:   v.optional(v.number()),
    createdAt:    v.number(),
    updatedAt:    v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_slug", ["slug"]),

  // ── Starred flashcards (Education Hub) ───────────────────────────────────
  starredCards: defineTable({
    userId:    v.id("users"),
    cardId:    v.string(),
    topic:     v.string(),
    createdAt: v.number(),
  })
    .index("by_user",         ["userId"])
    .index("by_user_card",    ["userId", "cardId"]),

  // ── Waitlist ──────────────────────────────────────────────────────────────
  waitlist: defineTable({
    email:     v.string(),
    role:      v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
})
