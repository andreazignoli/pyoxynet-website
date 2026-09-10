'use client'

import { motion } from 'framer-motion'
import type { McpServerSpec } from '@/content/demos/types'
import { Typewriter } from './demo-text'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

/**
 * The connected server, printed inside the agent's turn.
 *
 * There used to be a standing rail beside the transcript carrying this plus
 * every tool and its summary. It was the most detailed thing on screen and the
 * least important: the story is the conversation, and a permanent inventory
 * pulled the eye out of it. What survives is the part the agent actually says.
 */
export function McpConnectBlock({
  server,
  instant,
}: {
  server: McpServerSpec
  instant: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="rounded-xl border border-demo-line bg-demo-panel/60 px-4 py-3 font-mono text-[11.5px] leading-[1.9]"
    >
      <div className="text-demo-faint">MCP</div>
      <div className="flex flex-wrap items-center gap-x-2 text-demo-dim">
        <span className="text-demo-line2">└──</span>
        <span className="text-demo-ink">{server.title}</span>
      </div>
      <div className="flex items-center gap-2 pl-[2.1rem]">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: instant ? 0 : 0.5 }}
          className="flex items-center gap-1.5 text-accent-fill"
        >
          <span className="h-[5px] w-[5px] rounded-full bg-accent-fill" />
          Connected
        </motion.span>
        <span className="text-demo-faint">{server.transport}</span>
      </div>
    </motion.div>
  )
}

/**
 * What the agent found when it looked: the tool names, nothing else. The
 * one-line summaries went with the rail. A reader does not need to know what
 * `list_metrics` does to follow the story.
 */
export function McpToolsBlock({
  server,
  instant,
}: {
  server: McpServerSpec
  instant: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="pl-1"
    >
      <p className="font-mono text-[11.5px] text-demo-faint">
        <Typewriter
          text={`${server.tools.length} tools available`}
          msPerChar={24}
          instant={instant}
          caret={false}
        />
      </p>
      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
        {server.tools.map((tool, i) => (
          <motion.li
            key={tool.name}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              ease: EASE,
              delay: instant ? 0 : 0.55 + i * 0.075,
            }}
            className="truncate font-mono text-[11px] text-demo-dim"
          >
            <span className="text-demo-faint">{server.namespace}.</span>
            {tool.name}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
