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

const tokens = (selector: string) => {
  const start = css.indexOf(selector)
  const block = css.slice(start, css.indexOf('}', start))
  return Object.fromEntries([...block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]))
}
const rgb = (channels: string) => channels.split(/\s+/).map(Number)
const luminance = ([r, g, b]: number[]) => {
  const f = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const contrast = (a: number[], b: number[]) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

describe('light theme legibility', () => {
  const light = tokens(':root[data-theme="light"]')

  it('loads the display weight in italic too (no faux bold)', () => {
    const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf8')
    const w = light['--fw-display']
    const weights = /Cormorant\+Garamond:ital,wght@([^&"]*)/.exec(html)?.[1].split(';') ?? []
    expect(weights).toContain(`0,${w}`)
    expect(weights).toContain(`1,${w}`)
  })

  it('form field underlines reach 3:1 against the page (WCAG 1.4.11)', () => {
    const alpha = Number(/\.field \{[^}]*border-bottom: 1px solid rgb\(var\(--c-ink\) \/ ([\d.]+)\)/.exec(css)?.[1])
    const bg = rgb(light['--c-bg'])
    const ink = rgb(light['--c-ink'])
    const blended = ink.map((c, i) => c * alpha + bg[i] * (1 - alpha))
    expect(contrast(blended, bg)).toBeGreaterThanOrEqual(3)
  })
})
