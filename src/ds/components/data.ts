import { t, type Tone } from '../tones'
import { icon, type IconName } from '../icons'
import { cx, each, escHtml, when } from '../utils'

/**
 * Table for tabular data. Rows are raw HTML strings so a cell can hold a badge,
 * a button, anything. Wrap long tables — the container already scrolls sideways.
 *
 *   table({
 *     columns: [{ label: 'Name' }, { label: 'Size', align: 'right' }, { label: '' }],
 *     rows: files.map(f => [escHtml(f.name), formatSize(f.size), actions(f)]),
 *   })
 */
export function table(params: {
  columns: { label: string; align?: 'left' | 'right' | 'center'; class?: string }[]
  rows: string[][]
  /** Shown instead of the body when `rows` is empty. */
  empty?: string
  /** Fade row actions in on hover (adds `.hover-row` to each `<tr>`). */
  hoverActions?: boolean
  class?: string
}): string {
  const align = (a?: string) => (a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left')

  if (params.rows.length === 0 && params.empty) {
    return params.empty
  }

  return /* html */ `
    <div class="overflow-x-auto scroll-thin bg-white/5 border border-white/10 rounded-2xl ${params.class ?? ''}">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-white/10">
            ${each(params.columns, c => `<th scope="col" class="${cx('px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap', align(c.align), c.class)}">${escHtml(c.label)}</th>`)}
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          ${each(params.rows, r => `
            <tr class="${cx('transition-colors hover:bg-white/5', params.hoverActions && 'hover-row')}">
              ${each(r, (cell, i) => `<td class="${cx('px-4 py-3 text-gray-300', align(params.columns[i]?.align))}">${cell}</td>`)}
            </tr>`)}
        </tbody>
      </table>
    </div>`
}

/** Label/value pairs — a detail panel, a summary, a settings recap. */
export function definitionList(items: { label: string; value: string }[]): string {
  return /* html */ `
    <dl class="divide-y divide-white/5">
      ${each(items, i => `
        <div class="flex items-start justify-between gap-4 py-3">
          <dt class="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">${escHtml(i.label)}</dt>
          <dd class="text-sm text-gray-200 text-right min-w-0 break-words">${i.value}</dd>
        </div>`)}
    </dl>`
}

/** Monospace block for commands, config snippets and log output. */
export function codeBlock(params: {
  code: string
  /** Adds a copy button in the corner. */
  copyable?: boolean
  tone?: Tone
  /** Cap the height and scroll past it. */
  maxHeight?: string
  label?: string
}): string {
  const c = t(params.tone ?? 'secondary')
  const id = `code-${Math.random().toString(36).slice(2, 9)}`
  return /* html */ `
    <div class="relative group">
      ${when(params.label, `<p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">${escHtml(params.label)}</p>`)}
      <pre id="${id}" class="bg-black/30 rounded-lg p-3 overflow-x-auto scroll-thin text-xs ${c.textSoft} font-mono"${params.maxHeight ? ` style="max-height:${params.maxHeight};overflow-y:auto"` : ''}><code>${escHtml(params.code)}</code></pre>
      ${when(params.copyable, `
        <button type="button" title="Copy" aria-label="Copy to clipboard"
          onclick="navigator.clipboard.writeText(document.getElementById('${id}').innerText);window.toast&&toast('Copied','success')"
          class="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
          ${icon('copy', 'w-3.5 h-3.5')}
        </button>`)}
    </div>`
}

/** Inline monospace fragment inside prose. */
export function code(text: string): string {
  return `<code class="px-1.5 py-0.5 rounded bg-purple-400/12 text-purple-300 text-[0.9em] font-mono">${escHtml(text)}</code>`
}

/** Horizontal progress bar, 0–100. */
export function progress(params: { value: number; tone?: Tone; label?: string }): string {
  const c = t(params.tone ?? 'primary')
  const pct = Math.max(0, Math.min(100, params.value))
  return /* html */ `
    <div>
      ${when(params.label, `
        <div class="flex justify-between text-xs mb-1.5">
          <span class="text-gray-400">${escHtml(params.label)}</span>
          <span class="${c.textSoft} font-medium">${pct}%</span>
        </div>`)}
      <div class="h-1.5 rounded-full bg-white/10 overflow-hidden" role="progressbar"
        aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="h-full rounded-full transition-all duration-300" style="width:${pct}%;background:${c.hex}"></div>
      </div>
    </div>`
}

/** Vertical event list — deploys, audit trail, activity feed. */
export function timeline(
  items: { title: string; caption?: string; tone?: Tone; icon?: IconName | string }[],
): string {
  return /* html */ `
    <ol class="relative border-l border-white/10 ml-3 space-y-5">
      ${each(items, i => {
        const c = t(i.tone ?? 'muted')
        return `
        <li class="ml-6">
          <span class="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ${c.chip} ${c.text}">
            ${icon(i.icon ?? 'check', 'w-3 h-3')}
          </span>
          <p class="text-sm text-white font-medium">${escHtml(i.title)}</p>
          ${when(i.caption, `<p class="text-xs text-gray-500 mt-0.5">${escHtml(i.caption)}</p>`)}
        </li>`
      })}
    </ol>`
}
