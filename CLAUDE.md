# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

This is the Oxynet website — a modern Next.js 14 single-page site for the Oxynet project, an AI-powered toolset for automatic interpretation of cardiopulmonary exercise test (CPET) data.

- **Branch:** `next` (active development / Vercel deployment)
- **Legacy:** `gh-pages` (old Jekyll site, kept for reference)
- **Domain:** `www.oxynet.net` (DNS pointed to Vercel)

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + custom design tokens (dark theme)
- **UI Components:** shadcn/ui (Button, Badge, Tabs, Separator) — Radix UI primitives
- **Animations:** Framer Motion (scroll-triggered entrance animations)
- **Syntax Highlighting:** Shiki (server-side, `github-dark-dimmed` theme)
- **Font:** Geist (sans + mono, from Vercel)
- **Deployment:** Vercel (`vercel.json` configured)

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript check
```

## Architecture

### Directory Structure

```
src/
  app/
    layout.tsx          # Root layout: Geist fonts, metadata, Navbar
    page.tsx            # Home page: assembles all section components
    globals.css         # Tailwind base + CSS vars + .glass + .gradient-text utilities
    not-found.tsx       # 404 page
  components/
    layout/
      navbar.tsx        # Fixed glassmorphism nav ('use client')
      footer.tsx        # Disclaimer, acknowledgments, links
    sections/
      hero-section.tsx        # Full-viewport hero with bg image + CTAs ('use client')
      about-section.tsx       # 3 feature cards
      package-section.tsx     # Pyoxynet package info + links
      usage-section.tsx       # async Server Component: pre-renders Shiki HTML
      usage-tabs.tsx          # Radix Tabs client component
      publications-section.tsx # 11 publication cards
      contact-section.tsx     # Two contact cards with mailto links
    shared/
      section-wrapper.tsx  # Framer Motion useInView entrance animation ('use client')
      glass-card.tsx       # Glassmorphism card with hover animation ('use client')
      gradient-text.tsx    # Gradient text span
      code-block.tsx       # async Server Component wrapping Shiki highlight()
    ui/                  # shadcn/ui components (button, badge, tabs, separator)
  content/
    code-examples.ts     # Typed code snippet strings (install, usage, generation)
    publications.ts      # Typed array of all 11 publications
  lib/
    shiki.ts             # Module-level Shiki singleton + highlight() helper
    utils.ts             # shadcn cn() helper
  types/
    index.ts             # Publication, CodeExample, NavItem types
public/
  hero-bg.jpg            # Hero background image (from Unsplash / Pawel Czerwinski)
```

### Key Architecture Decisions

**Server/Client boundary for code tabs:**
`usage-section.tsx` is an async Server Component that pre-renders all Shiki HTML and passes the strings to `usage-tabs.tsx` (Client Component with Radix Tabs). Shiki never ships to the client.

**Shiki singleton:**
`src/lib/shiki.ts` creates one `Highlighter` instance reused across requests. Theme: `github-dark-dimmed`, langs: `python`, `sh`, `bash`.

**Glass morphism utility:**
The `.glass` class is defined in `globals.css` — `background: rgba(255,255,255,0.04)` + `backdrop-filter: blur(12px)`.

### Design Tokens
- Background: `#0a0a0a` (CSS var `--background`)
- Accent green: `#00dc82` (Tailwind `accent.DEFAULT`)
- Secondary blue: `#155799` (Tailwind `accent.blue`)
- Gradient text: `#00dc82 → #155799`

## Deployment

The site deploys automatically on Vercel from the `next` branch.

To run locally:
```bash
npm run dev   # http://localhost:3000
```

To deploy:
```bash
git push origin next   # Vercel picks it up automatically
```

### DNS / Domain
Point `www.oxynet.net` to Vercel using the A records or CNAME provided in the Vercel dashboard under "Domains".
