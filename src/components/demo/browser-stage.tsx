'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { DemoEvent } from '@/content/demos/types'
import { SheetIcon } from './attachment'
import { Transit } from './transit'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

type DropEvent = Extract<DemoEvent, { kind: 'drop' }>
type TabsEvent = Extract<DemoEvent, { kind: 'tabs' }>

function UploadGlyph({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 transition-colors duration-300 ${
        active ? 'text-accent-fill' : 'text-demo-faint'
      }`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 15.5V4.5m0 0L8.2 8.3M12 4.5l3.8 3.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 14.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * The app's upload screen, as it really reads.
 *
 * Title, subtitle and the line underneath are the strings in
 * `ui/src/pages/Home.tsx` and `ui/src/components/ui/file-upload.tsx`. Somebody
 * who watches this and then opens app.oxynet.net should arrive somewhere they
 * recognise, which is the same reason the chart mirrors the app's VT view.
 */
export function DropZone({ event, instant }: { event: DropEvent; instant: boolean }) {
  const [landed, setLanded] = useState(instant)

  useEffect(() => {
    if (instant) {
      setLanded(true)
      return
    }
    setLanded(false)
    const timer = setTimeout(() => setLanded(true), event.landMs)
    return () => clearTimeout(timer)
  }, [event.id, event.landMs, instant])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="flex flex-col gap-3"
    >
      <motion.div
        animate={{
          borderColor: landed ? 'rgba(0,220,130,0.4)' : '#2b302f',
          backgroundColor: landed ? 'rgba(0,220,130,0.04)' : 'rgba(21,24,23,0.3)',
        }}
        transition={{ duration: 0.45, ease: EASE }}
        className="rounded-xl border border-dashed px-4 py-7"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <UploadGlyph active={landed} />
          <p className="text-[14px] font-medium text-demo-ink">{event.title}</p>
          <p className="font-mono text-[11px] text-demo-faint">{event.subtitle}</p>
        </div>

        {landed && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mx-auto mt-5 flex max-w-sm items-center gap-2.5 rounded-lg border border-demo-line2 bg-demo-raised/70 px-3 py-2"
          >
            <SheetIcon className="h-4 w-4 shrink-0 text-accent-fill" />
            <span className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-demo-ink">
              {event.filename}
            </span>
            <span className="shrink-0 rounded-md bg-demo-raised px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-demo-dim">
              {event.meta}
            </span>
          </motion.div>
        )}
      </motion.div>

      {event.note && (
        <p className="text-center font-mono text-[10px] text-demo-faint">{event.note}</p>
      )}
    </motion.div>
  )
}

/**
 * What the file can be taken to once it is in.
 *
 * The four tabs are the app's own (`ui/src/components/FileBar.tsx`), and they
 * are the quiet argument that thresholds are the entry point rather than the
 * product. Which of them a given recording can actually run depends on its
 * channels, so nothing here claims all four are available.
 */
export function TabBar({ event, instant }: { event: TabsEvent; instant: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="flex flex-col gap-3"
    >
      <div className="rounded-xl border border-demo-line bg-demo-raised/30 px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <SheetIcon className="h-3.5 w-3.5 shrink-0 text-accent-fill" />
          <span className="min-w-0 truncate font-mono text-[11px] text-demo-dim">
            {event.filename}
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {event.tabs.map((tab, i) => (
            <motion.span
              key={tab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: EASE,
                delay: instant ? 0 : 0.3 + i * 0.13,
              }}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors duration-500 ${
                tab === event.active
                  ? 'border-accent-fill/40 bg-accent-fill/[0.07] text-accent-fill'
                  : 'border-demo-line text-demo-faint'
              }`}
            >
              {tab}
            </motion.span>
          ))}
        </div>
      </div>

      {event.note && (
        <p className="text-center font-mono text-[10px] text-demo-faint">{event.note}</p>
      )}
    </motion.div>
  )
}

/** The crossing, on its own, for a demo with no code to run. */
export function TransitStep({
  event,
  instant,
}: {
  event: Extract<DemoEvent, { kind: 'transit' }>
  instant: boolean
}) {
  const [phase, setPhase] = useState<'out' | 'infer' | 'back' | 'done'>(
    instant ? 'done' : 'out'
  )

  useEffect(() => {
    if (instant) {
      setPhase('done')
      return
    }
    setPhase('out')
    const out = event.runMs * 0.3
    const infer = event.runMs * 0.45
    const timers = [
      setTimeout(() => setPhase('infer'), out),
      setTimeout(() => setPhase('back'), out + infer),
      setTimeout(() => setPhase('done'), event.runMs),
    ]
    return () => timers.forEach(clearTimeout)
  }, [event.id, event.runMs, instant])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <Transit
        phase={phase}
        from={event.from}
        to={event.to}
        fromGlyph={event.fromGlyph}
        inference={event.inference}
        captions={event.captions}
      />
    </motion.div>
  )
}
