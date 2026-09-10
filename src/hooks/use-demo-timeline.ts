'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { DemoEvent, DemoScript } from '@/content/demos/types'
import { totalDuration } from '@/content/demos/types'

export type TimelineStatus = 'waiting' | 'running' | 'finished'

export interface Timeline {
  /** Events revealed so far, in order. */
  visible: DemoEvent[]
  /** The one currently being revealed, for the chapter label. */
  current: DemoEvent | null
  status: TimelineStatus
  /** 0 to 1, driven by a rAF clock rather than the event cursor. */
  progress: number
  /** Increments on every replay. Key the stage with it to remount cleanly. */
  runId: number
  totalMs: number
  replay: () => void
}

/**
 * Walks a demo script on wall-clock timers.
 *
 * Deliberately dumb: it reveals event `i` at the sum of the durations before
 * it, and knows nothing about what an event contains. Components with internal
 * animation (the tool calls, the discovery list) are tuned to finish inside
 * their own `durationMs`.
 */
export function useDemoTimeline(script: DemoScript, enabled: boolean): Timeline {
  const [cursor, setCursor] = useState(-1)
  const [status, setStatus] = useState<TimelineStatus>('waiting')
  const [progress, setProgress] = useState(0)
  const [runId, setRunId] = useState(0)
  const frame = useRef<number | null>(null)

  const totalMs = totalDuration(script)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    setCursor(-1)
    setProgress(0)
    setStatus('running')

    let at = script.startDelayMs
    script.events.forEach((event, i) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) setCursor(i)
        }, at),
      )
      at += event.durationMs
    })
    timers.push(
      setTimeout(() => {
        if (!cancelled) setStatus('finished')
      }, at),
    )

    const startedAt = performance.now()
    const tick = () => {
      if (cancelled) return
      const elapsed = performance.now() - startedAt
      setProgress(Math.min(1, elapsed / at))
      if (elapsed < at) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [enabled, runId, script])

  const replay = useCallback(() => setRunId((n) => n + 1), [])

  return {
    visible: script.events.slice(0, cursor + 1),
    current: cursor >= 0 ? script.events[cursor] : null,
    status,
    progress,
    runId,
    totalMs,
    replay,
  }
}

/** True when the reader has asked the operating system for less motion. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
