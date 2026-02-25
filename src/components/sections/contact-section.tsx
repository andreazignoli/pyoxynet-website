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

const CONTACTS = [
  {
    label: 'Feedback & Issues',
    name: 'Oxynet Team',
    email: 'oxynetcpetinterpreter@gmail.com',
    description: 'Bug reports, feature requests, and general inquiries about the Oxynet project.',
  },
  {
    label: 'Principal Investigator',
    name: 'Andrea Zignoli',
    email: 'andrea.zignoli@unitn.it',
    description: 'Research collaborations, academic partnerships, and scientific enquiries.',
  },
]

export function ContactSection() {
  return (
    <section id="contact" className="section-padding border-t border-white/5">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Get in Touch
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              <GradientText>Contact</GradientText>
            </h2>
            <p className="text-white/55 max-w-xl mx-auto text-lg">
              Interested in collaboration or have questions about the project?
            </p>
          </div>
        </SectionWrapper>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {CONTACTS.map((contact, i) => (
            <GlassCard key={contact.email} delay={i * 0.1}>
              <p className="text-accent text-xs font-mono uppercase tracking-wider mb-3">
                {contact.label}
              </p>
              <h3 className="text-white font-semibold text-lg mb-2">{contact.name}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-5">{contact.description}</p>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 text-sm text-accent hover:underline underline-offset-2 font-medium"
              >
                <MailIcon />
                {contact.email}
              </a>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
