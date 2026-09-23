/**
 * Assemble the data transfer agreement template and check every page fits.
 *
 *   node agreement/build.mjs   ->  agreement/.out/agreement.html
 *
 * Same pipeline as the manual: plain modules producing HTML, the manual's CSS,
 * tokens and furniture, and the manual's fit check, which fails the build if
 * any page runs into the folio band. render.mjs then prints and adds fields.
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { css } from '../manual/style.mjs'
import { measure } from '../manual/fit.mjs'
import { PAGE } from '../manual/tokens.mjs'
import { VERSION, DATE, TITLE } from './config.mjs'
import { PAGES, PAGES_TOTAL } from './pages.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const pages = PAGES.map((f) => f())
if (pages.length !== PAGES_TOTAL) {
  throw new Error(`agreement: PAGES_TOTAL says ${PAGES_TOTAL}, built ${pages.length}. The folios would be wrong.`)
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Oxynet ${TITLE} template v${VERSION}</title>
<meta name="author" content="Oxynet">
<meta name="description" content="Oxynet ${TITLE}, template version ${VERSION}, ${DATE}.">
<style>${css}</style>
</head>
<body>
${pages.join('\n')}
</body>
</html>`

const outDir = join(here, '.out')
mkdirSync(outDir, { recursive: true })
const out = join(outDir, 'agreement.html')
writeFileSync(out, html)
console.log(`agreement: ${pages.length} pages -> ${out.replace(root + '/', '')}`)

let bad = 0
for (const [id, end, full, worst] of measure(out)) {
  const limit = full ? PAGE.H : PAGE.LIMIT
  const ok = end <= limit
  if (!ok) bad++
  console.log(`${id.padEnd(6)} ${String(end).padStart(5)}  ${ok ? 'ok' : `OVER by ${end - limit}`}  ${ok ? '' : worst}`)
}
if (bad) {
  console.error(`agreement: ${bad} page(s) overflow the folio band`)
  process.exit(1)
}
