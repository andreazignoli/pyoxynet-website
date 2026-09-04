/**
 * The wavelet map, reproduced from the one the Oxynet application draws.
 *
 * The app renders `eob.maps.evidence` as a raster of time against log period,
 * coloured by oscillation strength, with each detected episode boxed: a dashed
 * amber box for an episode that was flagged but not graded, a solid box for a
 * graded one. This module draws the same picture for print.
 *
 * HONESTY NOTE, and it belongs in the caption of any figure built from this:
 * the map itself is computed here, from the same ventilation trace, because the
 * MCP surface returns the episode list without the raster behind it. Everything
 * *quantitative* on the figure (the episode bounds, its period band, its
 * amplitude, its corroboration) is what the API returned. The map is the
 * backdrop that shows what the detector was looking at, not a measurement.
 */

import { deflateSync } from 'node:zlib'

// ---------------------------------------------------------------- PNG
const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

/** Encode an RGB raster (w*h*3 bytes) as a PNG data URI. */
export function pngDataURI(rgb, w, h) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // truecolour
  const raw = Buffer.alloc(h * (w * 3 + 1))
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0 // filter: none
    rgb.copy ? rgb.copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3)
             : Buffer.from(rgb).copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3)
  }
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
  return 'data:image/png;base64,' + png.toString('base64')
}

// ---------------------------------------------------------------- palette
/** magma, the application's default, as anchor stops. */
const MAGMA = [
  [0, 0, 4], [28, 16, 68], [79, 18, 123], [129, 37, 129], [181, 54, 122],
  [229, 80, 100], [251, 135, 97], [254, 194, 135], [252, 253, 191],
]

export function magma(x) {
  const t = Math.max(0, Math.min(1, x)) * (MAGMA.length - 1)
  const i = Math.floor(t)
  const f = t - i
  const a = MAGMA[i]
  const b = MAGMA[Math.min(i + 1, MAGMA.length - 1)]
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]
}

export function magmaCSS(stops = 6) {
  return Array.from({ length: stops }, (_, i) => {
    const [r, g, b] = magma(i / (stops - 1))
    return `rgb(${r | 0},${g | 0},${b | 0}) ${((i / (stops - 1)) * 100).toFixed(0)}%`
  }).join(', ')
}

// ---------------------------------------------------------------- transform
/** Linear resample of scattered (t, y) onto a uniform grid. */
function resample(t, y, dt, tEnd) {
  const n = Math.floor(tEnd / dt) + 1
  const out = new Float64Array(n)
  let j = 0
  for (let i = 0; i < n; i++) {
    const x = i * dt
    while (j < t.length - 2 && t[j + 1] < x) j++
    const t0 = t[j]
    const t1 = t[j + 1] ?? t0 + 1
    const f = t1 === t0 ? 0 : (x - t0) / (t1 - t0)
    out[i] = y[j] + ((y[j + 1] ?? y[j]) - y[j]) * Math.max(0, Math.min(1, f))
  }
  return out
}

/** Subtract a centred moving average, so the ramp does not swamp the rhythm. */
function detrend(y, win) {
  const n = y.length
  const half = Math.max(1, Math.round(win / 2))
  const out = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, i - half)
    const b = Math.min(n, i + half + 1)
    let s = 0
    for (let k = a; k < b; k++) s += y[k]
    out[i] = y[i] - s / (b - a)
  }
  return out
}

/**
 * Continuous wavelet transform with a Morlet wavelet, w0 = 6.
 *
 * Returns power normalised to its own maximum, as an array of rows, one per
 * period, ordered from the longest period to the shortest so it can be written
 * straight into a raster with the long periods on top.
 */
export function morletPower(t, y, { dt = 2, periods, trendWin = 60 } = {}) {
  const tEnd = t[t.length - 1]
  const grid = detrend(resample(t, y, dt, tEnd), Math.round(trendWin / dt))
  const n = grid.length
  const w0 = 6
  const rows = []
  for (const T of periods) {
    // Fourier period to Morlet scale
    const s = (T * (w0 + Math.sqrt(2 + w0 * w0))) / (4 * Math.PI) / dt
    const half = Math.min(n, Math.ceil(4 * s))
    const kr = new Float64Array(2 * half + 1)
    const ki = new Float64Array(2 * half + 1)
    for (let k = -half; k <= half; k++) {
      const u = k / s
      const env = Math.exp(-0.5 * u * u) / Math.sqrt(s)
      kr[k + half] = env * Math.cos(w0 * u)
      ki[k + half] = env * Math.sin(w0 * u)
    }
    const row = new Float64Array(n)
    for (let i = 0; i < n; i++) {
      let re = 0
      let im = 0
      for (let k = -half; k <= half; k++) {
        const j = i + k
        if (j < 0 || j >= n) continue
        re += grid[j] * kr[k + half]
        im += grid[j] * ki[k + half]
      }
      row[i] = re * re + im * im
    }
    rows.push(row)
  }
  // Normalise each period against its OWN median across the test, not against
  // the global maximum. Two reasons, and the second is the important one:
  // absolute power falls off steeply with period, so a global scale paints the
  // slowest periods bright everywhere and buries a short-period episode; and
  // "how far this rhythm stands above this recording's own background at that
  // period" is exactly the quantity the engine reports as clarity. So the
  // colour on the map means the same thing as the number in the payload.
  for (const r of rows) {
    const sorted = Array.from(r).sort((a, b) => a - b)
    const med = sorted[sorted.length >> 1] || 1e-12
    for (let i = 0; i < r.length; i++) r[i] = r[i] / med
  }
  let max = 0
  for (const r of rows) for (const v of r) if (v > max) max = v
  if (max > 0) for (const r of rows) for (let i = 0; i < r.length; i++) r[i] /= max
  return { rows, n, dt }
}

/** Log-spaced periods, longest first, matching the app's axis direction. */
export function logPeriods(lo, hi, count) {
  const a = Math.log(hi)
  const b = Math.log(lo)
  return Array.from({ length: count }, (_, i) => Math.exp(a + ((b - a) * i) / (count - 1)))
}

/** Build the raster: rows already ordered long period to short. */
export function rasterURI({ rows, n }, { gamma = 0.45 } = {}) {
  const h = rows.length
  const buf = Buffer.alloc(n * h * 3)
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < n; c++) {
      const [rr, gg, bb] = magma(Math.pow(rows[r][c], gamma))
      const o = (r * n + c) * 3
      buf[o] = rr
      buf[o + 1] = gg
      buf[o + 2] = bb
    }
  }
  return pngDataURI(buf, n, h)
}
