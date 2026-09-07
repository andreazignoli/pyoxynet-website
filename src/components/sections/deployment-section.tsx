import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GlassCard } from '@/components/shared/glass-card'
import { GradientText } from '@/components/shared/gradient-text'
import { VENDOR_FORMATS, RETENTION_HOURS } from '@/content/facts'
import { IconApi, IconBrowser, IconCode } from '@/components/shared/icons'
import { Badge } from '@/components/ui/badge'

const DEPLOYMENT_OPTIONS = [
  {
    Icon: IconApi,
    title: 'API & MCP',
    badge: 'Integration-ready',
    description:
      `REST for clinical software, MCP for AI assistants, one key for both. ${VENDOR_FORMATS} vendor formats are detected automatically, so nothing upstream needs converting.`,
    cta: { label: 'Read the docs', href: 'https://app.oxynet.net/docs', external: true },
  },
  {
    Icon: IconBrowser,
    title: 'Web app',
    badge: 'No setup required',
    description:
      `Drop a raw metabolimeter file into the browser at app.oxynet.net and read the result. No installation, and the uploaded file is parsed and discarded: the parsed record is deleted after ${RETENTION_HOURS} hours.`,
    cta: { label: 'Open app.oxynet.net', href: 'https://app.oxynet.net', external: true },
  },
  {
    Icon: IconCode,
    title: 'Python package',
    badge: 'Open source',
    description:
      'The pyoxynet research package: run inference locally, generate synthetic CPET data, and build custom pipelines.',
    cta: { label: 'Install from PyPI', href: 'https://pypi.org/project/pyoxynet/', external: true },
  },
]

export function DeploymentSection() {
  return (
    <section id="deployment" className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Deployment
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Available in <GradientText>Three Formats</GradientText>
            </h2>
            <p className="text-ink-body max-w-xl mx-auto text-lg leading-relaxed">
              One engine, three doors. Start in the browser, move to the API when it should
              happen automatically, and use the open-source package when the work belongs in a
              script.
            </p>
          </div>
        </SectionWrapper>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {DEPLOYMENT_OPTIONS.map((option, i) => (
            <GlassCard key={option.title} delay={i * 0.1}>
              <div className="flex items-start justify-between mb-4">
                <option.Icon className="w-6 h-6 text-accent" />
                <Badge>{option.badge}</Badge>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{option.title}</h3>
              <p className="text-ink-subtle text-sm leading-relaxed mb-5">{option.description}</p>
              <a
                href={option.cta.href}
                target={option.cta.external ? '_blank' : undefined}
                rel={option.cta.external ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1 text-sm text-accent hover:underline font-medium"
              >
                {option.cta.label} →
              </a>
            </GlassCard>
          ))}
        </div>

        {/* Integration callout */}
        <SectionWrapper delay={0.3}>
          <div className="glass rounded-2xl p-10 max-w-3xl mx-auto border border-hairline">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <IconApi className="w-7 h-7 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Designed to integrate, not replace
                </h3>
                <p className="text-ink-body text-sm leading-relaxed">
                  Oxynet runs on top of existing CPET systems. It reads CPET time-series and
                  returns structured outputs over the API or in an embedded deployment, without
                  changes to your data capture hardware, clinical workflow, or reporting
                  interface.
                </p>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
