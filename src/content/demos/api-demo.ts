import type { DemoScript } from './types'

/**
 * Demo two of the family: Oxynet as an API.
 *
 * The MCP demo is one test and a conversation. This one is the opposite case
 * and has to look it: a folder of exports, no conversation, and rows landing in
 * somebody else's database at the end. That last beat is the whole argument for
 * an integrator, and it is the one thing the MCP demo cannot show.
 *
 * The routes are the real `/v1` surface in `oxynet/api/v1.py`: POST /v1/uploads
 * for a batch of one-shot tickets, POST /v1/cpet/{id}/analyze taking
 * {"analyses": [...]} and returning one envelope per analysis, and POST
 * /v1/cpet/{id}/compute taking {"metrics": [...]}. The values are invented, as
 * the disclosure says.
 */

const COHORT = 12

export const apiDemo: DemoScript = {
  slug: 'api',
  title: 'Oxynet as an API',
  label: 'REST API',
  statusText: 'v1',
  blurb:
    'A pipeline posts a folder of exports and stores the measurements that come back. Your product, your reporting, our physiology.',
  disclosure:
    'Simulated run. The routes, their payloads and the order they are called in are the live Oxynet REST API. The values are representative, not measured.',

  // No MCP server in this story. The shape is required by the script type and
  // the player only reads it for the connect and tool-list events, which this
  // demo does not use.
  server: {
    id: 'oxynet',
    namespace: 'oxynet',
    title: 'Oxynet REST API',
    transport: 'https',
    endpoint: 'app.oxynet.net/v1',
    tools: [],
  },

  startDelayMs: 700,

  events: [
    // ── The job starts ─────────────────────────────────────────────────────
    {
      id: 'run',
      kind: 'shell',
      chapter: 'Ingest',
      command: 'python ingest.py --dir ./cohort_2026_03',
      runMs: 1400,
      output: {
        status: 'ok',
        headline: `${COHORT} exports found`,
        lines: [
          { kind: 'field', label: 'formats', value: 'Cortex, COSMED, MetaSoft' },
          { kind: 'note', text: 'Read as exported. Nothing renamed, nothing converted.' },
        ],
      },
      durationMs: 3000,
    },

    // ── Tickets for the whole folder, not one at a time ────────────────────
    {
      id: 'tickets',
      kind: 'http',
      chapter: 'Ingest',
      method: 'POST',
      path: '/v1/uploads',
      body: `{ "count": ${COHORT} }`,
      latencyMs: 700,
      status: 201,
      durationMs: 2400,
      result: {
        status: 'ok',
        headline: `${COHORT} upload URLs issued`,
        lines: [
          { kind: 'field', label: 'expires_in', value: '5 min' },
          { kind: 'note', text: 'The bytes go from disk to Oxynet. They never pass through your app.' },
        ],
      },
    },
    {
      id: 'push',
      kind: 'shell',
      chapter: 'Ingest',
      command: 'for f in ./cohort_2026_03/*; do curl -sS -F "file=@$f" "$next"; done',
      runMs: 2600,
      output: {
        status: 'ok',
        headline: `${COHORT} recordings accepted`,
        lines: [
          { kind: 'field', label: 'breaths', value: '14,208 total' },
          { kind: 'field', label: 'rejected', value: '0' },
        ],
      },
      durationMs: 4000,
    },

    // ── One analysis, shown in full, then the rest implied ─────────────────
    {
      id: 'analyze',
      kind: 'http',
      chapter: 'Analyse',
      method: 'POST',
      path: '/v1/cpet/cpet_8f3a91c4/analyze',
      body: '{ "analyses": ["vt"] }',
      latencyMs: 2600,
      status: 200,
      durationMs: 4200,
      result: {
        status: 'ok',
        headline: 'One envelope per analysis',
        lines: [
          { kind: 'field', label: 'status', value: 'ok', accent: true },
          { kind: 'field', label: 'findings', value: 'vt1, vt2' },
          { kind: 'field', label: 'quality', value: 'good (of the recording)' },
          { kind: 'field', label: 'provenance', value: 'model, version, inputs' },
        ],
      },
    },
    {
      id: 'compute',
      kind: 'http',
      chapter: 'Analyse',
      method: 'POST',
      path: '/v1/cpet/cpet_8f3a91c4/compute',
      body: '{ "metrics": ["vo2max", "ve_vco2_slope"] }',
      latencyMs: 900,
      status: 200,
      durationMs: 2600,
      result: {
        status: 'ok',
        headline: 'Derived quantities',
        lines: [
          { kind: 'field', label: 'vo2max', value: '3.18 L/min' },
          { kind: 'field', label: 've_vco2_slope', value: 'profile over 25/50/75/100%' },
        ],
      },
    },

    // ── The payoff: rows somebody else owns ────────────────────────────────
    {
      id: 'rows',
      kind: 'table',
      chapter: 'Store',
      title: `cpet_measurements · ${COHORT} rows`,
      columns: ['subject', 'vt1', 'vt2', 'vo2peak', 'quality'],
      rows: [
        ['subject_041', '1.28', '2.06', '2.94', 'good'],
        ['subject_042', '1.42', '2.31', '3.18', 'good'],
        ['subject_043', '1.09', '1.84', '2.51', 'acceptable'],
        ['subject_044', '1.66', '2.58', '3.62', 'good'],
        ['subject_045', '1.21', '1.97', '2.77', 'good'],
        ['…', '', '', '', ''],
      ],
      caption:
        'Units L/min VO₂. Quality describes each recording, not the certainty of its result.',
      durationMs: 5200,
    },
    {
      id: 'written',
      kind: 'shell',
      chapter: 'Store',
      command: 'psql -c "select count(*) from cpet_measurements"',
      runMs: 900,
      output: {
        status: 'ok',
        headline: `${COHORT} rows`,
        lines: [
          { kind: 'note', text: 'In your schema, in your database, in your product.' },
        ],
      },
      durationMs: 3000,
    },

    // ── The reveal, aimed at whoever is integrating ────────────────────────
    {
      id: 'final',
      kind: 'final',
      chapter: 'Oxynet',
      headline: 'Your product, your reporting, our physiology.',
      accentWord: 'our physiology.',
      wordmark: 'Oxynet',
      channels: ['Interface', 'API', 'MCP'],
      activeChannel: 'API',
      site: 'oxynet.net',
      durationMs: 5000,
    },
  ],
}
