import { t, type Tone } from '../tones'
import { icon, type IconName } from '../icons'
import { attrs, cx, escHtml } from '../utils'

export type ButtonVariant = 'solid' | 'soft' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonParams {
  label?: string
  /** Renders an `<a>` instead of a `<button>`. */
  href?: string
  type?: 'button' | 'submit' | 'reset'
  tone?: Tone
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: IconName | string
  /** Put the icon after the label instead of before. */
  iconRight?: boolean
  full?: boolean
  disabled?: boolean
  onclick?: string
  title?: string
  class?: string
  /** Anything else: `hx-*`, `data-*`, `id`, `name`, `form`… */
  attrs?: Record<string, string | number | boolean | null | undefined>
}

const SIZE: Record<ButtonSize, { pad: string; text: string; icon: string }> = {
  sm: { pad: 'px-3 py-1.5', text: 'text-xs', icon: 'w-3.5 h-3.5' },
  md: { pad: 'px-5 py-2.5', text: 'text-xs', icon: 'w-4 h-4' },
  lg: { pad: 'px-6 py-3', text: 'text-sm', icon: 'w-4 h-4' },
}

/** Just the classes, for when you need to style an element the DS doesn't cover. */
export function buttonClass({
  tone = 'primary',
  variant = 'solid',
  size = 'lg',
  full,
  disabled,
  class: extra,
}: Pick<ButtonParams, 'tone' | 'variant' | 'size' | 'full' | 'disabled' | 'class'> = {}): string {
  const c = t(tone)
  const s = SIZE[size]
  const skin =
    variant === 'solid'
      ? cx(c.solid, 'shadow-lg hover:shadow-xl')
      : variant === 'soft'
        ? c.softInteractive
        : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'

  return cx(
    'inline-flex items-center justify-center gap-2 rounded-xl uppercase font-bold tracking-wide',
    'transition-all duration-300 whitespace-nowrap',
    s.pad,
    s.text,
    skin,
    full && 'w-full',
    disabled && 'opacity-40 pointer-events-none',
    extra,
  )
}

/**
 * The system's button.
 *
 *   button({ label: 'Add server', icon: 'plus', href: '/servers/new' })
 *   button({ label: 'Delete', tone: 'danger', variant: 'soft', size: 'sm' })
 */
export function button(params: ButtonParams): string {
  const { label, href, type = 'button', size = 'lg', disabled, onclick, title } = params
  const s = SIZE[size]
  const glyph = params.icon ? icon(params.icon, s.icon) : ''
  const body = cx(
    params.iconRight ? '' : glyph,
    label ? `<span>${escHtml(label)}</span>` : '',
    params.iconRight ? glyph : '',
  )

  const common =
    `class="${buttonClass(params)}"` +
    attrs({ title, onclick, ...params.attrs })

  return href
    ? `<a href="${escHtml(href)}"${disabled ? ' aria-disabled="true"' : ''} ${common}>${body}</a>`
    : `<button type="${type}"${disabled ? ' disabled' : ''} ${common}>${body}</button>`
}

/**
 * Square icon-only button for dense rows (edit / delete / refresh).
 * Always pass `title` — it is the only label a screen reader gets.
 */
export function iconButton(params: {
  icon: IconName | string
  title: string
  href?: string
  type?: 'button' | 'submit'
  tone?: Tone
  onclick?: string
  class?: string
  attrs?: Record<string, string | number | boolean | null | undefined>
}): string {
  const { tone = 'muted' } = params
  const skin = tone === 'muted' ? 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white' : t(tone).softInteractive
  const cls = cx('inline-flex items-center justify-center px-3 py-2 rounded-xl transition-all', skin, params.class)
  const glyph = icon(params.icon, 'w-4 h-4')
  const common = `class="${cls}" title="${escHtml(params.title)}" aria-label="${escHtml(params.title)}"` + attrs({ onclick: params.onclick, ...params.attrs })

  return params.href
    ? `<a href="${escHtml(params.href)}" ${common}>${glyph}</a>`
    : `<button type="${params.type ?? 'button'}" ${common}>${glyph}</button>`
}

/**
 * A destructive action that posts a form and asks for confirmation first.
 * Use it instead of hand-rolling the `<form onsubmit="return confirm(...)">`.
 */
export function confirmButton(params: {
  action: string
  label?: string
  icon?: IconName | string
  confirm: string
  tone?: Tone
  size?: ButtonSize
  class?: string
}): string {
  const { action, confirm, tone = 'danger', size = 'sm' } = params
  const inner = params.label
    ? button({ label: params.label, icon: params.icon, type: 'submit', tone, variant: 'soft', size })
    : iconButton({ icon: params.icon ?? 'trash', title: confirm, type: 'submit', tone })

  return `<form method="POST" action="${escHtml(action)}" class="${params.class ?? 'inline'}" onsubmit="return confirm('${confirm.replace(/'/g, "\\'")}')">${inner}</form>`
}

/** Inline spinner for pending states. */
export function spinner(cls = 'w-4 h-4'): string {
  return `<svg class="${cls} anim-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25" stroke-width="3"/><path d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`
}
