import { t, type Tone } from '../tones'
import { icon, type IconName } from '../icons'
import { cx, escHtml, when } from '../utils'

export interface CardParams {
  title: string
  /** Small line under the title — host, member count, timestamp… */
  subtitle?: string
  icon?: IconName | string
  /** Colour of the icon chip and, when `tinted`, of the card border. */
  tone?: Tone
  /** Badge in the top-right corner. Pass the rendered `badge()` output. */
  badge?: string
  /** Free-form HTML between the header and the actions. */
  body?: string
  /** Action row at the bottom. Pass rendered buttons. */
  actions?: string
  /** Makes the whole card a link. Cannot be combined with `actions`. */
  href?: string
  /** Use the tone's border instead of the neutral one. */
  tinted?: boolean
  class?: string
}

/**
 * The system's card: icon chip, title, subtitle, optional badge and actions.
 *
 *   card({ title: server.name, subtitle: `${server.user}@${server.host}`,
 *          icon: 'server', actions: button({ label: 'Connect', full: true }) })
 */
export function card(params: CardParams): string {
  const { tone = 'primary' } = params
  const c = t(tone)

  const head = /* html */ `
    <div class="flex items-start justify-between ${params.body || params.actions ? 'mb-3' : ''}">
      <div class="flex items-center gap-3 min-w-0">
        ${when(params.icon, () => `
          <div class="w-10 h-10 rounded-xl ${c.chip} flex items-center justify-center shrink-0">
            ${icon(params.icon!, `w-5 h-5 ${c.text}`)}
          </div>`)}
        <div class="min-w-0">
          <h3 class="font-bold text-white truncate">${escHtml(params.title)}</h3>
          ${when(params.subtitle, `<p class="text-xs text-gray-400 truncate">${escHtml(params.subtitle)}</p>`)}
        </div>
      </div>
      ${params.badge ?? ''}
    </div>`

  const inner = `${head}${params.body ?? ''}${when(params.actions, `<div class="flex gap-2 mt-4">${params.actions}</div>`)}`

  const cls = cx(
    'block bg-white/5 border rounded-2xl p-5 transition-all',
    params.tinted ? c.border : 'border-white/10',
    (params.href || params.actions) && 'hover:bg-white/10',
    params.class,
  )

  return params.href
    ? `<a href="${escHtml(params.href)}" class="${cls}">${inner}</a>`
    : `<div class="${cls}">${inner}</div>`
}

/** Responsive grid the cards are meant to sit in. */
export function cardGrid(cards: string, cols: 2 | 3 = 3): string {
  const c = cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3'
  return `<div class="grid grid-cols-1 ${c} gap-4">${cards}</div>`
}

/**
 * Dense list row — the compact sibling of `card`, for members, files, settings.
 * Actions live in `.row-actions` and fade in on hover.
 */
export function row(params: {
  title: string
  subtitle?: string
  icon?: IconName | string
  tone?: Tone
  actions?: string
  href?: string
  class?: string
}): string {
  const { tone = 'muted' } = params
  const c = t(tone)
  const inner = /* html */ `
    <div class="flex items-center gap-3 min-w-0">
      ${when(params.icon, () => `
        <div class="w-8 h-8 rounded-lg ${c.chip} flex items-center justify-center shrink-0">
          ${icon(params.icon!, `w-4 h-4 ${c.text}`)}
        </div>`)}
      <div class="min-w-0">
        <p class="text-white text-sm font-medium truncate">${escHtml(params.title)}</p>
        ${when(params.subtitle, `<p class="text-xs text-gray-400 truncate">${escHtml(params.subtitle)}</p>`)}
      </div>
    </div>
    ${when(params.actions, `<div class="row-actions flex items-center gap-2 shrink-0">${params.actions}</div>`)}`

  const cls = cx(
    'hover-row flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 transition-all hover:bg-white/10',
    params.class,
  )
  return params.href
    ? `<a href="${escHtml(params.href)}" class="${cls}">${inner}</a>`
    : `<div class="${cls}">${inner}</div>`
}

/** Vertical stack of `row()`s. */
export function rowList(rows: string): string {
  return `<div class="space-y-2">${rows}</div>`
}

/**
 * Metric tile for dashboards.
 *
 *   stat({ label: 'Active sessions', value: 12, icon: 'terminal' })
 */
export function stat(params: {
  label: string
  value: string | number
  hint?: string
  icon?: IconName | string
  tone?: Tone
}): string {
  const { tone = 'primary' } = params
  const c = t(tone)
  return /* html */ `
    <div class="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div class="flex items-center justify-between mb-2">
        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">${escHtml(params.label)}</p>
        ${when(params.icon, icon(params.icon ?? '', `w-4 h-4 ${c.text}`))}
      </div>
      <p class="text-3xl font-bold text-white">${escHtml(params.value)}</p>
      ${when(params.hint, `<p class="text-xs text-gray-500 mt-1">${escHtml(params.hint)}</p>`)}
    </div>`
}
