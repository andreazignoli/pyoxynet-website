/**
 * API v1 facts that the OpenAPI schema does not carry.
 *
 * The endpoint LIST is read from the live schema (src/lib/openapi.ts), never
 * typed here. What lives here is what the schema cannot say: per-endpoint
 * guidance, the error codes, the limits and the response envelope. Each is
 * restated from oxynet-core (oxynet/api/v1.py, store.py, auth.py, usage.py)
 * and the served guide at /llms-full.txt, as of the date in DOCS.updated.
 * Where the two disagreed, the code won, and the disagreement is listed in the
 * handover notes rather than resolved here.
 *
 * When v2 exists it gets its own file, api-v2.ts, and its own page.
 */

/** Guidance keyed by "METHOD /path", shown under the schema's own summary. */
export const ENDPOINT_NOTES: Record<string, string> = {
  'POST /v1/uploads':
    'The right call when the file is on disk. Returns a one-shot upload_url (and a ready-to-run curl line) valid for 5 minutes; POST the file to it with no API key, because the ticket is the credential. {"count": N} mints up to 200 at once for a folder.',
  'POST /v1/cpet/content':
    'JSON upload for callers that cannot send multipart (GPT Actions, function calling). Body: filename (keep the real extension), content (text) or content_base64 (XLS/XLSX), optional retain_hours.',
  'GET /v1/cpet/{cpet_id}':
    'The upload summary again: detected format, channels with coverage and the reason for any that are absent, sampling, external load, parser flags, and thresholds the metabolimeter itself embedded, where present.',
  'DELETE /v1/cpet/{cpet_id}': 'Delete the parsed record now rather than at expiry.',
  'GET /v1/cpet/{cpet_id}/series':
    'Downsampled signals for plotting only. Every measurement runs server-side on the full-resolution record; never compute from these.',
  'POST /v1/cpet/{cpet_id}/analyze':
    'Body: {"analyses": ["vt", "eov", "substrate"]}. Returns {cpet_id, results: [envelope, ...]}, one envelope per analysis. Omit "model" unless you need a specific one; the default matches the web application. Unknown fields are a 422.',
  'GET /v1/metrics': 'The derived-quantity registry: each metric with its unit, required channels, minimum duration and reading notes.',
  'POST /v1/cpet/{cpet_id}/compute':
    'Body: {"metrics": ["vo2max", "ve_vco2_slope", "gas_quality"]}. Each metric returns {status: "ok", value} or {status: "unavailable", error, message, context}. Never a bare null.',
  'GET /v1/capabilities':
    'Call first. The analyses and metrics this key may run, the models it can reach, its limits (upload size, monthly limit, retention) and the retention policy.',
  'GET /v1/sample':
    'A synthetic recording as {filename, content, note, expected}. No key needed. ?oscillating=true for one that exercises the oscillation detector.',
  'GET /v1/formats':
    'Every format id with a label saying what it is, how detection works, and if_unsupported: the canonical shape to convert a file into when nothing reads it.',
}

/** Served but deliberately left out of /v1/openapi.json, which is shaped for importers that reject multipart. */
export const OUTSIDE_SCHEMA = [
  {
    method: 'POST',
    path: '/v1/cpet',
    summary: 'Multipart upload (field "file"), optional retain_hours',
    note: 'The upload to use from your own code. Returns the same summary as the JSON upload.',
  },
  {
    method: 'POST',
    path: '/v1/uploads/{ticket}',
    summary: 'Post a file to a one-shot upload URL',
    note: 'No API key: the signed ticket is the credential. You receive this URL from POST /v1/uploads.',
  },
] as const

/** Unauthenticated endpoints, as the code serves them. */
export const OPEN_ENDPOINTS = ['/v1/openapi.json', '/v1/sample', '/health', '/llms.txt', '/llms-full.txt']

export const LIMITS: [string, string][] = [
  ['Upload size', '25 MB (413 FILE_TOO_LARGE)'],
  ['Samples per recording', '20,000 (413 RECORDING_TOO_LONG)'],
  ['Upload ticket', 'valid 5 minutes, one file each, up to 200 per request'],
  ['Retention, default', '24 hours after upload'],
  ['Retention, maximum', '168 hours (7 days), when requested with retain_hours'],
  ['Rate limiting', 'per key; a 429 RATE_LIMITED carries a Retry-After header'],
  ['Monthly quota', 'set per key, reported in capabilities.limits.monthly_limit (429 QUOTA_EXCEEDED)'],
  ['Billing units', 'one per analysis that returns status "ok"; one per compute request with any metric ok. Uploads and refusals are not billed'],
]

