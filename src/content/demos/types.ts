/**
 * The demo event model.
 *
 * A product demo is a list of `DemoEvent`s and nothing else. The player walks
 * the list on a timer and renders one component per event kind, so a second
 * demo (the interface, the API) is a second script file, not a second player.
 *
 * Two rules keep it honest:
 *
 *   1. Every value a viewer reads comes from the script, never from a
 *      component. Change `mcp-demo.ts` and the animation changes, including
 *      the positions of the threshold markers on the chart.
 *   2. Tool results are produced by a `ToolInvoker`, an async function keyed
 *      on the tool name and its input. The bundled one replays the scripted
 *      answer after the scripted latency. A real MCP client has the same
 *      shape, so swapping it in is a prop, not a rewrite.
 */

// ── Tool results ───────────────────────────────────────────────────────────

/** One line of a returned tool payload, rendered as a labelled mono row. */
export type ResultLine =
  | { kind: 'field'; label: string; value: string; accent?: boolean }
  | { kind: 'note'; text: string }

export interface ToolResultPayload {
  /** `warn` tints the status chip amber. Nothing here implies a confidence. */
  status: 'ok' | 'warn'
  headline: string
  lines: ResultLine[]
}

/**
 * The seam between the scripted demo and a live server.
 *
 * A real implementation posts `{ tool, input }` to an MCP client and resolves
 * with the same payload shape. The player awaits it, so latency, spinners and
 * the tool-status rail all behave identically whether the answer is canned or
 * genuinely computed.
 */
export type ToolInvoker = (call: {
  /** The id of the event that issued the call. A live client ignores it. */
  callId: string
  tool: string
  input: Record<string, unknown>
}) => Promise<ToolResultPayload>

// ── The MCP server being demonstrated ──────────────────────────────────────

export interface McpToolSpec {
  /** Bare tool name, rendered as `<server>.<name>`. */
  name: string
  summary: string
}

export interface McpServerSpec {
  id: string
  /** The namespace the tools are addressed under, for example `oxynet`. */
  namespace: string
  title: string
  transport: string
  endpoint: string
  tools: McpToolSpec[]
}

// ── Prominent results ──────────────────────────────────────────────────────

export interface Metric {
  label: string
  value: string
  unit?: string
  sub?: string
  /** Hex, tying the tile to the boundary it names on the chart. */
  color?: string
}

/**
 * The ventilatory plot, drawn the way app.oxynet.net draws it: the trace
 * coloured by intensity domain, changing colour exactly where a threshold was
 * detected.
 *
 * `markers` are the boundaries and `domains` the bands between them, so there
 * is always one more domain than marker. Both carry their own colour, which
 * keeps the app palette (moderate green, heavy amber, severe red) in the
 * script rather than hard-coded in the drawing.
 */
export interface ChartSpec {
  xLabel: string
  yLabel: string
  /** Lowest and highest VO2 on the ramp, in L/min. */
  vo2Start: number
  vo2Peak: number
  markers: { label: string; vo2: number; color: string }[]
  domains: { label: string; color: string }[]
}

// ── Events ─────────────────────────────────────────────────────────────────

interface BaseEvent {
  id: string
  /**
   * Total time the player waits on this event before revealing the next one,
   * covering both its entrance and the dwell after it. Retiming the demo means
   * editing these numbers and nothing else.
   */
  durationMs: number
  /** Shown in the transport bar while this event is the current one. */
  chapter?: string
}

