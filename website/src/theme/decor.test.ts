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
    ['melt-bottom', 'pages/NotreHistoire.tsx'],
    ['melt-hero', 'components/home/Hero.tsx'],
    ['melt-soft', 'components/hall/Gallery.tsx'],
    ['melt-edges', 'components/hall/HallIntro.tsx'],
    ['melt-y', 'components/layout/Footer.tsx'],
  ])('.%s is a light-theme alpha mask used by %s', (cls, file) => {
    expect(css).toMatch(new RegExp(`:root\\[data-theme="light"\\] \\.${cls} \\{[^}]*mask-image: linear-gradient`))
    expect(read(file)).toContain(cls)
  })
})

describe('section edges melt into the marble (light theme)', () => {
  it('fades the top and bottom of solid bands and panels', () => {
    expect(css).toMatch(/:root\[data-theme="light"\] \.melt-band::before,[^{]*\{[^}]*mask-image: linear-gradient/)
  })

  it('fades bands gradually: a long eased ramp, the colour holding before it lets go', () => {
    expect(Number(/--band-fade: (\d+)px/.exec(css)?.[1])).toBeGreaterThanOrEqual(240)
    const ramp = /--ramp: ([^;]+);/.exec(css)?.[1] ?? ''
    expect(ramp.split(/,(?![^(]*\))/).length).toBeGreaterThanOrEqual(7)
  })

  it.each(['components/hall/LiveStations.tsx', 'components/home/CommanderEnLigne.tsx', 'pages/NotreHistoire.tsx'])('%s uses it', file => {
    expect(read(file)).toContain('melt-band')
  })

  it('drops the white card behind the offer photos, which melt instead', () => {
    expect(css).toMatch(/:root\[data-theme="light"\] \.offer-card \{[^}]*background: transparent/)
    const offers = read('components/hall/Offers.tsx')
    expect(offers).toContain('offer-card')
    expect(offers).toContain('melt-edges')
  })
})

describe('readability on the light theme', () => {
  const tokens = (selector: string) => {
    const start = css.indexOf(selector)
    const block = css.slice(start, css.indexOf('}', start))
    return Object.fromEntries([...block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]))
  }
  const lum = (rgb: number[]) => {
    const f = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }
    return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2])
  }
  const ratio = (a: number[], b: number[]) => { const [h, l] = [lum(a), lum(b)].sort((x, y) => y - x); return (h + 0.05) / (l + 0.05) }
  const light = tokens(':root[data-theme="light"]')
  const marble = [222, 228, 229] // darker veins of the marble, worst case behind text
  const rgb = (k: string) => light[k].split(/\s+/).map(Number)

  it('secondary text reaches 7:1 on the marble', () => {
    expect(ratio(rgb('--c-muted'), marble)).toBeGreaterThanOrEqual(7)
  })

  it('gold labels reach 4.5:1 on the marble', () => {
    expect(ratio(rgb('--c-accent'), marble)).toBeGreaterThanOrEqual(4.5)
  })

  it('small text has a floor in the light theme', () => {
    expect(light['--fs-min']).toBe('0.8rem')
    expect(css).toMatch(/\.text-label \{[^}]*font-size: max\(0\.65rem, var\(--fs-min\)\)/)
  })

  it('section titles (gold eyebrows) are larger in the light theme', () => {
    expect(css).toMatch(/:root\[data-theme="light"\] p\.text-label \{ font-size: 0\.95rem/)
  })

  it.each(tsx.map(f => relative(SRC, f).replace(/\\/g, '/')))('%s has no tiny fixed font size', file => {
    expect(read(file)).not.toMatch(/fontSize: '0\.[0-7]\d*rem'/)
  })

  it('body paragraphs get at least 17px in the light theme', () => {
    expect(light['--fs-body-min']).toBe('1.0625rem')
    const smallParagraphs = tsx.flatMap(f => readFileSync(f, 'utf8').split(/\r?\n/)
      .filter(l => /<p\b/.test(l) && /fontSize: '0\.(8[5-9]|9\d*)rem'/.test(l))
      .map(l => `${relative(SRC, f)}: ${l.trim().slice(0, 60)}`))
    expect(smallParagraphs).toEqual([])
  })
})

