import type { DemoScript } from './types'

/**
 * Demo two of the three doors: Oxynet as an API.
 *
 * The first attempt at this reused the transcript layout and was unreadable,
 * because it looked exactly like the MCP demo with different words in it. The
 * audience here is a developer, and what a developer recognises is somebody
 * writing a file: one block on screen at a time, being typed, replaced by the
 * next, and finally run. Hence `layout: 'editor'`.
 *
 * Plain `fetch` on purpose. There is no JavaScript SDK to point at, and
 * inventing one would be inventing a product. What is shown is the real `/v1`
 * surface from `oxynet/api/v1.py`, callable from anything that speaks HTTP.
 * The response is shaped the way `analyze` really answers: `cpet_id` and one
 * envelope per analysis, each with its own status, findings and quality. The
 * values are invented, as the disclosure says.
 */
export const apiDemo: DemoScript = {
  slug: 'api',
  title: 'Oxynet as an API',
  label: 'REST API',
  statusText: 'v1',
  layout: 'editor',
  blurb:
    'Twenty lines against the REST API. Post the recording, read the measurements back, keep them in your own product.',
  disclosure:
    'Simulated run. The endpoint, the payload and the response shape are the live Oxynet REST API. The values are representative, not measured.',

  // Unused by this demo: there is no MCP server in the story. The shape is
  // required by the script type and only the connect and tool-list events read
  // it, neither of which appears here.
  server: {
    id: 'oxynet',
    namespace: 'oxynet',
    title: 'Oxynet REST API',
    transport: 'https',
    endpoint: 'app.oxynet.net/v1',
    tools: [],
  },

  startDelayMs: 600,

  events: [
    // ── Enough setup to make the call read, and no more ────────────────────
    // The first cut opened with an eleven-line fetch helper. It is the least
    // interesting code on screen and it pushed the round trip, which is the
    // part worth watching, past the halfway mark of the video.
    {
      id: 'setup',
      kind: 'code',
      chapter: 'Setup',
      filename: 'analyze.js',
      speed: 11,
      code: `const BASE = 'https://app.oxynet.net/v1'
const file = './subject_042.xlsx'

// goes straight to Oxynet, never through
// your own server
const { cpet_id } = await upload(file)`,
      durationMs: 3600,
    },

    // ── The one call that matters ──────────────────────────────────────────
    {
      id: 'analyze',
      kind: 'code',
      chapter: 'Analyse',
      filename: 'analyze.js',
      speed: 11,
      code: `// the validated models decide the physiology
const res = await fetch(
  \`\${BASE}/cpet/\${cpet_id}/analyze\`,
  {
    method: 'POST',
    headers: { Authorization: \`Bearer \${KEY}\` },
    body: JSON.stringify({ analyses: ['vt'] }),
  },
)`,
      durationMs: 4600,
    },

    // ── Out, inference, back ───────────────────────────────────────────────
    {
      id: 'run',
      kind: 'run',
      chapter: 'Response',
      filename: 'analyze.js',
      command: 'node analyze.js',
      request: `{ "analyses": ["vt"] }`,
      endpoint: '/v1/cpet/{cpet_id}/analyze',
      inference: 'oxynet-vt',
      runMs: 3800,
      response: `{
  "cpet_id": "cpet_8f3a91c4",
  "results": [
    {
      "analysis": "vt",
      "status": "ok",
      "findings": {
        "vt1": { "vo2": 1.42, "hr": 128 },
        "vt2": { "vo2": 2.31, "hr": 161 },
        "vo2peak": { "vo2": 3.18, "hr": 184 }
      },
      "quality": "good",
      "provenance": { "model": "oxynet-vt" }
    }
  ]
}`,
      durationMs: 9000,
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
      durationMs: 4200,
    },
  ],
}
