import type { Config } from 'tailwindcss'

/** FadeJunkie Educational Hub — Tailwind Config
 *  Source of truth: /DESIGN_SYSTEM.md (Notion-inspired)
 *  Every token here maps 1:1 to a variable in that doc.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // ── Colors ──────────────────────────────────────────────────────────
      colors: {
        // Primary
        'fj-black':      'rgba(0,0,0,0.95)',   // near-black text
        'fj-white':      '#ffffff',
        'fj-blue':       '#0075de',             // Notion Blue — primary CTA
        'fj-blue-active':'#005bab',             // pressed state
        'fj-navy':       '#213183',             // deep navy — dark sections
        // Warm neutral scale (yellow-brown undertones — never blue-gray)
        'warm-white':    '#f6f5f4',             // alt section bg
        'warm-dark':     '#31302e',             // dark surface text
        'warm-500':      '#615d59',             // secondary text
        'warm-300':      '#a39e98',             // muted / placeholder
        // Semantic accents
        'fj-teal':       '#2a9d99',
        'fj-green':      '#1aae39',
        'fj-orange':     '#dd5b00',
        'fj-pink':       '#ff64c8',
        'fj-purple':     '#391c57',
        'fj-brown':      '#523410',
        // Interactive
        'link-blue':     '#0075de',
        'link-light':    '#62aef0',
        'focus-blue':    '#097fe8',
        'badge-bg':      '#f2f9ff',
        'badge-text':    '#097fe8',
        // Border
        'border-whisper':'rgba(0,0,0,0.1)',
        'input-border':  '#dddddd',
      },

      // ── Typography ──────────────────────────────────────────────────────
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        // Display
        'display-hero':  ['4rem',    { lineHeight: '1.00', letterSpacing: '-2.125px', fontWeight: '700' }],
        'display-2':     ['3.375rem',{ lineHeight: '1.04', letterSpacing: '-1.875px', fontWeight: '700' }],
        'section':       ['3rem',    { lineHeight: '1.00', letterSpacing: '-1.5px',   fontWeight: '700' }],
        'subhead-lg':    ['2.5rem',  { lineHeight: '1.50', letterSpacing: 'normal',   fontWeight: '700' }],
        'subhead':       ['1.625rem',{ lineHeight: '1.23', letterSpacing: '-0.625px', fontWeight: '700' }],
        'card-title':    ['1.375rem',{ lineHeight: '1.27', letterSpacing: '-0.25px',  fontWeight: '700' }],
        'body-lg':       ['1.25rem', { lineHeight: '1.40', letterSpacing: '-0.125px', fontWeight: '600' }],
        // Body
        'body':          ['1rem',    { lineHeight: '1.50', letterSpacing: 'normal',   fontWeight: '400' }],
        'body-md':       ['1rem',    { lineHeight: '1.50', letterSpacing: 'normal',   fontWeight: '500' }],
        'body-sb':       ['1rem',    { lineHeight: '1.50', letterSpacing: 'normal',   fontWeight: '600' }],
        'body-bold':     ['1rem',    { lineHeight: '1.50', letterSpacing: 'normal',   fontWeight: '700' }],
        'nav':           ['0.9375rem',{ lineHeight: '1.33', letterSpacing: 'normal',  fontWeight: '600' }],
        // Small
        'caption':       ['0.875rem',{ lineHeight: '1.43', letterSpacing: 'normal',   fontWeight: '500' }],
        'caption-light': ['0.875rem',{ lineHeight: '1.43', letterSpacing: 'normal',   fontWeight: '400' }],
        'badge':         ['0.75rem', { lineHeight: '1.33', letterSpacing: '0.125px',  fontWeight: '600' }],
        'micro':         ['0.75rem', { lineHeight: '1.33', letterSpacing: '0.125px',  fontWeight: '400' }],
      },

      // ── Spacing ─────────────────────────────────────────────────────────
      // 8px base unit. Non-rigid organic scale per design doc.
      spacing: {
        '0.25': '2px',
        '0.375': '3px',
        '0.5': '4px',
        '0.625': '5px',
        '0.75': '6px',
        '0.875': '7px',
        '1': '8px',
        '1.375': '11px',
        '1.5': '12px',
        '1.75': '14px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '6': '48px',
        '8': '64px',
        '10': '80px',
        '12': '96px',
        '15': '120px',
      },

      // ── Border Radius ────────────────────────────────────────────────────
      borderRadius: {
        'micro':    '4px',   // buttons, inputs
        'sm':       '5px',   // links, menu items
        'md':       '8px',   // small cards
        'lg':       '12px',  // standard cards
        'xl':       '16px',  // hero/featured cards
        'pill':     '9999px',// badges, pills
        'circle':   '100%',  // avatars
      },

      // ── Box Shadow ───────────────────────────────────────────────────────
      boxShadow: {
        'card': [
          'rgba(0,0,0,0.04) 0px 4px 18px',
          'rgba(0,0,0,0.027) 0px 2.025px 7.847px',
          'rgba(0,0,0,0.02) 0px 0.8px 2.925px',
          'rgba(0,0,0,0.01) 0px 0.175px 1.041px',
        ].join(', '),
        'deep': [
          'rgba(0,0,0,0.01) 0px 1px 3px',
          'rgba(0,0,0,0.02) 0px 3px 7px',
          'rgba(0,0,0,0.02) 0px 7px 15px',
          'rgba(0,0,0,0.04) 0px 14px 28px',
          'rgba(0,0,0,0.05) 0px 23px 52px',
        ].join(', '),
        'whisper': '0 0 0 1px rgba(0,0,0,0.1)',
        'focus':   '0 0 0 2px #097fe8',
        'none':    'none',
      },

      // ── Max Width ─────────────────────────────────────────────────────────
      maxWidth: {
        'content': '1200px',
      },

      // ── Breakpoints ───────────────────────────────────────────────────────
      screens: {
        'xs':  '400px',
        'sm':  '600px',
        'md':  '768px',
        'lg':  '1080px',
        'xl':  '1200px',
        '2xl': '1440px',
      },
    },
  },
  plugins: [],
}

export default config
