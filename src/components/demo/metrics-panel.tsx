'use client'

import { motion } from 'framer-motion'
import type { ChartSpec, Metric } from '@/content/demos/types'
import { Eyebrow } from './demo-text'
import { PhysiologicalChart } from './physiological-chart'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

/**
 * The answer, given the weight the answer deserves. Everything above this in
 * the transcript is the agent working; this is the measurement it came for.
 */
export function MetricsPanel({
  title,
  caption,
  metrics,
  chart,
  instant,
}: {
  title: string
  caption?: string
  metrics: Metric[]
  chart?: ChartSpec
  instant: boolean
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border border-demo-line2 bg-demo-panel"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-70"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, rgba(0,220,130,0.10) 0%, rgba(0,220,130,0) 70%)',
        }}
      />

      <div className="relative px-4 pt-4 sm:px-5 sm:pt-5">
        <Eyebrow>Result</Eyebrow>
        <h3 className="mt-1.5 text-[15px] font-medium text-demo-ink">{title}</h3>

        <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: EASE,
                delay: instant ? 0 : 0.25 + i * 0.16,
              }}
              className="rounded-lg border border-demo-line bg-demo-raised/40 px-3 py-2.5"
              style={
                // The tile borrows the colour of the boundary it names, so the
                // eye pairs it with the dashed line on the chart below.
                metric.color
                  ? { borderColor: `${metric.color}38`, background: `${metric.color}0d` }
                  : undefined
              }
            >
              <p
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-demo-faint"
                style={metric.color ? { color: metric.color } : undefined}
              >
                {metric.label}
              </p>
              <p className="mt-1.5 flex items-baseline gap-1 text-demo-ink">
                <span className="text-[22px] sm:text-[26px] font-medium leading-none tabular-nums tracking-tight">
                  {metric.value}
                </span>
              </p>
              {metric.unit && (
                <p className="mt-1 font-mono text-[10px] text-demo-dim">{metric.unit}</p>
              )}
              {metric.sub && (
                <p className="mt-0.5 font-mono text-[10px] text-demo-faint">{metric.sub}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {chart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: instant ? 0 : 0.5 }}
          className="relative mt-3 px-1 pb-1 sm:px-2"
        >
          <PhysiologicalChart spec={chart} instant={instant} />
        </motion.div>
      )}

      {caption && (
        <p className="relative px-4 pb-4 font-mono text-[10.5px] leading-relaxed text-demo-faint sm:px-5 sm:pb-5">
          {caption}
        </p>
      )}
    </motion.section>
  )
}
