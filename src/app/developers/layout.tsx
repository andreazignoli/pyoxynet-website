import type { Metadata } from 'next'
import { Footer } from '@/components/layout/footer'
import { DocsSidebar } from '@/components/developers/docs-sidebar'

export const metadata: Metadata = {
  title: {
    template: '%s | Oxynet for developers',
    default: 'Oxynet for developers',
  },
}

export default function DevelopersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="pt-24 sm:pt-28">
        <div className="max-w-6xl mx-auto px-6 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          <aside>
            <DocsSidebar />
          </aside>
          <article className="min-w-0 pb-24">{children}</article>
        </div>
      </main>
      <Footer />
    </>
  )
}