export const ERRORS: { code: string; http: number; meaning: string }[] = [
  { code: 'MISSING_API_KEY', http: 401, meaning: 'No X-API-Key header.' },
  { code: 'INVALID_API_KEY', http: 403, meaning: 'The key is not recognised.' },
  { code: 'KEY_EXPIRED', http: 403, meaning: 'The key has passed its expiry date.' },
  { code: 'PRODUCT_NOT_ENABLED', http: 403, meaning: 'The key does not include that analysis. Analyses are licensed separately.' },
  { code: 'TIER_INSUFFICIENT', http: 403, meaning: 'The requested model needs a higher tier.' },
  { code: 'MODEL_NOT_ALLOWED', http: 403, meaning: 'The key is restricted to other models.' },
  { code: 'UPLOAD_TICKET_INVALID', http: 403, meaning: 'The upload URL is expired, used, or malformed.' },
  { code: 'CPET_NOT_FOUND', http: 404, meaning: 'Unknown id, or the record passed its expiry.' },
  { code: 'MODEL_NOT_FOUND', http: 404, meaning: 'No model by that name or version.' },
  { code: 'FILE_TOO_LARGE', http: 413, meaning: 'Over 25 MB.' },
  { code: 'RECORDING_TOO_LONG', http: 413, meaning: 'More than 20,000 samples.' },
  { code: 'UNSUPPORTED_FORMAT', http: 422, meaning: 'Not recognised as any supported export. context.recovery gives the canonical shape to convert into.' },
  { code: 'PARSER_ERROR', http: 422, meaning: 'Format recognised, contents unreadable.' },
  { code: 'UNKNOWN_ANALYSIS', http: 422, meaning: 'Not one of vt, eov, substrate. "signal" is not an analysis: use GET /v1/cpet/{id} and compute.' },
  { code: 'VALIDATION_ERROR', http: 422, meaning: 'Malformed body, or an unrecognised field. context.errors says which.' },
  { code: 'RATE_LIMITED', http: 429, meaning: 'Back off and honour Retry-After.' },
  { code: 'QUOTA_EXCEEDED', http: 429, meaning: 'Monthly analysis limit reached.' },
  { code: 'INFERENCE_FAILED', http: 500, meaning: 'The model could not run. Worth reporting.' },
  { code: 'UPLOAD_TICKETS_UNAVAILABLE', http: 503, meaning: 'Upload tickets are temporarily unavailable; use POST /v1/cpet.' },
]

/**
 * Refusals INSIDE a 200. An analysis that cannot run returns an envelope with
 * status "not_analysable" and one of these, and the others still run.
 */
export const REFUSALS: [string, string][] = [
  ['vt', 'INSUFFICIENT_SIGNAL, MISSING_CHANNEL, TIER_INSUFFICIENT, MODEL_NOT_FOUND, INFERENCE_FAILED'],
  ['eov', 'NO_USABLE_DATA, INSUFFICIENT_DURATION, MISSING_CHANNEL, EOV_FAILED'],
  ['substrate', 'MISSING_CHANNEL, INSUFFICIENT_SIGNAL, SUBSTRATE_FAILED'],
]

/** The envelope, field by field, from v1.py. */
export const ENVELOPE_FIELDS: [string, string][] = [
  ['analysis', '"vt", "eov" or "substrate".'],
  ['status', '"ok", or "not_analysable" when the recording cannot support it.'],
  ['findings', 'The measurements. Shape depends on the analysis; null when not analysable.'],
  ['quality', '"good", "acceptable" or "poor". Describes the INPUT recording (coverage of VE, VO2, VCO2 and whether the sampling interval is known). It is not a confidence in the result, and no field is.'],
  ['notes', 'Plain-language caveats that must travel with the numbers into any report built on them.'],
  ['error, message, context', 'Present when status is "not_analysable": the code, the reason, and what was needed.'],
  ['provenance', 'analysis_version, schema_version, computed_at, the model that ran and latency_ms; for thresholds also model_version and model_tier.'],
]
