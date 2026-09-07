/**
 * Figures the site states more than once.
 *
 * They live here because the page used to disagree with itself: the hero said
 * twenty-one vendor formats while the deployment and developer sections said
 * twenty. A number a reader can check has to come from one place, and the PDF
 * manual counts from its own copy of the same value in `manual/config.mjs`.
 * Change one, change the other.
 */

/** Vendor export formats read with automatic detection. */
export const VENDOR_FORMATS = 21

/**
 * Retention, stated the way the API states it. Uploaded bytes are parsed and
 * discarded; what persists is the parsed record.
 */
export const RETENTION_HOURS = 24
