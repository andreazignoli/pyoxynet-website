/**
 * The page furniture. Every page in the manual is built from these, so the
 * grid, the running head and the folio cannot drift between sections.
 */

import { PAGE, D, L, GREEN, BLUE, ACCENT_TEXT, WARN, WARN_DARK, GRADIENT, SANS, MONO } from './tokens.mjs'
import { VERSION } from './config.mjs'

export const GRAD_TEXT =
  `background:${GRADIENT};-webkit-background-clip:text;background-clip:text;` +
  `-webkit-text-fill-color:transparent;color:transparent`

/** Escape text destined for markup. Use on anything interpolated from data. */
export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** The separator the house style uses in place of an em dash. */
export const SEP = '&nbsp;·&nbsp;'

/**
 * One page. `light` picks the ink ramp; `full` marks a page whose background
 * is painted edge to edge, which fit.mjs is allowed to see reaching 1123.
 */
export function page({ id, light = true, full = false, body }) {
  const t = light ? L : D
  return `<section class="pg ${light ? 'pg-light' : 'pg-dark'}${full ? ' pg-full' : ''}" id="${id}" style="background:${t.bg};color:${t.body}">
${body}
</section>`
}

export function runhead(left, right, light = true) {
  const t = light ? L : D
  return `<div class="rh" style="color:${t.faint};border-color:${t.line}"><span>${left}</span><span>${right}</span></div>`
}

export function folio(n, light = true) {
  const t = light ? L : D
  return `<div class="rf" style="color:${t.faint}"><span>Oxynet Manual v${VERSION}</span><span>${n}</span></div>`
}

/** The asymmetric body grid: text column beside the margin rail. */
export function grid(main, rail = '') {
  return `<div class="content" style="display:grid;grid-template-columns:${PAGE.COL}px ${PAGE.RAIL}px;gap:${PAGE.GAP}px;align-items:start">
  <div>${main}</div><div>${rail}</div></div>`
}

/** A page whose content runs the full measure rather than sitting in a column. */
export function wide(main) {
  return `<div class="content">${main}</div>`
}

export function eyebrow(text, light = true) {
  return `<p class="eyebrow" style="color:${light ? ACCENT_TEXT : GREEN}">${text}</p>`
}

export function h1(text, style = '') {
  return `<h1 style="${style}">${text}</h1>`
}

export function stand(text, style = '') {
  return `<p class="stand" style="${style}">${text}</p>`
}

/**
 * A rail block. `kind` is 'accent' (a green rule, for the load-bearing note),
 * 'warn' (an amber rule, for a caveat the reader must not miss) or 'surface'
 * (a tinted box, for reference material).
 */
export function railBlock(kind, label, html) {
  if (kind === 'surface') {
    return `<div style="background:${L.surface};border-radius:10px;padding:15px 16px;margin-bottom:20px">
      <p class="rail-label" style="color:${L.subtle}">${label}</p>${html}</div>`
  }
  const c = kind === 'warn' ? WARN : GREEN
  const labelColour = kind === 'warn' ? WARN : ACCENT_TEXT
  return `<div style="border-left:2px solid ${c};padding-left:15px;margin-bottom:20px">
    <p class="rail-label" style="color:${labelColour}">${label}</p>${html}</div>`
}

/** A paragraph at rail scale. */
export function rp(html, last = false) {
  return `<p style="font-size:12.5px;line-height:1.6;color:${L.body};margin:0 0 ${last ? 0 : 8}px">${html}</p>`
}

export function callout(html) {
  return `<div style="background:${L.surface};border-radius:10px;padding:15px 17px">
    <p style="font-size:12.5px;line-height:1.6;color:${L.body};margin:0">${html}</p></div>`
}

/**
 * A code or payload block. Highlighting is done here rather than with a
 * library because the manual only ever shows JSON and shell, and Shiki's
 * themes are built for a dark editor rather than for paper.
 */
