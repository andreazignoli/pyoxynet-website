'use client'

import { useEffect, useState } from 'react'

type Choice = 'dark' | 'light' | null

/**
 * The reader's colour-scheme choice.
 *
 * Three states, not two. `null` means "whatever the operating system says",
 * which is the default and what most people should stay on; choosing pins
 * `data-theme` on <html> and wins over the media query in both directions.
 *
 * The chosen value is applied before paint by the inline script in layout.tsx,
 * so there is no flash of the wrong theme. This component only has to keep the
 * button in step with what that script already did.
 */
export function ThemeToggle() {
  const [choice, setChoice] = useState<Choice>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = window.localStorage.getItem('oxynet-theme')
    setChoice(stored === 'dark' || stored === 'light' ? stored : null)
  }, [])

  const isLight = mounted
    ? choice === 'light' ||
      (choice === null &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: light)').matches)
    : false

  const flip = () => {
    const next: Choice = isLight ? 'dark' : 'light'
    setChoice(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      window.localStorage.setItem('oxynet-theme', next)
    } catch {
      /* private mode: the choice lasts for this page only, which is fine */
    }
  }

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={isLight ? 'Switch to the dark theme' : 'Switch to the light theme'}
      title={isLight ? 'Dark theme' : 'Light theme'}
      className="p-1.5 rounded-md text-ink-body hover:text-foreground hover:bg-surface/50
                 transition-colors flex-shrink-0"
    >
      {/* Drawn rather than an icon font, so it recolours with currentColor. */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {isLight ? (
          // going to dark: a crescent
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
        ) : (
          // going to light: a sun
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  )
}
