'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { DemoEvent } from '@/content/demos/types'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

type CodeEvent = Extract<DemoEvent, { kind: 'code' }>
type RunEvent = Extract<DemoEvent, { kind: 'run' }>

/**
 * github-dark, approximated.
 *
 * The site's static code blocks use Shiki on github-dark-DIMMED, and the first
 * cut of this used the same values. On the near-black demo stage at 13px, in
 * something people watch rather than read, dimmed is exactly the wrong word:
 * the block came out grey and low-energy next to the response panel. These are
 * the brighter github-dark tones.
 *
 * Shiki itself is not an option here. It returns HTML for a finished string,
 * and this code arrives a character at a time, so the tokens have to survive
 * being sliced.
 */
const TONE = {
  plain: '#c9d1d9',
  comment: '#8b949e',
  keyword: '#ff7b72',
  string: '#a5d6ff',
  number: '#79c0ff',
  fn: '#d2a8ff',
  prop: '#79c0ff',
  punct: '#8b949e',
}

type Token = { text: string; tone: string }

const KEYWORDS =
  /^(const|let|var|await|async|function|return|import|export|from|new|if|else|for|of|in|true|false|null|undefined|throw|try|catch)$/

/**
 * A small scanner, not a parser. It only has to be right about the snippets in
 * the scripts, and being wrong is a colour, not a crash.
 */
function tokenize(src: string, json: boolean): Token[] {
  const out: Token[] = []
  let i = 0

  const push = (text: string, tone: string) => out.push({ text, tone })

  while (i < src.length) {
    const rest = src.slice(i)

    const ws = /^\s+/.exec(rest)
    if (ws) {
      push(ws[0], TONE.plain)
      i += ws[0].length
      continue
    }

    const comment = /^\/\/[^\n]*/.exec(rest)
    if (!json && comment) {
      push(comment[0], TONE.comment)
      i += comment[0].length
      continue
    }

    const str = /^(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/.exec(rest)
    if (str) {
      // In JSON a string followed by a colon is a key, which reads better in
      // the key colour than in the value colour.
      const isKey = json && /^\s*:/.test(rest.slice(str[0].length))
      push(str[0], isKey ? TONE.prop : TONE.string)
      i += str[0].length
      continue
    }

    const num = /^-?\d+(?:\.\d+)?/.exec(rest)
    if (num) {
      push(num[0], TONE.number)
      i += num[0].length
      continue
    }

    const word = /^[A-Za-z_$][\w$]*/.exec(rest)
    if (word) {
      const after = rest.slice(word[0].length)
      const tone = KEYWORDS.test(word[0])
        ? TONE.keyword
        : /^\s*\(/.test(after)
          ? TONE.fn
          : /^\s*:/.test(after)
            ? TONE.prop
            : TONE.plain
      push(word[0], tone)
      i += word[0].length
      continue
    }

    push(src[i], TONE.punct)
    i += 1
  }

  return out
}

function sliceTokens(tokens: Token[], chars: number): Token[] {
  const out: Token[] = []
  let left = chars
  for (const t of tokens) {
    if (left <= 0) break
    if (t.text.length <= left) {
      out.push(t)
      left -= t.text.length
    } else {
      out.push({ ...t, text: t.text.slice(0, left) })
      left = 0
    }
  }
  return out
}

function toLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]]
  for (const t of tokens) {
    const parts = t.text.split('\n')
    parts.forEach((part, k) => {
      if (k > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ ...t, text: part })
    })
  }
  return lines
}

function Gutter({ n }: { n: number }) {
  return (
    <span className="w-6 shrink-0 select-none pr-3 text-right font-mono text-[11.5px] leading-[1.75] text-demo-line2">
      {n}
    </span>
  )
}

function Lines({
  tokens,
  caret,
  startLine = 1,
}: {
  tokens: Token[]
  caret: boolean
  startLine?: number
}) {
  const lines = toLines(tokens)
  return (
    <div className="font-mono text-[13px] leading-[1.75]">
      {lines.map((line, n) => (
        <div key={n} className="flex">
          <Gutter n={startLine + n} />
          <span className="min-w-0 whitespace-pre-wrap break-words">
            {line.map((t, k) => (
              <span key={k} style={{ color: t.tone }}>
                {t.text}
              </span>
            ))}
            {caret && n === lines.length - 1 && (
              <span className="ml-px inline-block h-[0.95em] w-[0.5em] -mb-[0.1em] animate-caret bg-accent-fill" />
            )}
          </span>
        </div>
      ))}
    </div>
  )
}

function FileTab({ filename }: { filename: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-demo-line px-3 py-2">
      <span className="h-1.5 w-1.5 rounded-full bg-accent-fill/70" />
      <span className="font-mono text-[11px] text-demo-dim">{filename}</span>
    </div>
  )
}

