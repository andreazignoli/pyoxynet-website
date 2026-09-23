import { readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * Reads a downloadable example so a page can show exactly the file it offers.
 * One copy on disk, under public/developers/, rendered and downloaded from the
 * same bytes: the snippet on the page cannot drift from the file.
 *
 * Server-only. Runs at build time for these static pages.
 */
export function readExample(rel: string): { code: string; href: string } {
  const code = readFileSync(path.join(process.cwd(), 'public', 'developers', rel), 'utf8')
  return { code: code.trimEnd(), href: `/developers/${rel}` }
}
