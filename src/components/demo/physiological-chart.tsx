'use client'

import { motion } from 'framer-motion'
import { useId, useMemo } from 'react'
import type { ChartSpec } from '@/content/demos/types'

const W = 560
const H = 278
const PAD = { left: 44, right: 18 }

// Two stacked panels sharing one VO2 axis: the measured signal on top, what the
// model made of it underneath.
const SCATTER = { top: 26, bottom: 172 }
const PROB = { top: 192, bottom: 250 }

// The app's chart furniture, matched rather than reinvented: dashed grid on
// #3d3d3d, ticks #a1a1a1, axis titles #c4c4c4. See ui/src/components/
// CpetScatterChart.tsx in the interpreter repo.
const GRID = '#3d3d3d'
const TICK = '#a1a1a1'
const AXIS = '#c4c4c4'

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

/**
 * The measurement and the decision behind it, stacked.
 *
 * Top: breath-by-breath VE against VO2, every point coloured by the domain the
 * model puts it in. No fitted line, because there isn't one: the thresholds do
 * not come from a regression a reader could have drawn themselves, which is
 * the whole reason the agent calls the models instead of eyeballing the trace.
 *
 * Bottom: the zone probabilities, un-stacked, each running 0 to 100 per cent
 * independently, exactly as `ProbabilityTraceChart` draws them in the app.
 * That panel is why the two are stacked: **the crossings are the thresholds.**
 * Moderate meets heavy at VT1, heavy meets severe at VT2, and the dashed lines
 * run through both panels so the eye connects the colour of a breath above
 * with the probability that coloured it below.
 *
 * The numbers are the same numbers: one probability function feeds the point
 * colours and the traces, so the picture cannot contradict itself.
 */
