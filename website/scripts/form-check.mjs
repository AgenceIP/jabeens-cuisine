// Drives the request form in Edge, intercepts Formspree, prints the payload. Never reaches the real endpoint.
// Usage: node scripts/form-check.mjs [http://localhost:4173] [--fail]
import { chromium } from 'playwright-core'

const base = process.argv.slice(2).find(a => a.startsWith('http')) ?? 'http://localhost:4173'
const fail = process.argv.includes('--fail')
const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage()
await page.addInitScript(() => { localStorage.setItem('jc_newsletter_seen', String(Date.now())); localStorage.setItem('lang', 'fr') })
let payload = null
await page.route('https://formspree.io/**', async route => {
  payload = route.request().postDataJSON()
  await route.fulfill(fail ? { status: 500, body: '{}' } : { status: 200, contentType: 'application/json', body: '{"ok":true}' })
})
await page.goto(`${base}/location-salle`, { waitUntil: 'networkidle' })

// "Choisir ce menu" on Corporate presets the form
await page.getByRole('button', { name: 'Choisir ce menu' }).nth(2).click()
await page.getByLabel('Traiteur à votre adresse').check({ force: true })
await page.getByLabel('Nombre de personnes').fill('20')
await page.getByLabel('Occasion').selectOption('reception')
// Review Focus 1: switch to King -> error appears at once
await page.locator('select[name="menu"]').selectOption('king')
await page.getByText('Le menu King demande au moins 50 personnes.').waitFor({ timeout: 3000 })
console.log('ok: min error shown on menu change')

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
console.log('visible:', fail ? await page.getByText('Appelez-nous au (450) 926-3111').isVisible() : await page.getByText('Demande envoyée.').isVisible())
await browser.close()
