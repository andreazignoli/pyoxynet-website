'use client'

import { motion } from 'framer-motion'
import type { DemoEvent } from '@/content/demos/types'
import { Eyebrow } from './demo-text'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

type TableEvent = Extract<DemoEvent, { kind: 'table' }>

/**
 * Rows landing in the caller's own store.
 *
 * This is the payoff of the API demo and the thing the MCP demo cannot show: a
 * cohort going through the engine and coming out as records someone else owns.
 * Rows arrive one at a time because a table that appears whole reads as a
 * mockup, and one that fills in reads as a job running.
 */
export function ResultTable({
  event,
  instant,
}: {
  event: TableEvent
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
        className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-70"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, rgba(0,220,130,0.09) 0%, rgba(0,220,130,0) 70%)',
        }}
      />

      <div className="relative px-4 pt-4 sm:px-5 sm:pt-5">
        <Eyebrow>Your database</Eyebrow>
        <h3 className="mt-1.5 text-[15px] font-medium text-demo-ink">{event.title}</h3>
      </div>

      <div className="relative mt-3 overflow-x-auto demo-scroll px-4 pb-1 sm:px-5">
        <table className="w-full min-w-[26rem] border-collapse text-left">
          <thead>
            <tr>
              {event.columns.map((col) => (
                <th
                  key={col}
                  className="border-b border-demo-line pb-1.5 pr-3 font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-demo-faint last:pr-0"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {event.rows.map((row, r) => (
              <motion.tr
                key={row[0] ?? r}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  ease: EASE,
                  delay: instant ? 0 : 0.25 + r * 0.16,
                }}
              >
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className={`border-b border-demo-line/60 py-1.5 pr-3 font-mono text-[11.5px] tabular-nums last:pr-0 ${
                      c === 0 ? 'text-demo-ink' : 'text-demo-dim'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {event.caption && (
        <p className="relative px-4 pb-4 pt-3 font-mono text-[10.5px] leading-relaxed text-demo-faint sm:px-5 sm:pb-5">
          {event.caption}
        </p>
      )}
    </motion.section>
  )
}
