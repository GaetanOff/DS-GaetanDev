import { CONTROL, LABEL, t, type Tone } from '../tones'
import { icon, type IconName } from '../icons'
import { button } from './button'
import { attrs, cx, each, escHtml, when } from '../utils'

type Extra = Record<string, string | number | boolean | null | undefined>

interface FieldBase {
  name: string
  label?: string
  /** Defaults to `name`. */
  id?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  /** Grey line under the control. */
  hint?: string
  /** Red line under the control; also outlines it. */
  error?: string
  /** Focus ring colour. Match the section's tone. */
  tone?: Tone
  class?: string
  attrs?: Extra
}

function wrap(f: FieldBase, control: string): string {
  const id = f.id ?? f.name
  return /* html */ `
    <div class="${f.class ?? ''}">
      ${when(f.label, `<label for="${escHtml(id)}" class="${LABEL}">${escHtml(f.label)}${when(f.required, ' <span class="text-green-400" aria-hidden="true">*</span>')}</label>`)}
      ${control}
      ${when(f.error, `<p class="text-red-300 text-xs mt-1.5">${escHtml(f.error)}</p>`)}
      ${when(!f.error && f.hint, `<p class="text-gray-500 text-xs mt-1.5">${escHtml(f.hint)}</p>`)}
    </div>`
}

function controlClass(f: FieldBase, extra?: string): string {
  return cx(CONTROL, t(f.tone).ring, f.error && 'border-red-500/50', extra)
}

export interface InputParams extends FieldBase {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'search' | 'tel' | 'date' | 'time'
  value?: string | number
  autocomplete?: string
  min?: number
  max?: number
  step?: number
}

/**
 * Labelled text input.
 *
 *   input({ name: 'host', label: 'Host', placeholder: '192.168.1.100', required: true })
 */
export function input(f: InputParams): string {
  const id = f.id ?? f.name
  const control =
    `<input id="${escHtml(id)}" name="${escHtml(f.name)}" type="${f.type ?? 'text'}"` +
    attrs({
      value: f.value ?? '',
      placeholder: f.placeholder,
      required: f.required,
      disabled: f.disabled,
      autocomplete: f.autocomplete,
      min: f.min,
      max: f.max,
      step: f.step,
      'aria-invalid': f.error ? 'true' : undefined,
      ...f.attrs,
    }) +
    ` class="${controlClass(f)}">`
  return wrap(f, control)
}

export interface TextareaParams extends FieldBase {
  value?: string
  rows?: number
  /** Monospace — keys, config, logs. */
  mono?: boolean
}

export function textarea(f: TextareaParams): string {
  const id = f.id ?? f.name
  const control =
    `<textarea id="${escHtml(id)}" name="${escHtml(f.name)}" rows="${f.rows ?? 5}"` +
    attrs({
      placeholder: f.placeholder,
      required: f.required,
      disabled: f.disabled,
      'aria-invalid': f.error ? 'true' : undefined,
      ...f.attrs,
    }) +
    ` class="${controlClass(f, f.mono ? 'font-mono text-sm' : '')}">${escHtml(f.value)}</textarea>`
  return wrap(f, control)
}

export interface SelectParams extends FieldBase {
  options: { value: string; label: string; disabled?: boolean }[]
  value?: string
  /** Shown as a disabled, pre-selected first option. */
  placeholder?: string
}

export function select(f: SelectParams): string {
  const id = f.id ?? f.name
  const opts =
    when(
      f.placeholder,
      `<option value="" disabled ${f.value ? '' : 'selected'}>${escHtml(f.placeholder)}</option>`,
    ) +
    each(
      f.options,
      o =>
        `<option value="${escHtml(o.value)}"${o.value === f.value ? ' selected' : ''}${o.disabled ? ' disabled' : ''}>${escHtml(o.label)}</option>`,
    )
  const control =
    `<select id="${escHtml(id)}" name="${escHtml(f.name)}"` +
    attrs({ required: f.required, disabled: f.disabled, ...f.attrs }) +
    ` class="${controlClass(f)}">${opts}</select>`
  return wrap(f, control)
}

