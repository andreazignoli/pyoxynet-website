/**
 * Does every page actually fit on its sheet?
 *
 *   node manual/fit.mjs
 *
 * A page is 1123 px tall and the folio band starts at 1050, so body content
 * has to finish above that line. Eyeballing this is how copy ends up printed
 * through the footer, which is exactly what happened before this existed.
 *
 * The check renders the built document in headless Chrome and, for every page,
 * walks the DOM for the lowest element that is not the running head, the folio
 * or a full-bleed background layer. It exits non-zero if anything overflows,
 * so it can gate a build.
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { PAGE } from './tokens.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

export const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
]

export function findChrome() {
  const env = process.env.CHROME_PATH
  if (env && existsSync(env)) return env
  const found = CHROME_CANDIDATES.find((p) => existsSync(p))
  if (!found) {
    throw new Error(
      'manual: no Chrome found. Install Google Chrome or Chromium, or set CHROME_PATH to the binary.\n' +
        'The manual is printed by Chrome rather than a bundled browser so the build needs no 150 MB download.'
    )
  }
  return found
}

const PROBE = `
<script>
window.addEventListener('load', function () {
  setTimeout(function () {
    var out = [];
    document.querySelectorAll('.pg').forEach(function (pg) {
      var top = pg.getBoundingClientRect().top, max = 0, worst = null;
      pg.querySelectorAll('*').forEach(function (el) {
        if (el.closest('.rf') || el.closest('.rh')) return;
        var r = el.getBoundingClientRect();
        if (!r.height && !r.width) return;
        if (r.height >= 1100) return;              // full-bleed background layers
        var b = r.bottom - top;
        if (b > max) { max = b; worst = el; }
      });
      out.push([pg.id, Math.round(max), pg.classList.contains('pg-full') ? 1 : 0,
        worst ? (worst.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 44) : '']);
    });
    document.title = 'FIT ' + JSON.stringify(out);
  }, 900);
});
</script>`

export function measure() {
  const src = join(here, '.out/manual.html')
  if (!existsSync(src)) throw new Error('manual: build first (node manual/build.mjs)')
  const probed = join(here, '.out/manual.probe.html')
  writeFileSync(probed, readFileSync(src, 'utf8').replace('</head>', PROBE + '</head>'))

  const dom = execFileSync(
    findChrome(),
    ['--headless', '--disable-gpu', '--no-sandbox', '--virtual-time-budget=15000',
     '--window-size=794,1200', '--dump-dom', 'file://' + probed],
    // Chrome logs display-link warnings on headless macOS that mean nothing here.
    { encoding: 'utf8', maxBuffer: 1024 * 1024 * 128, stdio: ['ignore', 'pipe', 'ignore'] }
  )
  const m = dom.match(/<title>FIT (\[.*?\])<\/title>/s)
  if (!m) throw new Error('manual: could not measure the built document')
  return JSON.parse(m[1])
}

function main() {
  const rows = measure()
  let bad = 0
  for (const [id, end, full, worst] of rows) {
    const limit = full ? PAGE.H : PAGE.LIMIT
    const ok = end <= limit
    if (!ok) bad++
    console.log(
      `${id.padEnd(14)} ${String(end).padStart(5)}  ${(ok ? 'ok' : `OVER by ${end - limit}`).padEnd(13)} ${worst.slice(0, 46)}`
    )
  }
  console.log(bad === 0 ? `\nall ${rows.length} pages fit` : `\n${bad} of ${rows.length} pages overflow: trim the copy or the spacing`)
  process.exit(bad ? 1 : 0)
}

if (import.meta.url === `file://${process.argv[1]}`) main()
