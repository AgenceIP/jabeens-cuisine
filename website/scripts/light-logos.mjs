// Recolour the white wordmark of the logos to navy (#14213D); the gold peacock is untouched.
import sharp from 'sharp'

const NAVY = [20, 33, 61]
const jobs = [
  { src: 'public/assets/logo-main.png', out: 'public/assets/logo-main-light.webp', width: 600 },
  { src: 'public/assets/logo-footer.png', out: 'public/assets/logo-footer-light.webp', width: 400 },
]

for (const { src, out, width } of jobs) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]]
    const greyish = Math.max(r, g, b) - Math.min(r, g, b) < 40
    if (a > 0 && greyish && r > 150) [data[i], data[i + 1], data[i + 2]] = NAVY
  }
  await sharp(data, { raw: info }).resize({ width }).webp({ quality: 90 }).toFile(out)
  console.log('wrote', out)
}
