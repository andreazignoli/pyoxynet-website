import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'
import { UsageTabs } from './usage-tabs'
import { highlight } from '@/lib/shiki'
import { CODE_EXAMPLES } from '@/content/code-examples'

export async function UsageSection() {
  const [installPipHtml, installGitHtml, usageHtml, generationHtml] = await Promise.all([
    highlight(CODE_EXAMPLES.install_pip.code, CODE_EXAMPLES.install_pip.lang),
    highlight(CODE_EXAMPLES.install_git.code, CODE_EXAMPLES.install_git.lang),
    highlight(CODE_EXAMPLES.basic_usage.code, CODE_EXAMPLES.basic_usage.lang),
    highlight(CODE_EXAMPLES.generation.code, CODE_EXAMPLES.generation.lang),
  ])

  const tabs = [
    { label: 'Install', filename: CODE_EXAMPLES.install_pip.filename, html: installPipHtml },
    { label: 'Install (git)', filename: CODE_EXAMPLES.install_git.filename, html: installGitHtml },
    { label: 'Inference', filename: CODE_EXAMPLES.basic_usage.filename, html: usageHtml },
    { label: 'Generation', filename: CODE_EXAMPLES.generation.filename, html: generationHtml },
  ]

  return (
    <section id="usage" className="section-padding border-t border-hairline">
      <div className="section-container max-w-4xl">
        <SectionWrapper>
          <div className="mb-12">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Quick Start
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              <GradientText>Code Examples</GradientText>
            </h2>
            <p className="text-ink-body text-lg leading-relaxed max-w-2xl">
              Requires <strong className="text-ink-strong">Python 3.8+</strong>. Pyoxynet automatically
              handles data interpolation and supports second-by-second, breath-by-breath, and averaged
              CPET data formats.
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.1}>
          <UsageTabs tabs={tabs} />
        </SectionWrapper>
      </div>
    </section>
  )
}
