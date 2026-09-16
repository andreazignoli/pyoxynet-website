import { MARK } from '@/generated/registry'

/**
 * The Oxynet mark: a low-poly wireframe duck, the glyph "E" of the 3D Animals
 * typeface by Vladimir Nikolic, extracted to a path so it renders without the
 * font installed.
 *
 * Inlined rather than loaded from /oxynet-icon.svg because the glyph is drawn
 * with `currentColor`: an <img> is a separate document and cannot inherit the
 * colour of the page around it. The geometry is generated from the same asset
 * app.oxynet.net serves at /oxynet-icon.svg, so the two properties cannot show
 * different ducks.
 */
export function DuckMark({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox={MARK.viewBox} className={className} role="img" aria-label="Oxynet">
      <title>Oxynet</title>
      <g transform={MARK.transform}>
        <path
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={MARK.strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          d={MARK.path}
        />
      </g>
    </svg>
  )
}
