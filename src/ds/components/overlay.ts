import { icon, type IconName } from '../icons'
import { cx, escHtml, when } from '../utils'

/**
 * Centred modal. Hidden until `openModal('<id>')` is called; `closeModal('<id>')`
 * or Escape closes it. Include `modalScript()` once per page.
 *
 *   modal({ id: 'confirm', title: 'Delete server', body: '…',
 *           actions: button({ label: 'Delete', tone: 'danger' }) })
 */
export function modal(params: {
  id: string
  title: string
  description?: string
  body: string
  /** Rendered buttons for the footer. */
  actions?: string
  size?: 'sm' | 'md' | 'lg'
  /** Clicking the backdrop or Escape will not close it. */
  persistent?: boolean
}): string {
  const width =
    params.size === 'lg' ? 'max-w-3xl' : params.size === 'sm' ? 'max-w-sm' : 'max-w-xl'
  return /* html */ `
    <div id="${escHtml(params.id)}" class="ds-modal fixed inset-0 z-[150] hidden items-start justify-center overflow-y-auto p-4 py-12"
      style="background: rgba(0,0,0,0.5); backdrop-filter: blur(12px);"
      role="dialog" aria-modal="true" aria-labelledby="${escHtml(params.id)}-title"
      ${params.persistent ? 'data-persistent="true"' : `onclick="if(event.target===this)closeModal('${escHtml(params.id)}')"`}>
      <div class="glass rounded-3xl p-6 md:p-8 w-full ${width} anim-pop">
        <div class="flex items-start justify-between gap-4 mb-6">
          <div class="min-w-0">
            <h2 id="${escHtml(params.id)}-title" class="text-xl font-bold text-white">${escHtml(params.title)}</h2>
            ${when(params.description, `<p class="text-sm text-gray-400 mt-1">${escHtml(params.description)}</p>`)}
          </div>
          ${when(!params.persistent, `
            <button type="button" onclick="closeModal('${escHtml(params.id)}')" aria-label="Close"
              class="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all shrink-0">
              ${icon('close', 'w-5 h-5')}
            </button>`)}
        </div>
        ${params.body}
        ${when(params.actions, `<div class="flex gap-3 justify-end mt-6">${params.actions}</div>`)}
      </div>
    </div>`
}

/** Open/close helpers. Include once per page that uses `modal()`. */
export function modalScript(): string {
  return /* html */ `
    <script>
      window.openModal = function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('hidden');
        el.classList.add('flex');
        var focusable = el.querySelector('input, textarea, select, button');
        if (focusable) focusable.focus();
      };
      window.closeModal = function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.classList.add('hidden');
        el.classList.remove('flex');
      };
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        document.querySelectorAll('.ds-modal.flex:not([data-persistent])').forEach(function (el) {
          closeModal(el.id);
        });
      });
    </script>`
}

/**
 * Full-screen overlay pinned inside its relative parent — the "no session yet"
 * or "pick something to start" screen.
 */
export function overlay(params: { id: string; body: string; hidden?: boolean }): string {
  return /* html */ `
    <div id="${escHtml(params.id)}" class="absolute inset-0 z-50 overflow-y-auto${params.hidden ? ' hidden' : ''}"
      style="background: rgba(0,0,0,0.5); backdrop-filter: blur(12px);">
      <div class="min-h-full flex items-start justify-center py-8 px-4">
        <div class="w-full max-w-3xl">${params.body}</div>
      </div>
    </div>`
}

/**
 * Right-hand slide-over panel — details, an assistant, a filter drawer.
 * Toggle it by adding/removing `hidden` on the element.
 */
export function drawer(params: {
  id: string
  title: string
  body: string
  icon?: IconName | string
  footer?: string
  width?: string
}): string {
  return /* html */ `
    <aside id="${escHtml(params.id)}" class="fixed top-0 right-0 bottom-0 z-[100] hidden flex-col glass-deep border-l border-white/10 anim-slide-left"
      style="width: ${params.width ?? '380px'}; max-width: 90vw;" role="complementary" aria-label="${escHtml(params.title)}">
      <header class="flex items-center gap-2 px-4 py-3 border-b border-white/10 shrink-0">
        ${when(params.icon, icon(params.icon ?? '', 'w-4 h-4 text-purple-400'))}
        <h2 class="text-xs font-bold text-purple-400 uppercase tracking-widest flex-1">${escHtml(params.title)}</h2>
        <button type="button" aria-label="Close"
          onclick="document.getElementById('${escHtml(params.id)}').classList.add('hidden')"
          class="text-gray-500 hover:text-white p-1 rounded-md hover:bg-white/10 transition-all">
          ${icon('close', 'w-4 h-4')}
        </button>
      </header>
      <div class="flex-1 min-h-0 overflow-y-auto scroll-thin p-4">${params.body}</div>
      ${when(params.footer, `<footer class="shrink-0 border-t border-white/10 p-3">${params.footer}</footer>`)}
    </aside>`
}

/** Toggle helper for `drawer()`. */
export function drawerScript(): string {
  return /* html */ `
    <script>
      window.toggleDrawer = function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.classList.toggle('hidden');
        el.classList.toggle('flex');
      };
    </script>`
}

/** Dropdown menu anchored to a trigger. Closes on outside click. */
export function dropdown(params: {
  id: string
  trigger: string
  items: { label: string; href?: string; onclick?: string; icon?: IconName | string; danger?: boolean }[]
  align?: 'left' | 'right'
}): string {
  const align = params.align === 'left' ? 'left-0' : 'right-0'
  return /* html */ `
    <div class="relative inline-block" data-dropdown="${escHtml(params.id)}">
      <span onclick="toggleDropdown('${escHtml(params.id)}')">${params.trigger}</span>
      <div id="${escHtml(params.id)}" class="ds-dropdown hidden absolute ${align} top-[calc(100%+7px)] z-30 w-56 p-1 rounded-xl glass-deep shadow-2xl anim-pop" role="menu">
        ${params.items
          .map(i => {
            const cls = cx(
              'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left transition-all',
              i.danger ? 'text-red-300 hover:bg-red-500/15' : 'text-gray-300 hover:bg-white/8 hover:text-white',
            )
            const inner = `${when(i.icon, icon(i.icon ?? '', 'w-4 h-4 shrink-0'))}${escHtml(i.label)}`
            return i.href
              ? `<a href="${escHtml(i.href)}" role="menuitem" class="${cls}">${inner}</a>`
              : `<button type="button" role="menuitem" class="${cls}"${i.onclick ? ` onclick="${escHtml(i.onclick)}"` : ''}>${inner}</button>`
          })
          .join('')}
      </div>
    </div>`
}

/** Outside-click handling for `dropdown()`. Include once per page. */
export function dropdownScript(): string {
  return /* html */ `
    <script>
      window.toggleDropdown = function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        var wasOpen = !el.classList.contains('hidden');
        document.querySelectorAll('.ds-dropdown').forEach(function (d) { d.classList.add('hidden'); });
        if (!wasOpen) el.classList.remove('hidden');
      };
      document.addEventListener('click', function (e) {
        if (e.target.closest('[data-dropdown]')) return;
        document.querySelectorAll('.ds-dropdown').forEach(function (d) { d.classList.add('hidden'); });
      });
    </script>`
}
