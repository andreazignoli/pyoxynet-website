'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DuckMark } from '@/components/shared/duck-mark'
import { ThemeToggle } from '@/components/shared/theme-toggle'

const APP_URL = 'https://app.oxynet.net'

const NAV_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: 'Measurement', href: '/#measurement' },
  { label: 'Outputs', href: '/#outputs' },
  { label: 'For developers', href: '/#agents' },
  { label: 'Integration', href: '/integration' },
  { label: 'Package', href: '/#package' },
  { label: 'Publications', href: '/#publications' },
  { label: 'Manual (PDF)', href: '/manual', external: true },
  { label: 'Contact', href: '/#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass border-b border-hairline' : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* The mark and the wordmark, identical to the app's header. */}
        <a href="/" className="flex items-center gap-2 group flex-shrink-0">
          <DuckMark className="w-5 h-5 text-accent transition-opacity group-hover:opacity-80" />
          <span className="font-bold text-base gradient-text font-mono tracking-tight">
            Oxynet
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="px-2.5 py-1.5 text-sm text-ink-body hover:text-foreground transition-colors rounded-md hover:bg-surface whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeToggle />

          {/* The app is the product. It gets the only button in the bar. */}
          <a
            href={APP_URL}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium
                       bg-accent-fill text-black rounded-lg px-3.5 py-1.5
                       hover:bg-accent/85 transition-colors whitespace-nowrap"
          >
            Open the app
            <span aria-hidden="true">→</span>
          </a>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-ink-body hover:text-foreground transition-colors p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden glass border-t border-hairline px-6 pb-5"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm text-ink-body hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={APP_URL}
            onClick={() => setMenuOpen(false)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium
                       bg-accent-fill text-black rounded-lg px-3.5 py-2
                       hover:bg-accent/85 transition-colors"
          >
            Open the app
            <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      )}
    </motion.nav>
  )
}
