// Rebuild the client's menus as image-only PDFs without prices.
// - every price found in the text layer is erased from the page image (background filled from its border)
// - the King menu's hand-drawn scribble is covered with the blank area of the Queen menu
// - pages are re-encoded as JPEG, so no text (and no hidden price) is left in the files
// Originals with prices live in the git-ignored "Catering pictures and menus" folder.
// Usage (from website/): node scripts/pdf-clean/clean.mjs [--inspect]
import { getDocument, Util } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { PDFDocument } from 'pdf-lib'
import { createCanvas } from '@napi-rs/canvas'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { priceSpans } from './prices.mjs'

const RAW = path.resolve('..', 'Catering pictures and menus')
const JOBS = [
  { src: 'QUEEN MENU JC.pdf', out: 'public/menus/catering/queen.pdf', scale: 2 },
  { src: 'KingMenu (minimum 50 ppl).pdf', out: 'public/menus/catering/king.pdf', scale: 2 },
  { src: 'Final01_CorporateMenu.pdf', out: 'public/menus/catering/corporate.pdf', scale: 2 },
  { src: 'menus-originaux/Restaurant MENU.pdf', out: 'public/menu/Restaurant MENU.pdf', scale: 2.5 },
  { src: 'menus-originaux/TAKE OUT MENU.pdf', out: 'public/menu/TAKE OUT MENU.pdf', scale: 2.5 },
  { src: 'menus-originaux/DrinkMenu.pdf', out: 'public/menu/DrinkMenu.pdf', scale: 2.5 },
]
// Fractions of King page 1 (x, y, w, h) holding the hand-drawn scribble; the same area is blank on Queen.
const KING_PATCH = { x: 0.392, y: 0.312, w: 0.21, h: 0.034 }
const inspect = process.argv.includes('--inspect')
const measure = createCanvas(10, 10).getContext('2d')
measure.font = '100px serif'

/** Ink words along a line: column runs that differ from the line's median colour, split on gaps. */
function inkWords(ctx, x0, x1, y0, y1, minGap) {
  x0 = Math.max(0, Math.floor(x0)); y0 = Math.max(0, Math.floor(y0))
  const w = Math.max(1, Math.ceil(x1) - x0), h = Math.max(1, Math.ceil(y1) - y0)
  const d = ctx.getImageData(x0, y0, w, h).data
  const med = [0, 1, 2].map(c => { const v = []; for (let i = c; i < d.length; i += 4) v.push(d[i]); v.sort((p, q) => p - q); return v[v.length >> 1] })
  const ink = []
  for (let x = 0; x < w; x++) {
    let hit = 0
    for (let y = 0; y < h; y++) { const i = (y * w + x) * 4; if (Math.abs(d[i] - med[0]) + Math.abs(d[i + 1] - med[1]) + Math.abs(d[i + 2] - med[2]) > 90) hit++ }
    ink.push(hit > 0)
  }
  const words = []
  for (let x = 0; x < w; x++) {
    if (!ink[x]) continue
    const last = words[words.length - 1]
    if (last && x - last[1] <= minGap) last[1] = x
    else words.push([x, x])
  }
  return words.map(([a, b]) => [x0 + a, x0 + b])
}

/** Pixel boxes of the prices on one rendered page. */
function priceBoxes(items, vp, ctx) {
  const boxes = []
  for (const it of items) {
    if (!it.str?.trim()) continue
    const spans = priceSpans(it.str)
    if (spans !== 'all' && !spans.length) continue
    const m = Util.transform(vp.transform, it.transform)
    const h = Math.hypot(m[2], m[3]), x = m[4], base = m[5], w = it.width * vp.scale
    const full = measure.measureText(it.str).width || 1
    const at = i => x + (measure.measureText(it.str.slice(0, i)).width / full) * w
    const pad = h * 0.18
    const y0 = Math.floor(base - h * 1.0), y1 = Math.ceil(base + h * 0.32)
    for (const [a, b] of spans === 'all' ? [[0, it.str.length]] : spans) {
      let left = at(a) - pad
      if (a > 0) {
        // Mid-line span: the font estimate is unreliable on script fonts, so start at the first
        // ink word of the span, found in the rendered line (words counted from the line's end).
        const tokens = it.str.slice(a, b).trim().split(/\s+/).length
        const words = inkWords(ctx, x - pad, x + w + pad, y0, y1, h * 0.22)
        left = words.length > tokens ? (words[words.length - tokens][0] + words[words.length - tokens - 1][1]) / 2 : at(a) + h * 0.06
      }
      boxes.push({ x0: Math.floor(left), x1: Math.ceil(at(b) + pad), y0, y1, text: it.str.slice(a, b) })
    }
  }
  // Separators ("|", "/", "•") left alone next to an erased price, on the same line.
  for (const it of items) {
    if (!/^\s*[|/•·\-–]\s*$/.test(it.str ?? '')) continue
    const m = Util.transform(vp.transform, it.transform)
    const h = Math.hypot(m[2], m[3]), x = m[4], base = m[5], w = it.width * vp.scale
    const near = boxes.some(b => Math.abs(b.y1 - (base + h * 0.32)) < h * 0.6 && (Math.abs(b.x1 - x) < h * 1.5 || Math.abs(b.x0 - (x + w)) < h * 1.5))
    if (near) boxes.push({ x0: Math.floor(x - h * 0.2), x1: Math.ceil(x + w + h * 0.2), y0: Math.floor(base - h), y1: Math.ceil(base + h * 0.32), text: it.str })
  }
  return boxes
}

