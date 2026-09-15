import { EYEBROW, t, type Tone } from '../tones'
import { icon, type IconName } from '../icons'
import { cx, each, escHtml, when } from '../utils'

// ─── Sidebar ────────────────────────────────────────────────────────────────

export interface NavItem {
  /** Stable key compared against `active`. */
  key: string
  label: string
  href: string
  icon?: IconName | string
  /** Count or state shown on the right. Pass rendered `badge()` output. */
  badge?: string
  /** Skip htmx boosting — logout, downloads, external links. */
  noBoost?: boolean
}

export interface SidebarParams {
  items: NavItem[]
  active: string
  /** Small identity block at the top. */
  user?: { name: string; caption?: string }
  /** Items pinned to the bottom, separated by a rule — settings, logout. */
  footerItems?: NavItem[]
  /** Section title above the nav when there is no user block. */
  title?: string
}

function navLink(item: NavItem, active: boolean): string {
  const skin = active
    ? 'bg-white/15 text-white border border-white/20'
    : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent'
  return /* html */ `
    <a href="${escHtml(item.href)}"${item.noBoost ? ' hx-boost="false"' : ''}
      ${active ? 'aria-current="page"' : ''}
      class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${skin}">
      ${when(item.icon, icon(item.icon ?? '', 'w-5 h-5 shrink-0'))}
      <span class="flex-1 truncate">${escHtml(item.label)}</span>
      ${item.badge ?? ''}
    </a>`
}

/** The app shell's left rail. Collapses above the content on mobile. */
export function sidebar(params: SidebarParams): string {
  return /* html */ `
    <aside class="w-full lg:w-72 shrink-0 glass rounded-3xl p-5 h-fit">
      ${when(params.user, () => `
        <div class="mb-6">
          <p class="${EYEBROW} tracking-widest">${escHtml(params.user!.caption ?? 'Connected as')}</p>
          <p class="text-lg font-bold text-white mt-1 truncate">${escHtml(params.user!.name)}</p>
        </div>`)}
      ${when(!params.user && params.title, `<p class="${EYEBROW} mb-4">${escHtml(params.title)}</p>`)}
      <nav class="space-y-2">
        ${each(params.items, i => navLink(i, i.key === params.active))}
      </nav>
      ${when(params.footerItems?.length, () => `
        <div class="mt-6 pt-4 border-t border-white/10 space-y-2">
          ${each(params.footerItems!, i => navLink(i, i.key === params.active))}
        </div>`)}
    </aside>`
}

// ─── Page header ────────────────────────────────────────────────────────────

/** Title block at the top of a page body. `renderAppLayout` emits this for you. */
export function pageHeader(params: {
  title: string
  description?: string
  /** Rendered buttons, right-aligned on desktop. */
  actions?: string
}): string {
  return /* html */ `
    <header class="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-3xl font-bold text-white">${escHtml(params.title)}</h1>
        ${when(params.description, `<p class="text-gray-400 mt-2">${escHtml(params.description)}</p>`)}
      </div>
      ${when(params.actions, `<div class="flex gap-2 shrink-0">${params.actions}</div>`)}
    </header>`
}

/** Heading for a section inside a page, with an optional count and actions. */
export function sectionHeader(params: {
  title: string
  description?: string
  icon?: IconName | string
  tone?: Tone
  count?: number
  actions?: string
}): string {
  const c = t(params.tone ?? 'primary')
  return /* html */ `
    <div class="flex items-end justify-between mb-4 gap-4">
      <div class="min-w-0">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          ${when(params.icon, icon(params.icon ?? '', `w-5 h-5 ${c.text}`))}
          ${escHtml(params.title)}
          ${when(params.count !== undefined, `<span class="text-sm font-normal text-gray-400">(${params.count})</span>`)}
        </h2>
        ${when(params.description, `<p class="text-gray-400 text-sm mt-1">${escHtml(params.description)}</p>`)}
      </div>
      ${when(params.actions, `<div class="flex gap-2 shrink-0">${params.actions}</div>`)}
    </div>`
}

// ─── Breadcrumb ─────────────────────────────────────────────────────────────

export function breadcrumb(items: { label: string; href?: string }[]): string {
  return /* html */ `
    <nav aria-label="Breadcrumb" class="flex items-center gap-1 text-sm mb-4 flex-wrap">
      ${each(items, (item, i) => `
        ${i > 0 ? `<span class="text-gray-600" aria-hidden="true">${icon('chevronRight', 'w-3 h-3')}</span>` : ''}
        ${item.href
          ? `<a href="${escHtml(item.href)}" class="px-1.5 py-0.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-all">${escHtml(item.label)}</a>`
          : `<span class="px-1.5 py-0.5 text-white font-medium">${escHtml(item.label)}</span>`}`)}
    </nav>`
}

// ─── Segmented control / tabs ───────────────────────────────────────────────

/**
 * Inline mode switch — Terminal / SFTP, List / Grid, Day / Week.
 * Give each item either an `href` or an `onclick`.
 */
export function segmented(params: {
  items: { key: string; label: string; href?: string; onclick?: string }[]
  active: string
  tone?: Tone
  class?: string
}): string {
  const c = t(params.tone ?? 'primary')
  return /* html */ `
    <div class="inline-flex items-center rounded-lg bg-white/5 p-0.5 ${params.class ?? ''}" role="tablist">
      ${each(params.items, i => {
        const on = i.key === params.active
        const cls = cx(
          'px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer border-0',
          on ? c.soft : 'bg-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5',
        )
        const a = `role="tab" aria-selected="${on}" class="${cls}"`
        return i.href
          ? `<a href="${escHtml(i.href)}" ${a}>${escHtml(i.label)}</a>`
          : `<button type="button" ${a}${i.onclick ? ` onclick="${escHtml(i.onclick)}"` : ''}>${escHtml(i.label)}</button>`
      })}
    </div>`
}

/** Underlined tab strip for switching page sections. */
export function tabs(params: {
  items: { key: string; label: string; href: string; count?: number }[]
  active: string
  tone?: Tone
}): string {
  const c = t(params.tone ?? 'primary')
  return /* html */ `
    <div class="flex items-center gap-1 border-b border-white/10 mb-6 overflow-x-auto scroll-none">
      ${each(params.items, i => {
        const on = i.key === params.active
        return `<a href="${escHtml(i.href)}"${on ? ' aria-current="page"' : ''}
          class="${cx(
            'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-all',
            on ? `${c.text} border-current` : 'text-gray-400 border-transparent hover:text-white',
          )}">${escHtml(i.label)}${i.count !== undefined ? ` <span class="text-xs text-gray-500">${i.count}</span>` : ''}</a>`
      })}
    </div>`
}

// ─── Avatar ─────────────────────────────────────────────────────────────────

/** Initial-in-a-circle. Deterministic tone when none is given. */
export function avatar(params: { name: string; tone?: Tone; size?: 'sm' | 'md' | 'lg' }): string {
  const TONES: Tone[] = ['primary', 'secondary', 'info', 'accent', 'warning']
  const auto = TONES[params.name.charCodeAt(0) % TONES.length]!
  const c = t(params.tone ?? auto)
  const s =
    params.size === 'lg' ? 'w-12 h-12 text-base' : params.size === 'sm' ? 'w-6 h-6 text-xs' : 'w-9 h-9 text-sm'
  return `<span class="${cx('inline-flex items-center justify-center rounded-full font-bold shrink-0', s, c.soft)}" title="${escHtml(params.name)}">${escHtml(params.name.charAt(0).toUpperCase())}</span>`
}
