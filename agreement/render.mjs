/**
 * Print the template to PDF, then make it fillable.
 *
 *   node agreement/render.mjs  ->  public/agreement/oxynet-data-transfer-agreement.pdf
 *
 * Chrome prints the pages (it cannot emit form fields), then this script asks
 * Chrome where every element tagged by ui.mjs landed and lays a PDF form field
 * exactly over it with pdf-lib: check boxes, radio groups for choose-one
 * items, and text fields for blanks. The boxes and lines underneath are part
 * of the printed page, so the document still reads correctly on paper.
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { PDFDocument, rgb } from 'pdf-lib'
import { findChrome } from '../manual/fit.mjs'
import { PAGE } from '../manual/tokens.mjs'
import { OUTPUT, VERSION } from './config.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const src = join(here, '.out/agreement.html')
if (!existsSync(src)) throw new Error('agreement: build first (node agreement/build.mjs)')

// ---------------------------------------------------------------- print
const outDir = join(root, OUTPUT.dir)
mkdirSync(outDir, { recursive: true })
const out = join(outDir, OUTPUT.file)
const chrome = findChrome()
execFileSync(chrome, ['--headless', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
  '--virtual-time-budget=15000', `--print-to-pdf=${out}`, 'file://' + src], { stdio: ['ignore', 'ignore', 'inherit'] })

// ---------------------------------------------------------------- measure
const PROBE = `<script>
window.addEventListener('load', function () { setTimeout(function () {
  var pages = Array.prototype.slice.call(document.querySelectorAll('.pg')), out = [];
  document.querySelectorAll('[data-f]').forEach(function (el) {
    var pg = el.closest('.pg'), p = pg.getBoundingClientRect(), r = el.getBoundingClientRect();
    out.push({ page: pages.indexOf(pg), f: el.dataset.f, k: el.dataset.k, g: el.dataset.g || '', v: el.dataset.v || '',
      x: r.left - p.left, y: r.top - p.top, w: r.width, h: r.height });
  });
  document.title = 'FIELDS ' + JSON.stringify(out);
}, 900); });
</script>`
const probed = join(here, '.out/agreement.fields.html')
writeFileSync(probed, readFileSync(src, 'utf8').replace('</head>', PROBE + '</head>'))
const dom = execFileSync(chrome, ['--headless', '--disable-gpu', '--no-sandbox', '--virtual-time-budget=15000',
  `--window-size=${PAGE.W},1200`, '--dump-dom', 'file://' + probed],
  { encoding: 'utf8', maxBuffer: 1024 * 1024 * 128, stdio: ['ignore', 'pipe', 'ignore'] })
const m = dom.match(/<title>FIELDS (\[.*?\])<\/title>/s)
if (!m) throw new Error('agreement: could not measure field positions')
const fields = JSON.parse(m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'))

// ---------------------------------------------------------------- fields
const pdf = await PDFDocument.load(readFileSync(out))
const pdfPages = pdf.getPages()
const form = pdf.getForm()
const groups = new Map()
const seen = new Set()
// Transparent: the printed box or line underneath is the visible part.
// pdf-lib paints white unless the key is present, so it is set explicitly.
const CLEAR = { borderWidth: 0, backgroundColor: undefined, borderColor: undefined }
const names = (s) => s.replace(/\./g, '-') // a dot in a field name means hierarchy in AcroForm

for (const fd of fields) {
  const pg = pdfPages[fd.page]
  const { width: pw, height: ph } = pg.getSize()
  const s = pw / PAGE.W
  const rect = (pad = 0) => ({ x: (fd.x - pad) * s, y: ph - (fd.y + fd.h + pad) * s, width: (fd.w + 2 * pad) * s, height: (fd.h + 2 * pad) * s })
  const ink = rgb(0.19, 0.2, 0.2) // every field sits on a light ground, the cover's included

  if (fd.k === 'radio') {
    const gname = names(`item_${fd.g}`)
    if (!groups.has(gname)) groups.set(gname, form.createRadioGroup(gname))
    // Readers repaint a radio widget over whatever is printed beneath it, so the
    // widget draws its own ring, matched to the printed one, ticked or not.
    groups.get(gname).addOptionToPage(fd.v, pg, { ...rect(), borderWidth: 1.3 * s, borderColor: ink, backgroundColor: rgb(1, 1, 1), textColor: ink })
    continue
  }
  const name = names(fd.f)
  if (seen.has(name)) throw new Error(`agreement: duplicate field name ${fd.f}`)
  seen.add(name)
  if (fd.k === 'check') {
    form.createCheckBox(name).addToPage(pg, { ...rect(1), ...CLEAR, textColor: ink })
  } else {
    const tf = form.createTextField(name)
    if (fd.k === 'area') tf.enableMultiline()
    tf.addToPage(pg, { ...rect(), ...CLEAR, textColor: ink })
    tf.setFontSize(9.5)
  }
}

pdf.setTitle(`Oxynet Data Transfer Agreement template v${VERSION}`)
pdf.setAuthor('Oxynet')
writeFileSync(out, await pdf.save())

const kb = (statSync(out).size / 1024).toFixed(0)
const nRadio = [...groups.values()].length
console.log(`agreement: v${VERSION} -> ${out.replace(root + '/', '')} (${kb} KB, ${seen.size} fields + ${nRadio} choose-one groups)`)
