/**
 * Form primitives: tick boxes, choose-one options and blanks.
 *
 * Every interactive element is drawn in HTML, so the printed PDF reads
 * correctly on paper, and tagged with data attributes. After printing,
 * fields.mjs measures where each tagged element landed and lays a real PDF
 * form field over it, so the same file can be ticked and typed into in any
 * PDF reader. Change a layout here and the fields follow; nothing is placed by
 * hand-typed coordinates.
 *
 *   data-f  field name, unique in the document
 *   data-k  'check' | 'radio' | 'text' | 'area'
 *   data-g  radio group (the item id) and data-v its value
 */

import { L, ACCENT_TEXT, MONO } from '../manual/tokens.mjs'
import { tierOf } from './tiers.mjs'

const INK = L.strong

/** A square for "tick all that apply", a circle for "choose one". */
export function box(name, { radio = false, group = '', value = '', live = true } = {}) {
  const attrs = !live ? '' : radio
    ? `data-f="${group}" data-k="radio" data-g="${group}" data-v="${value}"`
    : `data-f="${name}" data-k="check"`
  return `<span ${attrs} style="display:inline-block;flex-shrink:0;width:11px;height:11px;margin-top:3px;border:1.3px solid ${INK};border-radius:${radio ? '50%' : '2px'};background:#fff"></span>`
}

/** A blank to write on. `lines` > 1 makes a ruled box for free text. */
export function blank(name, { w = 220, lines = 1 } = {}) {
  if (lines === 1) {
    return `<span data-f="${name}" data-k="text" style="display:inline-block;width:${w}px;height:17px;border-bottom:1px solid ${L.faint};vertical-align:bottom"></span>`
  }
  const rules = Array.from({ length: lines }, () => `<div style="height:19px;border-bottom:1px solid ${L.line}"></div>`).join('')
  return `<div data-f="${name}" data-k="area" style="box-sizing:border-box;width:${w === 'full' ? '100%' : w + 'px'};border:1px solid ${L.line};border-radius:6px;padding:0 8px 4px;background:#fff">${rules}</div>`
}

/** A labelled blank on one line. */
export function line(name, label, { w, grow = true } = {}) {
  return `<div style="display:flex;align-items:flex-end;gap:10px;margin:0 0 9px">
    <span style="font-size:12px;color:${L.subtle};white-space:nowrap">${label}</span>
    ${grow && !w ? `<span data-f="${name}" data-k="text" style="flex:1;height:17px;border-bottom:1px solid ${L.faint}"></span>` : blank(name, { w })}
  </div>`
}

/**
 * One option. `other` appends a blank for a free answer. For a choose-one
 * item, pass the item id as `group`.
 */
export function opt(item, key, label, { group = '', other = false, otherW = 180, note = '' } = {}) {
  const radio = Boolean(group)
  const name = `${item}_${key}`
  return `<div style="display:flex;gap:9px;align-items:flex-start;margin:0 0 6px">
    ${box(name, { radio, group, value: key })}
    <span style="font-size:12.5px;line-height:1.5;color:${L.body}">${label}${other ? ` ${blank(`${name}_text`, { w: otherW })}` : ''}${note ? `<span style="display:block;font-size:11px;color:${L.faint}">${note}</span>` : ''}</span>
  </div>`
}

/**
 * A numbered item. `mode` is 'one' (choose one), 'many' (tick all that apply),
 * 'fill' (write in) or 'fixed' (a term that is the same in every agreement).
 */
export function item(id, title, mode, body, { cols = 1 } = {}) {
  const HINT = { one: 'Choose one', many: 'Tick all that apply', fill: 'Fill in', fixed: 'Fixed term' }
  const inner = cols > 1 ? `<div style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));column-gap:18px">${body}</div>` : body
  return `<div style="display:grid;grid-template-columns:40px 1fr;gap:10px;padding:10px 0 6px;border-top:1px solid ${L.line}">
    <span style="display:flex;flex-direction:column;padding-top:2px"><span style="font-family:${MONO};font-size:10.5px;color:${ACCENT_TEXT}">${id}</span>${tierMark(id)}</span>
    <div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin:0 0 7px">
        <span style="font-size:13.5px;font-weight:600;color:${L.strong}">${title}</span>
        <span style="font-family:${MONO};font-size:8.5px;letter-spacing:.12em;text-transform:uppercase;color:${mode === 'fixed' ? L.faint : ACCENT_TEXT};white-space:nowrap">${HINT[mode]}</span>
      </div>
      ${inner}
    </div>
  </div>`
}

/**
 * The tier mark: three small squares, one per tier, filled for the tiers the
 * item applies to. An item needed from Tier 2 up reads as one empty and two
 * filled squares, so what to skip is visible without reading anything.
 */
export function tierMark(id) {
  const t = tierOf(id)
  return `<span style="display:inline-flex;gap:2px;margin-top:5px" title="Tier ${t} and above">${[1, 2, 3]
    .map((n) => `<span style="width:6px;height:6px;border-radius:1px;${n >= t ? `background:${ACCENT_TEXT}` : `border:1px solid ${L.faint};box-sizing:border-box`}"></span>`)
    .join('')}</span>`
}

/** Clause text at body scale. */
export function clause(html) {
  return `<p style="font-size:12.5px;line-height:1.55;color:${L.body};margin:0 0 7px">${html}</p>`
}

/** A section heading: number and title. */
export function section(n, title, stand = '') {
  return `<div style="margin:0 0 6px">
    <p class="eyebrow" style="color:${ACCENT_TEXT};margin-bottom:6px">Section ${n}</p>
    <h2 style="font-size:22px;margin:0 0 ${stand ? 5 : 8}px">${title}</h2>
    ${stand ? `<p style="font-size:13px;line-height:1.5;color:${L.subtle};margin:0 0 8px">${stand}</p>` : ''}
  </div>`
}
