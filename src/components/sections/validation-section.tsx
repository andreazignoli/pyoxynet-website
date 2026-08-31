import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'

const METRICS = [
  { value: 'VT1', label: 'First ventilatory threshold', note: 'Strong agreement with expert labelling' },
  { value: 'VT2', label: 'Second ventilatory threshold', note: 'Evaluated across multiple populations' },
  { value: '12', label: 'Peer-reviewed papers', note: 'Methodology and evaluation' },
]

export function ValidationSection() {
  return (
    <section id="validation" className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Scientific Validation
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Measured against <GradientText>expert interpretation</GradientText>
            </h2>
            <p className="text-ink-body text-lg leading-relaxed">
              Threshold detection is evaluated against expert labelling and shows strong
              agreement, documented across peer-reviewed publications. Agreement with an expert is
              the floor the engine has to clear. The measurements it makes beyond that are the
              reason to build on it.
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.15}>
          <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto mb-10">
            {METRICS.map((m) => (
              <div
                key={m.value}
                className="glass rounded-2xl p-6 text-center border border-hairline"
              >
                <div className="text-3xl font-bold gradient-text mb-2">{m.value}</div>
                <div className="text-ink-strong font-medium text-sm mb-1">{m.label}</div>
                <div className="text-ink-faint text-xs">{m.note}</div>
              </div>
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.25}>
          <div className="max-w-2xl mx-auto glass rounded-2xl p-6 border border-hairline text-center">
            <p className="text-ink-subtle text-sm leading-relaxed">
              Threshold detection carries the longest evidence record here. Oscillation analysis is
              beta, developed on a single heart-failure cohort and not yet tested for
              transportability to a second population. Both are research software, and neither is a
              medical device.
            </p>
            <a
              href="#publications"
              className="inline-flex items-center gap-2 mt-4 text-accent hover:underline text-sm font-medium"
            >
              View publications →
            </a>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
