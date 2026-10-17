import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

// Light theme = marble + photos and videos that melt into it (alpha masks) + ink/gold decor.
// Dark theme (rollback) keeps its colour-overlay fades.
const SRC = resolve(__dirname, '..')
const css = readFileSync(join(SRC, 'index.css'), 'utf8').replace(/\s+/g, ' ')
const read = (f: string) => readFileSync(join(SRC, f), 'utf8')

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

  it('hides colour-overlay fades in the light theme', () => {
    expect(css).toMatch(/:root\[data-theme="light"\] \.dark-only \{ display: none/)
  })

  it('keeps photo masks on in the light theme so images melt into the marble', () => {
    expect(css).not.toMatch(/dark-mask/)
  })

  it('puts the menu marble behind the light theme', () => {
    expect(css).toMatch(/:root\[data-theme="light"\] body::before \{[^}]*marble/)
  })

  it('has no rounded frame around the home hero', () => {
    expect(css).not.toMatch(/hero-frame/)
    expect(read('components/home/Hero.tsx')).not.toContain('hero-frame')
  })
})

describe('melting into the marble (light theme)', () => {
  it.each([
    ['melt-bottom', 'components/home/Hero.tsx'],
    ['melt-x', 'components/home/LaCarte.tsx'],
    ['melt-edges', 'components/hall/HallIntro.tsx'],
    ['melt-y', 'components/layout/Footer.tsx'],
  ])('.%s is a light-theme alpha mask used by %s', (cls, file) => {
    expect(css).toMatch(new RegExp(`:root\\[data-theme="light"\\] \\.${cls} \\{[^}]*mask-image: linear-gradient`))
    expect(read(file)).toContain(cls)
  })
})

describe('story video', () => {
  it('fills its panel in the light theme so its own edges sit in the melt', () => {
    expect(css).toMatch(/:root\[data-theme="light"\] \.light-cover \{[^}]*object-fit: cover/)
    expect(read('pages/NotreHistoire.tsx')).toContain('light-cover')
  })
})

describe('ink band', () => {
  const ink = read('components/decor/InkBand.tsx')

  it('serves a sharp source on wide screens and loads lazily', () => {
    expect(ink).toMatch(/ink-band-2560\.webp 2560w/)
    expect(ink).toContain('loading="lazy"')
  })

  it('melts its straight edge into the marble when it rises above the footer', () => {
    expect(css).toMatch(/\.ink-band--up \{[^}]*mask-image: linear-gradient/)
  })

  it('no longer hangs under the home hero', () => {
    expect(read('pages/Home.tsx')).not.toContain('InkBand')
  })
})

describe('components', () => {
  // Overlays that fade into the flat page colour turn grey on marble: dark theme only.
  const cases = tsx.flatMap(file => {
    const lines = readFileSync(file, 'utf8').split(/\r?\n/)
    const rel = relative(SRC, file).replace(/\\/g, '/')
    return lines.flatMap((line, i): [string, string][] => {
      const before = lines.slice(Math.max(0, i - 12), i + 1).join('\n')
      return /linear-gradient\(to [a-z]+, [^)]*rgb\(var\(--c-(bg|surface)\)/.test(line) ? [[`${rel}:${i + 1}`, before]] : []
    })
  })

  it('finds the colour fades to check', () => {
    expect(cases.length).toBeGreaterThan(5)
  })

  it.each(cases)('%s is scoped to the dark theme', (_label, before) => {
    expect(before).toContain('dark-only')
  })
})
