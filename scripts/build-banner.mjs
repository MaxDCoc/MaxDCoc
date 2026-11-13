// Builds the animated profile banner (dark + light) as self-contained SVGs.
//   node scripts/build-banner.mjs path/to/portrait-cutout.png
//
// Everything is vector: text is outlines (see lib/text.mjs), the LCD is dots, the only
// bitmap is the portrait, embedded as a small WebP. Animations are plain CSS, which
// GitHub keeps when the SVG is shown through <img>. Reduced motion shows a still frame.
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { THEMES, LCD, ACCENT, xmlEscape, num } from './lib/brand.mjs'
import { textPath, fitSize } from './lib/text.mjs'
import { glyphDots, lcdSafe } from './lib/lcd.mjs'

const portraitPath = process.argv[2]
if (!portraitPath) {
  console.error('usage: node scripts/build-banner.mjs <portrait-cutout.png>')
  process.exit(1)
}

const W = 1200
const H = 420

// What the locker screen cycles through. Every line is checked against the 26 columns.
const COLS = 26
const PHRASES = [
  ['2ND PLACE, HUAWEI ICT', 'GLOBAL FINAL, 179 TEAMS'],
  ['RESEARCH FELLOW, UTN', 'SUSTAINABILITY PLATFORM'],
  ['NOW BUILDING: LOCKIT!', 'SMART LOCKERS, ESP32+MQTT'],
  ['DATABASE, API, APP', 'AND THE DEVICE FIRMWARE'],
  ['BASED IN RESISTENCIA', 'CHACO, ARGENTINA'],
]
const STAGGER = 0.022 // seconds between characters typing in (and, later, erasing)
const VISIBLE = 4.2 // how long a character stays lit after it appears
// Last character erases at (2 * COLS - 1) * STAGGER + VISIBLE, which must fit inside the slot
// so two phrases never overlap. About 3 seconds of every slot show the full message.
const SLOT = 5.5 // seconds per phrase
const CYCLE = SLOT * PHRASES.length
if ((2 * COLS - 1) * STAGGER + VISIBLE > SLOT) throw new Error('phrases would overlap: raise SLOT')

for (const lines of PHRASES) {
  for (const l of lines) {
    if (l.length > COLS) throw new Error(`LCD line too long (${l.length}): ${l}`)
    if (lcdSafe(l) !== l) throw new Error(`LCD cannot draw: ${l}`)
  }
}

const portrait = await sharp(portraitPath)
  .resize({ width: 440 })
  .webp({ quality: 84, alphaQuality: 90, effort: 6 })
  .toBuffer()
const portraitUri = `data:image/webp;base64,${portrait.toString('base64')}`

// Geometry
const PITCH = 4.5
const DOT_R = 1.75 // lit dot
const OFF_R = 1.2 // unlit dot, kept faint like a real LCD matrix
const PAD = 16
const GRID_W = COLS * 6 - 1
const GRID_H = 2 * 8 - 1
const PANEL_X = 64
const PANEL_Y = 258
const PANEL_W = GRID_W * PITCH + PAD * 2
const PANEL_H = GRID_H * PITCH + PAD * 2
const DOTS_X = PANEL_X + PAD
const DOTS_Y = PANEL_Y + PAD

const NAME = 'Maximiliano Cocito'
const NAME_W = 744
const nameSize = fitSize('display', NAME, NAME_W)
const NAME_Y = 218

function phraseMarkup(lines, index) {
  const out = []
  lines.forEach((line, row) => {
    ;[...line].forEach((ch, col) => {
      if (ch === ' ') return
      const dots = glyphDots(ch)
      if (!dots.length) return
      const d = dots
        .map(([dx, dy]) => {
          const cx = DOTS_X + (col * 6 + dx + 0.5) * PITCH
          const cy = DOTS_Y + (row * 8 + dy + 0.5) * PITCH
          return `M${num(cx)} ${num(cy)}h0`
        })
        .join('')
      const delay = index * SLOT + (row * COLS + col) * STAGGER
      out.push(`<path class="ch p${index}" style="animation-delay:${num(delay)}s" d="${d}"/>`)
    })
  })
  return out.join('\n    ')
}