describe('navbar with readable labels', () => {
  it('shows the full bar from 1280px and the menu button below (labels no longer fit at 768-1279)', () => {
    const nav = read('components/layout/Navbar.tsx')
    expect(nav).not.toMatch(/hidden md:flex|md:hidden/)
    expect(nav.match(/hidden xl:flex/g)?.length).toBe(2)
    expect(nav).toContain('xl:hidden')
  })

  it('is a light veil once scrolled, not an opaque white band, and always stays in place', () => {
    const nav = read('components/layout/Navbar.tsx')
    const veil = Number(/rgb\(var\(--c-nav\) \/ ([\d.]+)\)/.exec(nav)?.[1])
    expect(veil).toBeLessThanOrEqual(0.5) // 0.94 then 0.72 were still too opaque for the client
    expect(nav).not.toMatch(/borderBottom/)
    expect(nav).not.toContain('translateY(-100%)') // the client does not want it to hide on scroll
  })

  it('mobile menu: opaque (no page showing through) and starts under the header (nothing clipped)', () => {
    const nav = read('components/layout/Navbar.tsx')
    const overlay = nav.slice(nav.indexOf('Mobile full-screen overlay'))
    expect(overlay).not.toMatch(/c-bg\) \/ 0\.\d+/)
    expect(overlay).toContain('overflow-y-auto')
    expect(overlay).toContain('pt-20')
    expect(overlay).toContain('m-auto')
  })
})

describe('buffet photos', () => {
  it('are square crops centred on the dish', async () => {
    const sharp = (await import('sharp')).default
    const { buffetPhotos } = await import('@/data/cateringPhotos')
    for (const p of buffetPhotos) {
      expect(p.id).toMatch(/-sq$/)
      const m = await sharp(resolve(SRC, '../public/assets/catering', `${p.id}-800.webp`)).metadata()
      expect(m.width).toBe(m.height)
    }
    expect(read('components/hall/Gallery.tsx')).toContain('aspect-square')
  })
})

describe('every photo melts into its background (light theme)', () => {
  it('has a soft edge mask for photos in grids', () => {
    expect(css).toMatch(/:root\[data-theme="light"\] \.melt-soft \{[^}]*mask-image: linear-gradient/)
  })

  it.each(['components/hall/Gallery.tsx', 'components/hall/LiveStations.tsx'])('%s: every grid photo melts', file => {
    const lines = read(file).split(/\r?\n/).filter(l => l.includes('<CateringImg'))
    expect(lines.length).toBeGreaterThan(0)
    for (const l of lines) expect(l).toMatch(/melt-/)
  })

  it('the home hero fills the screen whole and fades gradually below the fold (eased, long)', () => {
    const rule = /:root\[data-theme="light"\] \.melt-hero \{[^}]*\}/.exec(css)?.[0] ?? ''
    const px = (k: string) => Number(new RegExp(`${k}: (\\d+)px`).exec(rule)?.[1])
    expect(px('--hero-fade')).toBeGreaterThanOrEqual(280)
    expect(px('--hero-below')).toBeGreaterThanOrEqual(px('--hero-fade') * 0.85) // fade starts at most ~15% above the fold
    expect(rule).toContain('height: calc(100vh + var(--hero-below))')
    expect(rule).toContain('padding-bottom: var(--hero-below)') // title stays centred in the first screen
    expect(rule.match(/rgb\(0 0 0 \/ [\d.]+\) calc/g)?.length).toBeGreaterThanOrEqual(8)
  })

  it('the hero video keeps the first screen, centred and sharp (not stretched over the fade zone)', () => {
    expect(css).toMatch(/:root\[data-theme="light"\] \.melt-hero \.hero-media \{[^}]*bottom: var\(--hero-below\)/)
    const hero = read('components/home/Hero.tsx')
    expect(hero).toContain('hero-media')
    expect(hero).not.toMatch(/scale-\[1\.\d+\]/) // a CSS zoom upscales the 1080p video and blurs it
  })

  it.each(['components/home/PremiereImpression.tsx', 'components/home/EvenementsPrives.tsx'])('%s: the parallax photo fades its own top and bottom', file => {
    const src = read(file)
    const img = src.slice(src.indexOf('ref={imgInnerRef}') - 200, src.indexOf('ref={imgInnerRef}') + 400)
    expect(img).toContain('melt-ends')
  })

  it('melt-ends fades top and bottom only', () => {
    expect(css).toMatch(/:root\[data-theme="light"\] \.melt-ends \{[^}]*mask-image: linear-gradient\(to bottom/)
  })

  it('the home carousel melts on all four sides', () => {
    expect(read('components/home/LaCarte.tsx')).toContain('className="melt-edges"')
  })

  it('every page-level photo or video is masked or melted', () => {
    // feathered with an inline mask (also in the light theme now) or with a melt-* class
    for (const f of ['components/home/Hero.tsx', 'components/home/PremiereImpression.tsx', 'components/home/EvenementsPrives.tsx', 'pages/NotreHistoire.tsx', 'components/hall/HallIntro.tsx', 'components/hall/Offers.tsx', 'components/layout/Footer.tsx']) {
      expect(read(f), f).toMatch(/melt-|maskImage/)
    }
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

  it('sits at the very bottom of the page, under the footer content', () => {
    const footer = read('components/layout/Footer.tsx')
    expect(footer.indexOf('<InkBand')).toBeGreaterThan(footer.indexOf('mt-16 pt-6'))
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
