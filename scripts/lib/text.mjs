// Text as SVG outlines. Reads bricolage.json (made by tools/extract-glyphs.py) and
// lays out a string with kerning, so no font has to exist where the SVG is shown.
import { readFileSync } from 'node:fs'
// One decimal is plenty for outlines drawn at 12 to 120 px, and it halves the file size.
const num = (n) => {
  const r = Math.round(n * 10) / 10
  return Object.is(r, -0) ? '0' : String(r)
}

const font = JSON.parse(readFileSync(new URL('./bricolage.json', import.meta.url), 'utf8'))
const ARITY = { M: 2, L: 2, H: 1, V: 1, C: 6, Q: 4, Z: 0 }
const TOKEN = /([MLHVCQZ])|(-?\d+(?:\.\d+)?)/g

// Scales a glyph outline (font units, y already flipped) and moves it to (dx, dy).
function place(d, scale, dx, dy) {
  const tokens = [...d.matchAll(TOKEN)].map((m) => m[1] ?? Number(m[2]))
  let out = ''
  let i = 0
  const args = (cmd) => {
    const parts = []
    for (let k = 0; k < ARITY[cmd]; k++) {
      const v = tokens[i++]
      if (cmd === 'H') parts.push(num(v * scale + dx))
      else if (cmd === 'V') parts.push(num(v * scale + dy))
      else parts.push(num(v * scale + (k % 2 === 0 ? dx : dy)))
    }
    return parts.join(' ')
  }
  while (i < tokens.length) {
    const cmd = tokens[i++]
    out += cmd
    if (cmd === 'Z') continue
    out += args(cmd)
    // SVGPathPen drops the letter when a command repeats ("M1 0 125 -262" = M then L).
    const repeat = cmd === 'M' ? 'L' : cmd
    while (typeof tokens[i] === 'number') out += repeat + args(repeat)
  }
  return out
}

function glyphFor(inst, ch) {
  return inst.glyphs[ch] ?? inst.glyphs['?']
}

/** Width in px of `str` at `size`, with kerning and tracking (em fraction). */
export function measure(instance, str, size, tracking = 0) {
  const inst = font.instances[instance]
  const scale = size / font.upm
  let w = 0
  const chars = [...str]
  chars.forEach((ch, i) => {
    const g = glyphFor(inst, ch)
    const next = chars[i + 1]
    w += g.a + (next ? (inst.kern[ch + next] ?? 0) : 0) + tracking * font.upm
  })
  return w * scale - tracking * size
}

/**
 * One SVG path `d` for the string. Anchor 'start' | 'middle' | 'end' decides how x is read.
 * Returns { d, width }.
 */
export function textPath(instance, str, { x = 0, y = 0, size = 16, tracking = 0, anchor = 'start' } = {}) {
  const inst = font.instances[instance]
  const scale = size / font.upm
  const width = measure(instance, str, size, tracking)
  let pen = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x
  const chars = [...str]
  let d = ''
  chars.forEach((ch, i) => {
    const g = glyphFor(inst, ch)
    if (g.d) d += place(g.d, scale, pen, y)
    const next = chars[i + 1]
    pen += (g.a + (next ? (inst.kern[ch + next] ?? 0) : 0) + tracking * font.upm) * scale
  })
  return { d, width }
}

/** Size that makes `str` exactly `targetWidth` wide. */
export function fitSize(instance, str, targetWidth, tracking = 0) {
  return (targetWidth / measure(instance, str, 100, tracking)) * 100
}

/** Cuts the string with an ellipsis until it fits `maxWidth`. */
export function truncate(instance, str, size, maxWidth) {
  if (measure(instance, str, size) <= maxWidth) return str
  let s = str
  while (s.length > 1 && measure(instance, s + '...', size) > maxWidth) s = s.slice(0, -1)
  // Prefer to stop at a word boundary instead of mid-word.
  const cut = s.lastIndexOf(' ')
  if (cut > s.length * 0.6) s = s.slice(0, cut)
  return s.replace(/[\s,.;:]+$/, '') + '...'
}
