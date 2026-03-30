import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'

export function AboutSection() {
  return (
    <section id="about" className="section-padding border-t border-white/5">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              The Problem &amp; Solution
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Standardising <GradientText>CPET Interpretation</GradientText>
            </h2>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.1}>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Problem */}
            <div className="glass rounded-2xl p-8 border border-white/8">
              <p className="text-xs font-mono uppercase tracking-widest text-white/35 mb-4">Problem</p>
              <h3 className="text-lg font-semibold text-white mb-4">
                Interpretation variability limits clinical utility
              </h3>
              <p className="text-white/55 leading-relaxed text-sm">
                CPET interpretation is variable and often requires manual adjustment. Different
                software tools can produce inconsistent results, increasing clinician workload and
                introducing uncertainty into clinical decision-making.
              </p>
            </div>

            {/* Solution */}
            <div className="glass rounded-2xl p-8 border border-accent/20">
              <p className="text-xs font-mono uppercase tracking-widest text-accent/70 mb-4">Solution</p>
              <h3 className="text-lg font-semibold text-white mb-4">
                A consistent, data-driven interpretation layer
              </h3>
              <p className="text-white/55 leading-relaxed text-sm">
                Oxynet provides a standardised interpretation layer that reduces variability and
                supports reproducible outputs — operating across protocols, populations, and
                devices without manual adjustment.
              </p>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.25} className="mt-10">
          <div className="glass rounded-2xl p-8 text-center max-w-3xl mx-auto">
            <p className="text-white/60 leading-relaxed text-sm">
              Oxynet is not a replacement for clinical expertise. It is a{' '}
              <span className="text-white/85 font-medium">standardisation engine</span> — a
              consistency layer designed to reduce interpretation variability and support
              reproducible outputs across clinical settings and systems.
            </p>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
