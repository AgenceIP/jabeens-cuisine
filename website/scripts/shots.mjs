// Full-page screenshots at 1440 and 390 px in installed Edge.
// Usage: node scripts/shots.mjs http://localhost:4173 light shots / /menu /location-salle
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const [base = 'http://localhost:4173', theme = 'light', out = 'shots', ...paths] = process.argv.slice(2)
const pages = paths.length ? paths : ['/', '/menu', '/notre-histoire', '/location-salle']
const sizes = [
  { name: 'desk', viewport: { width: 1440, height: 900 } },
  { name: 'mob', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
]
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ channel: 'msedge' })
for (const s of sizes) {
  const ctx = await browser.newContext({ viewport: s.viewport, isMobile: s.isMobile, hasTouch: s.hasTouch, deviceScaleFactor: s.deviceScaleFactor ?? 1 })
  await ctx.addInitScript(() => {
    localStorage.setItem('jc_newsletter_seen', String(Date.now()))
    localStorage.setItem('lang', 'fr')
  })
  const page = await ctx.newPage()
  for (const p of pages) {
    await page.goto(`${base}${p}${p.includes('?') ? '&' : '?'}theme=${theme}`, { waitUntil: 'networkidle' })
    // Scroll through so whileInView / ScrollTrigger reveals run, then back to the top.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)) }
      window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600))
    })
    const slug = p === '/' ? 'home' : p.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')
    await page.screenshot({ path: `${out}/${theme}-${s.name}-${slug}.png`, fullPage: true })
    console.log('shot', theme, s.name, p)
  }
  await ctx.close()
}
await browser.close()
