import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GlassCard } from '@/components/shared/glass-card'
import { GradientText } from '@/components/shared/gradient-text'
import { Badge } from '@/components/ui/badge'

const DEPLOYMENT_OPTIONS = [
  {
    icon: '🔌',
    title: 'API & MCP',
    badge: 'Integration-ready',
    description:
      'REST for clinical software, MCP for AI assistants, one key for both. Twenty vendor formats are detected automatically, so nothing upstream needs converting.',
    cta: { label: 'Read the docs', href: 'https://app.oxynet.net/docs', external: true },
  },
  {
    icon: '🌐',
    title: 'Web app',
    badge: 'No setup required',
    description:
      'Drop a raw metabolimeter file into the browser at app.oxynet.net and read the result. Free inferences, nothing stored, no installation.',
    cta: { label: 'Open app.oxynet.net', href: 'https://app.oxynet.net', external: true },
  },
  {
    icon: '🐍',
    title: 'Python package',
    badge: 'Open source',
    description:
      'The pyoxynet research package: run inference locally, generate synthetic CPET data, and build custom pipelines.',
    cta: { label: 'Install from PyPI', href: 'https://pypi.org/project/pyoxynet/', external: true },
  },
]

export function DeploymentSection() {
  return (
    <section id="deployment" className="section-padding border-t border-white/5">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Deployment
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Available in <GradientText>Three Formats</GradientText>
            </h2>
            <p className="text-white/55 max-w-xl mx-auto text-lg leading-relaxed">
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
                <div className="text-3xl">{option.icon}</div>
                <Badge>{option.badge}</Badge>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{option.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-5">{option.description}</p>
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
          <div className="glass rounded-2xl p-10 max-w-3xl mx-auto border border-white/8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="text-4xl flex-shrink-0">🔗</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Designed to integrate, not replace
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
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
