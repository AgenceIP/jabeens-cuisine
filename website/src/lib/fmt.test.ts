import { expect, it } from 'vitest'
import { fmt } from './fmt'

it('replaces named placeholders and leaves unknown ones empty', () => {
  expect(fmt('Le menu {menu} demande au moins {min} personnes.', { menu: 'King', min: 50 }))
    .toBe('Le menu King demande au moins 50 personnes.')
  expect(fmt('Hi {name}', {})).toBe('Hi ')
})
