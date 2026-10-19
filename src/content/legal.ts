/**
 * Who provides Oxynet, and which version of the terms is in force.
 *
 * One place, because the terms page, the privacy page and the sign-up page in
 * the app (oxynet-core, ui/src/lib/signup.ts and oxynet/api/freekeys.py, which
 * carry TERMS_VERSION) must name the same provider and the same version. When
 * the terms change: new version and date here, the same version in both core
 * files, and people accept again at their next sign-in.
 *
 * Decided by the founder on 2026-10-19: the provider is Andrea Zignoli,
 * self-employed, in Verona, until the company exists; Italian law; the courts of
 * Verona. A field left null is rendered as a visible gap, never guessed.
 */

export const PROVIDER = {
  name: 'Andrea Zignoli',
  form: 'self-employed',
  city: '37124 Verona, Italy',
  /** Business address, as the founder chose to publish it (no house number). */
  address: 'Via A. Milani, Parona' as string | null,
  /** Partita IVA (check digit verified 2026-10-19; office code 023, Verona). */
  vat: '04833240239' as string | null,
  email: 'andrea.zignoli@unitn.it',
  courts: 'Verona, Italy',
} as const

/** Matches TERMS_VERSION in oxynet-core (ui/src/lib/signup.ts, oxynet/api/freekeys.py). */
export const TERMS_VERSION = '2026-10-19'
export const LEGAL_UPDATED = '19 October 2026'

/** Log lines are deleted after this many days (CloudWatch retention, set 2026-10-19). */
export const LOG_RETENTION_DAYS = 30
/** Per-key usage statistics are kept this long, then only totals across all keys. */
export const USAGE_DETAIL_MONTHS = 13
/** Free-key records are deleted this long after the key expires or is revoked. */
export const KEY_RECORD_MONTHS = 12
