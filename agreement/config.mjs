/**
 * What this edition of the data transfer agreement template says about itself.
 *
 * Bump VERSION and DATE together and add a CHANGELOG line. The version is on
 * the cover and in every folio, so a signed copy can always be matched to the
 * template it was filled from. Filled or signed copies never live in this
 * repository: they name institutions and terms, and belong in oxynet-company.
 */

export const VERSION = '1.6'
export const DATE = 'September 2026'

export const TITLE = 'Data Transfer Agreement'

export const RECIPIENT_CONTACT = {
  name: 'Andrea Zignoli',
  email: 'andrea.zignoli@unitn.it',
}

/**
 * Where the hosted service and its storage run, as read from the AWS account
 * on 2026-09-22 (aws apprunner list-services, aws s3api get-bucket-location,
 * get-bucket-encryption, get-public-access-block). Re-read them before a
 * version bump; Annex C prints these verbatim.
 */
export const HOSTING = {
  provider: 'Amazon Web Services (AWS)',
  region: 'eu-central-1 (Frankfurt, Germany)',
  compute: 'AWS App Runner',
  storage: 'Amazon S3',
  atRest: 'AES-256 server-side encryption (SSE-S3)',
  /**
   * No automatic expiry of noncurrent versions is configured: the bucket is
   * versioned and has no lifecycle rule, so a deleted object's prior versions
   * persist until they are deleted explicitly. Annex C therefore promises a
   * purge on deletion, carried out by hand, and states no timetable. Add the
   * lifecycle rule and this can become a stated period again.
   */
}

export const OUTPUT = {
  dir: 'public/agreement',
  file: 'oxynet-data-transfer-agreement.pdf',
}

export const CHANGELOG = [
  ['1.6', 'September 2026', 'Retention folded into Section 4, so one section now covers the whole life of the Data, and the sections after it renumbered. 4.3 states that it prevails over model development, and Section 5 states what it reaches, so the two cannot contradict each other.'],
  ['1.5', 'September 2026', 'Roles and legal basis removed; everything after it renumbered, so there is no gap. Transfer rebuilt as the chain it actually is: a cloud-drive link the Recipient downloads, then Oxynet storage, then training, with what is kept at analysis time as its own choice (nothing kept, kept without labels, kept with labels). Retention now covers every copy and states what persists regardless. Publication gains the Recipient publishing with the Provider cited as the source of the data and the expert labelling. Pre-submission review, the liability cap and the spare annexes removed.'],
  ['1.4', 'September 2026', 'Checked against the pipeline as built. Section 7 now names every way a contributed recording can be used (label-free representation learning, initialisation only, supervised training, evaluation, generative models behind the published synthetic samples, aggregate reference statistics, figures), separates signals from labels, and adds 7.4 on who a model trained on the Data may be offered to, enforced by the per-key model restriction the service already has. Withdrawal lists the derived artefacts by name. Revenue share added to 9.1. Annex C records where training runs and that only a monthly count per key persists. One page added.'],
  ['1.3', 'September 2026', 'Three tiers in one document: Feasibility, Validation, Data contribution and model development. Scope chosen in 0.1; every item marked with the tiers it applies to; defaults stated for skipped items. Page numbers now follow page order. One page added.'],
  ['1.2', 'September 2026', 'Annex C written from the live AWS configuration: service and storage in eu-central-1 (Frankfurt), encryption at rest, public access blocked, versioned copies purged after deletion, model training on the Recipient\u2019s workstation. One page added.'],
  ['1.1', 'September 2026', 'First review round. Roles decided per activity (analysis, model development) instead of once. Rights split into Data, models and know-how, and outputs, with an explicit no-exclusivity term. Withdrawal defined: future training only, existing models unaffected. Clinical-use term tied to the status in 11.1, which now describes the status at signature rather than a permanent one. Publication review, confidentiality and patent-delay options. Transfer to an Oxynet legal entity (10.3). Annexes C (hosting and security) and D (standard liability) and an indirect-loss option. Two pages added.'],
  ['1.0', 'September 2026', 'First edition: every choice shown as alternatives, fillable in any PDF reader.'],
]
