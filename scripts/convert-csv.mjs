// Converts milady-flashcards CSVs → studyData.ts
// Run: node scripts/convert-csv.mjs

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Topic mapping ──────────────────────────────────────────────────────────
// Every CSV topic → one of 13 clean study categories
const TOPIC_MAP = {
  // ── Life Skills & Professionalism ──
  'Life Skills':        'Life Skills',
  'Professionalism':    'Life Skills',
  'Professional Growth':'Life Skills',
  'Ethics':             'Life Skills',
  'Communication':      'Life Skills',
  'Ergonomics':         'Life Skills',
  'Study Skills':       'Life Skills',
  'Test Taking':        'Life Skills',
  'Nutrition':          'Life Skills',
  'Teamwork':           'Life Skills',
  'Reasoning':          'Life Skills',
  'Sales':              'Life Skills',
  'Client Relations':   'Life Skills',

  // ── History ──
  'History':            'History',
  'History/Fashion':    'History',
  'Organizations':      'History',

  // ── Sanitation & Microbiology ──
  'Sanitation':         'Sanitation',
  'Microbiology':       'Sanitation',
  'Safety':             'Sanitation',
  'Diseases':           'Sanitation',
  'Parasitic Infestations': 'Sanitation',
  'First Aid':          'Sanitation',
  'Regulations':        'Sanitation',
  'Hygiene':            'Sanitation',

  // ── Anatomy & Physiology ──
  'Anatomy':            'Anatomy',
  'Anatomy/Physiology': 'Anatomy',
  'Biology':            'Anatomy',
  'Body Systems':       'Anatomy',
  'Cells':              'Anatomy',

  // ── Skin Science ── (skin structure, function, aging — separate from disorders)
  'Anatomy/Skin':       'Skin Science',
  'Skin/Physiology':    'Skin Science',
  'Skin':               'Skin Science',
  'Skin Care':          'Skin Science',
  'Skin Treatments':    'Skin Science',
  'Skin Aging':         'Skin Science',
  'Scalp Treatments':   'Skin Science',
  'Massage':            'Skin Science',
  'Treatments':         'Skin Science',
  'Therapies':          'Skin Science',

  // ── Hair Science ── (hair structure, growth, analysis — not disorders)
  'Hair Growth':        'Hair Science',
  'Hair Structure':     'Hair Science',
  'Hair Types':         'Hair Science',
  'Hair Patterns':      'Hair Science',
  'Hair/Skin':          'Hair Science',
  'Hair/Scalp':         'Hair Science',
  'Hair Analysis':      'Hair Science',
  'Hair Care':          'Hair Science',
  'Hair Science':       'Hair Science',
  'Hair Replacement':   'Hair Science',
  'Hair Solutions':     'Hair Science',
  'Wigs':               'Hair Science',
  'Wigs/Hairpieces':    'Hair Science',

  // ── Chemical Services ── (perms, relaxers, color, hair chemistry)
  'Chemical Services':  'Chemical Services',
  'Relaxers':           'Chemical Services',
  'Haircolor':          'Chemical Services',
  'Chemistry/Haircare': 'Chemical Services',
  'Chemistry/Hair':     'Chemical Services',
  'Pharmacology':       'Chemical Services',

  // ── General Science & Chemistry ── (elements, pH, electricity, light)
  'Chemistry':          'Science & Chemistry',
  'Science':            'Science & Chemistry',
  'Science/Light':      'Science & Chemistry',
  'Electricity':        'Science & Chemistry',
  'Electrotherapy':     'Science & Chemistry',
  'Light Therapy':      'Science & Chemistry',

  // ── Skin & Hair Disorders ──
  'Skin Disorders':     'Disorders',
  'Hair Disorders':     'Disorders',
  'Disorders':          'Disorders',

  // ── Haircutting & Styling ──
  'Haircutting':        'Haircutting',
  'Haircuts':           'Haircutting',
  'Hair Design':        'Haircutting',
  'Design':             'Haircutting',
  'Facial Shapes':      'Haircutting',
  'Facial Profiles':    'Haircutting',
  'Barbering Skills':   'Haircutting',
  'Facial Hair Design': 'Haircutting',
  'Styling':            'Haircutting',

  // ── Shaving ──
  'Shaving':            'Shaving',
  'Beard Design':       'Shaving',

  // ── Tools, Equipment & Products ──
  'Tools':              'Tools & Equipment',
  'Equipment':          'Tools & Equipment',
  'Tools/Techniques':   'Tools & Equipment',
  'Products':           'Tools & Equipment',

  // ── Business & Career ──
  'Business':           'Business',
  'Business Layout':    'Business',
  'Law & Ethics':       'Business',
  'Career':             'Business',
  'Compensation':       'Business',
  'Finance':            'Business',
  'Taxes':              'Business',
  'Business Regulations': 'Business',
  'Business Ownership': 'Business',
}

