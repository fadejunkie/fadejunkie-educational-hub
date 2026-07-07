import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // ── Users ─────────────────────────────────────────────────────────────────
  users: defineTable({
    clerkId:                   v.string(),
    email:                     v.string(),
    name:                      v.optional(v.string()),
    avatar:                    v.optional(v.string()),
    school:                    v.optional(v.string()),
    cohort:                    v.optional(v.string()),
    lifetimePassPurchasedAt:   v.optional(v.number()),
    isAdmin:                   v.optional(v.boolean()),
    createdAt:                 v.number(),
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

  // ── Quiz sessions (Education Hub) ────────────────────────────────────────
  quizSessions: defineTable({
    userId:         v.id("users"),
    topic:          v.string(),
    count:          v.number(),
    correct:        v.number(),
    total:          v.number(),
    topicBreakdown: v.array(v.object({
      topic:   v.string(),
      correct: v.number(),
      total:   v.number(),
    })),
    completedAt:    v.number(),
  })
    .index("by_user",           ["userId"])
    .index("by_user_completed", ["userId", "completedAt"]),

  // ── Waitlist ──────────────────────────────────────────────────────────────
  waitlist: defineTable({
    email:     v.string(),
    role:      v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // ── Study preferences (Education Hub account settings) ───────────────────
  studyPreferences: defineTable({
    userId:            v.id("users"),
    showExplanations:  v.boolean(),
    dailyReminder:     v.boolean(),
    autoStarMissed:    v.boolean(),
    defaultQuizLength: v.optional(v.number()),
    updatedAt:         v.number(),
  }).index("by_user", ["userId"]),

  // ── Partner profiles ──────────────────────────────────────────────────────
  partnerProfiles: defineTable({
    userId:      v.id("users"),
    clerkId:     v.string(),
    name:        v.string(),
    handle:      v.optional(v.string()),
    avatarUrl:   v.optional(v.string()),
    type:        v.optional(v.string()),
    description: v.optional(v.string()),
    isVisible:   v.boolean(),
    createdAt:   v.number(),
    updatedAt:   v.number(),
  })
    .index("by_user",     ["userId"])
    .index("by_clerk_id", ["clerkId"])
    .index("by_visible",  ["isVisible"]),

  // ── Dev tickets (admin → Claude inbox) ─────────────────────────────────────
  devTickets: defineTable({
    createdBy:   v.id("users"),
    title:       v.string(),
    description: v.string(),
    category:    v.union(v.literal("bug"), v.literal("feature"), v.literal("content"), v.literal("other")),
    priority:    v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
    status:      v.union(v.literal("open"), v.literal("in_progress"), v.literal("done"), v.literal("wont_fix")),
    route:       v.optional(v.string()),
    createdAt:   v.number(),
    updatedAt:   v.number(),
  })
    .index("by_status",     ["status"])
    .index("by_created_at", ["createdAt"]),

  // ── School demo pipeline (admin-only micro CRM) ──────────────────────────
  schoolDemos: defineTable({
    createdBy:     v.id("users"),
    schoolName:    v.string(),
    contactName:   v.optional(v.string()),
    contactEmail:  v.optional(v.string()),
    contactPhone:  v.optional(v.string()),
    status:        v.union(
      v.literal("not_contacted"),
      v.literal("contacted"),
      v.literal("demo_scheduled"),
      v.literal("demo_completed"),
      v.literal("closed_won"),
      v.literal("closed_lost"),
    ),
    followUpBy:    v.optional(v.number()),
    demoDate:      v.optional(v.number()),
    notes:         v.optional(v.string()),
    createdAt:     v.number(),
    updatedAt:     v.number(),
  })
    .index("by_status",      ["status"])
    .index("by_follow_up",   ["followUpBy"])
    .index("by_demo_date",   ["demoDate"])
    .index("by_created_at",  ["createdAt"]),
})
