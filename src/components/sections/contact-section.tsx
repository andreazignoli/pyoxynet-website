import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GlassCard } from '@/components/shared/glass-card'
import { GradientText } from '@/components/shared/gradient-text'

function MailIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}

const TEAM_EMAIL = 'oxynetcpetinterpreter@gmail.com'

/**
 * Three intents, not one inbox.
 *
 * This used to ask whether the reader was "interested in collaboration", which
 * treated a device manufacturer, a lab with a cohort and a strategic partner as
 * the same person. They want different things and they arrive knowing which,
 * so the section names the three rather than making them work it out.
 */
const DOORS = [
  {
    audience: 'Researchers and laboratories',
    action: 'Run a cohort',
    description:
      'Bring a set of recordings through the engine and get structured measurements back, consistently across protocols and devices.',
    email: 'andrea.zignoli@unitn.it',
    subject: 'Oxynet: running a cohort',
  },
  {
    audience: 'Software, devices, developers',
    action: 'Integrate Oxynet',
    description:
      'Call the engine from the software you already ship. Your product, your reporting, our physiology.',
    email: TEAM_EMAIL,
    subject: 'Oxynet: integration',
  },
  {
    audience: 'Strategic and commercial',
    action: 'Partner with Oxynet',
    description:
      'Build on the computational layer: licensing, deployment options and joint validation work.',
    email: 'andrea.zignoli@unitn.it',
    subject: 'Oxynet: partnership',
  },
]

export function ContactSection() {
  return (
    <section id="contact" className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Get in Touch
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              <GradientText>Contact</GradientText>
            </h2>
            <p className="text-ink-body max-w-xl mx-auto text-lg">
              Three ways to start, depending on what you need.
            </p>
          </div>
        </SectionWrapper>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {DOORS.map((door, i) => (
            <GlassCard key={door.action} delay={i * 0.1} className="flex flex-col">
              <p className="text-accent text-xs font-mono uppercase tracking-wider mb-3">
                {door.audience}
              </p>
              <h3 className="text-foreground font-semibold text-lg mb-2">{door.action}</h3>
              <p className="text-ink-subtle text-sm leading-relaxed mb-5 flex-1">
                {door.description}
              </p>
              <a
                href={`mailto:${door.email}?subject=${encodeURIComponent(door.subject)}`}
                className="inline-flex items-center gap-2 text-sm text-accent hover:underline underline-offset-2 font-medium"
              >
                <MailIcon />
                {door.action}
              </a>
            </GlassCard>
          ))}
        </div>

        {/* The old "feedback and issues" card became this line rather than
            disappearing: it is a real route, it is just not one of the three. */}
        <p className="text-ink-subtle text-sm text-center mt-8">
          Bugs, feature requests and anything else:{' '}
          <a
            href={`mailto:${TEAM_EMAIL}`}
            className="text-accent hover:underline underline-offset-2"
          >
            {TEAM_EMAIL}
          </a>
        </p>
      </div>
    </section>
  )
}
