import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DemoPlayer } from '@/components/demo/demo-player'
import { DEMOS, getDemo } from '@/content/demos'

/**
 * The recording stage, one route per demo.
 *
 * Not a page anyone is meant to land on: it exists so a demo can be screen
 * recorded on its own, with no navbar, no page ground and no disclosure line
 * under the window, and dropped into a post as a video. It is also where a new
 * demo gets reviewed before it has anywhere on the site to live.
 *
 * It paints a fixed full-screen overlay above the navbar (which lives in the
 * root layout and cannot be opted out of from here) and centres the window at
 * its natural 4:5. `npm run clip` drives it; `CLIP_DEMO=api npm run clip`
 * picks which. Keep it noindex.
 */
export function generateStaticParams() {
  return DEMOS.map((demo) => ({ slug: demo.slug }))
}

export const metadata: Metadata = {
  title: 'Oxynet demo',
  robots: { index: false, follow: false },
}

export default function DemoClipPage({ params }: { params: { slug: string } }) {
  const demo = getDemo(params.slug)
  if (!demo) notFound()

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-demo-void">
      {/* Rendered at 2x. A CDP screencast hands back frames at the CSS size of
          the window, so recording a 544px-wide element and upscaling it gives a
          soft clip. Chrome rasterises after the transform, so scaling here is
          real resolution rather than interpolation. */}
      <div style={{ transform: 'scale(2)', transformOrigin: 'center' }}>
        <DemoPlayer script={demo} className="w-[34rem]" hideDisclosure fixedHeight />
      </div>
    </div>
  )
}
