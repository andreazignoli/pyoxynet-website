import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Section, Prose, NextSteps } from '@/components/developers/doc'
import { GuidePage, RunIt, WhatComesBack, BeforeYouUpload } from '@/components/thresholds/guide'
import { VENDOR_GUIDES, guideHref, formatsFor } from '@/content/thresholds'
import { MAILTO } from '@/content/developers/meta'

/** Only the guides in content/thresholds.ts exist; any other slug is a 404, not a render. */
export const dynamicParams = false

export function generateStaticParams() {
  return VENDOR_GUIDES.map((g) => ({ vendor: g.slug }))
}

const guideFor = (slug: string) => VENDOR_GUIDES.find((g) => g.slug === slug)

export function generateMetadata({ params }: { params: { vendor: string } }): Metadata {
  const g = guideFor(params.vendor)
  if (!g) return {}
  return {
    title: `${g.title} | Oxynet`,
    description: g.description,
    alternates: { canonical: guideHref(g) },
    openGraph: { title: g.title, description: g.description, url: guideHref(g), siteName: 'Oxynet', type: 'article' },
  }
}

export default function VendorGuidePage({ params }: { params: { vendor: string } }) {
  const g = guideFor(params.vendor)
  if (!g) notFound()
  const formats = formatsFor(g)

  return (
    <GuidePage
      eyebrow={`Ventilatory thresholds · ${g.vendor}`}
      title={g.title}
      lede={<p>{g.lede}</p>}
      back={{ href: '/ventilatory-thresholds', label: 'VT1 and VT2 from any CPET file' }}
    >
      <Section id="exports" title={`Which ${g.vendor} exports`}>
        <ul className="max-w-3xl rounded-xl border border-hairline divide-y divide-hairline">
          {formats.map((f) => (
            <li key={f.id} className="px-4 py-3">
              <p className="text-sm text-ink-strong">{f.description}</p>
              {(f.container || f.note) && (
                <p className="text-xs text-ink-subtle mt-1">{[f.container, f.note].filter(Boolean).join('. ')}</p>
              )}
            </li>
          ))}
        </ul>
        <Prose className="mt-5">
          <p className="text-sm">
            The format is detected automatically. The parser was built on exports
            from specific software versions, and another version may lay the file out differently: the
            reliable test is one real file. If yours is refused, <a href={MAILTO.feasibility}>send one
            de-identified export</a>.
          </p>
        </Prose>
      </Section>

      <Section id="handles" title="What Oxynet deals with in the file">
        <Prose className="mb-4">
          <p>
            Send the export unchanged. These are the things that go wrong when a file is converted by hand,
            and the parser handles them itself:
          </p>
        </Prose>
        <ul className="max-w-3xl space-y-3 list-disc pl-5 text-ink-body text-[15px] leading-relaxed marker:text-accent">
          {g.handles.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </Section>

      <RunIt fileNoun={g.fileNoun} />

      <BeforeYouUpload />

      <WhatComesBack />

      <p className="text-xs text-ink-faint max-w-3xl">
        {g.vendor} is a trademark of its owner, named here only to describe the files Oxynet reads. Oxynet is
        not affiliated with or endorsed by {g.vendor}.
      </p>

      <NextSteps
        links={[
          { href: '/ventilatory-thresholds', label: 'VT1 and VT2 from a CPET file', note: 'Who decides the threshold, the published evidence, and common questions.' },
          { href: '/developers/formats', label: 'Every supported format', note: 'All vendors, and the JSON to convert into when nothing reads a file.' },
          ...VENDOR_GUIDES.filter((o) => o.slug !== g.slug).map((o) => ({
            href: guideHref(o),
            label: o.title,
            note: `The ${o.vendor} guide.`,
          })),
        ]}
      />
    </GuidePage>
  )
}
