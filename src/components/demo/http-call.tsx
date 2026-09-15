'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { DemoEvent, ToolInvoker, ToolResultPayload } from '@/content/demos/types'
import { ToolResult } from './tool-result'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

type HttpEvent = Extract<DemoEvent, { kind: 'http' }>

const METHOD_TONE: Record<string, string> = {
  GET: 'text-[#4f9fd8]',
  POST: 'text-accent-fill',
  DELETE: 'text-warn',
}

/**
 * One request against the REST API.
 *
 * Deliberately the same shape as a tool call: the request goes out through the
 * injected `invoke`, the component waits, and the status and elapsed time key
 * off the promise. The API demo and the MCP demo are the same engine reached
 * two ways, and the page should feel that rather than assert it.
 */
export function HttpCall({
  event,
  invoke,
  onResolved,
  instant,
}: {
  event: HttpEvent
  invoke: ToolInvoker
  onResolved?: () => void
  instant: boolean
}) {
  const [payload, setPayload] = useState<ToolResultPayload | null>(null)
  const [failed, setFailed] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startedAt = useRef(0)

  useEffect(() => {
    let live = true
    startedAt.current = performance.now()

    invoke({ callId: event.id, tool: `${event.method} ${event.path}`, input: {} })
      .then((result) => {
        if (!live) return
        setElapsed(performance.now() - startedAt.current)
        setPayload(result)
        onResolved?.()
      })
      .catch(() => {
        if (live) setFailed(true)
      })

    return () => {
      live = false
    }
    // Issued once, when the request enters the transcript.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id])

  useEffect(() => {
    if (payload || failed) return
    const timer = setInterval(() => setElapsed(performance.now() - startedAt.current), 60)
    return () => clearInterval(timer)
  }, [payload, failed])

  const pending = !payload && !failed

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-xl border border-demo-line bg-demo-raised/45 px-4 py-3.5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="min-w-0 truncate font-mono text-[12.5px]">
          <span className={`mr-2 font-medium ${METHOD_TONE[event.method] ?? 'text-demo-dim'}`}>
            {event.method}
          </span>
          <span className="text-demo-ink">{event.path}</span>
        </p>
        <span className="shrink-0 font-mono text-[10px] tabular-nums text-demo-faint">
          {pending ? (
            `${Math.round(elapsed)} ms`
          ) : (
            <>
              <span className="text-accent-fill">{event.status}</span>{' '}
              {Math.round(elapsed)} ms
            </>
          )}
        </span>
      </div>

      {event.body && (
        <pre className="mt-2.5 overflow-x-auto font-mono text-[11.5px] leading-relaxed text-demo-dim/85">
          {event.body}
        </pre>
      )}

      {payload && <ToolResult payload={payload} instant={instant} />}
      {failed && (
        <p className="mt-3 border-l border-demo-line2 pl-3.5 font-mono text-[11.5px] text-warn">
          Request did not return.
        </p>
      )}
    </motion.div>
  )
}