/** One block of source, written out. */
export function CodeBlock({ event, instant }: { event: CodeEvent; instant: boolean }) {
  const tokens = useMemo(() => tokenize(event.code, false), [event.code])
  const total = event.code.length
  const [shown, setShown] = useState(instant ? total : 0)

  useEffect(() => {
    if (instant) {
      setShown(total)
      return
    }
    setShown(0)
    const step = event.speed ?? 14
    const timer = setInterval(() => {
      setShown((n) => {
        if (n >= total) {
          clearInterval(timer)
          return n
        }
        // A few characters per tick, so a long block still lands in time
        // without the tick rate becoming visibly jerky.
        return Math.min(total, n + 2)
      })
    }, step * 2)
    return () => clearInterval(timer)
  }, [event.id, event.code, event.speed, instant, total])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="overflow-hidden rounded-xl border border-demo-line bg-demo-raised/40"
    >
      <FileTab filename={event.filename} />
      <div className="overflow-x-auto px-3 py-3">
        <Lines tokens={sliceTokens(tokens, shown)} caret={shown < total} />
      </div>
    </motion.div>
  )
}

type Phase = 'out' | 'infer' | 'back' | 'done'

/** The caller: a terminal, because that is what is on screen above it. */
function ClientGlyph() {
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
function Transit({ phase, inference }: { phase: Phase; inference?: string }) {
  const moving = phase === 'out' || phase === 'back'
  const forward = phase === 'out'

  return (
    <div className="rounded-xl border border-demo-line bg-demo-raised/25 px-3 py-3">
      <div className="flex items-start justify-between gap-2">
        <Node label="your machine" active={forward}>
          <ClientGlyph />
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
          label={phase === 'infer' ? (inference ?? 'inference') : 'Oxynet'}
          active={phase !== 'out'}
          ring={phase === 'infer'}
        >
          {phase === 'infer' ? <ModelGlyph /> : <CloudGlyph />}
        </Node>
      </div>

      <p className="mt-2.5 text-center font-mono text-[10px] text-demo-faint">
        {phase === 'out' && 'the recording handle goes up'}
        {phase === 'infer' && 'the models decide the physiology'}
        {phase === 'back' && 'the measurements come back'}
      </p>
    </div>
  )
}

/** Running the file: what goes out, what happens there, what comes back. */
export function RunBlock({ event, instant }: { event: RunEvent; instant: boolean }) {
  const [phase, setPhase] = useState<Phase>(instant ? 'done' : 'out')
  const tokens = useMemo(() => tokenize(event.response, true), [event.response])
  const requestTokens = useMemo(
    () => (event.request ? tokenize(event.request, true) : []),
    [event.request]
  )

  useEffect(() => {
    if (instant) {
      setPhase('done')
      return
    }
    setPhase('out')
    // Out, think, back. The middle is the longest because that is where the
    // work actually happens, and the demo should not pretend otherwise.
    const out = event.runMs * 0.3
    const infer = event.runMs * 0.45
    const timers = [
      setTimeout(() => setPhase('infer'), out),
      setTimeout(() => setPhase('back'), out + infer),
      setTimeout(() => setPhase('done'), event.runMs),
    ]
    return () => timers.forEach(clearTimeout)
  }, [event.id, event.runMs, instant])

  const done = phase === 'done'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="flex flex-col gap-3"
    >
      <div className="rounded-xl border border-demo-line bg-demo-raised/40 px-3 py-2.5">
        <p className="font-mono text-[12px] text-demo-ink">
          <span className="mr-2 text-accent-fill/70">$</span>
          {event.command}
        </p>
      </div>

      {event.request && !done && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl border border-accent-fill/35 bg-accent-fill/[0.05]"
        >
          <div className="flex items-center justify-between border-b border-accent-fill/15 px-3 py-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent-fill">
              Request
            </span>
            <span className="font-mono text-[10px] text-demo-faint">
              POST {event.endpoint ?? ''}
            </span>
          </div>
          <div className="overflow-x-auto px-3 py-2.5">
            <Lines tokens={requestTokens} caret={false} />
          </div>
        </motion.div>
      )}

      {!done && (
        <Transit phase={phase} inference={event.inference} />
      )}

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="overflow-hidden rounded-xl border border-accent-fill/20 bg-demo-panel"
        >
          <div className="flex items-center justify-between border-b border-demo-line px-3 py-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-demo-faint">
              Response
            </span>
            <span className="font-mono text-[10px] text-accent-fill">200 OK</span>
          </div>
          <div className="overflow-x-auto px-3 py-3">
            <Lines tokens={tokens} caret={false} />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
