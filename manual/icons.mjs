/**
 * A small line-icon set, drawn rather than imported.
 *
 * One style throughout: stroke-based on a 20px grid, 1.5px stroke, round caps
 * and joins, no fills. They take `currentColor` so a card can tint its own icon
 * without a second copy of the path. No emoji anywhere in this document.
 */

const wrap = (paths, { size = 20, colour = 'currentColor', stroke = 1.5 } = {}) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" aria-hidden="true" style="display:block;flex-shrink:0">
    <g stroke="${colour}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
  </svg>`

export const icons = {
  /** A person: the clinician or researcher reading a test in a browser. */
  human: (o) => wrap('<circle cx="10" cy="6.2" r="2.9"/><path d="M3.8 16.8a6.2 6.2 0 0 1 12.4 0"/>', o),

  /** Angle brackets: software calling the API. */
  software: (o) => wrap('<path d="M7.2 6.5 3.5 10l3.7 3.5"/><path d="M12.8 6.5 16.5 10l-3.7 3.5"/><path d="M11.2 4.6 8.8 15.4"/>', o),

  /** A node with its edges: an agent orchestrating calls. */
  agent: (o) =>
    wrap(
      '<circle cx="10" cy="10" r="2.4"/><circle cx="4" cy="4.6" r="1.6"/><circle cx="16" cy="4.6" r="1.6"/>' +
        '<circle cx="4" cy="15.4" r="1.6"/><circle cx="16" cy="15.4" r="1.6"/>' +
        '<path d="M5.2 5.8 8.3 8.6M14.8 5.8 11.7 8.6M5.2 14.2l3.1-2.8M14.8 14.2l-3.1-2.8"/>',
      o
    ),

  /** A cloud: the hosted API. */
  cloud: (o) => wrap('<path d="M5.6 15.2h8.6a3.2 3.2 0 0 0 .3-6.4 4.6 4.6 0 0 0-8.8-.7 3.6 3.6 0 0 0-.1 7.1Z"/>', o),

  /** Stacked racks: an engine running inside the institution. */
  local: (o) =>
    wrap(
      '<rect x="3" y="3.6" width="14" height="5" rx="1.4"/><rect x="3" y="11.4" width="14" height="5" rx="1.4"/>' +
        '<path d="M6 6.1h.01M6 13.9h.01"/>',
      o
    ),

  /** A chip: the engine embedded in the device. */
  device: (o) =>
    wrap(
      '<rect x="5.6" y="5.6" width="8.8" height="8.8" rx="1.6"/><path d="M8.4 2.8v2.8M11.6 2.8v2.8M8.4 14.4v2.8M11.6 14.4v2.8"/>' +
        '<path d="M2.8 8.4h2.8M2.8 11.6h2.8M14.4 8.4h2.8M14.4 11.6h2.8"/>',
      o
    ),
}
