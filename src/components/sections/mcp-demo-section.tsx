import { DemoPlayerLazy } from '@/components/demo/demo-player-lazy'
import { GradientText } from '@/components/shared/gradient-text'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { mcpDemo } from '@/content/demos'

/**
 * The MCP demo, on the landing page.
 *
 * `demo` as an id was already taken by the before/after slider further up, and
 * the rail names that one "Demo", so this is `agent-demo`.
 *
 * It sits directly under the developer section because that section carries the
 * connect line (`claude mcp add ... /oxynet-mcp`), and this is what connecting
 * it buys you. The order matters to the copy: connect first, then ask. The
 * agent never discovers anything.
 *
 * Nothing here explains the animation. If it needs a caption it is not
 * working.
 */
export function McpDemoSection() {
  return (
    <section id="agent-demo" className="section-padding border-t border-hairline">
      {/* The window is deliberately near-square and capped at 34rem. It is
          meant to be screen-recorded and posted, and a 16:9 developer console
          crops to nothing in a LinkedIn feed. On a wide page the copy takes the
          space the window gives back rather than stretching the window. */}
      <div className="section-container grid gap-10 lg:grid-cols-[1fr_34rem] lg:items-center lg:gap-16">
        <SectionWrapper>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-5">
            Agents
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.15]">
            Not the model&apos;s opinion. <GradientText>Oxynet&apos;s measurement</GradientText>.
          </h2>
          <p className="mt-5 text-ink-body text-base leading-relaxed max-w-xl">
            If you want your agentic system to rely on validated models rather than on a
            plausible sentence, connect your provider to the Oxynet MCP server and ask it
            to analyse the test with Oxynet capabilities.
          </p>
          <p className="mt-4 text-ink-subtle text-base leading-relaxed max-w-xl">
            A language model asked to read a cardiopulmonary exercise test will happily
            estimate a threshold from the trace. Told to use Oxynet, it stops estimating
            and starts calling: the assistant routes the question and explains the answer,
            and the physiology is decided by models trained on expert-labelled tests.
          </p>
        </SectionWrapper>

        <SectionWrapper delay={0.1} className="w-full lg:mt-0">
          <DemoPlayerLazy script={mcpDemo} className="mx-auto max-w-[34rem]" />
        </SectionWrapper>
      </div>
    </section>
  )
}
