import { LINKS } from '@/content/developers/meta'

/**
 * The endpoint list, read from the running service's own OpenAPI schema.
 *
 * The API reference on this site is not a second copy of the API: it renders
 * what /v1/openapi.json says at build time and refreshes hourly, so an
 * endpoint added in core appears here without anyone editing the site. If the
 * schema cannot be fetched, the page says so and links to it, rather than
 * falling back to a list that would go stale unnoticed.
 */

export interface Operation {
  method: string
  path: string
  summary: string
  operationId?: string
}

export interface SchemaInfo {
  title: string
  version: string
  openapi: string
  operations: Operation[]
}

const METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const

export async function loadOpenApi(): Promise<SchemaInfo | null> {
  try {
    const res = await fetch(LINKS.openapi, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const spec = await res.json()
    const operations: Operation[] = []
    for (const [path, ops] of Object.entries<Record<string, { summary?: string; operationId?: string }>>(spec.paths ?? {})) {
      for (const m of METHODS) {
        const op = ops[m]
        if (op) operations.push({ method: m.toUpperCase(), path, summary: op.summary ?? '', operationId: op.operationId })
      }
    }
    return { title: spec.info?.title ?? '', version: spec.info?.version ?? '', openapi: spec.openapi ?? '', operations }
  } catch {
    return null
  }
}