export function code(src, { size = 11.5, width = PAGE.COL } = {}) {
  // The block does not wrap, so a line wider than its column is silently cut
  // off at the right edge. That shipped in v1.0 on two pages. Geist Mono runs
  // about 0.6 em per character; warn rather than clip.
  const maxChars = Math.floor((width - 34) / (size * 0.6))
  for (const ln of src.split('\n')) {
    if (ln.length > maxChars) {
      console.warn(
        `manual: code line is ${ln.length} chars, ${maxChars} fit in ${width}px at ${size}px. It will be cut:\n  ${ln}`
      )
    }
  }
  const lines = src.split('\n').map((ln) => {
    let h = ln.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    h = h.replace(/"([a-z_0-9]+)":/g, `<span style="color:${L.strong}">"$1"</span>:`)
    h = h.replace(/: (-?\d+\.?\d*)/g, `: <span style="color:${BLUE}">$1</span>`)
    h = h.replace(/: "([^"]*)"/g, `: <span style="color:${ACCENT_TEXT}">"$1"</span>`)
    h = h.replace(/^(\s*)(#|\$) (.*)$/, `$1<span style="color:${L.faint}">$2 $3</span>`)
    return h || '&nbsp;'
  })
  return `<div style="background:${L.surface};border:1px solid ${L.line};border-radius:8px;padding:13px 16px;
    font-family:${MONO};font-size:${size}px;line-height:1.68;color:${L.body};white-space:pre;overflow:hidden">${lines.join('\n')}</div>`
}

/** The beta marker. Oscillation analysis carries this wherever it is named. */
export function betaChip(dark = false) {
  const c = dark ? WARN_DARK : WARN
  return `<span style="font-family:${MONO};font-size:9px;letter-spacing:.12em;text-transform:uppercase;
    color:${c};border:1px solid ${c}59;border-radius:3px;padding:1.5px 5px;margin-left:8px;vertical-align:middle">beta</span>`
}

/** A labelled figure caption. */
export function caption(text, style = '') {
  return `<p class="cap" style="${style}">${text}</p>`
}

/** A simple data table with the manual's rules. */
export function table(headers, rows, { align = [] } = {}) {
  const th = headers
    .map((h, i) => `<th style="text-align:${align[i] || 'left'};padding-bottom:6px;border-bottom:1.5px solid ${L.strong};
      font-family:${MONO};font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:${L.subtle};font-weight:400">${h}</th>`)
    .join('')
  const tr = rows
    .map(
      (r) =>
        `<tr>${r
          .map(
            (c, i) =>
              `<td style="text-align:${align[i] || 'left'};padding:7px 0;border-bottom:1px solid ${L.line};
                font-size:13px;${i === 0 ? `font-weight:600;color:${L.strong};` : `font-family:${MONO};`}">${c}</td>`
          )
          .join('')}</tr>`
    )
    .join('')
  return `<table style="width:100%;border-collapse:collapse"><tr>${th}</tr>${tr}</table>`
}

/**
 * An external link.
 *
 * Every URL in this document must go through here. Printing a URL as plain
 * text looks the same on the page, but the PDF viewer then linkifies whatever
 * characters it can see, so a shortened or wrapped URL becomes a link to a
 * truncated address that 404s. The anchor carries the full target; the visible
 * text is free to be short.
 */
export function extlink(url, text) {
  return `<a href="${url}" style="color:inherit;text-decoration:none">${text ?? shortUrl(url)}</a>`
}

/** Protocol and trailing slash removed, elided in the middle if it is long. */
export function shortUrl(url, max = 46) {
  const bare = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  if (bare.length <= max) return bare
  const slash = bare.indexOf('/')
  const host = slash === -1 ? bare : bare.slice(0, slash)
  const rest = slash === -1 ? '' : bare.slice(slash)
  const room = Math.max(8, max - host.length - 1)
  return host + rest.slice(0, room) + '…'
}

