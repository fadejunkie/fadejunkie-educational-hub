# Claude Design Prompt — FadeJunkie Full Site Wireframe

Copy everything below the line into Claude Design.

---

## Project Overview

Design a complete set of wireframes for **FadeJunkie** — a barber culture brand and educational platform at fadejunkie.com. The product is a free study tool for Texas barber students preparing for their state board exam. The brand sits at the intersection of barber culture, streetwear energy, and practical tools.

The audience is barber students aged 18–30 in Texas programs, studying on their phones between clients. The design must feel built from inside the shop — not like corporate SaaS, generic ed-tech, or salon software.

---

## Design System (follow exactly)

**Aesthetic:** Notion-inspired — warm, clean, readable, focused. Not flashy.

**Colors:**
- Primary CTA: `#0075de` (the ONLY saturated color in core UI)
- Headings + body: `rgba(0,0,0,0.95)`
- Secondary text: `#615d59` (warm gray)
- Muted/placeholder: `#a39e98`
- Alt section background: `#f6f5f4` (warm white)
- Dark surface sections: `#31302e`
- Borders: `1px solid rgba(0,0,0,0.1)` — whisper-light, never heavy
- Card shadows: 4–5 layer, each ≤ 0.05 opacity

**Typography:** Inter font family
- Hero headline: 64px, -2.125px letter-spacing, weight 700
- Section heading: 48px, -1.5px letter-spacing, weight 700
- Sub-heading: 26px, -0.625px letter-spacing, weight 600
- Card title: 22px, -0.25px letter-spacing, weight 600
- Body intro: 20px, weight 600
- Badge/label: 12px, +0.125px letter-spacing, uppercase, weight 500

**Components:**
- Cards: subtle multi-layer shadow, whisper border, 12px radius
- Buttons: 4px radius. Primary = `#0075de` fill, white text. Secondary = transparent with border.
- Badges/pills: 9999px radius (full pill), light background
- Section rhythm: white sections alternate with warm-white (`#f6f5f4`) sections
- Warm neutrals ONLY — grays have yellow-brown undertones, never blue-gray

---

## Pages to Wireframe (8 total)

### 1. Homepage / Lander
**Sections in order:**
- **Sticky nav:** FadeJunkie logo left, hamburger right. Hamburger opens to two tabs: Education Hub, Partners
- **Hero:** Badge "By Barbers, For Barbers" → Headline "A barber brand built in the shop." → Subtext → 3-column role picker cards (Student, Barber, Shop). Student card is active with blue border, Barber shows "Soon" tag, Shop shows "Coming Soon" and is dimmed
- **Stats bar:** Warm-white bg. Three centered stats: "300+" Practice questions, "3" Study modes, "Free" Always, for barbers
- **Brand section:** Badge "The Brand" → Heading "More than merch." → 3-column card grid (Culture, Tools, Community) with badge + title + description each
- **Education Hub feature:** Warm-white bg. Badge "First Digital Product" → Heading "Pass your Texas State Board." → 3-column feature cards (Flashcards, Practice Quiz, Group Mode with "Coming Soon" tag) → CTA button "Open Education Hub"
- **Partners teaser:** Two-column. Left: badge + heading "Built with the industry." + description + "View Partners" button. Right: CTA card with "Interested in partnering?" + email button
- **Footer:** Warm-white bg, FadeJunkie logo, nav links

### 2. Education Hub Landing (`/education`)
- Hero with heading "Education Hub" and short description
- **Mode picker:** 3 large cards in a grid:
  - Flashcards — BookOpen icon, description, "Start Studying" CTA
  - Practice Quiz — Trophy icon, description, "Take a Quiz" CTA
  - Group Mode — Users icon, description, "Create or Join Room" CTA (can show "Coming Soon" state)
- **Progress summary panel** (for logged-in users): cards showing total questions answered, quiz sessions completed, weak topics
- **Weakness heatmap:** Visual grid showing topic mastery by color intensity across all topic categories (Life Skills, History, Anatomy, Tools, Sanitation, etc.)

### 3. Flashcard Mode (`/education/flashcards`)
- **Top bar:** Back arrow to Education Hub, topic filter dropdown, "Starred Only" toggle
- **Card area (center stage):** Large flip card — front shows question text, back shows answer. Tap/click to flip. Card has subtle shadow, generous padding
- **Card controls:** Below the card — Star button (outline or filled), Previous arrow, card counter "12 / 300", Next arrow
- **Topic filter sidebar/drawer (mobile):** List of topics with checkboxes (Life Skills, History, Professionalism, Sanitation, Microbiology, Diseases, Nutrition, Anatomy, Tools, Equipment, Ergonomics, Organizations, Ethics, Safety, Study Skills, Professional Growth, History/Fashion)
- **Progress indicator:** Thin bar at top showing how far through the deck

