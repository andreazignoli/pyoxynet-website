'use client'

import { Compare } from '@/components/ui/compare'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'

export function DemoSection() {
  return (
    <section id="demo" className="section-padding border-t border-white/5">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              See it in action
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              From Raw Data to <GradientText>Clinical Insight</GradientText>
            </h2>
            <p className="text-white/55 max-w-2xl mx-auto text-lg leading-relaxed">
              Drag the slider to see how Oxynet transforms raw CPET measurements into
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
              {/* Labels */}
              <div className="absolute top-6 left-6 z-50 pointer-events-none">
                <span className="text-xs font-mono bg-black/60 text-white/60 px-2 py-1 rounded border border-white/10">
                  Raw
                </span>
              </div>
              <div className="absolute top-6 right-6 z-50 pointer-events-none">
                <span className="text-xs font-mono bg-black/60 text-accent px-2 py-1 rounded border border-accent/30">
                  Oxynet
                </span>
              </div>
            </div>

            {/* Legend / explanation */}
            <div className="max-w-sm space-y-5">
              <h3 className="text-xl font-semibold text-white mb-6">
                Intensity Domains
              </h3>
              {[
                {
                  color: 'bg-green-500',
                  label: 'Moderate Domain',
                  threshold: 'Below LT',
                  description: 'VO₂ reaches steady state within minutes. Blood lactate returns to resting levels. Exercise is fully sustainable.',
                },
                {
                  color: 'bg-yellow-500',
                  label: 'Heavy Domain',
                  threshold: 'LT → RCP',
                  description: 'A VO₂ slow component emerges. Lactate rises but stabilises above baseline. Prolonged exercise remains possible.',
                },
                {
                  color: 'bg-red-500',
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
      </div>
    </section>
  )
}
