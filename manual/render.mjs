/**
 * Print the built document to PDF.
 *
 *   node manual/render.mjs   ->  public/manual/oxynet-manual-v<VERSION>.pdf
 *
 * Chrome does the printing. It is already on the machine, it is the same
 * engine the pages were designed against, and using it means the build needs
 * no bundled browser download. @page is A4 with zero margin and every page is
 * an exactly A4-sized section, so pagination is one section to one sheet.
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { VERSION, OUTPUT } from './config.mjs'
import { findChrome } from './fit.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

function render() {
  const src = join(here, '.out/manual.html')
  if (!existsSync(src)) throw new Error('manual: build first (node manual/build.mjs)')

  const outDir = join(root, OUTPUT.dir)
  mkdirSync(outDir, { recursive: true })
  const out = join(outDir, OUTPUT.file)

  execFileSync(
    findChrome(),
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      '--virtual-time-budget=20000',
      `--print-to-pdf=${out}`,
      'file://' + src,
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] }
  )

  if (!existsSync(out)) throw new Error('manual: Chrome produced no PDF')
  const kb = (statSync(out).size / 1024).toFixed(0)
  console.log(`manual: v${VERSION} -> ${out.replace(root + '/', '')} (${kb} KB)`)
}

render()
