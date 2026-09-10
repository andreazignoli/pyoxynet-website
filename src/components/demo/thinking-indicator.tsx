'use client'

import { motion } from 'framer-motion'
import { AgentGlyph } from './chat-message'

/**
 * The pause before the agent acts. Three dots breathing out of phase, which
 * reads as deliberation rather than as a loading spinner.
 */
export function ThinkingIndicator({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3"
    >
      <AgentGlyph />
      <span className="text-[14.5px] text-demo-faint">{label}</span>
      <span className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-1 h-1 rounded-full bg-demo-faint"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.18,
            }}
          />
        ))}
      </span>
    </motion.div>
  )
}
