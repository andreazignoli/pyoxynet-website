import type { Metadata } from 'next'
import { DemoPlayer } from '@/components/demo/demo-player'
import { Footer } from '@/components/layout/footer'
import { GradientText } from '@/components/shared/gradient-text'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { Button } from '@/components/ui/button'
import { mcpDemo } from '@/content/demos'

const APP_URL = 'https://app.oxynet.net'

/**
 * The demo on its own page, so it can be sent to someone.
 *
 * The landing page is the primary home for this; this route exists because a
 * link to `/#agent-demo` drops a stranger into a fourteen-section page and
 * makes them hunt. Same component, same script, no duplication: if the demo
 * changes, this changes with it.
 *
 * The player is imported directly rather than through `DemoPlayerLazy`. On the
 * landing page it is several screens down and deferring it is free; here it is
 * the reason the page exists and is above the fold.
 */
const TITLE = 'Watch an agent use Oxynet'
const DESCRIPTION =
  'Connect your agentic system to the Oxynet MCP server and ask it to analyse a ' +
  'cardiopulmonary exercise test with Oxynet capabilities. The assistant routes the ' +
  'question; validated models decide the physiology.'

export const metadata: Metadata = {
  title: `${TITLE} | Oxynet`,
  description: DESCRIPTION,
  alternates: { canonical: '/demo' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.oxynet.net/demo',
    siteName: 'Oxynet',
    type: 'website',
    images: [{ url: '/og-agent-demo.png', width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-agent-demo.png'],
  },
}

export default function DemoPage() {
  return (
    <main>
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionWrapper>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-5">
              Oxynet · MCP
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.15]">
              Not the model&apos;s opinion. <GradientText>Oxynet&apos;s measurement</GradientText>.
            </h1>
            <p className="mt-5 text-ink-body text-base leading-relaxed">
              If you want your agentic system to rely on validated models rather than on a
              plausible sentence, connect your provider to the Oxynet MCP server and ask it
              to analyse the test with Oxynet capabilities.
            </p>
          </SectionWrapper>

          <SectionWrapper delay={0.1} className="mt-12">
            <DemoPlayer script={mcpDemo} className="mx-auto max-w-[34rem]" />
          </SectionWrapper>

          <SectionWrapper delay={0.15} className="mt-16">
            <div className="glass rounded-2xl p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint mb-5">
                Connect it yourself
              </p>
              <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed text-ink-body">
                <span className="text-ink-faint"># any MCP client, one line</span>
                {'\n'}
                <span className="text-accent">claude mcp add</span> --transport http oxynet \
                {'\n  '}
                https://app.oxynet.net/oxynet-mcp --header{' '}
                <span className="text-ink-strong">
                  &quot;Authorization: Bearer $OXYNET_KEY&quot;
                </span>
              </pre>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                    Open the app
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="mailto:andrea.zignoli@unitn.it?subject=Oxynet%20MCP">
                    Talk to us
                  </a>
                </Button>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>

      <Footer />
    </main>
  )
}
