// Single source of truth for per-route <title>/description/canonical/JSON-LD.
// Consumed by both the React pages (via PageMeta, for client-side navigation)
// and scripts/prerender-meta.mjs (for the static build-time shell per route).
// Plain JS on purpose — scripts/prerender-meta.mjs imports this directly via
// Node ESM with no TS/build step involved.

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
        },
        {
          '@type': 'Organization',
          name: 'FadeJunkie',
          url: 'https://fadejunkie.com/',
          logo: 'https://fadejunkie.com/fj-logo-color.png',
          sameAs: [
            'https://www.instagram.com/fadejunkie',
            'https://www.tiktok.com/@fadejunkieofficial',
          ],
        },
      ],
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
  },
}