### 4. Solo Quiz Mode (`/education/quiz`)
**Pre-quiz setup screen:**
- Heading "Practice Quiz"
- Question count picker: 4 selectable pills (20, 50, 100, 150)
- Topic filter: "All Topics" default, or select specific topics
- "Start Quiz" primary CTA button

**Active quiz screen:**
- Timer in top-right corner
- Progress bar at top
- Question number "Question 14 of 50"
- Question text (large, readable)
- 4 answer options (A–D) as tappable cards — neutral state, selected state (blue border), correct (green), incorrect (red)
- "Next" button after answering

**Results screen:**
- Score prominently displayed: "38 / 50 — 76%"
- Per-topic breakdown: horizontal bars showing % correct per topic
- Weak topics highlighted
- "Review Missed Questions" and "Take Another Quiz" CTAs

### 5. Group Mode (`/education/group`)
**Host flow:**
- "Create Room" button → generates 6-character room code displayed large and centered
- QR code or shareable link below the code
- Player lobby: list of joined players with avatars, "Start Game" button when ready
- Live game: question displayed to all, timer counting down, real-time answer indicators
- Live scoreboard after each question: ranked list with points

**Player flow:**
- "Join Room" — input field for 6-character code
- Waiting screen with room code displayed and player list
- Active question: question + answer options, timer
- Score position shown after each question

**End screen:**
- Final scoreboard — 1st/2nd/3rd highlighted
- Per-player score breakdown
- "Play Again" and "Back to Hub" CTAs

### 6. Partners Page (`/partners`)
- Hero: heading "Partners" + description about peer-to-peer partnerships
- **Partner type cards** (4 types in a 2×2 grid):
  - Barber Schools: what we offer, what we ask
  - Tool & Product Brands: what we offer, what we ask
  - Distributors: what we offer, what we ask
  - Platform Partners: what we offer, what we ask
- Each card has a status badge (Actively Seeking, Open, Planning, Phase 4)
- **CTA section:** "Interested?" + email `partners@fadejunkie.com` + button
- Tone: professional but warm, peer-to-peer — not a media kit

### 7. User Profile / Dashboard (`/profile`)
- User info: name, avatar (from Google OAuth), member since date
- **Study stats panel:** Total questions seen, total correct, overall accuracy %, quiz sessions completed
- **Recent activity:** Last 5 quiz sessions with date, score, topics
- **Topic mastery grid:** All topics with progress bars showing mastery percentage
- **Starred flashcards count** with link to jump into starred-only mode
- Simple, data-dense but clean — no gamification clutter

### 8. Barber Page (`/barber`) — Coming Soon State
- Hero with heading and description about tools for working barbers
- 3–4 teaser cards showing planned features (dimmed/muted): Booking tools, Business resources, Community features
- Email signup: "Get notified when we launch" + email input + submit button
- Maintain the same section rhythm and warm-neutral palette

---

## Global Elements

**Navigation (all pages):**
- Sticky top nav: logo left, hamburger right
- Hamburger opens overlay/drawer with two primary tabs: Education Hub, Partners
- On auth pages, user avatar appears in nav with dropdown (Profile, Sign Out)

**Footer (all pages):**
- Warm-white background
- FadeJunkie logo (use `fj-logo-black.png` on light backgrounds)
- Navigation links: Education Hub, Partners, Barber (Coming Soon)
- Contact: partners@fadejunkie.com
- Copyright line

**Mobile-first:** All layouts should be designed mobile-first (375px viewport) with desktop breakpoints. Barber students study on their phones — mobile is the primary experience.

**Auth states:** Show both logged-out (anonymous browsing) and logged-in states where relevant. Anonymous users can browse flashcards and take quizzes but progress isn't saved. A subtle "Sign in to save progress" prompt appears where appropriate.

---

## What This Is NOT

Do not make it look like: corporate SaaS (Salesforce energy), generic ed-tech (Coursera/Khan Academy), salon software (Vagaro/Booker), or hype culture ("game changer", "#1 platform"). No red/white barbershop stripes. No vintage barber poles. No blue-gray tones. No heavy borders or loud gradients.

It should feel like: a clean, warm, modern tool that a barber student would actually want to use on their phone between clients. Notion meets streetwear. Confident but not loud.
