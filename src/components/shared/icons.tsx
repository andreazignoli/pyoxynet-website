/**
 * Line icons, drawn rather than imported, and the counterpart of
 * `manual/icons.mjs` in the PDF pipeline.
 *
 * One style throughout: stroke-based on a 20px grid, 1.5px stroke, round caps
 * and joins, no fills, `currentColor` so a card tints its own icon. These
 * replaced the emoji that used to sit at the top of the audience, deployment
 * and package cards: emoji render differently on every platform and read as
 * decoration on a document a hospital or a manufacturer is assessing.
 */

type IconProps = { className?: string }

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className ?? 'w-5 h-5'}
      strokeWidth={1.5}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

/** A hospital block: clinics and testing services. */
export const IconClinic = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.4 17.2V7.4l6.6-4 6.6 4v9.8" />
    <path d="M7.6 17.2v-4.4h4.8v4.4" />
    <path d="M10 6.6v3.2M8.4 8.2h3.2" />
  </Svg>
)

/** A gear: manufacturers and the software they ship. */
export const IconManufacturer = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="10" cy="10" r="2.6" />
    <path d="M10 2.6v2M10 15.4v2M17.4 10h-2M4.6 10h-2M15.2 4.8l-1.4 1.4M6.2 13.8l-1.4 1.4M15.2 15.2l-1.4-1.4M6.2 6.2 4.8 4.8" />
  </Svg>
)

/** A flask: research. */
export const IconResearch = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8.2 2.8v5L4 15.2a1.6 1.6 0 0 0 1.4 2.4h9.2a1.6 1.6 0 0 0 1.4-2.4L11.8 7.8v-5" />
    <path d="M7.2 2.8h5.6M6.1 12.4h7.8" />
  </Svg>
)

/** A plug: the API surface. */
export const IconApi = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7.4 2.8v3.4M12.6 2.8v3.4" />
    <path d="M5.2 6.2h9.6v3a4.8 4.8 0 0 1-9.6 0Z" />
    <path d="M10 14v3.2" />
  </Svg>
)

/** A browser window: the application. */
export const IconBrowser = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.6" y="4" width="14.8" height="12" rx="1.8" />
    <path d="M2.6 7.6h14.8" />
    <path d="M5.4 5.8h.01M7.6 5.8h.01" />
  </Svg>
)

/** Angle brackets: the package and anything called from code. */
export const IconCode = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7.2 6.5 3.5 10l3.7 3.5" />
    <path d="M12.8 6.5 16.5 10l-3.7 3.5" />
    <path d="M11.2 4.6 8.8 15.4" />
  </Svg>
)

/** A waveform: signal generation and synthetic data. */
export const IconSignal = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.6 10h2.6l1.8-5 2.6 10 2.4-7 1.6 4h3.8" />
  </Svg>
)
