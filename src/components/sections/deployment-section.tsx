import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GlassCard } from '@/components/shared/glass-card'
import { GradientText } from '@/components/shared/gradient-text'
import { Badge } from '@/components/ui/badge'

const DEPLOYMENT_OPTIONS = [
  {
    icon: '🔌',
    title: 'API',
    badge: 'Integration-ready',
    description:
      'Send CPET data, receive interpretation outputs. Designed for embedding into existing CPET systems and clinical software.',
    cta: { label: 'Request access', href: '#contact' },
  },
  {
    icon: '🌐',
    title: 'Web Platform',
    badge: 'No setup required',
    description:
      'Upload and interpret CPET data directly in the browser. Available now via Exercise Thresholds — no installation needed.',
    cta: { label: 'Try the demo', href: 'https://www.exercisethresholds.com/oxynet', external: true },
  },
  {
    icon: '🐍',
    title: 'Python Package',
    badge: 'Open source',
    description:
      'Full access via the pyoxynet package. Run inference, generate synthetic data, and build custom research pipelines.',
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
              Deploy Oxynet in the way that fits your system — from direct API integration to
              no-setup web access and open-source research tools.
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
                  Designed to integrate — not replace
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  Oxynet is built as a modular layer that operates on top of existing CPET systems.
                  It processes CPET time-series data and returns standardised interpretation outputs
                  via API or embedded deployment — without requiring changes to your data capture
                  hardware, clinical workflow, or reporting interface.
                </p>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
