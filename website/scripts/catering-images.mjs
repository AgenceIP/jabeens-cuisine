// Edited client photos (3:4, 1744x2336) -> WebP 800 and 1600 px wide.
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

const SRC = path.resolve('..', 'Catering pictures and menus', '_selection', 'edited')
const OUT = path.resolve('public', 'assets', 'catering')
await mkdir(OUT, { recursive: true })
for (const file of (await readdir(SRC)).filter(f => f.endsWith('.jpg'))) {
  const id = file.replace(/\.jpg$/, '')
  for (const w of [800, 1600]) {
    await sharp(path.join(SRC, file)).resize({ width: w }).webp({ quality: 78 }).toFile(path.join(OUT, `${id}-${w}.webp`))
  }
  console.log('ok', id)
}
