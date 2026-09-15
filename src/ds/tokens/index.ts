/**
 * GaetanDev Design System — Design tokens
 *
 * Raw values. Use these when you need the colour outside of a Tailwind class:
 * canvas, xterm themes, chart libraries, meta theme-color, e-mails, SVG fills…
 *
 * Inside HTML, prefer the Tailwind class recipes exposed by the components.
 */

// ─── Brand / semantic palette ───────────────────────────────────────────────
// Every tone maps to a Tailwind colour so the class recipes and the raw values
// never drift apart.
export const palette = {
  /** Primary action, success, "it works". Tailwind: green-400 */
  primary: '#4ade80',
  /** Secondary / collaborative / AI surfaces. Tailwind: purple-400 */
  secondary: '#c084fc',
  /** Informational, files, neutral-positive. Tailwind: blue-400 */
  info: '#60a5fa',
  /** Destructive, errors. Tailwind: red-400 */
  danger: '#f87171',
  /** Pending, careful, in-progress. Tailwind: yellow-400 */
  warning: '#facc15',
  /** Accent / data. Tailwind: cyan-400 */
  accent: '#22d3ee',
  /** Muted UI. Tailwind: gray-400 */
  muted: '#9ca3af',
} as const

// The `Tone` type itself lives in ../tones.ts, next to its class recipes.

// ─── Background ─────────────────────────────────────────────────────────────
export const background = {
  from: '#111827', // gray-900
  via: '#155e75', // cyan-800
  to: '#15803d', // green-700
  gradient: 'linear-gradient(to bottom right, #111827, #155e75, #15803d)',
} as const

// ─── Surfaces (glassmorphism) ───────────────────────────────────────────────
export const surface = {
  /** Main panels: sidebar, content shell, modals */
  glass: 'rgba(0, 0, 0, 0.2)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassBlur: '20px',
  /** Cards sitting on top of a glass panel */
  raised: 'rgba(255, 255, 255, 0.05)',
  raisedHover: 'rgba(255, 255, 255, 0.1)',
  /** Form controls */
  control: 'rgba(255, 255, 255, 0.1)',
  controlBorder: 'rgba(255, 255, 255, 0.2)',
  /** Deep surfaces: code blocks, terminal output, dropdown menus */
  sunken: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(10, 10, 15, 0.97)',
} as const

// ─── Text ───────────────────────────────────────────────────────────────────
export const text = {
  primary: '#ffffff',
  body: '#e2e8f0', // slate-200
  secondary: '#d1d5db', // gray-300
  muted: '#9ca3af', // gray-400
  faint: '#6b7280', // gray-500
  disabled: '#4b5563', // gray-600
} as const

// ─── Typography ─────────────────────────────────────────────────────────────
export const typography = {
  sans: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace",
  googleFonts:
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  /** Weight scale actually used by the system */
  weight: { normal: 400, medium: 500, semibold: 600, bold: 700, black: 800 },
} as const

// ─── Radii ──────────────────────────────────────────────────────────────────
// The system has three levels and sticks to them.
export const radius = {
  /** Micro: badges in dense rows, kbd, inline pills — Tailwind rounded-lg */
  sm: '0.5rem',
  /** Controls: buttons, inputs, alerts, small cards — Tailwind rounded-xl */
  md: '0.75rem',
  /** Cards — Tailwind rounded-2xl */
  lg: '1rem',
  /** Shell panels: sidebar, main content, modals — Tailwind rounded-3xl */
  xl: '1.5rem',
  full: '9999px',
} as const

// ─── Motion ─────────────────────────────────────────────────────────────────
export const motion = {
  /** Hovers on dense rows / icon buttons */
  fast: '100ms',
  /** Default UI feedback */
  base: '150ms',
  /** Buttons, cards, anything the eye follows */
  slow: '300ms',
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const

// ─── Layout ─────────────────────────────────────────────────────────────────
export const layout = {
  maxWidth: '80rem', // max-w-7xl
  sidebarWidth: '18rem', // lg:w-72
  pagePadding: '2rem', // md:p-8
} as const

// ─── Terminal theme (xterm.js) ──────────────────────────────────────────────
export const terminalTheme = {
  background: 'rgba(0, 0, 0, 0.01)',
  foreground: '#e2e8f0',
  cursor: '#4ade80',
  cursorAccent: '#000000',
  selectionBackground: 'rgba(74, 222, 128, 0.3)',
  black: '#1e293b',
  red: '#f87171',
  green: '#4ade80',
  yellow: '#facc15',
  blue: '#60a5fa',
  magenta: '#c084fc',
  cyan: '#22d3ee',
  white: '#e2e8f0',
  brightBlack: '#475569',
  brightRed: '#fca5a5',
  brightGreen: '#86efac',
  brightYellow: '#fde68a',
  brightBlue: '#93c5fd',
  brightMagenta: '#d8b4fe',
  brightCyan: '#67e8f9',
  brightWhite: '#f8fafc',
} as const

// ─── Chart palette ──────────────────────────────────────────────────────────
// Ordered for categorical series; readable on the dark gradient.
export const chartPalette = [
  '#4ade80',
  '#c084fc',
  '#60a5fa',
  '#facc15',
  '#22d3ee',
  '#f87171',
  '#86efac',
  '#d8b4fe',
] as const

// ─── Brand assets ───────────────────────────────────────────────────────────
export const brand = {
  name: 'GaetanDev',
  domain: 'gaetandev.fr',
  favicon: 'https://cdn.gaetandev.fr/gaetan/files/metaLogo.png',
} as const

export const tokens = {
  palette,
  background,
  surface,
  text,
  typography,
  radius,
  motion,
  layout,
  terminalTheme,
  chartPalette,
  brand,
} as const
