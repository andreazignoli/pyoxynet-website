import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'

export function AboutSection() {
  return (
    <section id="about" className="section-padding border-t border-hairline">
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
            <div className="glass rounded-2xl p-8 border border-hairline">
              <p className="text-xs font-mono uppercase tracking-widest text-ink-faint mb-4">Problem</p>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Interpretation variability limits clinical utility
              </h3>
              <p className="text-ink-body leading-relaxed text-sm">
                CPET interpretation is variable and often requires manual adjustment. Different
                software tools can produce inconsistent results, increasing clinician workload and
                introducing uncertainty into clinical decision-making.
              </p>
            </div>

            {/* Solution */}
            <div className="glass rounded-2xl p-8 border border-accent/20">
              <p className="text-xs font-mono uppercase tracking-widest text-accent/70 mb-4">Solution</p>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                A measurement layer under the interpretation
              </h3>
              <p className="text-ink-body leading-relaxed text-sm">
                Oxynet computes the same quantities the same way on every recording, whatever
                produced it, so the reading a clinician gives is anchored to numbers that do not
                move between sessions, sites or systems.
              </p>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.25} className="mt-10">
          <div className="glass rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-ink-subtle leading-relaxed text-sm text-center">
              Oxynet is a{' '}
              <span className="text-ink-strong font-medium">computational engine</span>, not a
              replacement for clinical expertise. It measures; the reading stays with the
              clinician.
            </p>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
