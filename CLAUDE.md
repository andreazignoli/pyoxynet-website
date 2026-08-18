# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

This is the Oxynet marketing site — a Next.js 14 site for Oxynet, a computational layer
that turns cardiopulmonary exercise test (CPET) signals into structured physiological
measurements.

- **Branch:** `main` (active development; ahead of `next`, which is stale)
- **Legacy:** `gh-pages` (old Jekyll site, kept for reference)
- **Domain:** `www.oxynet.net` (DNS pointed to Vercel)

## The sister repo: this is not the only Oxynet property

`app.oxynet.net` is the product; this site is the front door to it. It is built from
`oxynet-interpreter-tf2/ui` (React + Vite) in a separate repository, and the two are
deliberately indistinguishable to a visitor who moves between them.

**The design tokens are duplicated on purpose and must be changed in both places:**

| Token | Value | Here | App |
|---|---|---|---|
| Background | `#0a0a0a` | `--background` in `globals.css` | `ink-950` |
| Card / surface | `#121212` | `--card` | `ink-900` |
| Border | `#242424` | `--border` | `ink-800` |
| Muted text | `#8c8c8c` | `--muted-foreground` | `ink-500` |
| Accent | `#00dc82` | `accent.DEFAULT` | `brand-400` |
| Gradient | `#00dc82 → #155799` | `.gradient-text` | `.gradient-text` |
| Type | Geist Sans + Geist Mono | `geist/font` | Google Fonts |

`.glass` is defined identically in both repos. The **mark** is generated from
`oxynet/api/assets/oxynet-icon.svg` in the app repo into `src/components/shared/duck-mark.tsx`
here. It is inlined rather than an `<img>` because the path is drawn with `currentColor`,
which cannot inherit across document boundaries. Regenerate rather than hand-edit.

## Positioning: read before writing copy

The narrative is **measurement, not classification**. Oxynet is sold as a computational
layer that extracts physiological structure from CPET signals; VT1/VT2 is the entry
product, not the ceiling. Three rules that have been decided:

1. **Do not sell the AI.** Deep learning, Keras, TensorFlow and TFLite are the mechanism.
   A hospital or a device manufacturer is buying a new capability to interpret CPET, not
   a model architecture. Keep the stack talk in the package section, where researchers
   are the audience.
2. **The app is the destination.** Every product CTA points at `app.oxynet.net`.
   Exercise Thresholds remains credited in the footer acknowledgments and nowhere else.
3. **No em dashes in anything a user or an agent reads.** Not in the site copy, not in
   the app UI, not in the served text documents. Use a full stop, a comma, a colon or
   parentheses. The one exception is the bare dash used as an empty-cell placeholder in a
   data table, which is a symbol rather than punctuation. This is a standing house-style
   rule and applies to the sister repo too.
4. **Keep the copy punchy.** "A computational layer for CPET", "Physiological intelligence
   for exercise testing", "One engine, three doors" and similar lines are wanted. Plainer
   is not automatically better here. Cut a line when it claims something untrue, not
   because it has energy.
5. **Never invent confidence.** Nothing is calibrated against clinical outcomes, so no
   percentage confidence appears anywhere. Oscillation analysis is beta, developed on a
   single heart-failure cohort, with transportability untested. Say so wherever it is
   mentioned rather than in one buried footnote.

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
      hero-section.tsx        # Full-viewport hero, duck mark + CTAs ('use client')
      demo-section.tsx        # Before/after compare slider
      about-section.tsx       # Problem / solution pair
      measurement-section.tsx # "From classification to measurement" — the hinge
      outputs-section.tsx     # Four output families incl. oscillation + signal integrity
      agents-section.tsx      # REST / MCP / OpenAPI / llms.txt
      audience-section.tsx    # Clinics, manufacturers, researchers
      how-it-works-section.tsx
      deployment-section.tsx  # App, API+MCP, Python package
      validation-section.tsx  # Evidence, with the beta caveat
      package-section.tsx     # Pyoxynet package info + links
      usage-section.tsx       # async Server Component: pre-renders Shiki HTML
      usage-tabs.tsx          # Radix Tabs client component
      publications-section.tsx # 12 publication cards
      contact-section.tsx     # Two contact cards with mailto links
    shared/
      duck-mark.tsx        # The Oxynet mark, inlined (generated from the app repo)
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
git push origin main   # Vercel picks it up automatically
```

Confirm the production branch in the Vercel dashboard before pushing — the project was
originally wired to `next`, and `main` has since become the branch carrying the work.

### DNS / Domain
Point `www.oxynet.net` to Vercel using the A records or CNAME provided in the Vercel dashboard under "Domains".
