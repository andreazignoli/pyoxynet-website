/**
 * The publication list, read from the site's own `src/content/publications.ts`
 * rather than copied into this directory.
 *
 * One list, one place. If a paper is added to the site it appears in the next
 * build of the manual, and the two can never disagree about what has been
 * published. The parse is deliberately strict: if the shape of that file
 * changes, the build fails loudly instead of silently printing a short list.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const src = resolve(here, '../src/content/publications.ts')

function field(block, name) {
  const m = block.match(new RegExp(`\\b${name}:\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)"|(\\d+))`, 's'))
  if (!m) return null
  const raw = m[1] ?? m[2] ?? m[3]
  return m[3] !== undefined ? Number(raw) : raw.replace(/\\'/g, "'").replace(/\s+/g, ' ').trim()
}

export function publications() {
  const text = readFileSync(src, 'utf8')
  const body = text.slice(text.indexOf('['), text.lastIndexOf(']') + 1)

  // Split on the top-level object boundaries. The file is machine-formatted by
  // Prettier, so every entry starts at the same indentation.
  const blocks = body.split(/\n  \{\n/).slice(1)
  const out = blocks.map((b) => ({
    type: field(b, 'type'),
    title: field(b, 'title'),
    url: field(b, 'url'),
    year: field(b, 'year'),
    journal: field(b, 'journal'),
  }))

  // Only the journal articles carry a year. The blog posts and Medium pieces
  // in the same list do not, and must never be counted as papers.
  const bad = out.filter((p) => !p.title || !p.url)
  if (bad.length || out.length < 10) {
    throw new Error(
      `manual: could not parse ${src}. Got ${out.length} entries, ${bad.length} incomplete. ` +
        `The manual reads the site's publication list directly; if that file was reformatted, fix this parser rather than copying the list.`
    )
  }
  return out.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
}

const PEER_REVIEWED = new Set(['research', 'review'])

/**
 * Split the list the way a reader would: journal articles, then the preprint,
 * then everything that is writing rather than a paper.
 *
 * This exists because the counts matter. "Peer-reviewed" is a claim, and a
 * Medium post sitting in the same array is not one.
 */
export function groupedPublications() {
  const all = publications()
  const peer = all.filter((p) => PEER_REVIEWED.has(p.type) && p.year && p.journal && p.journal !== 'Preprint')
  const preprint = all.filter((p) => p.journal === 'Preprint')
  const other = all.filter((p) => !PEER_REVIEWED.has(p.type))
  return { all, peer, preprint, other }
}
