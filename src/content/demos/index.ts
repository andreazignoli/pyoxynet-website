import type { DemoScript } from './types'
import { apiDemo } from './api-demo'
import { browserDemo } from './browser-demo'
import { mcpDemo } from './mcp-demo'

/**
 * The demo family. One engine, three doors: the interface, the API, the MCP
 * server. MCP is the one that exists so far. A second demo is a second script
 * file registered here, not a second player.
 */
// Ordered the way the doors are named everywhere else: people, software,
// agents. The landing page will read them in this order.
export const DEMOS: DemoScript[] = [browserDemo, apiDemo, mcpDemo]

export { mcpDemo, apiDemo, browserDemo }

export function getDemo(slug: string): DemoScript | undefined {
  return DEMOS.find((d) => d.slug === slug)
}

export * from './types'
