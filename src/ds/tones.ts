/**
 * GaetanDev Design System — tone class recipes.
 *
 * Every coloured surface in the system is one of seven tones. This file is the
 * single place where a tone turns into Tailwind classes, so a card, a badge and
 * a button always agree on what "secondary" looks like.
 *
 * Tailwind classes are written out in full (never built by string concatenation
 * from a colour name) so the CDN scanner always sees them.
 */

export type Tone = 'primary' | 'secondary' | 'info' | 'danger' | 'warning' | 'accent' | 'muted'

export interface ToneClasses {
  /** Solid fill for primary buttons — black text on a bright fill. */
  solid: string
  /** Soft translucent fill: icon chips, badges, secondary buttons. */
  soft: string
  /** Just the translucent background, for square icon chips. */
  chip: string
  /** Soft fill + hover, for clickable soft surfaces. */
  softInteractive: string
  /** Text colour on a dark surface. */
  text: string
  /** Lighter text, used inside soft fills. */
  textSoft: string
  /** Border for tinted cards. */
  border: string
  /** Focus ring for form controls. */
  ring: string
  /** Alert block: fill + border. */
  alert: string
  /** Raw hex, for canvas / xterm / SVG. */
  hex: string
}

export const tones: Record<Tone, ToneClasses> = {
  primary: {
    solid: 'bg-green-400/80 hover:bg-green-400 text-black',
    soft: 'bg-green-400/20 text-green-300',
    chip: 'bg-green-400/20',
    softInteractive: 'bg-green-400/20 hover:bg-green-400/30 text-green-300 hover:text-green-200',
    text: 'text-green-400',
    textSoft: 'text-green-300',
    border: 'border-green-400/20',
    ring: 'focus:ring-green-400',
    alert: 'bg-green-500/20 border-green-500/30 text-green-300',
    hex: '#4ade80',
  },
  secondary: {
    solid: 'bg-purple-400/80 hover:bg-purple-400 text-black',
    soft: 'bg-purple-400/20 text-purple-300',
    chip: 'bg-purple-400/20',
    softInteractive: 'bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 hover:text-purple-200',
    text: 'text-purple-400',
    textSoft: 'text-purple-300',
    border: 'border-purple-400/20',
    ring: 'focus:ring-purple-400',
    alert: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
    hex: '#c084fc',
  },
  info: {
    solid: 'bg-blue-400/80 hover:bg-blue-400 text-black',
    soft: 'bg-blue-400/20 text-blue-300',
    chip: 'bg-blue-400/20',
    softInteractive: 'bg-blue-400/20 hover:bg-blue-400/30 text-blue-300 hover:text-blue-200',
    text: 'text-blue-400',
    textSoft: 'text-blue-300',
    border: 'border-blue-400/20',
    ring: 'focus:ring-blue-400',
    alert: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
    hex: '#60a5fa',
  },
  danger: {
    solid: 'bg-red-400/80 hover:bg-red-400 text-black',
    soft: 'bg-red-500/20 text-red-300',
    chip: 'bg-red-500/20',
    softInteractive: 'bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200',
    text: 'text-red-400',
    textSoft: 'text-red-300',
    border: 'border-red-400/20',
    ring: 'focus:ring-red-400',
    alert: 'bg-red-500/20 border-red-500/30 text-red-300',
    hex: '#f87171',
  },
  warning: {
    solid: 'bg-yellow-400/80 hover:bg-yellow-400 text-black',
    soft: 'bg-yellow-400/20 text-yellow-300',
    chip: 'bg-yellow-400/20',
    softInteractive:
      'bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 hover:text-yellow-200',
    text: 'text-yellow-400',
    textSoft: 'text-yellow-300',
    border: 'border-yellow-400/20',
    ring: 'focus:ring-yellow-400',
    alert: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
    hex: '#facc15',
  },
  accent: {
    solid: 'bg-cyan-400/80 hover:bg-cyan-400 text-black',
    soft: 'bg-cyan-400/20 text-cyan-300',
    chip: 'bg-cyan-400/20',
    softInteractive: 'bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 hover:text-cyan-200',
    text: 'text-cyan-400',
    textSoft: 'text-cyan-300',
    border: 'border-cyan-400/20',
    ring: 'focus:ring-cyan-400',
    alert: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
    hex: '#22d3ee',
  },
  muted: {
    solid: 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white',
    soft: 'bg-white/10 text-gray-300',
    chip: 'bg-white/10',
    softInteractive: 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white',
    text: 'text-gray-400',
    textSoft: 'text-gray-400',
    border: 'border-white/10',
    ring: 'focus:ring-white/40',
    alert: 'bg-white/5 border-white/10 text-gray-300',
    hex: '#9ca3af',
  },
}

/** Look up a tone, defaulting to `primary`. */
export function t(name: Tone = 'primary'): ToneClasses {
  return tones[name] ?? tones.primary
}

// ─── Shared surface recipes ────────────────────────────────────────────────
// Reach for these instead of retyping the class strings.

/** Frosted shell panel — sidebar, main content, modal body. */
export const GLASS = 'glass rounded-3xl'
/** Card sitting on a glass panel. */
export const SURFACE = 'bg-white/5 border border-white/10 rounded-2xl'
/** Same, but reacting to the pointer. */
export const SURFACE_INTERACTIVE =
  'bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all'
/** Dense row inside a list. */
export const ROW = 'bg-white/5 border border-white/10 rounded-xl'
/** Form control base — add a `ring` from the tone on focus. */
export const CONTROL =
  'w-full bg-white/10 text-white placeholder-gray-400 p-3 rounded-xl border border-white/20 focus:ring-2 focus:outline-none transition-all duration-300'
/** The system's label style: small, bold, uppercase, tracked. */
export const LABEL = 'block text-sm font-bold text-white mb-2 uppercase tracking-wider'
/** Section eyebrow above a group of cards. */
export const EYEBROW = 'text-xs font-bold text-gray-400 uppercase tracking-widest'
/** Deep surface for code, logs, terminal output. */
export const SUNKEN = 'bg-black/30 rounded-lg font-mono'
