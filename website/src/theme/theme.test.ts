import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { logoSrc } from './theme'

const css = readFileSync(resolve(__dirname, '../index.css'), 'utf8')

function varsOf(selector: string): string[] {
  const start = css.indexOf(selector)
  expect(start, `${selector} block missing`).toBeGreaterThan(-1)
  const block = css.slice(start, css.indexOf('}', start))
  return [...block.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]).sort()
}

describe('theme tokens', () => {
  it('light and dark define the same variables', () => {
    const light = varsOf(':root[data-theme="light"]')
    const dark = varsOf(':root[data-theme="dark"]')
    expect(light.length).toBeGreaterThan(15)
    expect(light).toEqual(dark)
  })
})

describe('logoSrc', () => {
  it('uses the navy wordmark in the light theme', () => {
    expect(logoSrc('main', 'light')).toBe('/assets/logo-main-light.webp')
  })
  it('uses the white wordmark in the dark theme', () => {
    expect(logoSrc('footer', 'dark')).toBe('/assets/logo-footer.webp')
  })
  it('uses the white wordmark over a dark photo in any theme', () => {
    expect(logoSrc('main', 'light', true)).toBe('/assets/logo-main.webp')
  })
})
