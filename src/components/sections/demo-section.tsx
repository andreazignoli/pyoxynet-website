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
              Drag or hover the slider to see how Oxynet transforms raw CPET measurements into
              color-coded intensity zones — automatically identifying VT1, VT2, and RCP thresholds.
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
                Automatic Zone Detection
              </h3>
              {[
                {
                  color: 'bg-blue-500',
                  label: 'Moderate Intensity',
                  description: 'Below the first ventilatory threshold (VT1). Sustainable aerobic exercise.',
                },
                {
                  color: 'bg-yellow-500',
                  label: 'Heavy Intensity',
                  description: 'Between VT1 and VT2. Increasing metabolic stress, still compensated.',
                },
                {
                  color: 'bg-orange-500',
                  label: 'Severe Intensity',
                  description: 'Between VT2 and RCP. Respiratory compensation point reached.',
                },
                {
                  color: 'bg-red-500',
                  label: 'Extreme Intensity',
                  description: 'Above RCP. Maximum effort, non-sustainable for extended periods.',
                },
              ].map((zone) => (
                <div key={zone.label} className="flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full ${zone.color} mt-1.5 flex-shrink-0 opacity-80`} />
                  <div>
                    <p className="text-white/90 font-medium text-sm">{zone.label}</p>
                    <p className="text-white/45 text-sm leading-relaxed mt-0.5">{zone.description}</p>
                  </div>
                </div>
              ))}

              <p className="text-white/30 text-xs mt-6 font-mono">
                * Placeholder CPET graphs — replace with real data images.
              </p>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
