// Runnable check for prices.mjs: node scripts/pdf-clean/prices.check.mjs
import assert from 'node:assert/strict'
import { priceSpans } from './prices.mjs'

const erased = s => {
  const spans = priceSpans(s)
  if (spans === 'all') return ''
  let out = s
  for (const [a, b] of [...spans].reverse()) out = out.slice(0, a) + out.slice(b)
  return out.trim()
}

assert.equal(priceSpans('$12'), 'all')
assert.equal(priceSpans('$13/ $19/ $15'), 'all')
assert.equal(priceSpans('$20 PER PERSON'), 'all')
assert.equal(priceSpans('$18.00 per person'), 'all')
assert.equal(priceSpans('Ajoutez frites + boisson gazeuse pour 4 $ de plus /'), 'all')
assert.equal(priceSpans('Add Fries + Soft Beverage for $4 extra'), 'all')
assert.equal(erased('Mojito - $9'), 'Mojito')
assert.equal(erased('Lassi à la mangue / Mango Lassi - $7'), 'Lassi à la mangue / Mango Lassi')
assert.equal(erased('EXECUTIVE BOX $26 PER PERSON'), 'EXECUTIVE BOX')
assert.equal(erased('Ajouter du poulet / Add chicken $2'), 'Ajouter du poulet / Add chicken')
assert.deepEqual(priceSpans('2 pieces • choose 4 (2 veg / 2 non-veg)'), [])
assert.deepEqual(priceSpans('Paneer tikka à l’achar /'), [])
console.log('prices.mjs: all checks passed')