/** Fill a box row by row from its left and right borders (prices sit in horizontal white space; the
 *  rows above and below often touch banners or other lines). Each border value is a median over a
 *  few columns and neighbouring rows, so a stray stroke on the border cannot draw a line across. */
function fillBox(ctx, b, W, H) {
  const M = 3 // border columns sampled on each side
  const x0 = Math.max(M, b.x0), y0 = Math.max(0, b.y0), x1 = Math.min(W - 1 - M, b.x1), y1 = Math.min(H - 1, b.y1)
  const w = x1 - x0 + 1 + 2 * M, h = y1 - y0 + 1
  if (w <= 2 * M || h < 2) return
  const img = ctx.getImageData(x0 - M, y0, w, h), d = img.data
  const k = Math.max(2, Math.round(h / 4))
  const median = (side, y, c) => {
    const vals = []
    for (let yy = Math.max(0, y - k); yy <= Math.min(h - 1, y + k); yy++) {
      for (let i = 0; i < M; i++) vals.push(d[(yy * w + (side ? w - 1 - i : i)) * 4 + c])
    }
    vals.sort((p, q) => p - q)
    return vals[vals.length >> 1]
  }
  const L = [], R = []
  for (let y = 0; y < h; y++) { L.push([0, 1, 2].map(c => median(0, y, c))); R.push([0, 1, 2].map(c => median(1, y, c))) }
  for (let y = 0; y < h; y++) for (let x = M; x < w - M; x++) {
    const u = (x - M + 1) / (w - 2 * M + 1)
    for (let c = 0; c < 3; c++) d[(y * w + x) * 4 + c] = (1 - u) * L[y][c] + u * R[y][c]
  }
  ctx.putImageData(img, x0 - M, y0)
}

async function render(job) {
  const doc = await getDocument({ data: new Uint8Array(await readFile(path.join(RAW, job.src))) }).promise
  const pages = []
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n)
    const vp = page.getViewport({ scale: job.scale })
    const { canvas, context } = doc.canvasFactory.create(Math.ceil(vp.width), Math.ceil(vp.height))
    await page.render({ canvasContext: context, canvas, viewport: vp }).promise
    const boxes = priceBoxes((await page.getTextContent()).items, vp, context)
    pages.push({ canvas, context, boxes, ptW: vp.width / job.scale, ptH: vp.height / job.scale })
  }
  return pages
}

const rendered = {}
for (const job of JOBS) rendered[job.out] = await render(job)

const king = rendered[JOBS[1].out][0], queen = rendered[JOBS[0].out][0]
const r = { x: Math.round(KING_PATCH.x * king.canvas.width), y: Math.round(KING_PATCH.y * king.canvas.height), w: Math.round(KING_PATCH.w * king.canvas.width), h: Math.round(KING_PATCH.h * king.canvas.height) }
king.context.putImageData(queen.context.getImageData(r.x, r.y, r.w, r.h), r.x, r.y)

for (const job of JOBS) {
  const pdf = await PDFDocument.create()
  let erased = 0
  for (const [i, p] of rendered[job.out].entries()) {
    if (inspect) {
      p.context.strokeStyle = 'red'; p.context.lineWidth = 2
      for (const b of p.boxes) p.context.strokeRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0)
      await mkdir('shots/pdf-inspect', { recursive: true })
      await writeFile(`shots/pdf-inspect/${path.basename(job.out, '.pdf').replace(/\W+/g, '_')}-p${i + 1}.png`, await p.canvas.encode('png'))
      continue
    }
    for (const b of p.boxes) fillBox(p.context, b, p.canvas.width, p.canvas.height)
    erased += p.boxes.length
    const jpg = await pdf.embedJpg(await p.canvas.encode('jpeg', 82))
    pdf.addPage([p.ptW, p.ptH]).drawImage(jpg, { x: 0, y: 0, width: p.ptW, height: p.ptH })
  }
  if (inspect) { console.log('inspect', job.out); continue }
  await mkdir(path.dirname(job.out), { recursive: true })
  await writeFile(job.out, await pdf.save())
  console.log('wrote', job.out, rendered[job.out].length, 'pages,', erased, 'prices erased')
}
