import type { DemoEvent, ToolInvoker, ToolResultPayload } from '@/content/demos/types'

/**
 * The scripted tool invoker.
 *
 * Every tool call in the player goes through a `ToolInvoker`, awaits it, and
 * only then flips the call from running to resolved. This one looks the answer
 * up in the script and waits out the scripted latency, so the pacing is data
 * and not a magic number in a component.
 *
 * The point of the indirection is the replacement. A live version is:
 *
 *   const invoke: ToolInvoker = async ({ tool, input }) =>
 *     toPayload(await mcpClient.callTool(`oxynet.${tool}`, input))
 *
 * and it drops into `<DemoPlayer invoke={invoke} />` without touching a single
 * component, because the player already treats a call as something that takes
 * an unknown amount of time and can come back either way.
 */
export function createScriptedInvoker(events: DemoEvent[]): ToolInvoker {
  const calls = new Map<string, { latencyMs: number; result: ToolResultPayload }>()
  for (const event of events) {
    if (event.kind === 'tool-call') {
      calls.set(event.id, { latencyMs: event.latencyMs, result: event.result })
    }
  }

  return ({ callId }) => {
    const canned = calls.get(callId)
    if (!canned) {
      return Promise.reject(new Error(`No scripted result for call ${callId}`))
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(canned.result), canned.latencyMs)
    })
  }
}

/**
 * JSON the way an agent surface shows it: one line while it fits, indented
 * once it does not. Keys keep the order the script wrote them in.
 */
export function formatToolInput(input: Record<string, unknown>): string {
  const entries = Object.entries(input)
  if (entries.length === 0) return '{}'
  const oneLine =
    '{ ' + entries.map(([k, v]) => `"${k}": ${JSON.stringify(v)}`).join(', ') + ' }'
  return oneLine.length <= 54 ? oneLine : JSON.stringify(input, null, 2)
}
