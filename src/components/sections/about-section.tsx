import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GlassCard } from '@/components/shared/glass-card'
import { GradientText } from '@/components/shared/gradient-text'

const PILLARS = [
  {
    icon: '🧬',
    title: 'CPET Experts',
    body: 'A global network of exercise physiologists and clinicians providing labeled training data, clinical validation, and domain expertise.',
  },
  {
    icon: '📊',
    title: 'Crowdsourced Dataset',
    body: 'A large, continuously growing dataset collected across diverse clinical settings worldwide, enabling robust and generalizable model training.',
  },
  {
    icon: '🤖',
    title: 'Advanced AI',
    body: 'Deep neural networks built with Keras and TensorFlow that approximate expert human judgment in CPET interpretation with high accuracy.',
  },
]

export function AboutSection() {
  return (
    <section id="about" className="section-padding">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              The Project
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              About <GradientText>Oxynet</GradientText>
            </h2>
            <p className="text-white/55 max-w-2xl mx-auto text-lg leading-relaxed">
              Universal access to high-quality healthcare remains a global challenge.{' '}
              <em className="text-white/75 not-italic">Oxynet</em> leverages AI and vast data resources to
              revolutionize the diagnosis of medical conditions through CPET analysis, enabling accurate and
              timely clinical decisions.
            </p>
          </div>
        </SectionWrapper>

        <div className="grid md:grid-cols-3 gap-5">
          {PILLARS.map((pillar, i) => (
            <GlassCard key={pillar.title} delay={i * 0.1}>
              <div className="text-4xl mb-5">{pillar.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-3">{pillar.title}</h3>
              <p className="text-white/55 leading-relaxed text-sm">{pillar.body}</p>
            </GlassCard>
          ))}
        </div>

        <SectionWrapper delay={0.4} className="mt-12">
          <div className="glass rounded-2xl p-8 text-center max-w-3xl mx-auto">
            <p className="text-white/60 leading-relaxed">
              We actively seek collaboration with universities, hospitals, clinics, medical professionals,
              and companies. Together we can advance research, contribute to publications, share data, and
              validate algorithms for clinical implementation.
            </p>
            <a
              href="mailto:oxynetcpetinterpreter@gmail.com"
              className="inline-flex items-center gap-2 mt-5 text-accent hover:underline text-sm font-medium"
            >
              Get in touch →
            </a>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
