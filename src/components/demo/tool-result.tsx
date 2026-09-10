'use client'

import { motion } from 'framer-motion'
import type { ToolResultPayload } from '@/content/demos/types'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

export function CheckGlyph({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden="true" fill="none">
      <path
        d="M2.5 6.3 4.8 8.6 9.5 3.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** What the server sent back, laid out as a returned payload rather than prose. */
export function ToolResult({
  payload,
  instant,
}: {
  payload: ToolResultPayload
  instant: boolean
}) {
  const tone = payload.status === 'ok' ? 'text-accent-fill' : 'text-warn'

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="mt-3 border-l border-demo-line2 pl-3.5"
    >
      <p className={`flex items-center gap-1.5 text-[13px] ${tone}`}>
        <CheckGlyph />
        {payload.headline}
      </p>

      {payload.lines.length > 0 && (
        <dl className="mt-2 space-y-1.5">
          {payload.lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: instant ? 0 : 0.12 + i * 0.09, duration: 0.3 }}
              className="flex flex-wrap items-baseline gap-x-3 font-mono text-[11.5px] leading-relaxed"
            >
              {line.kind === 'field' ? (
                <>
                  <dt className="w-[5.5rem] shrink-0 text-demo-faint">{line.label}</dt>
                  <dd className={line.accent ? 'text-accent-fill' : 'text-demo-dim'}>
                    {line.value}
                  </dd>
                </>
              ) : (
                <dd className="text-demo-faint italic">{line.text}</dd>
              )}
            </motion.div>
          ))}
        </dl>
      )}
    </motion.div>
  )
}
