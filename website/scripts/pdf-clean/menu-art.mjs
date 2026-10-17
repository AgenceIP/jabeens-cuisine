// Pull the decor of the client's dine-in menu (original vector PDF, kept in the git-ignored raw folder) into web assets:
// blue/gold ink band and gold flecks -> public/assets/decor/*.webp
// The marble (marble-3840 / marble-1600.webp) is the menu marble upscaled to 4K with Higgsfield
// (bytedance upscale, 2026-10-17) and colour-matched to the original; it is not rebuilt here.
// pdf.js draws each image on its own page (it decodes the menu's CMYK JPEGs correctly); the colour
// layer and its mask are separate images in this PDF, so they are recombined into RGBA here.
// Usage (from website/): node scripts/pdf-clean/menu-art.mjs
import { PDFDocument, PDFName, PDFDict, PDFRawStream } from 'pdf-lib'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { mkdir, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const sharp = require(path.resolve('node_modules', 'sharp'))
const SRC = path.resolve('..', 'Catering pictures and menus', 'menus-originaux', 'Restaurant MENU.pdf')
const OUT = path.resolve('public', 'assets', 'decor')

async function renderImages() {
  const src = await PDFDocument.load(await readFile(SRC))
  const doc = await PDFDocument.create()
  const [page] = await doc.copyPages(src, [0])
  const found = [], seen = new Set()
  const walk = resources => {
    if (!(resources instanceof PDFDict)) return
    const xo = resources.lookup(PDFName.of('XObject'))
    if (!(xo instanceof PDFDict)) return
    for (const [name, ref] of xo.entries()) {
      const obj = doc.context.lookup(ref)
      if (!(obj instanceof PDFRawStream)) continue
      const sub = obj.dict.get(PDFName.of('Subtype'))?.toString()
      if (sub === '/Form') { walk(obj.dict.lookup(PDFName.of('Resources'))); continue }
      if (sub !== '/Image' || seen.has(ref.toString())) continue
      seen.add(ref.toString())
      const w = Number(obj.dict.get(PDFName.of('Width')).toString()), h = Number(obj.dict.get(PDFName.of('Height')).toString())
      if (w > 1000) found.push({ name: name.toString().slice(1), w, h, resources })
    }
  }
  walk(page.node.Resources())
  for (const f of found) {
    const p = doc.addPage([f.w, f.h])
    p.node.set(PDFName.of('Resources'), f.resources)
    p.node.set(PDFName.of('Contents'), doc.context.register(doc.context.flateStream(`q ${f.w} 0 0 ${f.h} 0 0 cm /${f.name} Do Q`)))
  }
  const pdf = await getDocument({ data: await doc.save() }).promise
  const images = []
  for (let i = 0; i < found.length; i++) {
    const pg = await pdf.getPage(i + 1), vp = pg.getViewport({ scale: 1 })
    const { canvas, context } = pdf.canvasFactory.create(vp.width, vp.height)
    await pg.render({ canvasContext: context, canvas, viewport: vp, background: 'rgba(0,0,0,0)' }).promise
    images.push({ w: found[i].w, h: found[i].h, png: await canvas.encode('png') })
  }
  return images // order in this PDF: glow, glow mask, flecks, flecks mask, ink, ink mask, marble
}

async function withMask(color, mask) {
  const m = await sharp(mask.png).greyscale().raw().toBuffer({ resolveWithObject: true })
  const rgb = await sharp(color.png).removeAlpha().resize(m.info.width, m.info.height).raw().toBuffer()
  const n = m.info.width * m.info.height, rgba = Buffer.alloc(n * 4)
  for (let i = 0; i < n; i++) {
    rgba[i * 4] = rgb[i * 3]; rgba[i * 4 + 1] = rgb[i * 3 + 1]; rgba[i * 4 + 2] = rgb[i * 3 + 2]; rgba[i * 4 + 3] = m.data[i]
  }
  return sharp(rgba, { raw: { width: m.info.width, height: m.info.height, channels: 4 } }).trim().png().toBuffer()
}

await mkdir(OUT, { recursive: true })
const img = await renderImages()
const bySize = (w, h) => img.filter(i => i.w === w && i.h === h)
const [flecks, flecksMask] = bySize(1556, 1601)
const [ink, inkMask] = bySize(3162, 3162)

await sharp(await withMask(flecks, flecksMask)).resize({ width: 600 }).webp({ quality: 80, alphaQuality: 85 }).toFile(path.join(OUT, 'gold.webp'))
// The ink is cut straight on its top, left and right sides; its only organic edge sits at 70-85 % of
// its height. Keep rows 60-90 %: dense ink against a straight edge, drips below.
// Full resolution first, so wide screens get a sharp 2560 px band.
const inkRgba = await withMask(ink, inkMask)
const { width: iw, height: ih } = await sharp(inkRgba).metadata()
const band = await sharp(inkRgba).extract({ left: 0, top: Math.round(ih * 0.6), width: iw, height: Math.round(ih * 0.3) }).png().toBuffer()
for (const w of [1280, 2560]) {
  await sharp(band).resize({ width: w }).webp({ quality: 84, alphaQuality: 90 }).toFile(path.join(OUT, `ink-band-${w}.webp`))
}
for (const f of ['gold.webp', 'ink-band-1280.webp', 'ink-band-2560.webp']) {
  const m = await sharp(path.join(OUT, f)).metadata()
  console.log(f, `${m.width}x${m.height}`)
}
