'use client'

import { useEffect, useState } from 'react'

/**
 * Where you are on a 14,845 pixel page.
 *
 * Thirteen sections, about sixteen screens. The navbar names seven of them and
 * never says which one you are in, so finding something a second time meant
 * scrolling for it. This is the second, quieter axis: it holds all thirteen and
 * never competes with "Open the app", which stays the only button in the bar.
 *
 * Deliberately absent below `xl`. On a narrow window there is no room beside the
 * content, and a rail that overlaps the text is worse than no rail.
 */
const SECTIONS = [
  { id: 'demo', label: 'Demo' },
  { id: 'about', label: 'About' },
  { id: 'measurement', label: 'Measurement' },
  { id: 'outputs', label: 'Outputs' },
  { id: 'agents', label: 'For developers' },
  { id: 'audience', label: 'Who it is for' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'deployment', label: 'Deployment' },
  { id: 'validation', label: 'Validation' },
  { id: 'package', label: 'Package' },
  { id: 'usage', label: 'Usage' },
  { id: 'publications', label: 'Publications' },
  { id: 'contact', label: 'Contact' },
]

export function SectionRail() {
  const [active, setActive] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const els = SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    // The active entry is the section the reader is IN, not the last one they
    // clicked, so it is driven by position rather than by the click handler.
    // rootMargin pins the decision line a third of the way down the viewport:
    // without it a tall section counts as "entered" while it is still mostly
    // below the fold.
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (seen.length > 0) setActive(seen[0].target.id)
      },
      { rootMargin: '-33% 0px -60% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))

    // Hidden over the hero: the rail is for the long middle of the page, and
    // the first screen should be the photograph and one sentence.
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <nav
      aria-label="Sections"
      className={`hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-px
                  transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-subtle mb-2 pl-3">
        On this page
      </p>
      {SECTIONS.map((s) => {
        const on = active === s.id
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={on ? 'true' : undefined}
            className="group flex items-center gap-2.5 py-1 pr-2"
          >
            <span
              className={`w-0.5 rounded-full transition-all duration-200 ${
                on ? 'h-4 bg-accent' : 'h-3 bg-hairline group-hover:bg-ink-faint'
              }`}
            />
            <span
              className={`text-[11px] transition-colors ${
                on
                  ? 'text-foreground font-semibold'
                  : 'text-ink-subtle group-hover:text-foreground'
              }`}
            >
              {s.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}
