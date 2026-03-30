import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GlassCard } from '@/components/shared/glass-card'
import { GradientText } from '@/components/shared/gradient-text'

const OUTPUTS = [
  {
    icon: '⚡',
    title: 'Ventilatory Thresholds',
    detail: 'VT1 · VT2',
    description:
      'Automated, consistent detection of the first and second ventilatory thresholds from breath-by-breath CPET data.',
  },
  {
    icon: '📐',
    title: 'Exercise Intensity Domains',
    detail: 'Moderate · Heavy · Severe',
    description:
      'Every breath classified into a physiologically meaningful intensity domain — no manual adjustment required.',
  },
  {
    icon: '📊',
    title: 'Standardised Interpretation Metrics',
    detail: 'Protocol-agnostic',
    description:
      'Structured outputs that are consistent across different CPET protocols and ergometer types.',
  },
  {
    icon: '🔁',
    title: 'Reproducible Outputs',
    detail: 'Across tests and systems',
    description:
      'The same input always produces the same output — enabling longitudinal tracking and reliable system-to-system comparison.',
  },
]

export function OutputsSection() {
  return (
    <section id="outputs" className="section-padding border-t border-white/5">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              What Oxynet Produces
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Concrete, <GradientText>Standardised Outputs</GradientText>
            </h2>
            <p className="text-white/55 max-w-2xl mx-auto text-lg leading-relaxed">
              Every CPET processed by Oxynet returns the same structured set of interpretation
              results — regardless of the device, protocol, or population.
            </p>
          </div>
        </SectionWrapper>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {OUTPUTS.map((output, i) => (
            <GlassCard key={output.title} delay={i * 0.08}>
              <div className="text-3xl mb-4">{output.icon}</div>
              <p className="text-xs font-mono text-accent/70 uppercase tracking-widest mb-1">
                {output.detail}
              </p>
              <h3 className="text-base font-semibold text-white mb-3">{output.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{output.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
