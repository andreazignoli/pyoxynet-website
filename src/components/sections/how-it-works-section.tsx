import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-4">
          <span className="flex-shrink-0 w-6 h-6 rounded-full border border-accent/40 text-accent text-xs font-mono flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span className="text-white/65 text-sm leading-relaxed">{step}</span>
        </li>
      ))}
    </ol>
  )
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-padding border-t border-white/5">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              How it works
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Simple to Use, <GradientText>Simple to Integrate</GradientText>
            </h2>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.1}>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* For clinics */}
            <div className="glass rounded-2xl p-8 border border-white/8">
              <p className="text-xs font-mono uppercase tracking-widest text-white/35 mb-5">
                For clinics &amp; hospitals
              </p>
              <h3 className="text-lg font-semibold text-white mb-6">Direct use</h3>
              <StepList
                steps={[
                  'Upload or stream CPET time-series data from your existing system.',
                  'Oxynet processes the signals and detects ventilatory thresholds automatically.',
                  'Receive structured outputs (intensity domains, VT1, VT2) ready for clinical review.',
                ]}
              />
            </div>

            {/* For manufacturers */}
            <div className="glass rounded-2xl p-8 border border-accent/15">
              <p className="text-xs font-mono uppercase tracking-widest text-accent/60 mb-5">
                For manufacturers &amp; software partners
              </p>
              <h3 className="text-lg font-semibold text-white mb-6">API integration</h3>
              <StepList
                steps={[
                  'Integrate the Oxynet API into your existing CPET software or device platform.',
                  'Send CPET data via standard API calls, with no change to your data capture pipeline.',
                  'Receive standardised interpretation outputs and display them within your software.',
                ]}
              />
            </div>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
