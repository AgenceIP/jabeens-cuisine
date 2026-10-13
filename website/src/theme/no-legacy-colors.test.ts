import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const SRC = resolve(__dirname, '..')
// Files still to convert. Each task removes the files it converts; Task 10 empties it.
const PENDING = new Set<string>([
  'pages/Hall.tsx',
])
const LEGACY = /#(A8956A|1E1E1E|F5F5F0|0D1A2E|DEDEDA|060D18|2A2A2A|BFA97A|3A3A3A|0A0A0A|6B6B6B|4A4A44|E8E8E8)\b|rgba\(\s*(6,\s*13,\s*24|168,\s*149,\s*106|245,\s*245,\s*240|10,\s*10,\s*10|30,\s*30,\s*30)\s*,|fontFamily:\s*'(Montserrat|Cormorant Garamond)/i

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
}

describe('no legacy colours', () => {
  const files = walk(SRC)
    .filter(p => /\.(tsx?|css)$/.test(p) && !p.endsWith('.test.ts'))
    .map(p => relative(SRC, p).replace(/\\/g, '/'))
    .filter(f => f !== 'index.css' && !PENDING.has(f))

  it.each(files)('%s uses theme tokens', f => {
    const hit = readFileSync(join(SRC, f), 'utf8').match(LEGACY)
    expect(hit?.[0] ?? null).toBeNull()
  })
})
