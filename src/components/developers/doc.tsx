import Link from 'next/link'
import { cn } from '@/lib/utils'
import { MATURITY, type Maturity } from '@/content/developers/maturity'
import { DOCS } from '@/content/developers/meta'

/**
 * The building blocks every developer page is written in. Server components,
 * no motion: this is reference material, read and re-read, and an entrance
 * animation on a table someone came back to check is friction.
 */

export function DocHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string
  title: string
  lede: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <header className="mb-12 pb-8 border-b border-hairline">
      <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">{eyebrow}</p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4 leading-tight">
        {title}
      </h1>
      <div className="text-ink-body text-lg leading-relaxed max-w-3xl">{lede}</div>
      {children}
      <p className="mt-6 text-[11px] font-mono text-ink-faint">
        API {DOCS.apiVersion} · docs {DOCS.version} · updated {DOCS.updated}
      </p>
    </header>
  )
}

export function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('mb-14 scroll-mt-24', className)}>
      <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
        <a href={`#${id}`} className="hover:text-accent transition-colors">
          {title}
        </a>
      </h2>
      {children}
    </section>
  )
}

/** Body copy at reading width. */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'text-ink-body text-[15px] leading-relaxed max-w-3xl space-y-4',
        '[&_code]:font-mono [&_code]:text-[13px] [&_code]:text-ink-strong [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded',
        '[&_a]:text-accent [&_a:hover]:underline [&_a]:underline-offset-2',
        '[&_strong]:text-ink-strong',
        className
      )}
    >
      {children}
    </div>
  )
}

type CalloutTone = 'note' | 'warn' | 'todo'

const CALLOUT: Record<CalloutTone, { border: string; label: string; labelClass: string }> = {
  note: { border: 'border-accent/25', label: 'Note', labelClass: 'text-accent' },
  warn: { border: 'border-warn/40', label: 'Read this', labelClass: 'text-warn' },
  // A gap in what is published, shown as a gap. Better than a plausible guess.
  todo: { border: 'border-dashed border-hairline', label: 'Not yet documented', labelClass: 'text-ink-faint' },
}

export function Callout({
  tone = 'note',
  title,
  children,
  className,
}: {
  tone?: CalloutTone
  title?: string
  children: React.ReactNode
  className?: string
}) {
  const c = CALLOUT[tone]
  return (
    <div className={cn('glass rounded-xl border p-5 max-w-3xl', c.border, className)}>
      <p className={cn('text-[10px] font-mono uppercase tracking-[0.18em] mb-2', c.labelClass)}>
        {title ?? c.label}
      </p>
      <div className="text-ink-body text-sm leading-relaxed space-y-2 [&_code]:font-mono [&_code]:text-[12.5px] [&_code]:text-ink-strong [&_a]:text-accent [&_a:hover]:underline">
        {children}
      </div>
    </div>
  )
}

export function StatusBadge({ status, className }: { status: Maturity; className?: string }) {
  const m = MATURITY[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.12em] border whitespace-nowrap',
        m.className,
        className
      )}
      title={m.meaning}
    >
      {m.label}
    </span>
  )
}

/** Availability, not evidence: an option that exists but is scoped with each partner. */
export function ArrangementBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.12em] border border-dashed border-hairline text-ink-subtle whitespace-nowrap',
        className
      )}
    >
      By arrangement
    </span>
  )
}

/**
 * A vertical flow: boxes joined by a line. `accent` marks the steps that are
 * Oxynet, so the reader sees at a glance where the engine sits in a pipeline
 * that is otherwise someone else's.
 */
export function Flow({
  steps,
  className,
  label,
}: {
  steps: { label: string; sub?: string; accent?: boolean }[]
  className?: string
  label?: string
}) {
  return (
    <div className={cn('flex flex-col items-stretch w-full max-w-[17rem] mx-auto', className)} aria-label={label}>
      {steps.map((s, i) => (
        <div key={`${s.label}-${i}`} className="flex flex-col items-center">
          <div
            className={cn(
              'w-full rounded-lg border px-3 py-2 text-center',
              s.accent ? 'border-accent/40 bg-accent/[0.06]' : 'border-hairline bg-surface/40'
            )}
          >
            <p className={cn('text-sm font-medium leading-snug', s.accent ? 'text-accent' : 'text-ink-strong')}>
              {s.label}
            </p>
            {s.sub && <p className="text-[11px] font-mono text-ink-faint mt-0.5">{s.sub}</p>}
          </div>
          {i < steps.length - 1 && (
            <div className="flex flex-col items-center py-0.5" aria-hidden="true">
              <div className={cn('w-px h-4', s.accent && steps[i + 1].accent ? 'bg-accent/40' : 'bg-hairline')} />
              <span className="text-ink-faint text-[10px] leading-none">▼</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function Card({
  children,
  className,
  accent = false,
}: {
  children: React.ReactNode
  className?: string
  accent?: boolean
}) {
  return (
    <div className={cn('glass rounded-xl border p-5', accent ? 'border-accent/25' : 'border-hairline', className)}>
      {children}
    </div>
  )
}

/** A two-column fact table: label on the left, value on the right. */
export function Facts({ rows }: { rows: [React.ReactNode, React.ReactNode][] }) {
  return (
    <div className="max-w-3xl rounded-xl border border-hairline overflow-x-auto">
      <table className="w-full text-sm table-fixed">
        <tbody>
          {rows.map(([k, v], i) => (
            <tr key={i} className="border-t border-hairline first:border-t-0">
              <th className="text-left font-normal text-ink-subtle px-4 py-2.5 align-top w-[38%]">{k}</th>
              <td className="px-4 py-2.5 text-ink-strong align-top break-words [&_code]:font-mono [&_code]:text-[12.5px] [&_code]:break-all">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Where to go next, at the foot of a page. */
export function NextSteps({ links }: { links: { href: string; label: string; note: string }[] }) {
  return (
    <nav aria-label="Next" className="mt-16 pt-8 border-t border-hairline grid sm:grid-cols-2 gap-4">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="glass rounded-xl border border-hairline p-4 hover:border-accent/40 transition-colors group"
        >
          <p className="text-sm font-medium text-ink-strong group-hover:text-accent transition-colors">
            {l.label} →
          </p>
          <p className="text-xs text-ink-subtle mt-1 leading-relaxed">{l.note}</p>
        </Link>
      ))}
    </nav>
  )
}
