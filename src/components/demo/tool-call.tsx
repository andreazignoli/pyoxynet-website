'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { DemoEvent, ToolInvoker, ToolResultPayload } from '@/content/demos/types'
import { formatToolInput } from '@/lib/demo-invoker'
import { CheckGlyph, ToolResult } from './tool-result'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

type ToolCallEvent = Extract<DemoEvent, { kind: 'tool-call' }>

/**
 * One agent tool call, from issue to answer.
 *
 * The component does not know the answer. It calls the injected `invoke` and
 * waits, which is why the same component works against a live MCP client: the
 * running state, the elapsed clock and the rail status all key off the promise
 * rather than off the script.
 */
export function ToolCall({
  event,
  namespace,
  invoke,
  onStatus,
  instant,
}: {
  event: ToolCallEvent
  namespace: string
  invoke: ToolInvoker
  onStatus: (tool: string, status: 'running' | 'done') => void
  instant: boolean
}) {
  const [payload, setPayload] = useState<ToolResultPayload | null>(null)
  const [failed, setFailed] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [step, setStep] = useState(-1)
  const startedAt = useRef(0)

  useEffect(() => {
    let live = true
    startedAt.current = performance.now()
    onStatus(event.tool, 'running')

    invoke({ callId: event.id, tool: event.tool, input: event.input })
      .then((result) => {
        if (!live) return
        setElapsed(performance.now() - startedAt.current)
        setPayload(result)
        onStatus(event.tool, 'done')
      })
      .catch(() => {
        if (live) setFailed(true)
      })

    return () => {
      live = false
    }
    // The call is issued once, when the event enters the transcript.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id])

  // A live millisecond clock while the call is in flight. Small detail, but it
  // is the difference between a mock and something that looks like it ran.
  useEffect(() => {
    if (payload || failed) return
    const timer = setInterval(() => setElapsed(performance.now() - startedAt.current), 60)
    return () => clearInterval(timer)
  }, [payload, failed])

  // Progress lines, paced to land just before the answer does.
  useEffect(() => {
    const steps = event.steps
    if (!steps || steps.length === 0) return
    if (instant) {
      setStep(steps.length - 1)
      return
    }
    const gap = event.latencyMs / (steps.length + 0.5)
    setStep(0)
    let i = 0
    const timer = setInterval(() => {
      i += 1
      if (i >= steps.length) clearInterval(timer)
      else setStep(i)
    }, gap)
    return () => clearInterval(timer)
  }, [event.steps, event.latencyMs, instant])

  const pending = !payload && !failed

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-xl border border-demo-line bg-demo-raised/45 px-4 py-3.5"
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[12.5px] min-w-0 truncate">
          <span className="text-accent-fill/70 mr-1.5">&rarr;</span>
          <span className="text-demo-faint">{namespace}.</span>
          <span className="text-demo-ink">{event.tool}</span>
        </p>
        <span
          className={`font-mono text-[10px] tabular-nums shrink-0 ${
            pending ? 'text-demo-faint' : 'text-demo-faint/70'
          }`}
        >
          {Math.round(elapsed)} ms
        </span>
      </div>

      <pre className="mt-2.5 overflow-x-auto font-mono text-[11.5px] leading-relaxed text-demo-dim/85">
        {formatToolInput(event.input)}
      </pre>

      {event.steps && event.steps.length > 0 && (
        <ul className="mt-2.5 space-y-1">
          <AnimatePresence>
            {event.steps.slice(0, step + 1).map((label, i) => {
              const done = i < step || !pending
              return (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: done ? 0.55 : 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="flex items-center gap-2 font-mono text-[11px] text-demo-faint"
                >
                  {done ? (
                    <CheckGlyph className="w-2.5 h-2.5 text-accent-fill/70 shrink-0" />
                  ) : (
                    <motion.span
                      className="block w-2.5 shrink-0 text-center text-accent-fill/70"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      &middot;
                    </motion.span>
                  )}
                  {label}
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      )}

      {payload && <ToolResult payload={payload} instant={instant} />}
      {failed && (
        <p className="mt-3 border-l border-demo-line2 pl-3.5 font-mono text-[11.5px] text-warn">
          Call did not return.
        </p>
      )}
    </motion.div>
  )
}
