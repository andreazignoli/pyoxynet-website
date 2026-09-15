'use client'

import { motion } from 'framer-motion'

export type Phase = 'out' | 'infer' | 'back' | 'done'

/** The caller, when the caller is a script. */
function TerminalGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <rect
        x="1.6"
        y="3.2"
        width="16.8"
        height="13.6"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M1.6 7h16.8" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="m5.6 10.4 2 1.9-2 1.9M9.8 14.2h4.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** The caller, when the caller is a person in a browser. */
function BrowserGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <rect
        x="1.6"
        y="3.2"
        width="16.8"
        height="13.6"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M1.6 7.4h16.8" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4.5" cy="5.3" r="0.75" fill="currentColor" />
      <circle cx="7" cy="5.3" r="0.75" fill="currentColor" />
      <circle cx="9.5" cy="5.3" r="0.75" fill="currentColor" />
    </svg>
  )
}

/** Where it goes. */
function CloudGlyph() {
  return (
    <svg viewBox="0 0 24 18" className="h-[18px] w-[22px]" fill="none" aria-hidden="true">
      <path
        d="M6.6 15.2h11.1a3.9 3.9 0 0 0 .5-7.8 5.6 5.6 0 0 0-10.6-1.5 4.35 4.35 0 0 0-1 9.3Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** What happens there. */
function ModelGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <rect x="6" y="6" width="8" height="8" rx="1.3" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8.3 2.6v3.2M11.7 2.6v3.2M8.3 14.2v3.2M11.7 14.2v3.2M2.6 8.3h3.2M2.6 11.7h3.2M14.2 8.3h3.2M14.2 11.7h3.2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Node({
  children,
  label,
  active,
  ring,
}: {
  children: React.ReactNode
  label: string
  active: boolean
  ring?: boolean
}) {
  return (
    <div className="flex w-[4.5rem] shrink-0 flex-col items-center gap-1.5">
      <span
        className={`relative grid h-10 w-10 place-items-center rounded-xl border transition-colors duration-500 ${
          active
            ? 'border-accent-fill/45 bg-accent-fill/[0.07] text-accent-fill'
            : 'border-demo-line2 bg-demo-raised/50 text-demo-faint'
        }`}
      >
        {ring && (
          <span className="absolute inset-0 rounded-xl border border-accent-fill/50 animate-signal-pulse" />
        )}
        {children}
      </span>
      <span
        className={`text-center font-mono text-[9.5px] leading-tight transition-colors duration-500 ${
          active ? 'text-accent-fill' : 'text-demo-faint'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

/**
 * The payload crossing to the engine and the answer coming back, as a diagram.
 *
 * A line with dots on it was not enough: nothing on screen said cloud, and
 * nothing said inference, so the viewer had to be told in words what the
 * picture should have shown. Two nodes and a labelled track say it without the
 * caption, and the far node swaps its cloud for a model while the model is what
 * is working, which is the one moment worth spelling out.
 *
 * Packets rather than a card carrying the JSON: a card wide enough to hold the
 * body is most of the track, so it never reads as travelling. Dots do, and they
 * leave the body sitting still above where it can be read.
 */
export function Transit({
  phase,
  from = 'your machine',
  to = 'Oxynet',
  fromGlyph = 'terminal',
  inference,
  captions,
}: {
  phase: Phase
  from?: string
  to?: string
  fromGlyph?: 'terminal' | 'browser'
  inference?: string
  captions?: { out: string; infer: string; back: string }
}) {
  const moving = phase === 'out' || phase === 'back'
  const forward = phase === 'out'
  const says = captions ?? {
    out: 'the recording handle goes up',
    infer: 'the models decide the physiology',
    back: 'the measurements come back',
  }

  return (
    <div className="rounded-xl border border-demo-line bg-demo-raised/25 px-3 py-3">
      <div className="flex items-start justify-between gap-2">
        <Node label={from} active={forward}>
          {fromGlyph === 'browser' ? <BrowserGlyph /> : <TerminalGlyph />}
        </Node>

        <div className="relative mt-[1.15rem] h-4 flex-1">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-demo-line2" />

          {moving &&
            [0, 1, 2, 3].map((i) => (
              <motion.span
                key={`${phase}-${i}`}
                className="absolute top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full bg-accent-fill"
                initial={{ left: forward ? '0%' : '97%', opacity: 0 }}
                animate={{
                  left: forward ? ['0%', '97%'] : ['97%', '0%'],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 1.05,
                  delay: i * 0.13,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              />
            ))}
        </div>

        <Node
          label={phase === 'infer' ? (inference ?? 'inference') : to}
          active={phase !== 'out'}
          ring={phase === 'infer'}
        >
          {phase === 'infer' ? <ModelGlyph /> : <CloudGlyph />}
        </Node>
      </div>

      <p className="mt-2.5 text-center font-mono text-[10px] text-demo-faint">
        {phase === 'out' && says.out}
        {phase === 'infer' && says.infer}
        {phase === 'back' && says.back}
      </p>
    </div>
  )
}
