/**
 * The mark and the field: the two pieces of the hero that the cover borrows.
 *
 * The mark is read from `public/oxynet-mark.svg`, the same asset the site and
 * the app serve, rather than being redrawn here. It is the glyph "E" of the
 * 3D Animals typeface extracted to a path, and it is drawn with `currentColor`
 * in the original, so this module substitutes a real paint before printing.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { GREEN, BLUE } from './tokens.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const raw = readFileSync(join(here, '../public/oxynet-mark.svg'), 'utf8')

/**
 * The wireframe duck at a given width. `paint` is 'gradient' for the cover,
 * where it sits beside the gradient wordmark, or a hex for anywhere else.
 */
export function mark({ width = 150, paint = 'gradient', id = 'ox' } = {}) {
  const fill = paint === 'gradient' ? `url(#${id}g)` : paint
  const defs =
    paint === 'gradient'
      ? `<defs><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1">` +
        `<stop offset="0" stop-color="${GREEN}"/><stop offset="1" stop-color="${BLUE}"/></linearGradient></defs>`
      : ''
  return raw
    .replace(/<svg([^>]*)>/, (m, attrs) => {
      const cleaned = attrs.replace(/\swidth="[^"]*"/, '').replace(/\sheight="[^"]*"/, '')
      return `<svg${cleaned} width="${width}" style="display:block">${defs}`
    })
    .replace(/fill="currentColor"/g, `fill="${fill}"`)
}

/**
 * Gradient lettering, drawn as SVG rather than with CSS.
 *
 * The site uses `-webkit-background-clip: text` for the wordmark, which is
 * right on screen and wrong in print: Chrome rasterises the gradient box and
 * drops the text clip, so the PDF gets a solid rectangle where the word should
 * be. SVG text with a gradient paint prints correctly, so the manual uses this
 * everywhere the site would use `.gradient-text`.
 */
export function gradientText(text, { size = 96, weight = 700, tracking = -0.035, id = 'wm', width, height } = {}) {
  // Geist is not quite this tight, but the box only has to contain the word;
  // the text is centred in it, so a generous box costs nothing.
  const w = width ?? Math.ceil(text.length * size * 0.62 + size * 0.4)
  const h = height ?? Math.ceil(size * 1.18)
  const baseline = Math.round(h * 0.8)
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${text}" style="display:block;overflow:visible">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${GREEN}"/><stop offset="1" stop-color="${BLUE}"/>
    </linearGradient></defs>
    <text x="${w / 2}" y="${baseline}" text-anchor="middle" fill="url(#${id})"
      font-family="Geist, 'Helvetica Neue', Arial, sans-serif" font-size="${size}"
      font-weight="${weight}" letter-spacing="${(tracking * size).toFixed(2)}">${text}</text>
  </svg>`
}

/**
 * The particle field behind the cover and the part dividers.
 *
 * The site draws this with a canvas the reader can watch move. Print gets one
 * frame of the same idea: a swirl in the wordmark's two hues, densest at the
 * centre and thinning outward, generated from a fixed seed so every build of a
 * given version produces the same cover.
 */
export function field({ W = 794, H = 1123, n = 620, seed = 7, cx = 0.5, cy = 0.42 } = {}) {
  let s = seed
  const rnd = () => {
    // mulberry32: small, deterministic, good enough for scattering dots
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let x = Math.imul(s ^ (s >>> 15), 1 | s)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
  const ox = W * cx
  const oy = H * cy
  const R = Math.max(W, H) * 0.58
  const dots = []
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2
    const r = Math.pow(rnd(), 0.55) * R
    const swirl = a + r * 0.0042
    const x = ox + Math.cos(swirl) * r * 1.28
    const y = oy + Math.sin(swirl) * r * 0.86
    if (x < -30 || x > W + 30 || y < -30 || y > H + 30) continue
    const tt = Math.min(1, r / R)
    const hue = rnd() > tt * 0.72 ? GREEN : BLUE
    const op = (0.5 * Math.pow(1 - tt, 1.25) + 0.05).toFixed(3)
    const rad = (0.7 + (1 - tt) * 1.9).toFixed(2)
    dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad}" fill="${hue}" opacity="${op}"/>`)
  }
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${dots.join('')}</svg>`
}
