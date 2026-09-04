/**
 * The manual's design tokens.
 *
 * These are the site's own values, not approximations of them. The dark tokens
 * are what `globals.css` resolves to on `#0a0a0a`; the light tokens are the
 * light theme's contrast-matched ink ramp. Change one, change `globals.css`,
 * and change the app repo's `tailwind.config.js` too: the three properties are
 * one brand and the palette lives in all of them as the same numbers.
 *
 * The one deliberate departure is DOMAIN, below.
 */

// ---------------------------------------------------------------- geometry
// A4 at 96 css px per inch. Chrome prints 1 css px as 1/96 in, so authoring in
// these numbers and printing @page A4 lands on the millimetre.
export const PAGE = {
  W: 794,
  H: 1123,
  ML: 62,
  MR: 62,
  MT: 54,
  MB: 50,
  get CW() {
    return this.W - this.ML - this.MR
  }, // 670
  COL: 428, // the text column
  GAP: 30,
  RAIL: 212, // the margin rail: caveats, gates, stats
  // Body content must finish here. Below it is the folio band. `fit.mjs`
  // enforces this, because eyeballing it is what put text through the footer.
  LIMIT: 1050,
}

// ---------------------------------------------------------------- dark
export const D = {
  bg: '#0a0a0a',
  strong: '#cecece',
  body: '#919191',
  subtle: '#787878',
  faint: '#545454',
  line: '#1e1e1e',
}

// ---------------------------------------------------------------- light
export const L = {
  bg: '#fbfbfa',
  strong: '#303233',
  body: '#5d5e5f',
  subtle: '#747676',
  faint: '#9d9d9e',
  line: '#e1e1e0',
  surface: '#f2f2f1',
}

// ---------------------------------------------------------------- brand
export const GREEN = '#00dc82' // the Oxynet green. A fill, never a letterform on white.
export const BLUE = '#155799'
export const ACCENT_TEXT = '#046c45' // the green stepped for a light ground: 6.5:1
export const WARN = '#92400e'
export const WARN_DARK = '#fbbf24'
export const GRADIENT = 'linear-gradient(135deg,#00dc82 0%,#155799 100%)'

/**
 * The three intensity domains.
 *
 * The app paints these `#34d399 / #fbbf24 / #f87171`, tuned against `#0a0a0a`.
 * On the manual's paper ground those read 1.87, 1.63 and 2.69 to 1, which is
 * below the 3:1 a chart mark needs. These are the same three hues stepped
 * darker until they pass, the way the light theme steps the accent to #046c45.
 *
 * They clear the lightness band, the chroma floor and the normal-vision
 * separation, and sit in the 6 to 8 band for protanopia, which is legal only
 * with a second encoding. So every band that uses them is directly labelled.
 * Do not use them unlabelled.
 */
export const DOMAIN = {
  moderate: '#059669',
  heavy: '#d97706',
  severe: '#e11d48',
}

// ---------------------------------------------------------------- type
export const SANS = "'Geist','Helvetica Neue',Arial,sans-serif"
// Geist Mono is missing a few maths and arrow glyphs the manual uses (≤ ≥ →).
// Geist is named next so those fall back to a face that is already embedded,
// rather than dragging a system mono into the PDF.
export const MONO = "'Geist Mono','Geist','SF Mono',ui-monospace,Menlo,monospace"

// 12pt is 16px at 96dpi, and that is the floor for reading copy. Short labels
// and legal lines may go to 12px, nothing goes below it.
export const TYPE = {
  h1: 34,
  h2: 22,
  h3: 15.5,
  stand: 19,
  body: 16,
  small: 13.5,
  note: 12.5,
  caption: 10,
  eyebrow: 10,
}
