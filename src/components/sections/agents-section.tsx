import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GlassCard } from '@/components/shared/glass-card'
import { GradientText } from '@/components/shared/gradient-text'

/**
 * Everything named here is live on app.oxynet.net today: the MCP endpoint, the
 * OpenAPI schema, the plain-text agent documentation. This section is not a
 * roadmap. It describes endpoints that already answer.
 */

const CHANNELS = [
  {
    label: 'REST',
    title: 'HTTP API',
    endpoint: '/v1/cpet · /v1/cpet/{id}/analyze',
    description:
      'Upload the vendor file exactly as exported and work with the handle you get back. Twenty metabolimeter formats are detected automatically, so nothing upstream has to normalise units or columns first.',
  },
  {
    label: 'MCP',
    title: 'Model Context Protocol',
    endpoint: '/oxynet-mcp',
    description:
      'A native connector for Claude, Gemini CLI and any MCP client. An assistant asked to analyse a folder of tests calls the physiological models directly, so the signals never travel through the conversation.',
  },
  {
    label: 'Schema',
    title: 'OpenAPI 3.0',
    endpoint: '/v1/openapi.json',
    description:
      'Importable into a custom GPT action, a client generator, or an integration platform. Every endpoint, parameter and response shape is machine-readable.',
  },
  {
    label: 'Plain text',
    title: 'Agent documentation',
    endpoint: '/llms.txt · /llms-full.txt',
    description:
      'A web page returns an empty shell to anything that fetches it. The integration guide is also served as plain text, so an agent can read it in one request.',
  },
]

export function AgentsSection() {
  return (
    <section id="agents" className="section-padding border-t border-white/5">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Programmatic access
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Built for machines, agents and{' '}
              <GradientText>clinical systems</GradientText>
            </h2>
            <p className="text-white/55 max-w-2xl mx-auto text-lg leading-relaxed">
              Oxynet exposes CPET interpretation as structured data, so clinical software,
              research pipelines and AI assistants can call the physiological models directly,
              without a person deciding, one test at a time, to use it.
            </p>
          </div>
        </SectionWrapper>

        <div className="grid sm:grid-cols-2 gap-5 mb-14">
          {CHANNELS.map((channel, i) => (
            <GlassCard key={channel.title} delay={i * 0.08}>
              <p className="text-xs font-mono uppercase tracking-widest text-accent/70 mb-3">
                {channel.label}
              </p>
              <h3 className="text-base font-semibold text-white mb-2">{channel.title}</h3>
              <p className="text-[11px] font-mono text-white/30 mb-4 break-all">
                {channel.endpoint}
              </p>
              <p className="text-white/50 text-sm leading-relaxed">{channel.description}</p>
            </GlassCard>
          ))}
        </div>

        <SectionWrapper delay={0.3}>
          <div className="glass rounded-2xl p-8 sm:p-10 max-w-3xl mx-auto border border-accent/12">
            <h3 className="text-xl font-semibold text-white mb-4">
              The test happens. The interpretation follows.
            </h3>
            <p className="text-white/55 text-sm leading-relaxed mb-7">
              The unit of work is not a person uploading a file. A testing service that runs
              thousands of CPETs a year can have every one of them interpreted as it is recorded:
              no export, no manual transfer, no decision to make per test. That is the integration
              Oxynet is built for.
            </p>

            <div className="rounded-xl border border-white/8 bg-black/30 p-5 font-mono text-[12.5px] leading-relaxed overflow-x-auto">
              <p className="text-white/30 mb-3"># any MCP client, one line</p>
              <p className="text-white/70">
                <span className="text-accent">claude mcp add</span> --transport http oxynet \
              </p>
              <p className="text-white/70 pl-4">
                https://app.oxynet.net/oxynet-mcp --header{' '}
                <span className="text-white/45">&quot;X-API-Key: ...&quot;</span>
              </p>
              <p className="text-white/30 mt-4 mb-1"># then, in the conversation</p>
              <p className="text-white/55">
                &quot;analyse every CPET in this folder and tell me which
              </p>
              <p className="text-white/55">
                {' '}ones show oscillatory ventilation&quot;
              </p>
            </div>

            <p className="text-white/35 text-xs leading-relaxed mt-6">
              No result carries a confidence score, and an assistant should not invent one.
              Nothing here is calibrated against clinical outcomes. Where a recording cannot
              support an analysis, the API says so and says why. That refusal is the correct thing
              to report, not an obstacle to work around.
            </p>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
