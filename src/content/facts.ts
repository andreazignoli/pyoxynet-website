/**
 * Figures the site states more than once.
 *
 * They live here because the page used to disagree with itself: the hero said
 * twenty-one vendor formats while the deployment and developer sections said
 * twenty. A number a reader can check has to come from one place.
 *
 * The format count is no longer typed here at all. It is generated from the
 * parser in oxynet-core, the same count /llms.txt and /v1/formats state, by the
 * orchestration repo's `harness/registry.py sync`. The manual reads the same
 * generated value.
 */

/** Vendor export formats read with automatic detection. */
export { VENDOR_FORMATS } from '../generated/registry'

/**
 * Retention, stated the way the API states it. Uploaded bytes are parsed and
 * discarded; what persists is the parsed record.
 */
export const RETENTION_HOURS = 24
