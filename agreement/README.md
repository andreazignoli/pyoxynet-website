# The data transfer agreement template

A 16-page A4 PDF that Oxynet sends to a partner sharing CPET recordings. Every
choice is printed with its alternatives; blanks are left for the partner's
details. The PDF is **fillable**: tick boxes, choose-one options and text
fields work in any PDF reader, and the filled copy is saved and sent back.
It is served at `/data-agreement` (not indexed, linked from the partner and
data-handling pages).

```bash
npm run agreement     # build, fit-check every page, print, add form fields
```

Output: `public/agreement/oxynet-data-transfer-agreement.pdf` (committed).

| File | What lives there |
|---|---|
| `config.mjs` | version, date, contact, output path, changelog |
| `pages.mjs` | the text, one function per page; `ITEMS` feeds the Annex A tracker |
| `tiers.mjs` | the three tiers, the lowest tier of every item, and the defaults for skipped items |
| `ui.mjs` | form primitives: `opt`, `item`, `line`, `blank`, `box` |
| `build.mjs` | assembles the HTML with the manual's CSS and runs the manual's fit check |
| `render.mjs` | prints with Chrome, measures every tagged element, lays pdf-lib fields over them |

It reuses the manual's tokens, mark, CSS (`manual/style.mjs`) and fit check,
so the two documents cannot drift apart visually.

## Rules

- **Fields follow the layout.** Never type coordinates. Every interactive
  element is tagged in `ui.mjs` and positioned by measuring the rendered page.
  A duplicate field name fails the render.
- **Choose-one items are radio groups named `item_<id>`**; tick-all items are
  check boxes named `<id>_<key>`. Renaming an option changes its field name,
  which only matters for copies already filled.
- **Add an item to `ITEMS`** in `pages.mjs` when you add one to the text, so
  the tracker lists it.
- **Facts about the service** (retention, what is stored, regulatory status)
  are restated from oxynet-core and the manual. Anything the repository cannot
  establish (hosting region, which legal entity signs, legal basis) stays a
  blank or an option, never a guess.
- **Filled or signed copies never go in this repository.** They name
  institutions and commercial terms; they belong in `oxynet-company`.
- **One change, one version.** Bump `VERSION` and `DATE` in `config.mjs` and
  add a changelog line; the version is in every folio, so a signed copy can be
  matched to its template.
- **Legal review.** The template was drafted from the repository's facts, not
  by a lawyer. Have counsel review it before first use and after any change to
  a fixed term.

## Annex C depends on the live AWS configuration

`HOSTING` in `config.mjs` is read from the AWS account, not assumed: App Runner
service and S3 bucket `oxynet-data` in eu-central-1, SSE-S3 at rest, public
access blocked (checked 2026-09-22). Re-read before any version bump.

**`purgeDays` is only true while an S3 lifecycle rule expires noncurrent
versions under `cpet/`.** The bucket is versioned, so without that rule a record
the service deletes stays in S3 as an old version indefinitely. The same
sentence appears on the site's data-handling page. If the rule is ever removed,
both are false.

## Tiers

One document, three depths: Feasibility, Validation, Data contribution and
model development, chosen in item 0.1. Every item's lowest tier lives in
`tiers.mjs`; `item()` draws it as three squares under the number and **fails
the build for an item with no tier**, so adding an item forces the decision.
Anything a skipped item would leave undecided gets a line in `DEFAULTS`, which
is printed on the scope page. Page numbers follow the order of `PAGES`, so a
page can be inserted without renumbering by hand.
