'use client'

import { motion } from 'framer-motion'
import { DuckMark } from '@/components/shared/duck-mark'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

// The stage is dark whatever the site theme is doing, so the gradient is
// spelled out here rather than taken from `.gradient-text`, whose start colour
// flips to a dark green on a light page.
const GRADIENT = 'linear-gradient(120deg, #00dc82 0%, #47b98f 55%, #4f9fd8 100%)'
const CLIP = {
  backgroundImage: GRADIENT,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
} as const

function step(i: number, instant: boolean) {
  return {
    initial: { opacity: 0, y: instant ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay: instant ? 0 : 0.25 + i * 0.32 },
  }
}

/**
 * The reveal. The technical surface falls away and the claim is left standing
 * on its own, which is the only moment in the run that is advertising.
 */
export function FinalScreen({
  headline,
  accentWord,
  wordmark,
  channels,
  activeChannel,
  site,
  instant,
}: {
  headline: string
  accentWord?: string
  wordmark: string
  channels: string[]
  activeChannel?: string
  site: string
  instant: boolean
}) {
  const [head, tail] =
    accentWord && headline.endsWith(accentWord)
      ? [headline.slice(0, headline.length - accentWord.length), accentWord]
      : [headline, '']

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="absolute inset-0 z-20 grid place-items-center bg-demo-bg px-6 text-center"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 65% at 50% 42%, rgba(0,220,130,0.07) 0%, rgba(0,220,130,0) 68%)',
        }}
      />

      <div className="relative max-w-2xl">
        <motion.h2
          {...step(0, instant)}
          className="text-[clamp(1.5rem,4.6vw,2.75rem)] font-medium leading-[1.12] tracking-tight text-demo-ink"
        >
          {head}
          {tail && <span style={CLIP}>{tail}</span>}
        </motion.h2>

        <motion.div
          {...step(1, instant)}
          className="mt-10 flex items-center justify-center gap-2"
        >
          <DuckMark className="w-5 h-5 text-accent-fill" />
          <span className="font-mono text-base font-bold tracking-tight" style={CLIP}>
            {wordmark}
          </span>
        </motion.div>

        <motion.p
          {...step(2, instant)}
          className="mt-4 flex items-center justify-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em]"
        >
          {channels.map((channel, i) => (
            <span key={channel} className="flex items-center gap-2.5">
              {i > 0 && <span className="text-demo-line2">&middot;</span>}
              <span
                className={
                  channel === activeChannel ? 'text-accent-fill' : 'text-demo-faint'
                }
              >
                {channel}
              </span>
            </span>
          ))}
        </motion.p>

        <motion.div {...step(3, instant)} className="mt-9">
          <span className="mx-auto mb-5 block h-px w-16 bg-demo-line2" />
          <a
            href={`https://www.${site}`}
            className="font-mono text-xs text-demo-dim transition-colors hover:text-accent-fill"
          >
            {site}
          </a>
        </motion.div>
      </div>
    </motion.div>
  )
}
