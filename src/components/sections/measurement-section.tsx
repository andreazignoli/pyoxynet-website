import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'

/**
 * The conceptual hinge of the site.
 *
 * The first generation of Oxynet used a model to recognise a pattern experts
 * had already defined: VT1, VT2, three intensity domains. That framing caps
 * the product at "does what an expert does, faster", which is both a weaker
 * claim than the engine supports and a harder one to sell to a manufacturer.
 *
 * What the engine actually does now is measure continuous properties of the
 * signal that are difficult to quantify by eye: oscillation period and
 * amplitude, how far a rhythm stands above a recording's own background, a
 * VE/VCO2 slope that is a profile rather than a number, and whether the gas
 * traces can be believed at all. Classification is one thing you can do with
 * those measurements. It is not the ceiling.
 */

function FlowColumn({
  label,
  tone,
  steps,
  note,
}: {
  label: string
  tone: 'muted' | 'accent'
  steps: string[]
  note: string
}) {
  const accent = tone === 'accent'
  return (
    <div
      className={[
        'glass rounded-2xl p-8',
        accent ? 'border border-accent/20' : 'border border-white/8',
      ].join(' ')}
    >
      <p
        className={[
          'text-xs font-mono uppercase tracking-widest mb-6',
          accent ? 'text-accent/70' : 'text-white/35',
        ].join(' ')}
      >
        {label}
      </p>

      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={step}>
            <div
              className={[
                'text-sm leading-snug py-2 px-3 rounded-lg',
                accent
                  ? i === steps.length - 1
                    ? 'text-accent bg-accent/8'
                    : 'text-white/75'
                  : i === steps.length - 1
                  ? 'text-white/45 bg-white/4 font-mono text-[13px]'
                  : 'text-white/60',
              ].join(' ')}
            >
              {step}
            </div>
            {i < steps.length - 1 && (
              <div
                className={[
                  'w-px h-4 ml-6',
                  accent ? 'bg-accent/30' : 'bg-white/10',
                ].join(' ')}
              />
            )}
          </div>
        ))}
      </div>

      <p
        className={[
          'text-xs leading-relaxed mt-6 pt-5 border-t',
          accent
            ? 'text-white/50 border-accent/12'
            : 'text-white/35 border-white/8',
        ].join(' ')}
      >
        {note}
      </p>
    </div>
  )
}

export function MeasurementSection() {
  return (
    <section id="measurement" className="section-padding border-t border-white/5">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              What changed
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              From classification to <GradientText>measurement</GradientText>
            </h2>
            <p className="text-white/55 max-w-2xl mx-auto text-lg leading-relaxed">
              Asking a CPET where VT1 and VT2 sit is one question. Asking what physiological
              structure the signals contain is a larger one, and it is the question the engine is
              now built to answer.
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.1}>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <FlowColumn
              label="Classification"
              tone="muted"
              steps={[
                'CPET recording',
                'Match against a defined pattern',
                'VT2 = 12.4 min · EOV = yes / no',
              ]}
              note="A verdict. Two patients either side of the same cut-off are reported as different. Two patients at opposite ends of one category are reported as the same."
            />
            <FlowColumn
              label="Measurement"
              tone="accent"
              steps={[
                'CPET recording',
                'Continuous physiological signals',
                'Quantitative features',
                'Structured physiological description',
              ]}
              note="Numbers with units. Each one carries where it sits in the test, how far it stands above that recording's own background, and whether the channel it came from can be believed."
            />
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.2} className="mt-10">
          <div className="glass rounded-2xl p-8 sm:p-10 max-w-3xl mx-auto border border-white/8">
            <h3 className="text-lg font-semibold text-white mb-4">
              A worked example: oscillatory ventilation
            </h3>
            <p className="text-white/55 text-sm leading-relaxed mb-6">
              Exercise oscillatory ventilation is usually reported as present or absent. Oxynet
              returns the oscillation itself: each episode with its period, its amplitude as a
              share of ventilation, how many times it exceeds the background variation of that
              recording, whether end-tidal CO₂ moves in antiphase to corroborate it, whether the
              swing grew or faded across the test, and where the burden peaked.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  k: 'Located',
                  v: 'An oscillation that fades during exercise is a different finding from one that emerges late.',
                },
                {
                  k: 'Corroborated',
                  v: 'A ventilatory swing that end-tidal CO₂ does not follow is reported as exactly that.',
                },
                {
                  k: 'Bounded',
                  v: 'Where a channel is clipping, the numbers it feeds are returned as bounds, not measurements.',
                },
              ].map((item) => (
                <div key={item.k}>
                  <p className="text-accent/80 text-xs font-mono uppercase tracking-widest mb-2">
                    {item.k}
                  </p>
                  <p className="text-white/45 text-xs leading-relaxed">{item.v}</p>
                </div>
              ))}
            </div>
            <p className="text-white/30 text-xs leading-relaxed mt-7 pt-5 border-t border-white/8">
              Oscillation analysis is in beta and has been developed on a single heart-failure
              cohort. It has not yet been tested for transportability to a second population, and
              is offered for research use on that basis.
            </p>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
