'use client'

import { Fragment, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Types a string out character by character.
 *
 * `instant` is the reduced-motion path: the whole string is there on the first
 * frame, so the demo still reads correctly when the reader has asked the
 * operating system for less movement.
 */
export function Typewriter({
  text,
  msPerChar = 24,
  startDelayMs = 0,
  instant = false,
  caret = true,
  className,
}: {
  text: string
  msPerChar?: number
  startDelayMs?: number
  instant?: boolean
  caret?: boolean
  className?: string
}) {
  const [shown, setShown] = useState(instant ? text.length : 0)

  useEffect(() => {
    if (instant) {
      setShown(text.length)
      return
    }
    setShown(0)
    let timer: ReturnType<typeof setInterval>
    const start = setTimeout(() => {
      timer = setInterval(() => {
        setShown((n) => {
          if (n >= text.length) {
            clearInterval(timer)
            return n
          }
          return n + 1
        })
      }, msPerChar)
    }, startDelayMs)
    return () => {
      clearTimeout(start)
      clearInterval(timer)
    }
  }, [text, msPerChar, startDelayMs, instant])

  const typing = shown < text.length

  return (
    <span className={className}>
      {text.slice(0, shown)}
      {caret && typing && (
        <span className="inline-block w-[0.5em] h-[1em] -mb-[0.12em] ml-px bg-accent-fill animate-caret" />
      )}
    </span>
  )
}

/**
 * The only markup the scripts carry is `**bold**`. Anything richer belongs in
 * the script as structured data, not in a string.
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-medium text-demo-ink">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </span>
  )
}

/** The small uppercase mono label used across the stage. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'font-mono text-[10px] uppercase tracking-[0.18em] text-demo-faint',
        className,
      )}
    >
      {children}
    </span>
  )
}
