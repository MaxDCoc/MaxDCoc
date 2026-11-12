// Design tokens, copied from the portfolio (Portfolio/site/src/styles/tokens.css).
// One accent (the locker orange), two themes. The LCD panel stays dark in both.

export const ACCENT = '#ff8719'

export const THEMES = {
  dark: {
    name: 'dark',
    bg: '#0c0d11',
    elev: '#14161b',
    sunk: '#08090c',
    ink: '#edeef1',
    ink2: '#a3a9b5',
    accent: ACCENT,
    accentText: '#ff9b45',
    line: 'rgba(237,238,241,0.10)',
    track: 'rgba(237,238,241,0.09)',
    glow: 0.16,
  },
  light: {
    name: 'light',
    bg: '#e9ebee',
    elev: '#f4f5f7',
    sunk: '#dcdfe4',
    ink: '#0e1014',
    ink2: '#4a505b',
    accent: ACCENT,
    accentText: '#b04a00',
    line: 'rgba(14,16,20,0.12)',
    track: 'rgba(14,16,20,0.09)',
    glow: 0.1,
  },
}

export const LCD = {
  panel: '#08090c',
  on: '#ff9b45',
  off: 'rgba(255,135,25,0.10)',
}

export const xmlEscape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const num = (n) => {
  const r = Math.round(n * 100) / 100
  return Object.is(r, -0) ? '0' : String(r)
}
