'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { DemoEvent } from '@/content/demos/types'
import { ToolResult } from './tool-result'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

type ShellEvent = Extract<DemoEvent, { kind: 'shell' }>

/**
 * A command the agent runs in a shell rather than a tool it calls.
 *
 * This exists because of how Oxynet takes files: `create_upload` hands back a
 * one-shot URL and the bytes go from disk straight to the server, so the
 * recording never passes through the conversation. That is a selling point
 * and it only shows if the upload looks like what it is.
 */
export function ShellStep({ event, instant }: { event: ShellEvent; instant: boolean }) {
  const [done, setDone] = useState(instant)

  useEffect(() => {
    if (instant) return
    setDone(false)
    const timer = setTimeout(() => setDone(true), event.runMs)
    return () => clearTimeout(timer)
  }, [event.id, event.runMs, instant])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-xl border border-demo-line bg-demo-raised/45 px-4 py-3.5"
    >
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[12.5px] text-accent-fill/70">$</span>
        <p className="min-w-0 overflow-x-auto font-mono text-[11.5px] leading-relaxed text-demo-ink whitespace-pre">
          {event.command}
        </p>
      </div>

      {!done ? (
        <motion.p
          className="mt-2.5 font-mono text-[11px] text-demo-faint"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          uploading&hellip;
        </motion.p>
      ) : (
        <ToolResult payload={event.output} instant={instant} />
      )}
    </motion.div>
  )
}
