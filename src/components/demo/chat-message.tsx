'use client'

import { motion } from 'framer-motion'
import { RichText, Typewriter } from './demo-text'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

/**
 * A neutral mark for the agent. Not anybody's logo: a four-point spark, the
 * oldest way of drawing "this was generated".
 */
export function AgentGlyph({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <span
      className={`${className} shrink-0 rounded-md border border-demo-line2 bg-demo-raised grid place-items-center`}
    >
      <svg viewBox="0 0 12 12" className="w-3 h-3" aria-hidden="true">
        <path
          d="M6 0.6c.5 2.6 1.3 3.9 3.4 4.5 .8.2 1.4.4 2 .9-2.9.5-4.3 1.4-4.9 3.6-.2.7-.3 1.3-.5 1.8-.5-2.6-1.3-3.9-3.4-4.5-.8-.2-1.4-.4-2-.9 2.9-.5 4.3-1.4 4.9-3.6.2-.7.3-1.3.5-1.8Z"
          fill="currentColor"
          className="text-demo-dim"
        />
      </svg>
    </span>
  )
}

export function UserMessage({ text, instant }: { text: string; instant: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-xl border border-demo-line bg-demo-panel/70 px-4 py-3.5 sm:px-5"
    >
      <div className="flex gap-3">
        <span className="mt-[0.4rem] font-mono text-[13px] leading-none text-accent-fill/70">
          &gt;
        </span>
        <p className="text-[17px] leading-relaxed text-demo-ink">
          <Typewriter text={text} msPerChar={26} instant={instant} />
        </p>
      </div>
    </motion.div>
  )
}

export function AssistantMessage({
  text,
  showGlyph,
}: {
  text: string
  showGlyph: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex gap-3"
    >
      <div className="w-6 shrink-0">{showGlyph && <AgentGlyph />}</div>
      <p className="text-[14.5px] leading-relaxed text-demo-dim max-w-[62ch]">
        <RichText text={text} />
      </p>
    </motion.div>
  )
}
