'use client'

import { useState } from 'react'

/** Copies the raw source of a code block, not its highlighted HTML. */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        } catch {
          // Clipboard refused (insecure context, permissions). Selecting by hand still works.
        }
      }}
      className="text-[11px] font-mono text-ink-subtle hover:text-accent transition-colors px-2 py-0.5 rounded border border-hairline hover:border-accent/40"
      aria-label="Copy code"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
