import type { DemoScript } from './types'
import { apiDemo } from './api-demo'
import { mcpDemo } from './mcp-demo'

/**
 * The demo family. One engine, three doors: the interface, the API, the MCP
 * server. MCP is the one that exists so far. A second demo is a second script
 * file registered here, not a second player.
 */
export const DEMOS: DemoScript[] = [mcpDemo, apiDemo]

export { mcpDemo, apiDemo }

export function getDemo(slug: string): DemoScript | undefined {
  return DEMOS.find((d) => d.slug === slug)
}

export * from './types'
