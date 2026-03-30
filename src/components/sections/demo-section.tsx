'use client'

import { Compare } from '@/components/ui/compare'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'
import { Button } from '@/components/ui/button'

export function DemoSection() {
  return (
    <section id="demo" className="section-padding border-t border-white/5">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              See how it works
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              From Raw Data to <GradientText>Clinical Insight</GradientText>
            </h2>
            <p className="text-white/55 max-w-2xl mx-auto text-lg leading-relaxed">
              Drag the slider to see how raw CPET measurements are transformed into standardised
              intensity domains — automatically detecting LT and RCP to classify every breath.
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.15}>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Compare slider */}
            <div className="relative">
              <div className="p-3 glass rounded-3xl border border-white/10">
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
              <h3 className="text-xl font-semibold text-white mb-6">
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
                  color: 'bg-amber-500',
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
                      <p className="text-white/90 font-medium text-sm">{zone.label}</p>
                      <span className="text-white/30 text-xs font-mono">{zone.threshold}</span>
                    </div>
                    <p className="text-white/45 text-sm leading-relaxed mt-0.5">{zone.description}</p>
                  </div>
                </div>
              ))}

              <p className="text-white/30 text-xs mt-6 font-mono">
                Based on Keir et al., Sports Medicine (2022)
              </p>
            </div>
          </div>
        </SectionWrapper>

        {/* CTA block */}
        <SectionWrapper delay={0.3}>
          <div className="mt-16 glass rounded-2xl p-10 max-w-2xl mx-auto text-center border border-white/8">
            <p className="text-white/55 text-sm mb-2">Ready to interpret your own CPET data?</p>
            <h3 className="text-xl font-semibold text-white mb-6">
              Try Oxynet on a real test
            </h3>
            <Button size="lg" asChild>
              <a
                href="https://www.exercisethresholds.com/oxynet"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try Oxynet on Exercise Thresholds →
              </a>
            </Button>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
