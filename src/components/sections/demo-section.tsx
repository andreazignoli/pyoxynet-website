'use client'

import { Compare } from '@/components/ui/compare'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'
import { Button } from '@/components/ui/button'

export function DemoSection() {
  return (
    <section id="demo" className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              See how it works
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              From Raw Data to <GradientText>Clinical Insight</GradientText>
            </h2>
            <p className="text-ink-body max-w-2xl mx-auto text-lg leading-relaxed">
              Drag the slider to see how raw CPET measurements are transformed into standardised
              intensity domains, automatically detecting LT and RCP to classify every breath.
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.15}>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Compare slider */}
            <div className="relative">
              <div className="p-3 glass rounded-3xl border border-hairline">
                <Compare
                  firstImage="/cpet-raw.svg"
                  secondImage="/cpet-analyzed.svg"
                  firstImageClassName="object-cover object-center"
                  secondImageClassname="object-cover object-center"
                  className="h-[320px] w-[320px] md:h-[440px] md:w-[440px] rounded-2xl"
                  slideMode="drag"
                  autoplay
                  autoplayDuration={3000}
                />
              </div>
            </div>

            {/* Legend / explanation */}
            <div className="max-w-sm space-y-5">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Intensity Domains
              </h3>
              {[
                {
                  color: 'bg-emerald-500',
                  label: 'Moderate Domain',
                  threshold: 'Below LT',
                  description: 'VO₂ reaches steady state within minutes. Blood lactate returns to resting levels. Exercise is fully sustainable.',
                },
                {
                  color: 'bg-warn',
                  label: 'Heavy Domain',
                  threshold: 'LT → RCP',
                  description: 'A VO₂ slow component emerges. Lactate rises but stabilises above baseline. Prolonged exercise remains possible.',
                },
                {
                  color: 'bg-rose-500',
                  label: 'Severe Domain',
                  threshold: 'Above RCP',
                  description: 'Respiratory compensation is engaged. Lactate and VO₂ rise continuously toward VO₂max. Exercise tolerance is time-limited.',
                },
              ].map((zone) => (
                <div key={zone.label} className="flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full ${zone.color} mt-1.5 flex-shrink-0 opacity-80`} />
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-ink-strong font-medium text-sm">{zone.label}</p>
                      <span className="text-ink-faint text-xs font-mono">{zone.threshold}</span>
                    </div>
                    <p className="text-ink-subtle text-sm leading-relaxed mt-0.5">{zone.description}</p>
                  </div>
                </div>
              ))}

              <p className="text-ink-faint text-xs mt-6 font-mono">
                Based on Keir et al., Sports Medicine (2022)
              </p>
            </div>
          </div>
        </SectionWrapper>

        {/* CTA block */}
        <SectionWrapper delay={0.3}>
          <div className="mt-16 glass rounded-2xl p-6 sm:p-10 max-w-2xl mx-auto text-center border border-hairline">
            <p className="text-ink-body text-sm mb-2">Ready to run one of your own?</p>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Drop a real CPET file into the app
            </h3>
            <p className="text-ink-subtle text-sm mb-6">
              Free inferences in the browser. Cortex, COSMED, MetaSoft and more, read as exported.
              Nothing is stored.
            </p>
            <Button size="lg" asChild className="w-full sm:w-auto">
              <a href="https://app.oxynet.net">Open app.oxynet.net →</a>
            </Button>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
