// Study content — Education Hub flashcards + quiz questions, admin-editable.
//
// List queries are PUBLIC (not admin-gated): this content is already shipped
// to every visitor today via the static JS bundle (src/data/studyData.ts),
// so serving it from Convex instead is no reduction in confidentiality.
// Every create/update/delete mutation is admin-gated via requireAdmin — see
// convex/schoolDemos.ts for the pattern this file mirrors.

import { mutation, query, internalMutation } from "./_generated/server"
import { v } from "convex/values"
import { requireAdmin } from "./authz"
import { ALL_FLASH_CARDS, ALL_QUIZ_QUESTIONS } from "../src/data/studyData"

// Keep in sync with the `Topic` union in src/data/studyData.ts (minus 'All').
const TOPIC_VALUES = [
  "Life Skills",
  "History",
  "Sanitation",
  "Tools & Equipment",
  "Anatomy",
  "Haircutting",
  "Business",
  "Science & Chemistry",
  "Chemical Services",
  "Hair Science",
  "Skin Science",
  "Disorders",
  "Shaving",
] as const

function assertValidTopic(topic: string) {
  if (!(TOPIC_VALUES as readonly string[]).includes(topic)) {
    throw new Error(`Invalid topic: ${topic}`)
  }
}

// ── Flashcards ───────────────────────────────────────────────────────────

export const listFlashCards = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("flashCards").collect()
    return rows
      .sort((a, b) => a.num - b.num)
      .map(r => ({ id: r.num, topic: r.topic, question: r.question, answer: r.answer, _id: r._id }))
  },
})

export const createFlashCard = mutation({
  args: { topic: v.string(), question: v.string(), answer: v.string() },
  handler: async (ctx, { topic, question, answer }) => {
    await requireAdmin(ctx)
    assertValidTopic(topic)
    const q = question.trim()
    const a = answer.trim()
    if (!q) throw new Error("Question is required")
    if (!a) throw new Error("Answer is required")

    const existing = await ctx.db.query("flashCards").collect()
    const num = existing.reduce((max, r) => Math.max(max, r.num), 0) + 1
    const now = Date.now()
    return await ctx.db.insert("flashCards", { num, topic, question: q, answer: a, createdAt: now, updatedAt: now })
  },
})

export const updateFlashCard = mutation({
  args: {
    id:       v.id("flashCards"),
    topic:    v.optional(v.string()),
    question: v.optional(v.string()),
    answer:   v.optional(v.string()),
  },
  handler: async (ctx, { id, ...rest }) => {
    await requireAdmin(ctx)
    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    if (rest.topic !== undefined) {
      assertValidTopic(rest.topic)
      patch.topic = rest.topic
    }
    if (rest.question !== undefined) {
      const q = rest.question.trim()
      if (!q) throw new Error("Question is required")
      patch.question = q
    }
    if (rest.answer !== undefined) {
      const a = rest.answer.trim()
      if (!a) throw new Error("Answer is required")
      patch.answer = a
    }
    await ctx.db.patch(id, patch)
  },
})

export const deleteFlashCard = mutation({
  args: { id: v.id("flashCards") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx)
    await ctx.db.delete(id)
  },
})

// ── Quiz questions ───────────────────────────────────────────────────────

export const listQuizQuestions = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("quizQuestions").collect()
    return rows
      .sort((a, b) => a.num - b.num)
      .map(r => ({
        id: r.num,
        topic: r.topic,
        question: r.question,
        choices: r.choices,
        answer: r.answer,
        explanation: r.explanation,
        _id: r._id,
      }))
  },
})

export const createQuizQuestion = mutation({
  args: {
    topic:       v.string(),
    question:    v.string(),
    choices:     v.array(v.string()),
    answer:      v.number(),
    explanation: v.string(),
  },
  handler: async (ctx, { topic, question, choices, answer, explanation }) => {
    await requireAdmin(ctx)
    assertValidTopic(topic)
    const q = question.trim()
    if (!q) throw new Error("Question is required")
    const trimmedChoices = choices.map(c => c.trim())
    if (trimmedChoices.length < 2) throw new Error("At least 2 choices are required")
    if (trimmedChoices.some(c => !c)) throw new Error("Choices cannot be empty")
    if (answer < 0 || answer >= trimmedChoices.length) throw new Error("Answer index out of range")

    const existing = await ctx.db.query("quizQuestions").collect()
    const num = existing.reduce((max, r) => Math.max(max, r.num), 0) + 1
    const now = Date.now()
    return await ctx.db.insert("quizQuestions", {
      num,
      topic,
      question: q,
      choices: trimmedChoices,
      answer,
      explanation: explanation.trim(),
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const updateQuizQuestion = mutation({
  args: {
    id:          v.id("quizQuestions"),
    topic:       v.optional(v.string()),
    question:    v.optional(v.string()),
    choices:     v.optional(v.array(v.string())),
    answer:      v.optional(v.number()),
    explanation: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...rest }) => {
    await requireAdmin(ctx)
    const existing = await ctx.db.get(id)
    if (!existing) throw new Error("Quiz question not found")

    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    if (rest.topic !== undefined) {
      assertValidTopic(rest.topic)
      patch.topic = rest.topic
    }
    if (rest.question !== undefined) {
      const q = rest.question.trim()
      if (!q) throw new Error("Question is required")
      patch.question = q
    }
    if (rest.choices !== undefined) {
      const trimmedChoices = rest.choices.map(c => c.trim())
      if (trimmedChoices.length < 2) throw new Error("At least 2 choices are required")
      if (trimmedChoices.some(c => !c)) throw new Error("Choices cannot be empty")
      patch.choices = trimmedChoices
    }
    if (rest.answer !== undefined) patch.answer = rest.answer
    if (rest.explanation !== undefined) patch.explanation = rest.explanation.trim()

    // Validate the final answer index against the final choices length,
    // whichever (or both) of the two fields changed this call.
    const finalChoices = (patch.choices as string[] | undefined) ?? existing.choices
    const finalAnswer = (patch.answer as number | undefined) ?? existing.answer
    if (finalAnswer < 0 || finalAnswer >= finalChoices.length) throw new Error("Answer index out of range")

    await ctx.db.patch(id, patch)
  },
})

export const deleteQuizQuestion = mutation({
  args: { id: v.id("quizQuestions") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx)
    await ctx.db.delete(id)
  },
})

// ── One-time seed from the static studyData.ts arrays ───────────────────
// Run once via: npx convex run studyContent:seedStudyContent
// Idempotent — no-ops if flashCards already has rows.

export const seedStudyContent = internalMutation({
  args: {},
  handler: async (ctx) => {
    const already = await ctx.db.query("flashCards").first()
    if (already) return "already seeded — no-op"

    const now = Date.now()
    for (const c of ALL_FLASH_CARDS) {
      await ctx.db.insert("flashCards", {
        num: c.id,
        topic: c.topic,
        question: c.question,
        answer: c.answer,
        createdAt: now,
        updatedAt: now,
      })
    }
    for (const q of ALL_QUIZ_QUESTIONS) {
      await ctx.db.insert("quizQuestions", {
        num: q.id,
        topic: q.topic,
        question: q.question,
        choices: q.choices,
        answer: q.answer,
        explanation: q.explanation,
        createdAt: now,
        updatedAt: now,
      })
    }
    return `seeded ${ALL_FLASH_CARDS.length} flashcards + ${ALL_QUIZ_QUESTIONS.length} quiz questions`
  },
})
