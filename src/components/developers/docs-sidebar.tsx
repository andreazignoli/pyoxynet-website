'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { DEV_NAV, DEV_PAGES } from '@/content/developers/nav'

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="space-y-6">
      {DEV_NAV.map((group) => (
        <div key={group.group}>
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-faint mb-2 px-3">
            {group.group}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'block rounded-md px-3 py-1.5 text-sm transition-colors',
                      active
                        ? 'bg-accent/10 text-accent font-medium'
                        : 'text-ink-body hover:text-foreground hover:bg-surface'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

/** A sticky sidebar from lg up; a disclosure menu naming the current page below it. */
export function DocsSidebar() {
  const pathname = usePathname() ?? '/developers'
  const current = DEV_PAGES.find((p) => p.href === pathname)?.label ?? 'Developers'

  return (
    <>
      <nav aria-label="Developer documentation" className="hidden lg:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-8">
        <NavList pathname={pathname} />
      </nav>

      <details className="lg:hidden glass rounded-xl border border-hairline mb-8 group">
        <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between text-sm">
          <span>
            <span className="text-ink-faint font-mono text-[11px] uppercase tracking-[0.15em] mr-2">Developers</span>
            <span className="text-ink-strong">{current}</span>
          </span>
          <span className="text-ink-faint group-open:rotate-180 transition-transform" aria-hidden="true">
            ▾
          </span>
        </summary>
        <div className="px-1 pb-4">
          <NavList pathname={pathname} />
        </div>
      </details>
    </>
  )
}
