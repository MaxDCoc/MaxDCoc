// Builds the "stack" panel (dark + light): tools grouped by layer, with real logos from
// Simple Icons. Static, so it is generated once and committed.
//   npm run build:stack
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as si from 'simple-icons'
import { THEMES, ACCENT, xmlEscape, num } from './lib/brand.mjs'
import { textPath, measure } from './lib/text.mjs'

// [label, simple-icons key or null]. No icon means a small orange bullet instead.
const GROUPS = [
  {
    name: 'Automation',
    items: [['n8n', 'siN8n'], ['MQTT', 'siMqtt'], ['GitHub Actions', 'siGithubactions'], ['REST APIs', null], ['GoHighLevel', null]],
  },
  {
    name: 'Data and ETL',
    items: [
      ['Python', 'siPython'], ['pandas', 'siPandas'], ['NumPy', 'siNumpy'], ['PostgreSQL', 'siPostgresql'],
      ['TimescaleDB', 'siTimescale'], ['MySQL', 'siMysql'], ['Supabase', 'siSupabase'], ['Redis', 'siRedis'], ['Power BI', null],
    ],
  },
  {
    name: 'Backend',
    items: [['FastAPI', 'siFastapi'], ['Django', 'siDjango'], ['NestJS', 'siNestjs'], ['Express', 'siExpress'], ['Prisma', 'siPrisma'], ['Go', 'siGo'], ['C#', null]],
  },
  {
    name: 'Web, mobile and IoT',
    items: [
      ['React', 'siReact'], ['Expo', 'siExpo'], ['TypeScript', 'siTypescript'], ['Svelte', 'siSvelte'],
      ['Tailwind CSS', 'siTailwindcss'], ['ESP32', 'siEspressif'], ['C++', 'siCplusplus'],
    ],
  },
  {
    name: 'DevOps and AI',
    items: [
      ['Docker', 'siDocker'], ['Linux', 'siLinux'], ['Traefik', 'siTraefikproxy'], ['Vercel', 'siVercel'],
      ['Railway', 'siRailway'], ['Ollama', 'siOllama'], ['scikit-learn', 'siScikitlearn'], ['Anthropic API', 'siAnthropic'],
    ],
  },
]

const W = 800
const PAD = 24
const LABEL_COL = 150 // width reserved for the group name
const X0 = PAD + LABEL_COL + 8
const RIGHT = W - PAD
const ICON = 20
const FONT = 13.5
const GAP_ICON = 8
const GAP_ITEM = 18
const LINE_H = 34
const GROUP_PAD = 14

function layout() {
  let y = 0
  const rows = []
  for (const g of GROUPS) {
    const placed = []
    let x = X0
    let line = 0
    for (const [label, key] of g.items) {
      const icon = key ? si[key] : null
      if (key && !icon) throw new Error(`Simple Icons has no ${key}`)
      const w = (icon ? ICON : 8) + GAP_ICON + measure('ui', label, FONT)
      if (x + w > RIGHT) {
        x = X0
        line++
      }
      placed.push({ label, icon, x, line, w })
      x += w + GAP_ITEM
    }
    const height = (line + 1) * LINE_H + GROUP_PAD * 2
    rows.push({ g, placed, y, height })
    y += height
  }
  return { rows, total: y }
}

function build(theme) {
  const t = THEMES[theme]
  const { rows, total } = layout()
  const H = total + 2
  let titles = ''
  let labels = ''
  let shapes = ''
  let rules = ''

  rows.forEach(({ g, placed, y, height }, gi) => {
    if (gi > 0) rules += `<path d="M${PAD} ${y + 1}H${W - PAD}" stroke="${t.line}" stroke-width="1"/>`
    const title = textPath('semi', g.name, { x: PAD, y: y + 1 + GROUP_PAD + 21, size: 14.5 })
    titles += title.d
    for (const p of placed) {
      const cy = y + 1 + GROUP_PAD + p.line * LINE_H + LINE_H / 2
      if (p.icon) {
        const s = ICON / 24
        shapes += `<path transform="translate(${num(p.x)} ${num(cy - ICON / 2)}) scale(${num(s)})" d="${p.icon.path}" fill="${t.ink}"/>`
      } else {
        shapes += `<rect x="${num(p.x + 1)}" y="${num(cy - 3.5)}" width="7" height="7" rx="1.5" fill="${ACCENT}"/>`
      }
      const tx = p.x + (p.icon ? ICON : 8) + GAP_ICON
      labels += textPath('ui', p.label, { x: tx, y: cy + FONT * 0.34, size: FONT }).d
    }
  })

  const names = GROUPS.map((g) => `${g.name}: ${g.items.map((i) => i[0]).join(', ')}`).join('. ')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">Tech stack</title>
  <desc id="d">${xmlEscape(names)}.</desc>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="18" fill="${t.elev}" stroke="${t.line}"/>
  ${rules}
  <path d="${titles}" fill="${t.accentText}"/>
  ${shapes}
  <path d="${labels}" fill="${t.ink}"/>
</svg>
`
}

const outDir = fileURLToPath(new URL('../assets/', import.meta.url))
mkdirSync(outDir, { recursive: true })
for (const theme of ['dark', 'light']) {
  const svg = build(theme)
  writeFileSync(`${outDir}stack-${theme}.svg`, svg)
  console.log(`stack-${theme}.svg  ${(Buffer.byteLength(svg) / 1024).toFixed(0)} KB`)
}