function build(theme) {
  const t = THEMES[theme]
  const eyebrow = textPath('semi', 'Full stack and embedded developer', { x: 64, y: 92, size: 26, tracking: 0.005 })
  const name = textPath('display', NAME, { x: 62, y: NAME_Y, size: nameSize, tracking: -0.004 })
  const hairline = `M64 ${num(PANEL_Y - 22)}H${num(PANEL_X + PANEL_W)}`

  const keyframes = `@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
    @keyframes slide{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}
    @keyframes type{0%{opacity:1}${num((VISIBLE / CYCLE) * 100)}%{opacity:0}100%{opacity:0}}
    @keyframes led{0%,55%{opacity:1}56%,100%{opacity:.2}}`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">Maximiliano Cocito, full stack and embedded developer</title>
  <desc id="d">Banner with the name, a portrait on an orange locker door, and a dot-matrix screen cycling through: 2nd place at the Huawei ICT global final, research fellow at UTN, building the LockIT smart locker network, building the whole system from the database to the device firmware, based in Resistencia, Argentina.</desc>
  <defs>
    <radialGradient id="glow" cx="0.86" cy="1" r="0.55">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="${t.glow}"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="off" x="${num(DOTS_X)}" y="${num(DOTS_Y)}" width="${PITCH}" height="${PITCH}" patternUnits="userSpaceOnUse">
      <circle cx="${PITCH / 2}" cy="${PITCH / 2}" r="${OFF_R}" fill="${LCD.off}"/>
    </pattern>
    <clipPath id="frame"><rect width="${W}" height="${H}"/></clipPath>
  </defs>
  <style>
    ${keyframes}
    .a1{animation:rise .7s .05s cubic-bezier(.2,.7,.2,1) both}
    .a2{animation:rise .8s .15s cubic-bezier(.2,.7,.2,1) both}
    .a3{animation:rise .8s .3s cubic-bezier(.2,.7,.2,1) both}
    .a4{animation:slide .9s .2s cubic-bezier(.2,.7,.2,1) both}
    .ch{opacity:0;fill:none;stroke:${LCD.on};stroke-width:${DOT_R * 2};stroke-linecap:round;animation:type ${CYCLE}s step-end infinite}
    .led{animation:led 1.4s step-end infinite}
    @media (prefers-reduced-motion:reduce){
      .a1,.a2,.a3,.a4,.led{animation:none}
      .ch{animation:none}
      .ch.p0{opacity:1}
    }
  </style>
  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="${t.bg}"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>

    <path class="a1" d="${eyebrow.d}" fill="${t.accentText}"/>
    <path class="a2" d="${name.d}" fill="${t.ink}"/>

    <g class="a3">
      <path d="${hairline}" stroke="${t.line}" stroke-width="1" fill="none"/>
      <rect x="${PANEL_X}" y="${PANEL_Y}" width="${num(PANEL_W)}" height="${num(PANEL_H)}" rx="14" fill="${LCD.panel}"/>
      <rect x="${num(DOTS_X)}" y="${num(DOTS_Y)}" width="${num(GRID_W * PITCH)}" height="${num(GRID_H * PITCH)}" fill="url(#off)"/>
      ${PHRASES.map((lines, i) => phraseMarkup(lines, i)).join('\n    ')}
      <circle class="led" cx="${num(PANEL_X + PANEL_W - 16)}" cy="${PANEL_Y + 14}" r="3" fill="${ACCENT}"/>
    </g>

    <g class="a4">
      <rect x="860" y="118" width="276" height="360" rx="24" fill="${ACCENT}"/>
      <rect x="1098" y="228" width="9" height="74" rx="4.5" fill="#0c0d11" fill-opacity=".42"/>
      <image href="${portraitUri}" x="806" y="40" width="380" height="380" preserveAspectRatio="xMidYMid meet"/>
    </g>
  </g>
</svg>
`
}

const outDir = fileURLToPath(new URL('../assets/', import.meta.url))
mkdirSync(outDir, { recursive: true })
for (const theme of ['dark', 'light']) {
  const svg = build(theme)
  writeFileSync(`${outDir}banner-${theme}.svg`, svg)
  console.log(`banner-${theme}.svg  ${(Buffer.byteLength(svg) / 1024).toFixed(0)} KB`)
}