// ── CSV parser (handles quoted fields with commas) ─────────────────────────
function parseCSV(text) {
  const lines = []
  const rows = text.trim().split('\n')
  const headers = rows[0].split(',')

  for (let i = 1; i < rows.length; i++) {
    const row = {}
    const fields = []
    let field = ''
    let inQuote = false

    for (let c = 0; c < rows[i].length; c++) {
      const ch = rows[i][c]
      if (ch === '"') {
        inQuote = !inQuote
      } else if (ch === ',' && !inQuote) {
        fields.push(field)
        field = ''
      } else {
        field += ch
      }
    }
    fields.push(field)

    headers.forEach((h, idx) => {
      row[h.trim()] = (fields[idx] || '').trim()
    })
    lines.push(row)
  }
  return lines
}

// ── Strip letter prefix from choices e.g. "A) text" → "text" ─────────────
function cleanChoice(s) {
  return s.replace(/^[A-E]\)\s*/, '').trim()
}

// ── Correct option letter → index ─────────────────────────────────────────
function answerIndex(letter) {
  return { A: 0, B: 1, C: 2, D: 3, E: 4 }[letter.toUpperCase()] ?? 0
}

// ── Process rows ───────────────────────────────────────────────────────────
function processRows(rows, idOffset) {
  const flashCards = []
  const quizQuestions = []

  rows.forEach((row, i) => {
    const topic = TOPIC_MAP[row.topic] || 'Life Skills'
    const id = idOffset + i + 1

    // Build choices array — skip empty options
    const opts = [row.option_a, row.option_b, row.option_c, row.option_d, row.option_e]
      .filter(Boolean)
    const choices = opts.map(cleanChoice)
    const ansIdx = answerIndex(row.correct_options)
    const correctText = choices[ansIdx] || choices[0]

    // FlashCard
    flashCards.push({
      id,
      topic,
      question: row.question,
      answer: correctText,
    })

    // QuizQuestion — only if 2+ choices
    if (choices.length >= 2) {
      quizQuestions.push({
        id,
        topic,
        question: row.question,
        choices,
        answer: ansIdx,
        explanation: `Correct answer: ${correctText}. (Source: ${row.source})`,
      })
    }
  })

  return { flashCards, quizQuestions }
}

// ── Main ───────────────────────────────────────────────────────────────────
const exam1 = parseCSV(readFileSync(join(__dirname, 'exam1.csv'), 'utf8'))
const exam2 = parseCSV(readFileSync(join(__dirname, 'exam2.csv'), 'utf8'))

const r1 = processRows(exam1, 0)
const r2 = processRows(exam2, exam1.length)

const allFlash = [...r1.flashCards, ...r2.flashCards]
const allQuiz  = [...r1.quizQuestions, ...r2.quizQuestions]

// ── Collect all unique mapped topics ──────────────────────────────────────
const usedTopics = [...new Set(allFlash.map(c => c.topic))]

// ── Render TypeScript ──────────────────────────────────────────────────────
function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
}

function renderFlash(cards) {
  return cards.map(c => `  {
    id: ${c.id},
    topic: '${c.topic}',
    question: \`${esc(c.question)}\`,
    answer: \`${esc(c.answer)}\`,
  }`).join(',\n')
}

function renderQuiz(qs) {
  return qs.map(q => `  {
    id: ${q.id},
    topic: '${q.topic}',
    question: \`${esc(q.question)}\`,
    choices: [${q.choices.map(c => `\`${esc(c)}\``).join(', ')}],
    answer: ${q.answer},
    explanation: \`${esc(q.explanation)}\`,
  }`).join(',\n')
}

const topicUnion = usedTopics.map(t => `  | '${t}'`).join('\n')

const output = `// ── Texas State Board Study Data ──────────────────────────────────────────
// Auto-generated from fadejunkie/milady-flashcards CSV archives.
// Source: Milady Standard Barbering, Exam 1 + Exam 2 (${allFlash.length} questions total)
// DO NOT hand-edit — re-run scripts/convert-csv.mjs to regenerate.

export type Topic =
  | 'All'
${topicUnion}

export interface FlashCard {
  id: number
  topic: Exclude<Topic, 'All'>
  question: string
  answer: string
}

export interface QuizQuestion {
  id: number
  topic: Exclude<Topic, 'All'>
  question: string
  choices: string[]
  answer: number
  explanation: string
}

export const TOPICS: Topic[] = [
  'All',
${usedTopics.map(t => `  '${t}'`).join(',\n')},
]

export const ALL_FLASH_CARDS: FlashCard[] = [
${renderFlash(allFlash)}
]

export const ALL_QUIZ_QUESTIONS: QuizQuestion[] = [
${renderQuiz(allQuiz)}
]

export const QUIZ_COUNTS = [20, 50, 100] as const
export type QuizCount = typeof QUIZ_COUNTS[number]
`

const outPath = join(__dirname, '../src/data/studyData.ts')
writeFileSync(outPath, output, 'utf8')
console.log(`✓ Written ${allFlash.length} flashcards and ${allQuiz.length} quiz questions to ${outPath}`)
console.log(`  Topics: ${usedTopics.join(', ')}`)
