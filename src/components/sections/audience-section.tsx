import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GlassCard } from '@/components/shared/glass-card'
import { GradientText } from '@/components/shared/gradient-text'
import { IconClinic, IconManufacturer, IconResearch } from '@/components/shared/icons'

const APP_URL = 'https://app.oxynet.net'

const AUDIENCES = [
  {
    Icon: IconClinic,
    label: 'For clinics & hospitals',
    headline: 'Consistent interpretation at scale',
    description:
      'Reduce variability across clinicians and sessions. Oxynet reads your metabolimeter export as exported and returns the same structured measurements every time, with no change to how you capture data.',
    cta: { label: 'Open the app', href: APP_URL, external: true },
  },
  {
    Icon: IconManufacturer,
    label: 'For manufacturers & software partners',
    headline: 'A physiology engine behind your system',
    description:
      'Call Oxynet from the software you already ship. Send the recording, receive structured measurements, display them in your own interface. Your product, your reporting, our physiology.',
    cta: { label: 'See the integration', href: '/integration' },
  },
  {
    Icon: IconResearch,
    label: 'For researchers',
    headline: 'A cohort, analysed in one pass',
    description:
      'Point an API client, or an AI assistant over MCP, at a directory of tests and get structured results back per recording. The open-source Python package covers local inference and synthetic data generation.',
    cta: { label: 'Analyse a cohort', href: '#agents' },
  },
]

export function AudienceSection() {
  return (
    <section id="audience" className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Who it&apos;s for
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Built for <GradientText>Your Context</GradientText>
            </h2>
            <p className="text-ink-body max-w-xl mx-auto text-lg leading-relaxed">
              The same engine, reached the way that fits your context: a browser, an API call,
              an assistant, or a Python import.
            </p>
          </div>
        </SectionWrapper>

        <div className="grid md:grid-cols-3 gap-5">
          {AUDIENCES.map((audience, i) => (
            <GlassCard key={audience.label} delay={i * 0.1}>
              <audience.Icon className="w-6 h-6 text-accent mb-4" />
              <p className="text-xs font-mono uppercase tracking-widest text-accent/70 mb-2">
                {audience.label}
              </p>
              <h3 className="text-base font-semibold text-foreground mb-3">{audience.headline}</h3>
              <p className="text-ink-subtle text-sm leading-relaxed mb-5">{audience.description}</p>
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
