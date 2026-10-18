// Share images (Open Graph, 1200x630) for each page, cropped from the site's own photos.
// Usage: node scripts/og-images.mjs
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const out = 'public/assets/og'
const jobs = {
  home: ['public/assets/hero-2.jpg', 'attention'],
  menu: ['public/assets/catering/buffet-02-butter-chicken-1600.webp', 'centre'],
  salle: ['public/assets/catering/hall-01-reception-stage-front-1600.webp', 'centre'],
  histoire: ['public/assets/tables.jpg', 'centre'],
}

await mkdir(out, { recursive: true })
for (const [name, [src, position]] of Object.entries(jobs)) {
  await sharp(src).resize(1200, 630, { fit: 'cover', position }).jpeg({ quality: 82, mozjpeg: true }).toFile(`${out}/${name}.jpg`)
  console.log(`${out}/${name}.jpg`)
}
