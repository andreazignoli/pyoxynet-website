import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'

const METRICS = [
  { value: 'VT1', label: 'First Ventilatory Threshold', note: 'Strong agreement with expert labelling' },
  { value: 'VT2', label: 'Second Ventilatory Threshold', note: 'Validated across multiple populations' },
  { value: '3', label: 'Intensity Domains', note: 'Consistent classification per breath' },
]

export function ValidationSection() {
  return (
    <section id="validation" className="section-padding border-t border-white/5">
      <div className="section-container">
        <SectionWrapper>
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Scientific Validation
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Validated Against <GradientText>Expert Interpretation</GradientText>
            </h2>
            <p className="text-white/55 text-lg leading-relaxed">
              Oxynet has been evaluated against expert-level CPET interpretation, showing strong
              agreement for key physiological markers such as ventilatory thresholds. Its
              performance is documented in peer-reviewed publications.
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.15}>
          <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto mb-10">
            {METRICS.map((m) => (
              <div
                key={m.value}
                className="glass rounded-2xl p-6 text-center border border-white/8"
              >
                <div className="text-3xl font-bold gradient-text mb-2">{m.value}</div>
                <div className="text-white/80 font-medium text-sm mb-1">{m.label}</div>
                <div className="text-white/35 text-xs">{m.note}</div>
              </div>
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.25}>
          <div className="max-w-2xl mx-auto glass rounded-2xl p-6 border border-white/8 text-center">
            <p className="text-white/45 text-sm leading-relaxed">
              Oxynet&apos;s outputs are not intended to replace clinical judgement. They are designed to
              reduce variability and provide a reproducible baseline for further clinical review.
              Over 11 peer-reviewed publications document its methodology and validation.
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