function buildModel(spec: ChartSpec) {
  const start = spec.vo2Start
  const peak = spec.vo2Peak
  const bounds = spec.markers.map((m) => m.vo2)
  const [vt1, vt2] = [bounds[0] ?? 0, bounds[1] ?? 0]

  // Ventilatory equivalents either side of each break. Ordinary values for a
  // ramp test: VE rises with VO2, faster above VT1, faster again above VT2.
  const s1 = 17
  const s2 = 30
  const s3 = 52
  const base = 11

  const ve = (v: number) => {
    if (v <= vt1) return base + s1 * (v - start)
    if (v <= vt2) return base + s1 * (vt1 - start) + s2 * (v - vt1)
    return base + s1 * (vt1 - start) + s2 * (vt2 - vt1) + s3 * (v - vt2)
  }

  const yMax = ve(peak) * 1.14
  const x = (v: number) =>
    PAD.left + ((v - start) / (peak - start)) * (W - PAD.left - PAD.right)
  const y = (value: number) =>
    SCATTER.bottom - (value / yMax) * (SCATTER.bottom - SCATTER.top)
  const yProb = (p: number) => PROB.bottom - p * (PROB.bottom - PROB.top)

  const fract = (n: number) => {
    const s = Math.sin(n * 12.9898) * 43758.5453
    return s - Math.floor(s)
  }

  // Domain membership, soft around each boundary. One function, used both to
  // colour a breath and to draw the trace under it, so the two panels cannot
  // disagree. The width is a compromise: tight enough that most breaths take a
  // domain colour cleanly, wide enough that the probability curves below still
  // look like a model deciding rather than a switch flipping.
  const rgb = spec.domains.map((d) => hexToRgb(d.color))
  const width = (peak - start) * 0.042
  const ramp = (v: number, at: number) => 1 / (1 + Math.exp(-(v - at) / width))

  const probsAt = (v: number) => {
    const above1 = bounds[0] != null ? ramp(v, bounds[0]) : 0
    const above2 = bounds[1] != null ? ramp(v, bounds[1]) : 0
    return [1 - above1, above1 - above2, above2]
  }

  const colorAt = (v: number) => {
    const p = probsAt(v)
    const mix = (k: 'r' | 'g' | 'b') =>
      Math.round(rgb.reduce((sum, c, i) => sum + (p[i] ?? 0) * c[k], 0))
    return `rgb(${mix('r')},${mix('g')},${mix('b')})`
  }

  // Deterministic scatter, so the picture is identical on every replay and on
  // the server. Breath-by-breath data is noisy, and with no fitted line over
  // the top the points have to carry both the shape and the domain colour on
  // their own, which is why they are drawn nearly opaque.
  const N = 150
  const points = Array.from({ length: N }, (_, i) => {
    const v = start + ((peak - start) * i) / (N - 1)
    const spread = 1.7 + 4.2 * ((v - start) / (peak - start))
    return {
      cx: x(v + (fract(i * 1.7) - 0.5) * 0.02),
      cy: y(ve(v) + (fract(i) - 0.5) * 2 * spread),
      fill: colorAt(v),
    }
  })

  // The probability traces. A little deterministic wobble, because a model
  // output is not a textbook logistic, kept far too small to shift a crossing.
  const STEPS = 90
  const traces = spec.domains.map((domain, d) => {
    const pts = Array.from({ length: STEPS + 1 }, (_, k) => {
      const v = start + ((peak - start) * k) / STEPS
      const wobble = (fract(k * (d + 3) * 2.3) - 0.5) * 0.036
      const p = Math.min(1, Math.max(0, (probsAt(v)[d] ?? 0) + wobble))
      return { px: x(v), py: yProb(p) }
    })
    const line = pts.map((p, k) => `${k === 0 ? 'M' : 'L'}${p.px.toFixed(1)},${p.py.toFixed(1)}`)
    return {
      color: domain.color,
      label: domain.label,
      line: line.join(' '),
      area: `${line.join(' ')} L${pts[pts.length - 1].px.toFixed(1)},${PROB.bottom} L${pts[0].px.toFixed(1)},${PROB.bottom} Z`,
    }
  })

  // The bands behind the scatter, and where each domain's name sits.
  const edges = [start, ...bounds, peak]
  const bands = spec.domains.map((domain, i) => ({
    color: domain.color,
    label: domain.label,
    from: edges[i],
    to: edges[i + 1],
    midX: x((edges[i] + edges[i + 1]) / 2),
  }))

  // Round gridlines to a step a physiologist would have chosen, rather than to
  // quarters of whatever the peak happens to be.
  const step = [5, 10, 20, 25, 50, 100].find((s) => s >= yMax / 4) ?? 100
  const gridValues: number[] = []
  for (let value = step; value <= yMax; value += step) gridValues.push(value)

  return { ve, x, y, yProb, points, traces, bands, gridValues, yMax, start, peak }
}

