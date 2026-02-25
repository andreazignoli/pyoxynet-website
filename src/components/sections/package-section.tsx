import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GlassCard } from '@/components/shared/glass-card'
import { GradientText } from '@/components/shared/gradient-text'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const MODELS = [
  {
    icon: '🔬',
    title: 'Inference Model',
    description:
      'Estimates exercise intensity domains from CPET data with high accuracy. Supports VO₂, VCO₂, VE, PetO₂, PetCO₂, VE/VO₂, and VE/VCO₂ inputs.',
    badge: 'TFLite',
  },
  {
    icon: '⚗️',
    title: 'Generator Model',
    description:
      'Creates realistic synthetic CPET data for research and validation using a Conditional GAN (CGAN) architecture.',
    badge: 'CGAN',
  },
]

export function PackageSection() {
  return (
    <section id="package" className="section-padding border-t border-white/5">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Open Source
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              The <GradientText>Pyoxynet</GradientText> Package
            </h2>
            <p className="text-white/55 max-w-2xl mx-auto text-lg leading-relaxed">
              A comprehensive suite of deep neural network algorithms specifically designed for CPET data
              analysis. Built with{' '}
              <a
                href="https://keras.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-accent transition-colors underline underline-offset-2"
              >
                Keras
              </a>{' '}
              and{' '}
              <a
                href="https://www.tensorflow.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-accent transition-colors underline underline-offset-2"
              >
                TensorFlow
              </a>
              , models available in efficient TFLite format.
            </p>
          </div>
        </SectionWrapper>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {MODELS.map((model, i) => (
            <GlassCard key={model.title} delay={i * 0.1}>
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{model.icon}</div>
                <Badge>{model.badge}</Badge>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{model.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{model.description}</p>
            </GlassCard>
          ))}
        </div>

        <SectionWrapper delay={0.2}>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <a
                href="https://pypi.org/project/pyoxynet/"
                target="_blank"
                rel="noopener noreferrer"
              >
                🐍 Install from PyPI
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://pyoxynet.readthedocs.io/en/latest/index.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                📖 Read the Docs
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://github.com/andreazignoli/pyoxynet"
                target="_blank"
                rel="noopener noreferrer"
              >
                ↗ GitHub
              </a>
            </Button>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
