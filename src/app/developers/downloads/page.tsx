import type { Metadata } from 'next'
import Link from 'next/link'
import { statSync } from 'node:fs'
import path from 'node:path'
import { DocHeader, Section, Prose, Callout, NextSteps } from '@/components/developers/doc'
import { LINKS, PYOXYNET } from '@/content/developers/meta'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Downloads: CPET sample data, OpenAPI schema, code examples',
  description:
    'Synthetic CPET sample files, the Oxynet OpenAPI 3.0 schema, Python and curl examples, MCP configuration and the pyoxynet package, in one place.',
  alternates: { canonical: '/developers/downloads' },
}

function size(rel: string) {
  const bytes = statSync(path.join(process.cwd(), 'public', 'developers', rel)).size
  return bytes > 1024 ? `${Math.round(bytes / 1024)} KB` : `${bytes} B`
}

interface Item {
  name: string
  href: string
  meta: string
  body: string
  local?: boolean
}

function Row({ item }: { item: Item }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4">
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[13px] text-ink-strong break-all">{item.name}</p>
        <p className="text-sm text-ink-body leading-relaxed mt-1">{item.body}</p>
        <p className="text-[11px] font-mono text-ink-faint mt-1">{item.meta}</p>
      </div>
      <a
        href={item.href}
        {...(item.local ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
        className={cn(
          'shrink-0 inline-flex items-center justify-center text-sm font-medium rounded-lg px-4 py-2 transition-colors',
          item.local ? 'bg-accent-fill text-black hover:bg-accent/85' : 'border border-hairline text-ink-strong hover:border-accent/40'
        )}
      >
        {item.local ? 'Download' : 'Open'}
      </a>
    </div>
  )
}

function Group({ items }: { items: Item[] }) {
  return <div className="rounded-xl border border-hairline divide-y divide-hairline">{items.map((i) => <Row key={i.href} item={i} />)}</div>
}

export default function DownloadsPage() {
  const samples: Item[] = [
    {
      name: 'oxynet_sample.json',
      href: '/developers/samples/oxynet_sample.json',
      local: true,
      meta: `Oxynet canonical JSON · synthetic · ${size('samples/oxynet_sample.json')}`,
      body: 'An incremental test: 900 s at 2 s intervals, with V̇O₂, V̇CO₂, V̇E, breathing frequency, PetO₂, PetCO₂ and heart rate. No work-rate channel. Expect VT1 and VT2, and substrate against %V̇O₂peak.',
    },
    {
      name: 'oxynet_sample_oscillating.json',
      href: '/developers/samples/oxynet_sample_oscillating.json',
      local: true,
      meta: `Oxynet canonical JSON · synthetic · ${size('samples/oxynet_sample_oscillating.json')}`,
      body: 'The same test with a 60 s oscillation added (ventilation and end-tidal CO₂ in antiphase), to exercise the research-stage oscillation analysis.',
    },
  ]

  const examples: Item[] = [
    { name: 'examples/README.md', href: '/developers/examples/README.md', local: true, meta: 'Markdown', body: 'What each file is and how to run it.' },
    { name: 'examples/python/quickstart.py', href: '/developers/examples/python/quickstart.py', local: true, meta: 'Python 3 · requests', body: 'Capabilities, upload, analyses, derived quantities, deletion.' },
    { name: 'examples/rest/quickstart.sh', href: '/developers/examples/rest/quickstart.sh', local: true, meta: 'bash · curl · jq', body: 'The same flow from a shell.' },
    { name: 'examples/mcp/claude-code.sh', href: '/developers/examples/mcp/claude-code.sh', local: true, meta: 'Claude Code', body: 'Connect Claude Code to the MCP server.' },
    { name: 'examples/mcp/gemini-settings.json', href: '/developers/examples/mcp/gemini-settings.json', local: true, meta: 'Gemini CLI', body: 'MCP server entry for ~/.gemini/settings.json.' },
  ]

  const api: Item[] = [
    { name: 'openapi.json', href: LINKS.openapi, meta: 'OpenAPI 3.0 · live · no key needed', body: 'The machine-readable API, served by the running service. Import into a client generator, a GPT Action or an integration platform.' },
    { name: 'API documentation', href: LINKS.apiDocs, meta: 'app.oxynet.net/docs', body: 'The reference generated from that schema.' },
    { name: 'llms-full.txt', href: LINKS.llmsFull, meta: 'plain text', body: 'The complete integration guide, written for an agent to read in one request.' },
  ]

  const pkg: Item[] = [
    { name: 'pyoxynet on PyPI', href: LINKS.pypi, meta: `v${PYOXYNET.version} · Python ${PYOXYNET.python} · ${PYOXYNET.license}`, body: 'Open-source local research inference and synthetic CPET generation. Not a client for the hosted API.' },
    { name: 'pyoxynet on GitHub', href: LINKS.pyoxynetRepo, meta: 'source', body: 'The package source and its README.' },
  ]

  return (
    <>
      <DocHeader
        eyebrow="Downloads"
        title="Everything to get started"
        lede={<p>Sample data, examples and schema. Nothing here requires an account to download.</p>}
      />

      <Section id="samples" title="Sample CPET data">
        <Group items={samples} />
        <Callout tone="warn" title="Synthetic, and what that means" className="mt-5">
          <p>
            Both files are the output of the API&apos;s own generator (<code>GET /v1/sample</code>),
            saved on {`2026-09-22`}. No person and no patient. The thresholds sit near 55 % and 80 % of
            the exercise period because the generator placed them there, and the <code>LT</code> and{' '}
            <code>RCP</code> fields in the file record that placement. They show the pipeline working;
            they are not validation data and say nothing about accuracy.
          </p>
        </Callout>
      </Section>

      <Section id="examples" title="Examples">
        <Group items={examples} />
        <Prose className="mt-4"><p className="text-sm">Each is shown in full on the <Link href="/developers/quickstart#run">quick start</Link>, <Link href="/developers/python">Python</Link> and <Link href="/developers/mcp">MCP</Link> pages.</p></Prose>
      </Section>

      <Section id="api" title="API schema and documentation">
        <Group items={api} />
      </Section>

      <Section id="python" title="Python package">
        <Group items={pkg} />
      </Section>

      <Section id="manual" title="The manual">
        <Group items={[{ name: 'oxynet-manual.pdf', href: LINKS.manual, meta: 'PDF · always the current edition', body: 'The engine, the evidence and the integration options, written to be forwarded.' }]} />
      </Section>

      <NextSteps
        links={[
          { href: '/developers/quickstart', label: 'Quick start', note: 'Use these in order.' },
          { href: '/developers/formats', label: 'Supported formats', note: 'Before sending your own file.' },
        ]}
      />
    </>
  )
}
