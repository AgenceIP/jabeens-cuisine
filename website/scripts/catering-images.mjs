// Edited client photos (3:4, 1744x2336) -> WebP 800 and 1600 px wide.
// Buffet dishes also get a square crop centred on the food ("<id>-sq"), measured on the photos.
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

const SRC = path.resolve('..', 'Catering pictures and menus', '_selection', 'edited')
const OUT = path.resolve('public', 'assets', 'catering')
// Square crops: centre of the dish in source pixels, side 1600.
const SQUARE = {
  'buffet-01-gold-buffet-line': [872, 1300],
  'buffet-02-butter-chicken': [850, 1125],
  'buffet-03-curry': [785, 1075],
  'buffet-04-biryani': [785, 1285],
}
await mkdir(OUT, { recursive: true })
for (const file of (await readdir(SRC)).filter(f => f.endsWith('.jpg'))) {
  const id = file.replace(/\.jpg$/, '')
  for (const w of [800, 1600]) {
    await sharp(path.join(SRC, file)).resize({ width: w }).webp({ quality: 78 }).toFile(path.join(OUT, `${id}-${w}.webp`))
  }
  const centre = SQUARE[id]
  if (centre) {
    const meta = await sharp(path.join(SRC, file)).metadata(), side = 1600
    const left = Math.min(Math.max(0, centre[0] - side / 2), meta.width - side)
    const top = Math.min(Math.max(0, centre[1] - side / 2), meta.height - side)
    for (const w of [800, 1600]) {
      await sharp(path.join(SRC, file)).extract({ left: Math.round(left), top: Math.round(top), width: side, height: side }).resize({ width: w }).webp({ quality: 78 }).toFile(path.join(OUT, `${id}-sq-${w}.webp`))
    }
  }
  console.log('ok', id)
}
