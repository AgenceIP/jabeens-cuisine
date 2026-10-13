// Drives the Hall & Traiteur page in Edge with Formspree intercepted (never reaches the real endpoint).
// Prints "ok:" / "FAIL:" lines and exits 1 on any failure.
// Usage: node scripts/form-check.mjs [http://localhost:4173] [--fail]
import { chromium } from 'playwright-core'

const base = process.argv.slice(2).find(a => a.startsWith('http')) ?? 'http://localhost:4173'
const fail = process.argv.includes('--fail')
const check = (ok, label) => { console.log(`${ok ? 'ok' : 'FAIL'}: ${label}`); if (!ok) process.exitCode = 1 }
const browser = await chromium.launch({ channel: 'msedge' })

async function open() {
  const page = await browser.newPage()
  await page.addInitScript(() => { localStorage.setItem('jc_newsletter_seen', String(Date.now())); localStorage.setItem('lang', 'fr') })
  await page.goto(`${base}/location-salle`, { waitUntil: 'networkidle' })
  return page
}

// Gallery photos carry short captions (spec §5.1.4).
{
  const page = await open()
  const captions = await page.locator('main figure figcaption').count()
  check(captions >= 13, `gallery and live-station photos have captions (${captions})`)
  await page.close()
}

// Empty submit, then "Choisir ce menu": no stale "required" error, no guessed service.
{
  const page = await open()
  await page.getByRole('button', { name: 'Envoyer ma demande' }).click()
  await page.getByText('Ce champ est requis.').first().waitFor({ timeout: 3000 })
  await page.getByRole('button', { name: 'Choisir ce menu' }).nth(2).click()
  await page.waitForTimeout(800)
  check(await page.locator('select[name="menu"]').inputValue() === 'corporate', 'menu preset to Corporate')
  const menuErr = await page.locator('select[name="menu"] ~ p[role="alert"], select[name="menu"] + p[role="alert"]').count()
  check(menuErr === 0, 'no stale "required" error under the preset menu')
  await page.close()
}

// "Choisir ce menu" on a fresh form must not guess the service for the visitor.
{
  const page = await open()
  await page.getByRole('button', { name: 'Choisir ce menu' }).nth(2).click()
  await page.waitForTimeout(800)
  check(await page.locator('fieldset label.border-gold').count() === 0, 'service is left for the visitor to choose')
  await page.close()
}

// Main flow.
{
  const page = await open()
  let payload = null
  await page.route('https://formspree.io/**', async route => {
    payload = route.request().postDataJSON()
    await route.fulfill(fail ? { status: 500, body: '{}' } : { status: 200, contentType: 'application/json', body: '{"ok":true}' })
  })
  await page.getByRole('button', { name: 'Choisir ce menu' }).nth(2).click()
  await page.getByLabel('Traiteur à votre adresse').check({ force: true })
  await page.getByLabel('Nombre de personnes').fill('20')
  await page.getByLabel('Occasion').selectOption('reception')
  // Switch to King: the minimum error appears at once...
  await page.locator('select[name="menu"]').selectOption('king')
  const minErr = page.getByText('Le menu King demande au moins 50 personnes.')
  check(await minErr.waitFor({ timeout: 3000 }).then(() => true, () => false), 'min error shown on menu change')
  // ...and disappears as soon as the count is fixed.
  await page.getByLabel('Nombre de personnes').fill('60')
  await page.waitForTimeout(500)
  check(!(await minErr.isVisible()), 'min error clears once the count is fixed')

  await page.getByLabel('Nombre de personnes').fill('80')
  const d = new Date(); d.setDate(d.getDate() + 30)
  await page.getByLabel("Date de l'événement").fill(d.toISOString().slice(0, 10))
  await page.getByLabel("Adresse de l'événement").fill('12 rue des Lilas, Brossard')
  await page.getByLabel('Prénom').fill('Test')
  await page.getByLabel('Nom', { exact: true }).fill('Formulaire')
  await page.getByLabel('Courriel').fill('test@example.com')
  await page.getByLabel('Téléphone').fill('514-555-0101')
  await page.getByRole('button', { name: 'Envoyer ma demande' }).click()
  await page.waitForTimeout(1500)
  console.log('payload', JSON.stringify(payload, null, 2))
  check(payload?.Menu === 'King (min. 50)' && payload?.Adresse === '12 rue des Lilas, Brossard', 'payload has menu and address')
  check(fail ? await page.getByText('Appelez-nous au (450) 926-3111').isVisible() : await page.getByText('Demande envoyée.').isVisible(),
    fail ? 'network error shows the phone number' : 'success message shown')
}
await browser.close()
