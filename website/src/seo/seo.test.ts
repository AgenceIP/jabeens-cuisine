import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pages } from './pages'
import { jsonLd } from './jsonld'

const entries = Object.entries(pages)

describe('page heads', () => {
  it.each(entries)('%s: title is 30-60 characters with the brand at the end', (_p, m) => {
    expect(m.title.length).toBeGreaterThanOrEqual(30)
    expect(m.title.length).toBeLessThanOrEqual(60)
    expect(m.title).toMatch(/\| Jabeen's Cuisine$/)
  })

  it.each(entries)('%s: description is 120-130 characters', (_p, m) => {
    expect(m.description.length).toBeGreaterThanOrEqual(120)
    expect(m.description.length).toBeLessThanOrEqual(130)
  })

  it('titles and descriptions are unique', () => {
    expect(new Set(entries.map(([, m]) => m.title)).size).toBe(entries.length)
    expect(new Set(entries.map(([, m]) => m.description)).size).toBe(entries.length)
  })

  it('every page in the sitemap has a head, and only those', () => {
    const sitemap = readFileSync(resolve(__dirname, '../../public/sitemap.xml'), 'utf8')
    const locs = [...sitemap.matchAll(/<loc>https:\/\/www\.jabeenscuisine\.com([^<]*)<\/loc>/g)].map(m => m[1] || '/')
    expect(locs.sort()).toEqual(Object.keys(pages).sort())
  })

  it('Vercel serves each inner page from its prerendered file (before the SPA fallback)', () => {
    const { rewrites } = JSON.parse(readFileSync(resolve(__dirname, '../../vercel.json'), 'utf8')) as { rewrites: { source: string; destination: string }[] }
    const inner = Object.keys(pages).filter(p => p !== '/')
    for (const p of inner) {
      const i = rewrites.findIndex(r => r.source === p)
      expect(rewrites[i]?.destination, p).toBe(`${p}/index.html`)
      expect(i, p).toBeLessThan(rewrites.findIndex(r => r.source === '/(.*)'))
    }
  })

  it.each(entries)('%s: has an Open Graph image file', (_p, m) => {
    expect(() => readFileSync(resolve(__dirname, '../../public', '.' + m.image))).not.toThrow()
  })
})

describe('structured data', () => {
  it('the home page describes the restaurant with its NAP, logo and profiles', () => {
    const [r] = jsonLd('/') as Record<string, unknown>[]
    expect(r['@type']).toBe('Restaurant')
    for (const k of ['name', 'url', 'logo', 'telephone', 'email', 'address', 'sameAs']) expect(r[k], k).toBeTruthy()
    expect((r.sameAs as string[]).length).toBeGreaterThan(0)
  })

  it.each(['/menu', '/location-salle', '/notre-histoire'] as const)('%s has a breadcrumb', path => {
    expect(jsonLd(path).map(b => (b as { '@type': string })['@type'])).toContain('BreadcrumbList')
  })

  it('the hall page describes the service', () => {
    expect(jsonLd('/location-salle').map(b => (b as { '@type': string })['@type'])).toContain('Service')
  })
})