export type DemoEvent =
  /**
   * The reader attaching a file before they ask anything. It puts the chip in
   * the window header, where it stays for the rest of the run.
   */
  | (BaseEvent & {
      kind: 'attach'
      filename: string
      meta: string
    })
  | (BaseEvent & { kind: 'user'; text: string })
  | (BaseEvent & { kind: 'thinking'; label: string })
  /** `text` accepts `**bold**` and nothing else. */
  | (BaseEvent & { kind: 'assistant'; text: string })
  /**
   * The server the reader connected, looked at from inside the agent's turn.
   * The agent is reading what it has been given, not finding it.
   */
  | (BaseEvent & { kind: 'mcp-connect' })
  | (BaseEvent & { kind: 'mcp-tools' })
  | (BaseEvent & {
      kind: 'tool-call'
      tool: string
      input: Record<string, unknown>
      /** Progress lines ticked off while the call is in flight. */
      steps?: string[]
      latencyMs: number
      result: ToolResultPayload
    })
  /**
   * A shell command the agent runs itself. Oxynet hands out a one-shot upload
   * URL rather than taking the bytes through the conversation, so the upload
   * is a curl and not a tool call, and the demo has to show that to be true to
   * the server.
   */
  | (BaseEvent & {
      kind: 'shell'
      command: string
      runMs: number
      output: ToolResultPayload
    })
  /** The app's upload screen, and a recording landing in it. */
  | (BaseEvent & {
      kind: 'drop'
      title: string
      subtitle: string
      filename: string
      meta: string
      note?: string
      /** How long the zone sits empty before the file arrives. */
      landMs: number
    })
  /** What the file can be taken to once it is in. */
  | (BaseEvent & {
      kind: 'tabs'
      filename: string
      tabs: string[]
      active: string
      note?: string
    })
  /**
   * The crossing on its own, for a demo with no code to run. The same picture
   * the `run` event draws, because it is the same journey.
   */
  | (BaseEvent & {
      kind: 'transit'
      from: string
      to: string
      fromGlyph?: 'terminal' | 'browser'
      inference: string
      runMs: number
      captions: { out: string; infer: string; back: string }
    })
  /**
   * A block of source being written. In `editor` layout each one replaces the
   * last, because the story is somebody building up a script, not a log.
   */
  | (BaseEvent & {
      kind: 'code'
      filename: string
      code: string
      /** Milliseconds per character. */
      speed?: number
    })
  /**
   * Running what was just written: the payload leaving the machine, crossing to
   * the engine, the inference, and the answer coming back. The round trip is
   * the point. A request and a response with nothing between them look like a
   * local function call, which is exactly what this is not.
   */
  | (BaseEvent & {
      kind: 'run'
      filename: string
      command: string
      /** The outgoing body, held up on its own while it crosses. */
      request?: string
      /** Where it is going, named on the far end of the track. */
      endpoint?: string
      /** What runs there, named while it runs. */
      inference?: string
      runMs: number
      /** Pretty-printed JSON, highlighted as JSON rather than as source. */
      response: string
    })
  /**
   * A request against the REST API. Goes through the same `ToolInvoker` as a
   * tool call, so the latency, the spinner and a future live implementation
   * all behave the same way whichever door the demo is showing.
   */
  | (BaseEvent & {
      kind: 'http'
      method: 'GET' | 'POST' | 'DELETE'
      path: string
      /** Pretty-printed JSON, shown under the request line. */
      body?: string
      latencyMs: number
      status: number
      result: ToolResultPayload
    })
  /** Rows landing in the caller's own store, one after another. */
  | (BaseEvent & {
      kind: 'table'
      title: string
      columns: string[]
      rows: string[][]
      caption?: string
    })
  | (BaseEvent & {
      kind: 'metrics'
      title: string
      caption?: string
      metrics: Metric[]
      chart?: ChartSpec
    })
  | (BaseEvent & {
      kind: 'final'
      headline: string
      /** The word carrying the gradient, matched inside `headline`. */
      accentWord?: string
      wordmark: string
      channels: string[]
      activeChannel?: string
      site: string
    })

export interface DemoScript {
  slug: string
  title: string
  /** Sits beside the wordmark in the window header. */
  label: string
  /** The status word next to the indicator dot, once the first call lands. */
  statusText: string
  /**
   * `transcript` stacks events, which suits a conversation. `editor` shows only
   * the current one, which suits somebody writing a file: the block being
   * worked on is the only thing on screen.
   */
  layout?: 'transcript' | 'editor'
  /** One line, used on the demo index and as the page description. */
  blurb: string
  /** Sits under the window as a standing honesty note. */
  disclosure: string
  server: McpServerSpec
  startDelayMs: number
  events: DemoEvent[]
}

export function totalDuration(script: DemoScript): number {
  return script.events.reduce((t, e) => t + e.durationMs, script.startDelayMs)
}
