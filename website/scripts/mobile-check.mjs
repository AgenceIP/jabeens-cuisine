// Phone check on the built site: overflow, menu button, broken images, small tap targets, tiny text.
// Prints "ok:" / "FAIL:" lines (exit 1 on failure) and saves viewport frames to shots/mobile/.
// Usage: node scripts/mobile-check.mjs [http://localhost:4173]
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const base = process.argv.slice(2).find(a => a.startsWith('http')) ?? 'http://localhost:4173'
const pages = ['/', '/menu', '/notre-histoire', '/location-salle']
const widths = [360, 390, 430]
let failed = 0
const check = (ok, label) => { console.log(`${ok ? 'ok' : 'FAIL'}: ${label}`); if (!ok) failed++ }
await mkdir('shots/mobile', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge' })

for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' })
  await ctx.addInitScript(() => { localStorage.setItem('jc_newsletter_seen', String(Date.now())); localStorage.setItem('lang', 'fr') })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  for (const path of pages) {
    await page.goto(`${base}${path}?theme=light`, { waitUntil: 'networkidle' })
    // scroll through so lazy images and reveals load; keep a few frames for the eye
    const total = await page.evaluate(() => document.body.scrollHeight)
    let frame = 0
    for (let y = 0; y < total; y += 700) {
      await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(250)
      if (w === 390 && y % 2100 === 0) await page.screenshot({ path: `shots/mobile/${path.replace(/\W+/g, '_') || 'home'}-${String(frame++).padStart(2, '0')}.png` })
    }
    await page.waitForTimeout(500)
    const r = await page.evaluate(() => {
      const visible = e => { const b = e.getBoundingClientRect(); const s = getComputedStyle(e); return b.width > 0 && b.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' }
      const broken = [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('loading') !== 'lazy').map(i => i.src.split('/').pop())
      const tapSmall = [...document.querySelectorAll('main a, main button, main input, main select, main textarea, footer a')]
        .filter(visible).filter(e => !e.classList.contains('sr-only')).filter(e => { const b = e.getBoundingClientRect(); return b.height < 32 || b.width < 32 })
        .map(e => (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 24))
      const tiny = [...document.querySelectorAll('main *, footer *')].filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))
        .filter(visible).filter(e => parseFloat(getComputedStyle(e).fontSize) < 12).map(e => e.textContent.trim().slice(0, 24))
      return { over: document.documentElement.scrollWidth - innerWidth, broken, tapSmall, tiny }
    })
    check(r.over <= 0, `${w}px ${path}: no horizontal scroll (${r.over}px)`)
    check(r.broken.length === 0, `${w}px ${path}: images load ${r.broken.join(', ')}`)
    check(r.tiny.length === 0, `${w}px ${path}: no text under 12px ${r.tiny.slice(0, 4).join(' | ')}`)
    check(r.tapSmall.length === 0, `${w}px ${path}: tap targets at least 32px ${[...new Set(r.tapSmall)].slice(0, 6).join(' | ')}`)
  }
  // menu button opens the menu and its links work
  await page.goto(`${base}/?theme=light`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Menu' }).click()
  const link = page.locator('div.fixed.inset-0').getByRole('link', { name: 'Notre Histoire' })
  check(await link.isVisible(), `${w}px menu button opens the menu`)
  await link.click(); await page.waitForTimeout(1200)
  check(page.url().includes('/notre-histoire'), `${w}px menu link navigates`)
  check(errors.length === 0, `${w}px no page errors ${errors.slice(0, 2).join(' | ')}`)
  await ctx.close()
}
await browser.close()
console.log(failed ? `${failed} check(s) failed` : 'all mobile checks passed')
process.exitCode = failed ? 1 : 0
