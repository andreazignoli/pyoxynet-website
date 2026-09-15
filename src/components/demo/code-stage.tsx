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

/** Running the file, and what the API sent back. */
export function RunBlock({ event, instant }: { event: RunEvent; instant: boolean }) {
  const [done, setDone] = useState(instant)
  const tokens = useMemo(() => tokenize(event.response, true), [event.response])

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

      {!done ? (
        <motion.p
          className="pl-1 font-mono text-[11.5px] text-demo-faint"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          waiting for the engine&hellip;
        </motion.p>
      ) : (
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
