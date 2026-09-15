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
    // ── One helper, so the calls that follow read as calls ─────────────────
    {
      id: 'setup',
      kind: 'code',
      chapter: 'Setup',
      filename: 'analyze.js',
      speed: 11,
      code: `const KEY = process.env.OXYNET_KEY

const api = (path, body) =>
  fetch('https://app.oxynet.net' + path, {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((r) => r.json())`,
      durationMs: 6200,
    },

    // ── The file goes straight to Oxynet, not through your server ──────────
    {
      id: 'upload',
      kind: 'code',
      chapter: 'Upload',
      filename: 'analyze.js',
      speed: 12,
      code: `// a one-shot URL, so the recording never
// passes through your own server
const { upload_url } = await api('/v1/uploads', {
  count: 1,
})

const { cpet_id } = await postFile(
  upload_url,
  './subject_042.xlsx',
)`,
      durationMs: 6400,
    },

    // ── The one call that matters ──────────────────────────────────────────
    {
      id: 'analyze',
      kind: 'code',
      chapter: 'Analyse',
      filename: 'analyze.js',
      speed: 12,
      code: `// the validated models decide the physiology,
// not your code and not a language model
const { results } = await api(
  \`/v1/cpet/\${cpet_id}/analyze\`,
  { analyses: ['vt'] },
)

console.log(results[0].findings)`,
      durationMs: 5800,
    },

    // ── Run it ─────────────────────────────────────────────────────────────
    {
      id: 'run',
      kind: 'run',
      chapter: 'Response',
      filename: 'analyze.js',
      command: 'node analyze.js',
      request: `{ "analyses": ["vt"] }`,
      endpoint: '/v1/cpet/{cpet_id}/analyze',
      inference: 'oxynet-vt',
      runMs: 4400,
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
      "provenance": {
        "model": "oxynet-vt",
        "inputs": ["VO2", "VCO2", "VE"]
      }
    }
  ]
}`,
      durationMs: 11000,
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
