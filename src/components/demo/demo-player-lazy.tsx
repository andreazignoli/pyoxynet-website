'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import type { DemoScript } from '@/content/demos/types'

/**
 * The demo, kept off the critical path.
 *
 * The player pulls in Framer Motion, the chart, the timeline and the whole
 * script: about 32 kB of parse on a page that is already heavy, for a section
 * that is several screens below the fold and does not start animating until it
 * is scrolled to. Measured on the landing page at 4x CPU throttle, having it in
 * the initial bundle cost about 85 ms of first contentful paint.
 *
 * So it is fetched only once the reader is within 600 px of it, which on any
 * real scroll is well before they arrive. Until then the box below holds the
 * space, so nothing shifts when the real thing swaps in.
 */
const DemoPlayer = dynamic(() => import('./demo-player').then((m) => m.DemoPlayer), {
  ssr: false,
})

/**
 * Holds the window's footprint while the chunk is in flight. The heights mirror
 * the player's own chrome; if that changes, this drifts, but the swap happens
 * 600 px off-screen so a few pixels of drift are never seen.
 */
function PlayerSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="rounded-[1.05rem] bg-gradient-to-b from-white/[0.11] via-white/[0.045] to-white/[0.02] p-px shadow-[0_40px_90px_-50px_rgba(0,0,0,0.95)]">
        <div className="overflow-hidden rounded-2xl bg-demo-bg">
          <div className="h-[2.7rem] border-b border-demo-line" />
          <div className="h-[clamp(24rem,62vh,37rem)]" />
          <div className="h-[2.6rem] border-t border-demo-line" />
        </div>
      </div>
      <div className="mt-3 h-8" />
    </div>
  )
}

export function DemoPlayerLazy({
  script,
  className,
}: {
  script: DemoScript
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '600px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {near ? <DemoPlayer script={script} /> : <PlayerSkeleton />}
    </div>
  )
}
