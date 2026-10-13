// Rebuild the catering menus from page images: removes the hidden prices in the text layer,
// covers the King scribble with the matching blank area of the Queen menu, shrinks Corporate.
// Usage (from website/): node scripts/pdf-clean/clean.mjs [--inspect]
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { PDFDocument } from 'pdf-lib'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SRC = path.resolve('..', 'Catering pictures and menus')
const OUT = path.resolve('public', 'menus', 'catering')
const SCALE = 2 // ~144 dpi
const JOBS = [
  { file: 'QUEEN MENU JC.pdf', out: 'queen.pdf' },
  { file: 'KingMenu (minimum 50 ppl).pdf', out: 'king.pdf' },
  { file: 'Final01_CorporateMenu.pdf', out: 'corporate.pdf' },
]
// Fractions of page 1 (x, y, w, h) holding the hand-drawn scribble on the King menu.
// Measured in --inspect output; the same area is blank on the Queen menu.
const KING_PATCH = { x: 0.392, y: 0.312, w: 0.21, h: 0.034 }

async function renderPages(file) {
  const doc = await getDocument({ data: new Uint8Array(await readFile(path.join(SRC, file))) }).promise
  const pages = []
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n)
    const vp = page.getViewport({ scale: SCALE })
    const { canvas, context } = doc.canvasFactory.create(Math.ceil(vp.width), Math.ceil(vp.height))
    await page.render({ canvasContext: context, canvas, viewport: vp }).promise
    pages.push({ canvas, context, ptW: vp.width / SCALE, ptH: vp.height / SCALE })
  }
  return pages
}

await mkdir(OUT, { recursive: true })
const rendered = {}
for (const job of JOBS) rendered[job.out] = await renderPages(job.file)

const king = rendered['king.pdf'][0], queen = rendered['queen.pdf'][0]
const r = {
  x: Math.round(KING_PATCH.x * king.canvas.width), y: Math.round(KING_PATCH.y * king.canvas.height),
  w: Math.round(KING_PATCH.w * king.canvas.width), h: Math.round(KING_PATCH.h * king.canvas.height),
}

if (process.argv.includes('--inspect')) {
  for (const [name, p] of [['king', king], ['queen', queen]]) {
    p.context.strokeStyle = 'red'; p.context.lineWidth = 2; p.context.strokeRect(r.x, r.y, r.w, r.h)
    await writeFile(path.join(OUT, `_inspect-${name}.png`), await p.canvas.encode('png'))
  }
  console.log('wrote _inspect-*.png; adjust KING_PATCH until the red box covers only the scribble')
  process.exit(0)
}

king.context.putImageData(queen.context.getImageData(r.x, r.y, r.w, r.h), r.x, r.y)

for (const job of JOBS) {
  const pdf = await PDFDocument.create()
  for (const p of rendered[job.out]) {
    const jpg = await pdf.embedJpg(await p.canvas.encode('jpeg', 80))
    pdf.addPage([p.ptW, p.ptH]).drawImage(jpg, { x: 0, y: 0, width: p.ptW, height: p.ptH })
  }
  await writeFile(path.join(OUT, job.out), await pdf.save())
  console.log('wrote', job.out, rendered[job.out].length, 'pages')
}
