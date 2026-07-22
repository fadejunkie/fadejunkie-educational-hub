// Generates a static index.html per public route under dist/, each a copy of the
// base SPA shell with that route's real <title>/description/canonical/JSON-LD baked
// in — so non-JS HTTP crawlers (most AI answer-engine bots) see accurate per-page
// metadata instead of the identical generic shell every route otherwise serves.
// Run: node scripts/prerender-meta.mjs (wired into `npm run build` as a postbuild step)

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { routeMeta } from '../src/data/routeMeta.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const baseShell = readFileSync(join(distDir, 'index.html'), 'utf-8')

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function renderShell(meta) {
  let html = baseShell

  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)

  if (/<meta name="description"[^>]*>/.test(html)) {
    html = html.replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${escapeHtml(meta.description)}" />`
    )
  } else {
    html = html.replace('</title>', `</title>\n    <meta name="description" content="${escapeHtml(meta.description)}" />`)
  }

  if (/<link rel="canonical"[^>]*>/.test(html)) {
    html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${meta.canonical}" />`)
  } else {
    html = html.replace('</title>', `</title>\n    <link rel="canonical" href="${meta.canonical}" />`)
  }

  // Replace any existing static JSON-LD block (e.g. the homepage's), else insert a fresh one before </head>
  const jsonLdTag = meta.jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`
    : ''
  if (/<script type="application\/ld\+json">.*?<\/script>/s.test(html)) {
    html = html.replace(/<script type="application\/ld\+json">.*?<\/script>/s, jsonLdTag)
  } else if (jsonLdTag) {
    html = html.replace('</head>', `  ${jsonLdTag}\n  </head>`)
  }

  return html
}

for (const [route, meta] of Object.entries(routeMeta)) {
  if (route === '/') continue // homepage shell already lives at dist/index.html

  const outDir = join(distDir, route.replace(/^\//, ''))
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), renderShell(meta))
  console.log(`Prerendered: dist${route}/index.html`)
}
