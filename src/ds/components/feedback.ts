import { t, type Tone } from '../tones'
import { icon, type IconName } from '../icons'
import { cx, escHtml, when } from '../utils'

// ─── Alerts ─────────────────────────────────────────────────────────────────

export type AlertTone = 'success' | 'error' | 'warning' | 'info'

const ALERT_TONE: Record<AlertTone, { tone: Tone; icon: IconName }> = {
  success: { tone: 'primary', icon: 'checkCircle' },
  error: { tone: 'danger', icon: 'xCircle' },
  warning: { tone: 'warning', icon: 'warning' },
  info: { tone: 'info', icon: 'info' },
}

/**
 * Inline message block at the top of a page. The system uses it for flash
 * messages after a redirect and for form-level errors.
 *
 *   alert({ tone: 'success', message: flash })
 */
export function alert(params: {
  message: string
  tone?: AlertTone
  title?: string
  /** Hide the leading icon for a plainer block. */
  bare?: boolean
  class?: string
}): string {
  const { tone = 'info' } = params
  const map = ALERT_TONE[tone]
  const c = t(map.tone)
  return /* html */ `
    <div role="${tone === 'error' ? 'alert' : 'status'}"
      class="${cx('flex items-start gap-3 p-4 border rounded-xl', c.alert, params.class ?? 'mb-6')}">
      ${when(!params.bare, icon(map.icon, 'w-5 h-5 shrink-0 mt-0.5'))}
      <div class="min-w-0">
        ${when(params.title, `<p class="font-bold text-sm mb-0.5">${escHtml(params.title)}</p>`)}
        <p class="text-sm">${escHtml(params.message)}</p>
      </div>
    </div>`
}

/** Render the flash/error pair most pages carry. Skips whatever is absent. */
export function flashes(params: { flash?: string; error?: string }): string {
  return (
    when(params.flash, () => alert({ message: params.flash!, tone: 'success' })) +
    when(params.error, () => alert({ message: params.error!, tone: 'error' }))
  )
}

// ─── Badges ─────────────────────────────────────────────────────────────────

/**
 * Small status pill: role, environment, count, state.
 *
 *   badge({ label: 'Owner', tone: 'secondary' })
 */
export function badge(params: {
  label: string | number
  tone?: Tone
  icon?: IconName | string
  /** Adds a leading status dot instead of an icon. */
  dot?: StatusKind
  class?: string
}): string {
  const c = t(params.tone ?? 'muted')
  return /* html */ `<span class="${cx('inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg whitespace-nowrap', c.soft, params.class)}">${
    params.dot ? statusDot(params.dot) : when(params.icon, icon(params.icon ?? '', 'w-3 h-3'))
  }${escHtml(params.label)}</span>`
}

/** Keyboard shortcut hint. */
export function kbd(key: string): string {
  return `<kbd class="px-1.5 py-0.5 rounded bg-white/10 text-gray-400 text-[10px] font-mono">${escHtml(key)}</kbd>`
}

// ─── Status ─────────────────────────────────────────────────────────────────

export type StatusKind = 'pending' | 'online' | 'offline' | 'error'

const STATUS_TEXT: Record<StatusKind, string> = {
  pending: 'text-yellow-400',
  online: 'text-green-400',
  offline: 'text-gray-400',
  error: 'text-red-400',
}

/** 6px dot; `pending` pulses. */
export function statusDot(kind: StatusKind = 'offline'): string {
  return `<span class="status-dot is-${kind}" aria-hidden="true"></span>`
}

/** Dot plus label, tinted to match. */
export function status(kind: StatusKind, label: string): string {
  return `<span class="inline-flex items-center gap-2"><span class="status-dot is-${kind}" aria-hidden="true"></span><span class="text-xs ${STATUS_TEXT[kind]}">${escHtml(label)}</span></span>`
}

// ─── Empty state ────────────────────────────────────────────────────────────

/**
 * What a list shows before it has anything in it. Always give it an action —
 * an empty state without a next step is a dead end.
 */
export function emptyState(params: {
  title: string
  description?: string
  icon?: IconName | string
  /** Rendered button(s). */
  action?: string
  /** Compact variant for empty sections inside a page. */
  compact?: boolean
}): string {
  if (params.compact) {
    return /* html */ `
      <div class="text-center py-8 bg-white/5 border border-white/10 rounded-2xl">
        <p class="text-gray-400 text-sm">${escHtml(params.title)}</p>
        ${when(params.description, `<p class="text-gray-500 text-xs mt-1">${escHtml(params.description)}</p>`)}
        ${when(params.action, `<div class="mt-4">${params.action}</div>`)}
      </div>`
  }
  return /* html */ `
    <div class="text-center py-16">
      ${when(params.icon, icon(params.icon ?? '', 'w-16 h-16 mx-auto text-gray-500 mb-4', 1.5))}
      <p class="text-gray-400 text-lg mb-2">${escHtml(params.title)}</p>
      ${when(params.description, `<p class="text-gray-500 text-sm mb-6">${escHtml(params.description)}</p>`)}
      ${params.action ?? ''}
    </div>`
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

/** Placeholder block while content loads (htmx swap, fetch…). */
export function skeleton(cls = 'h-4 w-full'): string {
  return `<div class="${cx('bg-white/10 rounded-lg anim-pulse', cls)}" aria-hidden="true"></div>`
}

// ─── Toasts ─────────────────────────────────────────────────────────────────

/**
 * Drop `toastHost()` once near the end of `<body>`, then call
 * `toast('Saved', 'success')` from any client script.
 */
export function toastHost(): string {
  return /* html */ `
    <div id="dsToasts" class="fixed bottom-4 right-4 z-[200] flex flex-col gap-2" aria-live="polite"></div>
    <script>
      window.toast = function (message, type, ms) {
        var host = document.getElementById('dsToasts');
        if (!host) return;
        var skin = { success: 'bg-green-500/90', error: 'bg-red-500/90', warning: 'bg-yellow-500/90', info: 'bg-blue-500/90' };
        var el = document.createElement('div');
        el.className = 'px-4 py-3 rounded-xl text-sm font-medium shadow-lg text-white anim-in ' + (skin[type] || skin.info);
        el.textContent = message;
        host.appendChild(el);
        setTimeout(function () {
          el.classList.remove('anim-in');
          el.classList.add('anim-out');
          setTimeout(function () { el.remove(); }, 300);
        }, ms || 4000);
      };
    </script>`
}
