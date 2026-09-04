/**
 * Assemble the manual into one HTML document, one A4 page per <section>.
 *
 *   node manual/build.mjs   ->  manual/.out/manual.html
 *
 * The output is an intermediate: open it in a browser to proof a page, then
 * run fit.mjs to check nothing overflows and render.mjs to print the PDF.
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { PAGE, L, D, SANS, MONO, TYPE } from './tokens.mjs'
import { VERSION, DATE } from './config.mjs'
import { PARTS, LAST_PAGE } from './toc.mjs'
import { cover, colophon, contents, divider } from './pages/front.mjs'
import { PART_ONE } from './pages/part1.mjs'
import { PART_TWO } from './pages/part2.mjs'
import { PART_THREE } from './pages/part3.mjs'
import { PART_FOUR } from './pages/part4.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

/**
 * Geist, embedded from the same package the site uses so the PDF carries the
 * brand face rather than a substitute. Chrome resolves these file URLs at
 * print time; if the package moves, the build fails loudly rather than
 * printing in Helvetica.
 */
const FACES = [
  ['Geist', 400, 'geist-sans/Geist-Regular.woff2'],
  ['Geist', 500, 'geist-sans/Geist-Medium.woff2'],
  ['Geist', 600, 'geist-sans/Geist-SemiBold.woff2'],
  ['Geist', 700, 'geist-sans/Geist-Bold.woff2'],
  ['Geist Mono', 400, 'geist-mono/GeistMono-Regular.woff2'],
  ['Geist Mono', 500, 'geist-mono/GeistMono-Medium.woff2'],
]

function fontFaces() {
  return FACES.map(([family, weight, rel]) => {
    const abs = join(root, 'node_modules/geist/dist/fonts', rel)
    if (!existsSync(abs)) {
      throw new Error(
        `manual: font missing at ${abs}\n` +
          `Run "npm install" first. The manual embeds Geist from the geist package, ` +
          `which is the same face the site loads, so the PDF cannot be built without it.`
      )
    }
    return `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;font-display:block;src:url('file://${abs}') format('woff2')}`
  }).join('\n')
}

const css = `
${fontFaces()}

@page { size: A4; margin: 0; }

html, body { margin:0; padding:0; background:#8c8c8c; }

.pg {
  position: relative;
  width: ${PAGE.W}px;
  height: ${PAGE.H}px;
  overflow: hidden;
  box-sizing: border-box;
  font-family: ${SANS};
  font-size: ${TYPE.body}px;
  -webkit-font-smoothing: antialiased;
  break-after: page;
  page-break-after: always;
  margin: 0 auto;
}
.pg:last-child { break-after: auto; page-break-after: auto; }

/* On screen the pages are stacked with a gap so the document can be proofed
   by scrolling. Print collapses it: each section is exactly one A4 sheet. */
@media screen { .pg { margin: 0 auto 24px; box-shadow: 0 2px 14px rgba(0,0,0,.35); } }
@media print  { .pg { margin: 0; box-shadow: none; } }

.content {
  position: absolute;
  left: ${PAGE.ML}px;
  top: 96px;
  width: ${PAGE.CW}px;
}

.rh {
  position: absolute;
  left: ${PAGE.ML}px; right: ${PAGE.MR}px; top: ${PAGE.MT}px;
  display: flex; justify-content: space-between;
  font-family: ${MONO}; font-size: 9px; letter-spacing: .14em; text-transform: uppercase;
  padding-bottom: 9px; border-bottom: 1px solid;
}
.rf {
  position: absolute;
  left: ${PAGE.ML}px; right: ${PAGE.MR}px; bottom: ${PAGE.MB}px;
  display: flex; justify-content: space-between;
  font-family: ${MONO}; font-size: 9.5px; letter-spacing: .1em;
}

.eyebrow {
  font-family: ${MONO}; font-size: ${TYPE.eyebrow}px; letter-spacing: .2em;
  text-transform: uppercase; margin: 0 0 14px;
}
.rail-label {
  font-family: ${MONO}; font-size: 9.5px; letter-spacing: .16em;
  text-transform: uppercase; margin: 0 0 8px;
}

h1 { font-size:${TYPE.h1}px; line-height:1.14; font-weight:600; letter-spacing:-.02em; color:${L.strong}; margin:0 0 16px; text-wrap:pretty; }
h2 { font-size:${TYPE.h2}px; line-height:1.22; font-weight:600; letter-spacing:-.015em; color:${L.strong}; margin:0 0 9px; }
h3 { font-size:${TYPE.h3}px; font-weight:600; color:${L.strong}; margin:0 0 6px; }
p  { font-size:${TYPE.body}px; line-height:1.58; margin:0 0 13px; text-wrap:pretty; }
.stand { font-size:${TYPE.stand}px; line-height:1.48; color:${L.strong}; font-weight:500; margin:0 0 20px; }
.cap { font-family:${MONO}; font-size:${TYPE.caption}px; letter-spacing:.05em; color:${L.faint}; line-height:1.55; margin:8px 0 0; }
.mono { font-family:${MONO}; }

.pg-dark h1, .pg-dark h2, .pg-dark h3 { color:${D.strong}; }
a { color:#046c45; text-decoration:none; }
`

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
