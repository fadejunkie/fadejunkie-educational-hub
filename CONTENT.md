# FadeJunkie Educational Hub — Content Rules

> Governs all question content, deck structure, and topic taxonomy.
> No question enters the product without following these rules.

---

## Source of Truth

All questions currently in this product come from **Milady Standard Barbering**
published study materials. This is the primary textbook used in Texas barber
programs and the basis for state board exam content.

Until a licensed curriculum partnership is established, **Milady is the only
approved source.**

---

## Current Question Bank

| File | Questions | Status |
|---|---|---|
| `mbf_exam_1.csv` | 150 | Active |
| `mbf_exam_2.csv` | 150 | Active |
| **Total** | **300** | — |

Source repo: `github.com/fadejunkie/milady-flashcards`

---

## Question Schema

Each question follows this structure:

```
id            — unique ID (format: Q-XXXX)
type          — mc_single (multiple choice, one correct answer)
question      — the question text
option_a      — answer choice A (includes letter prefix: "A) ...")
option_b      — answer choice B
option_c      — answer choice C
option_d      — answer choice D
option_e      — answer choice E (rarely used)
correct_options — correct answer letter (A, B, C, or D)
source        — original review question reference
topic         — topic category (see taxonomy below)
```

---

## Topic Taxonomy

Questions are tagged with one of these topics. This list is the canonical
taxonomy — do not add topics without updating this file.

| Topic | Description |
|---|---|
| Life Skills | Goal setting, mindset, professionalism fundamentals |
| History | Barbering history, cultural context, industry milestones |
| Professionalism | Ethics, client relations, workplace conduct |
| Sanitation | Infection control, disinfection, safety protocols |
| Microbiology | Bacteria, pathogens, disease transmission |
| Diseases | Bloodborne pathogens, skin conditions, contraindications |
| Nutrition | Health and wellness relevant to barber practice |
| Anatomy | Muscles, nerves, bones relevant to barbering |
| Tools | Clippers, shears, razors, implements |
| Equipment | Chairs, sterilizers, latherizers, shop equipment |
| Ergonomics | Posture, body mechanics for working barbers |
| Organizations | AMBBA, NABBA, state boards, licensing bodies |
| Ethics | Professional codes, AMBBA ethics |
| Safety | Fire safety, chemical safety, shop safety |
| Study Skills | Note-taking, test preparation, learning techniques |
| Professional Growth | Career development, goal setting |
| History/Fashion | Trend history, style evolution |

---

## Adding New Questions

1. Questions must come from a licensed, citable source
2. Each question needs all required schema fields populated
3. Topic must match the taxonomy above (add new topic here first if needed)
4. Questions are converted to `src/data/questions.json` via the import script (Phase 2)
5. Never manually edit `questions.json` — always edit the source CSV and re-run the script

---

## Adding New Decks

Future decks (other states, advanced topics) follow the same rules:

- Named `{state/topic}_exam_{n}.csv`
- Stored in `src/data/source/`
- Each deck needs a name, description, and target audience defined in `src/data/decks.json`
- A deck must have at least 50 questions before being made available

---

## Content We Will Never Add

- Questions from unverified internet sources
- AI-generated questions (until verified against licensed curriculum)
- Questions that aren't relevant to Texas barber state board content
- Cosmetology-only content (nail tech, esthetics, etc.)

---

## Updating Existing Questions

If a question is found to be incorrect or outdated:
1. Flag it in GitHub as an issue with label `content-fix`
2. Verify correction against the Milady source material
3. Update the source CSV, not the generated JSON
4. Re-run the import script and commit both CSV + JSON changes together
