/**
 * GaetanDev Design System — helpers shared by every component.
 */

/** Escape untrusted text before interpolating it into an HTML template. */
export function escHtml(str: string | number | undefined | null): string {
  if (str === undefined || str === null || str === '') return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Escape a string for use inside a single-quoted inline JS handler. */
export function escJs(str: string | undefined | null): string {
  if (!str) return ''
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/</g, '\\u003c')
}

/** Join class names, dropping falsy entries. */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

/**
 * Render an attribute bag: `{ 'hx-get': '/x', disabled: true, title: null }`
 * → ` hx-get="/x" disabled`. `false`/`null`/`undefined` values are dropped.
 */
export function attrs(bag?: Record<string, string | number | boolean | null | undefined>): string {
  if (!bag) return ''
  return Object.entries(bag)
    .filter(([, v]) => v !== false && v !== null && v !== undefined)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${escHtml(v as string | number)}"`))
    .join('')
}

/** Render `items.map(fn)` joined — the pattern used everywhere in pages. */
export function each<T>(items: readonly T[], fn: (item: T, index: number) => string): string {
  return items.map(fn).join('')
}

/** Render `content` only when `condition` is truthy. */
export function when(condition: unknown, content: string | (() => string)): string {
  if (!condition) return ''
  return typeof content === 'function' ? content() : content
}

/** Human-readable byte size: 1536 → "1.5 KB". */
export function formatSize(bytes: number): string {
  if (!bytes) return '--'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`
}

/** Tagged template that just returns the string — gives editors HTML highlighting. */
export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce<string>(
    (out, chunk, i) => out + chunk + (i < values.length ? String(values[i] ?? '') : ''),
    '',
  )
}
