// Single source of truth for per-route <title>/description/canonical/JSON-LD,
// and (as of the 2026-07-23 GEO fix pass) a `staticContent` HTML snapshot of
// each page's real body copy. Consumed by:
//   - React pages, via PageMeta (client-side nav) and, for /guide/*, direct
//     dangerouslySetInnerHTML of staticContent (single source, zero drift)
//   - scripts/prerender-meta.mjs (build-time static shell per route) — this
//     is what non-JS AI crawlers actually see, since the app is a client-
//     rendered SPA and createRoot() overwrites #root on mount either way.
// Plain JS on purpose — scripts/prerender-meta.mjs imports this directly via
// Node ESM with no TS/build step involved.

const ORG_JSONLD = {
  '@type': 'Organization',
  name: 'FadeJunkie',
  url: 'https://fadejunkie.com/',
  logo: 'https://fadejunkie.com/fj-logo-color.png',
  email: 'partners@fadejunkie.com',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'partners@fadejunkie.com',
    contactType: 'partnerships',
  },
  sameAs: [
    'https://www.instagram.com/fadejunkie',
    'https://www.tiktok.com/@fadejunkieofficial',
  ],
}

export const routeMeta = {
  '/': {
    title: 'FadeJunkie — Free Texas Barber State Board Study Tool',
    description:
      'Flashcards, timed practice quizzes, and live group study for the Texas barber state board exam. 300+ questions from the Milady curriculum. Built by barbers, free forever.',
    canonical: 'https://fadejunkie.com/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: 'FadeJunkie',
          url: 'https://fadejunkie.com/',
          description:
            'Free study tool for Texas barber students preparing for the state board exam — flashcards, quizzes, and live group study.',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://fadejunkie.com/education/flash?topic={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        },
        ORG_JSONLD,
      ],
    },
    staticContent: `
<h1>FadeJunkie — Free Texas Barber State Board Study Tool</h1>
<p>Flashcards, timed practice quizzes, and live group study for the Texas barber state board exam. 300+ questions from the Milady curriculum, organized across 13 topics: Life Skills, History, Sanitation, Tools &amp; Equipment, Anatomy, Haircutting, Business, Science &amp; Chemistry, Chemical Services, Hair Science, Skin Science, Disorders, and Shaving.</p>
<h2>Three ways to study</h2>
<ul>
<li><strong>Flashcards</strong> — 300 cards across 13 topics. Star your weak spots, filter by topic, drill until it sticks.</li>
<li><strong>Practice Quiz</strong> — Timed, 20/50/100 questions, randomized or by topic, with a per-topic score breakdown.</li>
<li><strong>Group Mode</strong> — Live study rooms with your class. Coming soon.</li>
</ul>
<p>Built by barbers, for Texas barber students studying for their <a href="/guide/texas-barber-state-board-exam">TDLR state board exam</a>.</p>`,
  },

  '/education': {
    title: 'Texas Barber Exam Study Hub — FadeJunkie',
    description:
      'Flashcards, solo practice quizzes, and live group study for Texas barber state board prep. 300+ questions from the Milady curriculum. Free.',
    canonical: 'https://fadejunkie.com/education',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: 'Texas Barber State Board Exam Study Hub',
      description:
        'Free interactive study tool covering all Texas barber state board exam topics: anatomy, sanitation, tools, life skills, and more.',
      url: 'https://fadejunkie.com/education',
      provider: { '@type': 'Organization', name: 'FadeJunkie', url: 'https://fadejunkie.com' },
      educationalLevel: 'Vocational',
      teaches: 'Texas Barber State Board Exam',
      isAccessibleForFree: false,
      inLanguage: 'en',
      dateModified: '2026-07-23',
    },
    staticContent: `
<h1>Texas Barber State Board Exam Study Hub</h1>
<p>Free interactive study tool covering every Texas barber state board exam topic: anatomy, sanitation, tools, life skills, and more — 300+ questions sourced from the Milady curriculum.</p>
<h2>Sample question</h2>
<p><strong>Q:</strong> Most effective way to sanitize metal implements between clients?<br><strong>A:</strong> An EPA-registered hospital disinfectant, minimum 10 minutes contact.</p>
<p>Create a free account to start studying flashcards, the practice quiz, and the practical exam guide. A one-time $15 lifetime pass unlocks full multi-topic study and the complete question bank.</p>`,
  },

  '/education/flash': {
    title: 'Flashcards — Texas Barber State Board Prep — FadeJunkie',
    description:
      '300+ Texas barber state board flashcards across 13 topics. Filter by topic, star your weak spots, and drill until it sticks. Free.',
    canonical: 'https://fadejunkie.com/education/flash',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Flashcards — Texas Barber State Board Prep',
      description:
        '300+ Texas barber state board flashcards across 13 topics, sourced from the Milady curriculum.',
      url: 'https://fadejunkie.com/education/flash',
      isPartOf: { '@type': 'WebSite', name: 'FadeJunkie', url: 'https://fadejunkie.com/' },
      dateModified: '2026-07-23',
    },
    staticContent: `
<h1>Flashcards — Texas Barber State Board Prep</h1>
<p>300+ Texas barber state board flashcards across 13 topics, sourced from the Milady curriculum. Filter by topic, star your weak spots, and drill until it sticks. Free to start with an account.</p>`,
  },

  '/education/quiz': {
    title: 'Practice Quiz — Texas Barber State Board Prep — FadeJunkie',
    description:
      'Timed practice quiz for the Texas barber state board exam — 20, 50, or 100 questions, randomized or by topic, scored with a per-topic breakdown. Free.',
    canonical: 'https://fadejunkie.com/education/quiz',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Practice Quiz — Texas Barber State Board Prep',
      description:
        'Timed multiple-choice practice quiz for the Texas barber state board exam.',
      url: 'https://fadejunkie.com/education/quiz',
      isPartOf: { '@type': 'WebSite', name: 'FadeJunkie', url: 'https://fadejunkie.com/' },
      dateModified: '2026-07-23',
    },
    staticContent: `
<h1>Practice Quiz — Texas Barber State Board Prep</h1>
<p>Timed practice quiz for the Texas barber state board exam — 20, 50, or 100 questions, randomized or by topic, scored with a per-topic breakdown at the end.</p>`,
  },

  '/education/practical': {
    title: 'TDLR Barber Practical Exam Guide — FadeJunkie',
    description:
      'Complete Texas barber practical exam guide — materials checklist and step-by-step instructions for every section. Powered by FadeJunkie.',
    canonical: 'https://fadejunkie.com/education/practical',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'TDLR Barber Practical Exam Guide',
      description:
        'Materials checklist and step-by-step instructions for every section of the Texas barber practical exam.',
      url: 'https://fadejunkie.com/education/practical',
      isPartOf: { '@type': 'WebSite', name: 'FadeJunkie', url: 'https://fadejunkie.com/' },
      dateModified: '2026-07-23',
    },
    staticContent: `
<h1>TDLR Barber Practical Exam Guide</h1>
<p>Materials checklist and step-by-step instructions for every section of the Texas barber practical exam.</p>
<h2>Exam sections</h2>
<ol>
<li>Pre-Exam Setup &amp; Disinfection — 10 min</li>
<li>Manicure Service — 22 min</li>
<li>Professional Shave Service — 42 min</li>
<li>Blood Exposure Incident — 12 min</li>
<li>Facial Service — 17 min</li>
<li>Haircutting Service — 37 min</li>
<li>Blow-Drying &amp; Thermal Curling — 22 min</li>
<li>Chemical Application Preparation — 5 min</li>
<li>Permanent Wave Service — 20 min</li>
<li>Single Color Retouch — 22 min</li>
<li>End of Exam Disinfection — 5 min</li>
</ol>`,
  },

  '/partners': {
    title: 'Partners — FadeJunkie',
    description:
      'FadeJunkie partners with barber schools and instructors to bring group study tools to their students — built with the industry, not just for it.',
    canonical: 'https://fadejunkie.com/partners',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'FadeJunkie Partners',
      description: 'Barber schools and instructors using FadeJunkie group study tools with their classes.',
      url: 'https://fadejunkie.com/partners',
      isPartOf: { '@type': 'WebSite', name: 'FadeJunkie', url: 'https://fadejunkie.com/' },
      dateModified: '2026-07-23',
    },
    staticContent: `
<h1>FadeJunkie Partners</h1>
<p>FadeJunkie partners with barber schools and instructors to bring group study tools to their students — built with the industry, not just for it.</p>`,
  },

  '/barber': {
    title: 'Your Barber Page — FadeJunkie',
    description:
      'Get your own barber page live in minutes — services, pricing, photo gallery, and a booking link. 7-day free preview.',
    canonical: 'https://fadejunkie.com/barber',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Your Barber Page',
      description: 'A hosted page for working barbers — services, pricing, photos, and a booking link.',
      url: 'https://fadejunkie.com/barber',
      isPartOf: { '@type': 'WebSite', name: 'FadeJunkie', url: 'https://fadejunkie.com/' },
      dateModified: '2026-07-23',
    },
    staticContent: `
<h1>Your Barber Page</h1>
<p>Get your own barber page live in minutes — services, pricing, photo gallery, and a booking link. 7-day free preview.</p>`,
  },

  '/guide/texas-barber-state-board-exam': {
    title: 'Texas Barber State Board Exam Guide — FadeJunkie',
    description:
      "What to expect on the Texas barber written and practical exams — required hours, PSI scheduling, exam sections, fees, and free FadeJunkie prep tools.",
    canonical: 'https://fadejunkie.com/guide/texas-barber-state-board-exam',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: 'The Texas Barber State Board Exam, Explained',
          description:
            "What to expect on the Texas barber written and practical exams — required hours, PSI scheduling, exam sections, fees, and free FadeJunkie prep tools.",
          url: 'https://fadejunkie.com/guide/texas-barber-state-board-exam',
          datePublished: '2026-07-23',
          dateModified: '2026-07-23',
          author: { '@type': 'Organization', name: 'FadeJunkie', url: 'https://fadejunkie.com/' },
          publisher: ORG_JSONLD,
          isPartOf: { '@type': 'WebSite', name: 'FadeJunkie', url: 'https://fadejunkie.com/' },
          about: 'Texas Class A Barber License Examination',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How many hours do I need before I can take the Texas barber written exam?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "You need to complete 900 of the required 1,000 hours of a Class A Barber course at a TDLR-licensed school before you're eligible for the written exam.",
              },
            },
            {
              '@type': 'Question',
              name: 'Who administers the Texas barber licensing exams?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "PSI, TDLR's third-party testing vendor, administers both the written and practical Class A Barber exams. Once your school reports your eligible hours, PSI emails you scheduling instructions.",
              },
            },
            {
              '@type': 'Question',
              name: 'When can I take the practical exam?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'After you complete all 1,000 required hours and pass the written exam.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is FadeJunkie free to use?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Creating an account is free, and gets you into flashcards, the practice quiz, and the practical exam guide. A one-time $15 lifetime pass unlocks full multi-topic study and the complete 300-question bank.',
              },
            },
            {
              '@type': 'Question',
              name: 'What topics does FadeJunkie cover?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'All 13 areas tested on the Texas barber state board exam: Life Skills, History, Sanitation, Tools & Equipment, Anatomy, Haircutting, Business, Science & Chemistry, Chemical Services, Hair Science, Skin Science, Disorders, and Shaving.',
              },
            },
          ],
        },
      ],
    },
    staticContent: `
<h1>The Texas Barber State Board Exam, Explained</h1>
<p>The Texas Class A Barber license requires passing two exams administered by <a href="https://www.psiexams.com/test-takers/tdlr/" rel="noopener">PSI</a> on behalf of the <a href="https://www.tdlr.texas.gov/barbering-and-cosmetology/individuals/examinations/" rel="noopener">Texas Department of Licensing and Regulation (TDLR)</a>: a written exam and a practical exam. Here's exactly how the process works, sourced from TDLR's own published requirements.</p>

<h2>Before you can test</h2>
<ul>
<li>Complete a Class A Barber course — <strong>1,000 hours</strong> of instruction at a barbering/cosmetology school licensed in Texas.</li>
<li>Be at least <strong>17 years old</strong> to apply for a license.</li>
<li>Your school reports your hours to TDLR; allow <strong>24–48 hours</strong> for your eligibility to generate in the system.</li>
</ul>

<h2>The written exam</h2>
<p>Once you've completed <strong>900 of the 1,000</strong> required hours, your school notifies TDLR that you're eligible for the written exam. PSI then emails you scheduling instructions. The exam is offered in English, Spanish, Korean, Simplified Chinese, and Vietnamese. The exact number of questions, time allotted, and passing score are set by TDLR's official <a href="https://test-takers.psiexams.com/api/content/bulletin/701" rel="noopener">Candidate Information Bulletin (CIB)</a> — download the current version before test day, since these details can change.</p>

<h2>The practical exam</h2>
<p>You become eligible for the practical exam only after completing <strong>all 1,000 hours</strong> and <strong>passing the written exam</strong>. FadeJunkie's own <a href="/education/practical">TDLR Barber Practical Exam Guide</a> breaks down every section with real time limits, drawn from the Milady curriculum: Pre-Exam Setup &amp; Disinfection (10 min), Manicure Service (22 min), Professional Shave Service (42 min), Blood Exposure Incident (12 min), Facial Service (17 min), Haircutting Service (37 min), Blow-Drying &amp; Thermal Curling (22 min), Chemical Application Preparation (5 min), Permanent Wave Service (20 min), Single Color Retouch (22 min), and End of Exam Disinfection (5 min).</p>

<h2>License &amp; fees</h2>
<ul>
<li>Application fee: <strong>$50</strong>, non-refundable.</li>
<li>A Class A Barber license is valid for <strong>two years</strong> from the date of issue.</li>
<li>Applicants with a felony or misdemeanor conviction must submit a Criminal History Questionnaire; TDLR's review takes about <strong>1–6 weeks</strong>.</li>
</ul>

<h2>How FadeJunkie helps</h2>
<p>300+ practice questions from the Milady curriculum across all 13 tested topics — <a href="/education/flash">flashcards</a>, a <a href="/education/quiz">timed practice quiz</a>, and the practical exam guide above. Free account required; a one-time $15 lifetime pass unlocks full multi-topic study and the complete question bank.</p>

<h2>FAQ</h2>
<p><strong>How many hours do I need before I can take the written exam?</strong><br>900 of the required 1,000 hours.</p>
<p><strong>Who administers the exams?</strong><br>PSI, on behalf of TDLR.</p>
<p><strong>When can I take the practical exam?</strong><br>After all 1,000 hours are complete and you've passed the written exam.</p>
<p><strong>Is FadeJunkie free?</strong><br>A free account unlocks flashcards, the quiz, and the practical guide. $15 one-time unlocks everything.</p>

<h2>Sources</h2>
<ul>
<li><a href="https://www.tdlr.texas.gov/barbering-and-cosmetology/individuals/examinations/" rel="noopener">TDLR — Exam Information for Barbers and Cosmetologists</a></li>
<li><a href="https://www.tdlr.texas.gov/barbering-and-cosmetology/individuals/apply-barber.htm" rel="noopener">TDLR — Apply for a Class A Barber License</a></li>
<li><a href="https://www.psiexams.com/test-takers/tdlr/" rel="noopener">PSI — TDLR Certification Exams</a></li>
</ul>`,
  },
}
