// After `vite build` (client) and `vite build --ssr src/entry-server.tsx` (dist-ssr), write one HTML
// file per page with its own head (title, description, canonical, Open Graph, JSON-LD) and its
// rendered content, plus llms.txt. Fails the build if a page breaks the SEO rules.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const dist = resolve('dist')
const { render, pages, absolute, jsonLd, siteConfig } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const template = await readFile(`${dist}/index.html`, 'utf8')

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// Main content only, like Semrush: it counted 186 words on a home page where everything gave 271.
// MIN_WORDS keeps a margin over its 200 (it still counted a few words fewer than this method).
const MIN_WORDS = 220
const words = html => html
  .replace(/<(script|style|svg|nav|footer|form|button)\b[\s\S]*?<\/\1>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z#0-9]+;/gi, ' ')
  .split(/\s+/).filter(w => /\p{L}/u.test(w)).length

function head(path) {
  const p = pages[path], url = absolute(path), image = absolute(p.image)
  const ld = jsonLd(path).map(b => `<script type="application/ld+json">${JSON.stringify(b).replace(/</g, '\\u003c')}</script>`)
  return [
    `<title>${esc(p.title)}</title>`,
    `<meta name="description" content="${esc(p.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(siteConfig.name)}" />`,
    `<meta property="og:locale" content="fr_CA" />`,
    `<meta property="og:title" content="${esc(p.title)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(p.title)}" />`,
    `<meta name="twitter:description" content="${esc(p.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    ...ld,
  ].map(l => `    ${l}`).join('\n')
}

const base = template
  .replace(/<title>[\s\S]*?<\/title>\s*/, '')
  .replace(/<meta (?:name="description"|property="og:[^"]*"|name="twitter:[^"]*")[^>]*>\s*/g, '')
  .replace(/<link rel="canonical"[^>]*>\s*/, '')

const problems = []
for (const path of Object.keys(pages)) {
  // videos carry no text; React mounts them (a prerendered copy would start a second download)
  const body = (await render(path)).replace(/<video\b[^>]*>[\s\S]*?<\/video>/g, '')
  const html = base
    .replace('</head>', `${head(path)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)

  const n = words(body), h1 = (body.match(/<h1\b/g) ?? []).length
  if (n < MIN_WORDS) problems.push(`${path}: ${n} words of main content (${MIN_WORDS} minimum)`)
  if (h1 !== 1) problems.push(`${path}: ${h1} h1 (exactly 1)`)

  const file = path === '/' ? `${dist}/index.html` : `${dist}${path}/index.html`
  await mkdir(resolve(file, '..'), { recursive: true })
  await writeFile(file, html)
  if (path === '/') await Promise.all(['gz', 'br'].map(ext => rm(`${file}.${ext}`, { force: true }))) // stale compressed copies
  console.log(`prerendered ${path} (${n} words)`)
}

const s = siteConfig
await writeFile(`${dist}/llms.txt`, `# ${s.name}

> Restaurant indien et pakistanais 100 % halal à Brossard (Québec), avec une salle de réception jusqu'à 225 personnes et un service traiteur.

- Adresse : ${s.address}
- Téléphone : ${s.phone}
- Courriel : ${s.email}
- Commander en ligne : https://jabeenscuisine.clusterpos.com

## Pages

${Object.entries(pages).map(([path, p]) => `- [${p.name}](${absolute(path)}) : ${p.description}`).join('\n')}

## Réseaux

${Object.entries(s.social).map(([k, v]) => `- ${k} : ${v}`).join('\n')}
`)

if (problems.length) {
  console.error(`SEO prerender failed:\n${problems.join('\n')}`)
  process.exit(1)
}
