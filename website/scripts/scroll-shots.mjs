// Viewport screenshots while scrolling down a page, so scroll-triggered animations play.
// Usage: node scripts/scroll-shots.mjs 'http://localhost:4173/?theme=light' shots/seq/lh 1440 900 900
import { chromium } from 'playwright-core'
const [url, prefix, w = '1440', h = '900', step = '800'] = process.argv.slice(2)
const b = await chromium.launch({ channel: 'msedge' })
const ctx = await b.newContext({ viewport: { width: +w, height: +h } })
await ctx.addInitScript(() => { localStorage.setItem('jc_newsletter_seen', String(Date.now())); localStorage.setItem('lang', 'fr') })
const p = await ctx.newPage()
await p.goto(url, { waitUntil: 'networkidle' })
const total = await p.evaluate(() => document.body.scrollHeight)
let i = 0
for (let y = 0; y < total; y += +step) {
  await p.mouse.wheel(0, i === 0 ? 0 : +step); await p.waitForTimeout(1400)
  await p.screenshot({ path: `${prefix}-${String(i).padStart(2, '0')}.png` }); i++
}
console.log('frames', i)
await b.close()
