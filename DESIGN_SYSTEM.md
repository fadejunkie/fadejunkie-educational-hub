# FadeJunkie Educational Hub — Design System
> Source of truth. All UI decisions defer to this file.
> Original spec: `/Desktop/BRANDS/FadeJunkie/notion-style-fadejunkie-design.md`

This project uses a Notion-inspired design system: warm neutrals, whisper borders,
multi-layer shadows, and Inter typography with aggressive negative letter-spacing
at display sizes.

## Where tokens live

| Layer | File |
|---|---|
| CSS variables | `src/index.css` (`:root` block) |
| Tailwind config | `tailwind.config.ts` |
| Component primitives | `src/index.css` (`.fj-*` classes) |
| JS token exports | `src/lib/design.ts` |
| Class merge utility | `src/lib/cn.ts` |

## Color quick reference

| Token | Value | Use |
|---|---|---|
| `--color-blue` | `#0075de` | Primary CTA only |
| `--color-black-95` | `rgba(0,0,0,0.95)` | All headings + body text |
| `--color-warm-500` | `#615d59` | Secondary/description text |
| `--color-warm-300` | `#a39e98` | Placeholders, muted |
| `--color-warm-white` | `#f6f5f4` | Alternating section bg |
| `--color-warm-dark` | `#31302e` | Dark surface sections |
| `--border-whisper` | `1px solid rgba(0,0,0,0.1)` | All card/divider borders |

## Typography quick reference

| Role | Class |
|---|---|
| Hero headline | `.text-display-hero` (64px, -2.125px tracking) |
| Section heading | `.text-section` (48px, -1.5px tracking) |
| Sub-heading | `.text-subhead` (26px, -0.625px tracking) |
| Card title | `.text-card-title` (22px, -0.25px tracking) |
| Body intro | `.text-body-lg` (20px, 600) |
| Badge | `.text-badge` (12px, +0.125px tracking) |

## Component quick reference

| Component | Class |
|---|---|
| Card | `.fj-card` |
| Hero card | `.fj-card-hero` |
| Primary button | `.fj-btn-primary` |
| Secondary button | `.fj-btn-secondary` |
| Pill badge | `.fj-badge` |
| Input | `.fj-input` |
| White section | `.fj-section` |
| Warm white section | `.fj-section-alt` |
| Dark section | `.fj-section-dark` |

## Rules (non-negotiable)

1. Warm neutrals only — grays have yellow-brown undertones, never blue-gray
2. `--color-blue` (`#0075de`) is the ONLY saturated color in core UI
3. Borders are whispers — `1px solid rgba(0,0,0,0.1)` — never heavier
4. Shadows use 4–5 layers, each ≤ 0.05 opacity
5. Letter-spacing scales with size: -2.125px at 64px → normal at 16px
6. Four font weights: 400 read · 500 interact · 600 emphasize · 700 announce
7. Section rhythm: white alternates with warm-white (`#f6f5f4`)
8. Pills (9999px) for badges/tags — 4px radius for buttons/inputs
