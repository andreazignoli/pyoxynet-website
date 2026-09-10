'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DuckMark } from '@/components/shared/duck-mark'
import type { DemoScript, ToolInvoker } from '@/content/demos/types'
import { useDemoTimeline, usePrefersReducedMotion } from '@/hooks/use-demo-timeline'
import { createScriptedInvoker } from '@/lib/demo-invoker'
import { AttachChip, AttachRow } from './attachment'
import { AssistantMessage, UserMessage } from './chat-message'
import { Eyebrow } from './demo-text'
import { FinalScreen } from './final-screen'
import { McpConnectBlock, McpToolsBlock } from './mcp-panel'
import { MetricsPanel } from './metrics-panel'
import { ShellStep } from './shell-step'
import { ThinkingIndicator } from './thinking-indicator'
import { ToolCall } from './tool-call'

function ReplayIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path
        d="M13.5 8a5.5 5.5 0 1 1-1.7-3.96"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M13.2 1.9v2.9h-2.9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * The demo shell.
 *
 * It owns three things and nothing else: when each event appears, which tools
 * are currently in flight, and the transport controls. Every word on screen
 * comes from the script, and every tool answer comes from `invoke`, so a live
 * MCP-backed run is the same component with a different function passed in.
 */
export function DemoPlayer({
  script,
  invoke,
  className,
  hideDisclosure = false,
  fixedHeight = false,
}: {
  script: DemoScript
  invoke?: ToolInvoker
  className?: string
  /** The recording stage carries the notice in the post instead. */
  hideDisclosure?: boolean
  /**
   * Pin the stage instead of sizing it against the viewport. The recorder needs
   * the window to be the same shape whatever it renders into, so the clip is
   * not a function of the height of the machine that made it.
   */
  fixedHeight?: boolean
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { once: true, margin: '-120px' })
  const reduced = usePrefersReducedMotion()

  const timeline = useDemoTimeline(script, inView)
  const { visible, current, progress, runId, replay } = timeline

  const scriptedInvoke = useMemo(
    () => createScriptedInvoker(script.events),
    [script.events],
  )
  const activeInvoke = invoke ?? scriptedInvoke

  const [resolved, setResolved] = useState(0)
  useEffect(() => setResolved(0), [runId])

  const onStatus = useCallback((_tool: string, status: 'running' | 'done') => {
    if (status === 'done') setResolved((n) => n + 1)
  }, [])

  const connected = visible.some((e) => e.kind === 'mcp-connect')
  const attached = visible.find((e) => e.kind === 'attach')
  const final = visible.find((e) => e.kind === 'final')

  // Follow the conversation down. The second nudge catches the tool results,
  // which land a beat after the call block that owns them.
  useEffect(() => {
    const node = transcriptRef.current
    if (!node) return
    const toBottom = () =>
      node.scrollTo({
        top: node.scrollHeight,
        behavior: reduced ? 'auto' : 'smooth',
      })
    toBottom()
    const later = setTimeout(toBottom, 700)
    return () => clearTimeout(later)
  }, [visible.length, resolved, reduced])

  return (
    <div ref={stageRef} className={className}>
      {/* A lit bezel rather than a flat border. On the light page the drop
          shadow separates the window; on the dark one, where the page and the
          stage are within a shade of each other, only this rim does. */}
      <div
        data-demo-window
        className="rounded-[1.05rem] bg-gradient-to-b from-white/[0.11] via-white/[0.045] to-white/[0.02] p-px shadow-[0_40px_90px_-50px_rgba(0,0,0,0.95)]"
      >
        <div className="relative overflow-hidden rounded-2xl bg-demo-bg">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 z-10"
            style={{
              background:
                'radial-gradient(75% 100% at 50% 0%, rgba(0,220,130,0.055) 0%, rgba(0,220,130,0) 75%)',
            }}
          />

          {/* Everything the reveal covers. The transport bar stays below it, so
            the demo can still be replayed from the final frame.

            The stage height is picked so the window lands on 4:5 at its 34rem
            cap: 544 wide by 680 tall, which is the ratio LinkedIn gives the
            most feed height to. It is meant to be recorded and posted. */}
          <div className="relative">
            {/* Header */}
            <header className="relative flex items-center justify-between gap-3 border-b border-demo-line px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2.5 min-w-0">
                <DuckMark className="w-[18px] h-[18px] text-accent-fill shrink-0" />
                <span className="font-mono text-[13px] font-bold tracking-[0.16em] text-demo-ink">
                  OXYNET
                </span>
                <span className="hidden sm:block h-3.5 w-px bg-demo-line2" />
                <span className="hidden sm:block font-mono text-[11px] tracking-wide text-demo-faint">
                  MCP Demo
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 min-w-0">
                <span className="flex items-center gap-1.5">
                  <span className="relative grid place-items-center w-2 h-2">
                    {connected && (
                      <span className="absolute inset-0 rounded-full bg-accent-fill/50 animate-signal-pulse" />
                    )}
                    <span
                      className={`relative w-[5px] h-[5px] rounded-full transition-colors duration-700 ${
                        connected ? 'bg-accent-fill' : 'bg-demo-line2'
                      }`}
                    />
                  </span>
                  <span className="font-mono text-[10px] text-demo-faint">
                    {connected ? 'MCP' : 'Idle'}
                  </span>
                </span>
                {attached && attached.kind === 'attach' && (
                  <AttachChip filename={attached.filename} />
                )}
              </div>
            </header>

            {/* Stage */}
            <div
              className={`relative flex min-h-0 ${
                fixedHeight ? 'h-[37rem]' : 'h-[clamp(24rem,62vh,37rem)]'
              }`}
            >
              <div
                ref={transcriptRef}
                aria-label={`${script.title}, an animated demonstration`}
                className="demo-scroll flex-1 min-w-0 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6"
              >
                <div className="flex flex-col gap-4">
                  <AnimatePresence initial={false}>
                    {visible.map((event, i) => {
                      const isLast = i === visible.length - 1
                      const previous = visible[i - 1]

                      switch (event.kind) {
                        case 'attach':
                          return (
                            <AttachRow
                              key={event.id}
                              filename={event.filename}
                              meta={event.meta}
                              instant={reduced}
                            />
                          )

                        case 'user':
                          return (
                            <UserMessage
                              key={event.id}
                              text={event.text}
                              instant={reduced}
                            />
                          )

                        case 'thinking':
                          // It is a state, not a message: it goes when work starts.
                          return isLast ? (
                            <ThinkingIndicator key={event.id} label={event.label} />
                          ) : null

                        case 'assistant':
                          return (
                            <AssistantMessage
                              key={event.id}
                              text={event.text}
                              showGlyph={previous?.kind !== 'assistant'}
                            />
                          )

                        case 'mcp-connect':
                          return (
                            <McpConnectBlock
                              key={event.id}
                              server={script.server}
                              instant={reduced}
                            />
                          )

                        case 'mcp-tools':
                          return (
                            <McpToolsBlock
                              key={event.id}
                              server={script.server}
                              instant={reduced}
                            />
                          )

                        case 'tool-call':
                          return (
                            <ToolCall
                              key={event.id}
                              event={event}
                              namespace={script.server.namespace}
                              invoke={activeInvoke}
                              onStatus={onStatus}
                              instant={reduced}
                            />
                          )

                        case 'shell':
                      return <ShellStep key={event.id} event={event} instant={reduced} />

                    case 'metrics':
                          return (
                            <MetricsPanel
                              key={event.id}
                              title={event.title}
                              caption={event.caption}
                              metrics={event.metrics}
                              chart={event.chart}
                              instant={reduced}
                            />
                          )

                        default:
                          return null
                      }
                    })}
                  </AnimatePresence>
                </div>
              </div>

            </div>

            <AnimatePresence>
              {final && final.kind === 'final' && (
                <FinalScreen
                  key="final"
                  headline={final.headline}
                  accentWord={final.accentWord}
                  wordmark={final.wordmark}
                  channels={final.channels}
                  activeChannel={final.activeChannel}
                  site={final.site}
                  instant={reduced}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Transport */}
          <div className="relative z-30 border-t border-demo-line">
            <div className="absolute inset-x-0 -top-px h-px bg-demo-line2/60">
              <motion.div
                className="h-full bg-accent-fill/70 origin-left"
                style={{ scaleX: progress }}
              />
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
              <Eyebrow className="truncate">{current?.chapter ?? 'Ready'}</Eyebrow>
              <button
                type="button"
                onClick={replay}
                className="flex items-center gap-1.5 rounded-md border border-demo-line px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-demo-dim transition-colors hover:border-accent-fill/40 hover:text-accent-fill focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-fill/60"
              >
                <ReplayIcon />
                Replay
              </button>
            </div>
          </div>
        </div>
      </div>

      {!hideDisclosure && (
        <p className="mt-3 px-1 font-mono text-[10.5px] leading-relaxed text-ink-faint">
          {script.disclosure}
        </p>
      )}
    </div>
  )
}