/**
 * Radio group laid out on one line. The system uses it for either/or choices
 * that change what the rest of the form shows (password vs. SSH key).
 */
export function radioGroup(f: {
  name: string
  label?: string
  options: { value: string; label: string }[]
  value?: string
  tone?: Tone
  onchange?: string
  class?: string
}): string {
  const ring = t(f.tone).ring
  const accent = t(f.tone).text
  return /* html */ `
    <div class="${f.class ?? ''}">
      ${when(f.label, `<span class="${LABEL}">${escHtml(f.label)}</span>`)}
      <div class="flex flex-wrap gap-4">
        ${each(f.options, o => `
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="${escHtml(f.name)}" value="${escHtml(o.value)}"${o.value === f.value ? ' checked' : ''}
              class="${accent} ${ring}"${attrs({ onchange: f.onchange })}>
            <span class="text-gray-300">${escHtml(o.label)}</span>
          </label>`)}
      </div>
    </div>`
}

export function checkbox(f: {
  name: string
  label: string
  checked?: boolean
  value?: string
  tone?: Tone
  hint?: string
  attrs?: Extra
}): string {
  return /* html */ `
    <label class="flex items-start gap-3 cursor-pointer">
      <input type="checkbox" name="${escHtml(f.name)}" value="${escHtml(f.value ?? 'on')}"${f.checked ? ' checked' : ''}
        class="mt-0.5 rounded ${t(f.tone).text} ${t(f.tone).ring}"${attrs(f.attrs)}>
      <span>
        <span class="text-gray-300 text-sm">${escHtml(f.label)}</span>
        ${when(f.hint, `<span class="block text-gray-500 text-xs">${escHtml(f.hint)}</span>`)}
      </span>
    </label>`
}

/**
 * Search / filter input with a leading icon.
 * Pair it with htmx: `attrs: { 'hx-get': '/search', 'hx-trigger': 'keyup changed delay:300ms' }`
 */
export function searchInput(f: {
  name?: string
  placeholder?: string
  value?: string
  tone?: Tone
  class?: string
  attrs?: Extra
}): string {
  return /* html */ `
    <div class="relative ${f.class ?? ''}">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">${icon('search', 'w-4 h-4')}</span>
      <input type="search" name="${escHtml(f.name ?? 'q')}" value="${escHtml(f.value)}"
        placeholder="${escHtml(f.placeholder ?? 'Search…')}"${attrs(f.attrs)}
        class="${cx(CONTROL, t(f.tone).ring, 'pl-10')}">
    </div>`
}

/**
 * Form shell: consistent vertical rhythm plus a right-aligned action row.
 *
 *   form({ action: '/servers', fields: [...].join(''),
 *          submit: 'Save server', cancelHref: '/' })
 */
export function form(params: {
  action: string
  method?: 'POST' | 'GET'
  fields: string
  submit?: string
  submitTone?: Tone
  submitIcon?: IconName | string
  cancelHref?: string
  cancelLabel?: string
  class?: string
  attrs?: Extra
}): string {
  return /* html */ `
    <form method="${params.method ?? 'POST'}" action="${escHtml(params.action)}"${attrs(params.attrs)}
      class="${params.class ?? 'max-w-xl space-y-6'}">
      ${params.fields}
      ${when(params.submit, () => `
        <div class="flex gap-3 pt-2">
          ${button({ label: params.submit!, icon: params.submitIcon, type: 'submit', tone: params.submitTone ?? 'primary' })}
          ${when(params.cancelHref, () => button({ label: params.cancelLabel ?? 'Cancel', href: params.cancelHref!, tone: 'muted', variant: 'ghost' }))}
        </div>`)}
    </form>`
}

/** Two-column field row that collapses on mobile. */
export function fieldRow(fields: string[], cols: 2 | 3 = 2): string {
  const c = cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
  return `<div class="grid grid-cols-1 ${c} gap-4">${fields.join('')}</div>`
}
