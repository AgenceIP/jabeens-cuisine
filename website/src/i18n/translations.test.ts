import { expect, it } from 'vitest'
import { translations } from './translations'

const shape = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(shape) : v && typeof v === 'object'
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, shape((v as Record<string, unknown>)[k])]))
    : typeof v

it('en and fr have the same shape', () => {
  expect(shape(translations.en)).toEqual(shape(translations.fr))
})

it('hall page has the catering form copy', () => {
  expect(translations.fr.hallPage.form.errors.minGuests).toContain('{min}')
  expect(translations.en.hallPage.menus.items.king.length).toBeGreaterThan(2)
})