export function PhysiologicalChart({
  spec,
  instant,
}: {
  spec: ChartSpec
  instant: boolean
}) {
  const uid = useId().replace(/:/g, '')
  const m = useMemo(() => buildModel(spec), [spec])

  const xTicks = useMemo(() => {
    const ticks: number[] = []
    for (let v = Math.ceil(m.start * 2) / 2; v <= m.peak; v += 0.5) ticks.push(v)
    return ticks.filter((v) => v >= m.start + 0.2)
  }, [m])

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label={`Breath-by-breath ventilation against oxygen uptake, coloured by intensity domain, above the zone probabilities that produced it. The probability curves cross at ${spec.markers
        .map((mk) => `${mk.label}, ${mk.vo2} litres per minute`)
        .join(' and ')}.`}
    >
      <defs>
        {m.bands.map((band, i) => (
          <linearGradient key={i} id={`band-${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={band.color} stopOpacity="0.09" />
            <stop offset="100%" stopColor={band.color} stopOpacity="0.01" />
          </linearGradient>
        ))}
      </defs>

      {/* The three intensity domains, behind the breaths */}
      {m.bands.map((band, i) => (
        <motion.g
          key={band.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: instant ? 0 : 0.5, delay: instant ? 0 : 0.1 + i * 0.12 }}
        >
          <rect
            x={m.x(band.from)}
            y={SCATTER.top}
            width={m.x(band.to) - m.x(band.from)}
            height={SCATTER.bottom - SCATTER.top}
            fill={`url(#band-${uid}-${i})`}
          />
          <text
            x={band.midX}
            y={SCATTER.top - 9}
            textAnchor="middle"
            fill={band.color}
            fillOpacity="0.75"
            className="font-mono"
            fontSize="8.5"
            letterSpacing="0.12em"
          >
            {band.label.toUpperCase()}
          </text>
        </motion.g>
      ))}

      {/* Grid, upper panel */}
      {m.gridValues.map((value) => (
        <g key={value}>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={m.y(value)}
            y2={m.y(value)}
            stroke={GRID}
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text
            x={PAD.left - 9}
            y={m.y(value) + 3.5}
            textAnchor="end"
            fill={TICK}
            className="font-mono"
            fontSize="9"
          >
            {value}
          </text>
        </g>
      ))}
      <text
        x={-(SCATTER.top + SCATTER.bottom) / 2}
        y={11}
        transform="rotate(-90)"
        textAnchor="middle"
        fill={AXIS}
        className="font-mono"
        fontSize="9"
      >
        {spec.yLabel}
      </text>

      {/* Grid, lower panel */}
      {[0, 0.5, 1].map((p) => (
        <g key={p}>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={m.yProb(p)}
            y2={m.yProb(p)}
            stroke={GRID}
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text
            x={PAD.left - 9}
            y={m.yProb(p) + 3.5}
            textAnchor="end"
            fill={TICK}
            className="font-mono"
            fontSize="9"
          >
            {p * 100}%
          </text>
        </g>
      ))}
      <text
        x={-(PROB.top + PROB.bottom) / 2}
        y={11}
        transform="rotate(-90)"
        textAnchor="middle"
        fill={AXIS}
        className="font-mono"
        fontSize="9"
      >
        P(zone)
      </text>

      {/* Shared VO2 axis */}
      <line
        x1={PAD.left}
        x2={W - PAD.right}
        y1={PROB.bottom}
        y2={PROB.bottom}
        stroke={GRID}
        strokeWidth="1"
      />
      {xTicks.map((v) => (
        <text
          key={v}
          x={m.x(v)}
          y={PROB.bottom + 14}
          textAnchor="middle"
          fill={TICK}
          className="font-mono"
          fontSize="9"
        >
          {v.toFixed(1)}
        </text>
      ))}
      <text
        x={W - PAD.right}
        y={H - 4}
        textAnchor="end"
        fill={AXIS}
        className="font-mono"
        fontSize="9"
      >
        {spec.xLabel}
      </text>

      {/* Every breath, coloured by the domain the model put it in */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: instant ? 0 : 1.2, delay: instant ? 0 : 0.25 }}
      >
        {m.points.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r="1.9" fill={p.fill} fillOpacity="0.95" />
        ))}
      </motion.g>

      {/* The zone probabilities. Their crossings are the thresholds. */}
      {m.traces.map((trace, i) => (
        <motion.g
          key={trace.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: instant ? 0 : 0.6, delay: instant ? 0 : 0.9 + i * 0.12 }}
        >
          <path d={trace.area} fill={trace.color} fillOpacity="0.22" />
          <motion.path
            d={trace.line}
            fill="none"
            stroke={trace.color}
            strokeWidth="1.6"
            strokeLinecap="round"
            initial={{ pathLength: instant ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: instant ? 0 : 1.3,
              delay: instant ? 0 : 0.9 + i * 0.12,
              ease: 'linear',
            }}
          />
        </motion.g>
      ))}

      {/* Thresholds, drawn through both panels so the connection is visible */}
      {spec.markers.map((marker, i) => {
        const cx = m.x(marker.vo2)
        const delay = instant ? 0 : 1.7 + i * 0.35
        return (
          <motion.g
            key={marker.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay }}
          >
            <line
              x1={cx}
              x2={cx}
              y1={SCATTER.top}
              y2={PROB.bottom}
              stroke={marker.color}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx={cx} cy={m.yProb(0.5)} r="6" fill={marker.color} fillOpacity="0.16" />
            <circle cx={cx} cy={m.yProb(0.5)} r="2.6" fill={marker.color} />
            <text
              x={cx + 5}
              y={SCATTER.bottom - 6}
              textAnchor="start"
              fill={marker.color}
              className="font-mono"
              fontSize="10"
              letterSpacing="0.06em"
            >
              {marker.label}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}
