import type { Metadata } from 'next'
import { DemoPlayer } from '@/components/demo/demo-player'
import { mcpDemo } from '@/content/demos'

/**
 * The recording stage.
 *
 * Not a page anyone is meant to land on: it exists so the demo can be screen
 * recorded on its own, with no navbar, no page ground and no disclosure line
 * under the window, and dropped into a LinkedIn post as a video.
 *
 * It paints a fixed full-screen overlay above the navbar (which lives in the
 * root layout and cannot be opted out of from here) and centres the window at
 * its natural 4:5. Record a 1080x1350 viewport and the window fills it.
 *
 * `npm run clip` drives this route and writes the mp4. Keep it noindex.
 */
export const metadata: Metadata = {
  title: 'Oxynet MCP demo',
  robots: { index: false, follow: false },
}

export default function DemoClipPage() {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-demo-void">
      {/* Rendered at 2x. A CDP screencast hands back frames at the CSS size of
          the window, so recording a 544px-wide element and upscaling it gives a
          soft clip. Chrome rasterises after the transform, so scaling here is
          real resolution rather than interpolation. */}
      <div style={{ transform: 'scale(2)', transformOrigin: 'center' }}>
        <DemoPlayer
          script={mcpDemo}
          className="w-[34rem]"
          hideDisclosure
          fixedHeight
        />
      </div>
    </div>
  )
}
