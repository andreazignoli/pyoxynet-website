'use client'

import { motion } from 'framer-motion'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

/** A spreadsheet, which is what a CPET export usually arrives as. */
export function SheetIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path
        d="M3.4 1.6h6.1L13 5.1v9.3H3.4z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M9.3 1.7v3.5H12.8" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M5.3 8.4h5.4M5.3 11h5.4M8 8.4V11" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

/**
 * The attach beat: the plus is pressed, the file lands, and a moment later the
 * chip turns up in the header. Two separate animations rather than one flying
 * element, because a shared-layout transition out of a scrolling transcript is
 * fragile for the sake of a detail nobody is looking straight at.
 */
export function AttachRow({
  filename,
  meta,
  instant,
}: {
  filename: string
  meta: string
  instant: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex items-center gap-3"
    >
      <motion.span
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-demo-line2 text-demo-dim"
        animate={
          instant
            ? {}
            : {
                scale: [1, 0.88, 1],
                borderColor: ['#2b302f', 'rgba(0,220,130,0.55)', '#2b302f'],
                color: ['#9aa2a0', '#00dc82', '#9aa2a0'],
              }
        }
        transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
      >
        <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden="true">
          <path
            d="M7 2.6v8.8M2.6 7h8.8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </motion.span>

      <motion.span
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: instant ? 0 : 0.6 }}
        className="flex min-w-0 items-center gap-2 rounded-lg border border-demo-line bg-demo-raised/60 px-2.5 py-1.5"
      >
        <SheetIcon className="h-3.5 w-3.5 shrink-0 text-accent-fill" />
        <span className="truncate font-mono text-[11.5px] text-demo-ink">{filename}</span>
        <span className="shrink-0 font-mono text-[10px] text-demo-faint">{meta}</span>
      </motion.span>
    </motion.div>
  )
}

/** The same file, parked in the header for the rest of the run. */
export function AttachChip({ filename }: { filename: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: EASE, delay: 0.75 }}
      className="flex min-w-0 items-center gap-1.5 rounded-md border border-demo-line2 bg-demo-raised/70 px-2 py-1"
    >
      <SheetIcon className="h-3 w-3 shrink-0 text-accent-fill" />
      <span className="truncate font-mono text-[10px] text-demo-dim">{filename}</span>
    </motion.span>
  )
}
