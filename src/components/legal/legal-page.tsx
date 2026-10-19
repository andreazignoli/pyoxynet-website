import { Footer } from '@/components/layout/footer'
import { PROVIDER, TERMS_VERSION, LEGAL_UPDATED } from '@/content/legal'

/**
 * The frame for the terms and the privacy page: reading width, no sidebar, the
 * site footer. Not DocHeader, which stamps the API and docs versions; a legal
 * page states its own version and date instead.
 */
export function LegalPage({
  title,
  lede,
  children,
}: {
  title: string
  lede: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <main className="pt-24 sm:pt-28">
        <article className="max-w-3xl mx-auto px-6 pb-24">
          <header className="mb-12 pb-8 border-b border-hairline">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">Legal</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4 leading-tight">
              {title}
            </h1>
            <div className="text-ink-body text-lg leading-relaxed">{lede}</div>
            <p className="mt-6 text-[11px] font-mono text-ink-faint">
              version {TERMS_VERSION} · updated {LEGAL_UPDATED}
            </p>
          </header>
          {children}
        </article>
      </main>
      <Footer />
    </>
  )
}

/** A detail that has not been supplied yet, shown as a gap rather than guessed. */
function Gap({ label }: { label: string }) {
  return <span className="font-mono text-warn">[{label} to be added]</span>
}

/** The provider, as both pages state it. */
export function ProviderBlock() {
  return (
    <p>
      Oxynet is provided by <strong>{PROVIDER.name}</strong>, {PROVIDER.form},{' '}
      {PROVIDER.address ?? <Gap label="business address" />}, {PROVIDER.city}, VAT number{' '}
      {PROVIDER.vat ?? <Gap label="partita IVA" />} (&ldquo;Oxynet&rdquo;, &ldquo;we&rdquo;). Contact:{' '}
      <a href={`mailto:${PROVIDER.email}`}>{PROVIDER.email}</a>.
    </p>
  )
}
