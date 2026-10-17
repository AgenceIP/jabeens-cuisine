import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

// Light theme = marble + crisp edges + ink/gold decor; dark theme (rollback) keeps its fades.
const SRC = resolve(__dirname, '..')
const css = readFileSync(join(SRC, 'index.css'), 'utf8').replace(/\s+/g, ' ')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
}
const tsx = walk(SRC).filter(p => p.endsWith('.tsx'))

describe('theme-scoped decor', () => {
  it('hides light-only decor in the dark theme', () => {
    expect(css).toMatch(/:root\[data-theme="dark"\] \.light-only \{ display: none/)
  })

  it('hides fade overlays and turns photo masks off in the light theme', () => {
    expect(css).toMatch(/:root\[data-theme="light"\] \.dark-only \{ display: none/)
    expect(css).toMatch(/:root\[data-theme="light"\] \.dark-mask \{[^}]*mask-image: none !important/)
  })

  it('puts the menu marble behind the light theme', () => {
    expect(css).toMatch(/:root\[data-theme="light"\] body::before \{[^}]*marble\.webp/)
  })

  it('frames the home hero on the marble in the light theme only', () => {
    expect(css).toMatch(/:root\[data-theme="light"\] \.hero-frame \{[^}]*border-radius/)
    expect(readFileSync(join(SRC, 'components/home/Hero.tsx'), 'utf8')).toContain('hero-frame')
  })
})

describe('ink band', () => {
  const ink = readFileSync(join(SRC, 'components/decor/InkBand.tsx'), 'utf8')

  it('serves a sharp source on wide screens and loads lazily', () => {
    expect(ink).toMatch(/ink-band-2560\.webp 2560w/)
    expect(ink).toContain('loading="lazy"')
  })

  it('no longer hangs under the home hero', () => {
    expect(readFileSync(join(SRC, 'pages/Home.tsx'), 'utf8')).not.toContain('InkBand')
  })
})

describe('components', () => {
  // Every element that feathers a photo with a CSS mask must carry .dark-mask,
  // and every overlay that fades into the page colour must carry .dark-only.
  const cases = tsx.flatMap(file => {
    const lines = readFileSync(file, 'utf8').split(/\r?\n/)
    const rel = relative(SRC, file).replace(/\\/g, '/')
    return lines.flatMap((line, i): [string, string, string][] => {
      const before = lines.slice(Math.max(0, i - 12), i + 1).join('\n')
      if (/maskImage:/i.test(line)) return [[`${rel}:${i + 1} mask`, before, 'dark-mask']]
      if (/linear-gradient\(to [a-z]+, [^)]*rgb\(var\(--c-(bg|surface)\)/.test(line)) return [[`${rel}:${i + 1} fade`, before, 'dark-only']]
      return []
    })
  })

  it('finds the feathered photos and fades to check', () => {
    expect(cases.length).toBeGreaterThan(5)
  })

  it.each(cases)('%s is scoped to the dark theme', (_label, before, cls) => {
    expect(before).toContain(cls)
  })
})
