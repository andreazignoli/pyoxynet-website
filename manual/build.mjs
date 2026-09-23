/**
 * Assemble the manual into one HTML document, one A4 page per <section>.
 *
 *   node manual/build.mjs   ->  manual/.out/manual.html
 *
 * The output is an intermediate: open it in a browser to proof a page, then
 * run fit.mjs to check nothing overflows and render.mjs to print the PDF.
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { css } from './style.mjs'
import { VERSION, DATE } from './config.mjs'
import { PARTS, LAST_PAGE } from './toc.mjs'
import { cover, colophon, contents, divider } from './pages/front.mjs'
import { PART_ONE } from './pages/part1.mjs'
import { PART_TWO } from './pages/part2.mjs'
import { PART_THREE } from './pages/part3.mjs'
import { PART_FOUR } from './pages/part4.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

function build() {
  const pages = [
    cover(),
    colophon(),
    contents(),
    divider(PARTS[0]), ...PART_ONE.map((f) => f()),
    divider(PARTS[1]), ...PART_TWO.map((f) => f()),
    divider(PARTS[2]), ...PART_THREE.map((f) => f()),
    divider(PARTS[3]), ...PART_FOUR.map((f) => f()),
  ]

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Oxynet Manual v${VERSION}</title>
<meta name="author" content="Andrea Zignoli">
<meta name="description" content="Oxynet: a computational layer for cardiopulmonary exercise testing. Manual version ${VERSION}, ${DATE}.">
<style>${css}</style>
</head>
<body>
${pages.join('\n')}
</body>
</html>`

  const outDir = join(here, '.out')
  mkdirSync(outDir, { recursive: true })
  const outFile = join(outDir, 'manual.html')
  writeFileSync(outFile, html)
  console.log(`manual: ${pages.length} pages -> ${outFile.replace(root + '/', '')}`)
  if (pages.length !== LAST_PAGE) {
    console.warn(`manual: toc.mjs says ${LAST_PAGE} pages, built ${pages.length}. Renumber toc.mjs if this is intended.`)
  }
  return outFile
}

build()
