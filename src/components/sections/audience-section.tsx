import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GlassCard } from '@/components/shared/glass-card'
import { GradientText } from '@/components/shared/gradient-text'

const AUDIENCES = [
  {
    icon: '🏥',
    label: 'For Clinics & Hospitals',
    headline: 'Consistent interpretation at scale',
    description:
      'Reduce variability across clinicians and sessions. Oxynet provides a standardised interpretation layer you can deploy directly — via web or API — without changing your existing workflow.',
    cta: { label: 'Try Oxynet on Exercise Thresholds', href: 'https://www.exercisethresholds.com/oxynet', external: true },
  },
  {
    icon: '⚙️',
    label: 'For CPET Manufacturers',
    headline: 'Add AI interpretation to your system',
    description:
      'Integrate Oxynet via API to add automated, standardised CPET interpretation to your existing software. Send CPET data, receive structured outputs, display within your platform.',
    cta: { label: 'Request API access', href: '#contact' },
  },
  {
    icon: '🔬',
    label: 'For Researchers',
    headline: 'Open tools for CPET science',
    description:
      'Use the open-source Python package to run inference, generate synthetic CPET data, and integrate Oxynet into your research pipelines. Well-documented, actively maintained.',
    cta: { label: 'Explore the package', href: '#package' },
  },
]

export function AudienceSection() {
  return (
    <section id="audience" className="section-padding border-t border-white/5">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Who it&apos;s for
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Built for <GradientText>Your Context</GradientText>
            </h2>
            <p className="text-white/55 max-w-xl mx-auto text-lg leading-relaxed">
              Oxynet is available in formats designed for clinical deployment, system integration,
              and research use.
            </p>
          </div>
        </SectionWrapper>

        <div className="grid md:grid-cols-3 gap-5">
          {AUDIENCES.map((audience, i) => (
            <GlassCard key={audience.label} delay={i * 0.1}>
              <div className="text-3xl mb-4">{audience.icon}</div>
              <p className="text-xs font-mono uppercase tracking-widest text-accent/70 mb-2">
                {audience.label}
              </p>
              <h3 className="text-base font-semibold text-white mb-3">{audience.headline}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-5">{audience.description}</p>
              <a
                href={audience.cta.href}
                target={'external' in audience.cta ? '_blank' : undefined}
                rel={'external' in audience.cta ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1 text-sm text-accent hover:underline font-medium"
              >
                {audience.cta.label} →
              </a>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
