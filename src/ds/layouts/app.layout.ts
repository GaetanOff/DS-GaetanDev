import { renderBaseLayout, type BaseLayoutParams } from './base.layout'
import { pageHeader, sidebar, type NavItem } from '../components/navigation'
import { toastHost } from '../components/feedback'
import { tokens } from '../tokens'
import { escHtml, when } from '../utils'

export interface AppLayoutParams {
  /** Browser tab title. `" — <App name>"` is appended automatically. */
  title: string
  /** Heading shown at the top of the content panel. Defaults to `title`. */
  pageTitle?: string
  pageDescription?: string
  /** Rendered buttons, right of the page heading. */
  pageActions?: string
  /** Page body, inside the glass panel. */
  content: string

  /** Sidebar items. Pass the app's `NAV` constant. */
  nav: NavItem[]
  /** `key` of the active nav item. */
  active: string
  navFooter?: NavItem[]
  user?: { name: string; caption?: string }

  /** Small eyebrow above the shell. Defaults to `gaetandev.fr`. */
  eyebrow?: string
  /** Suffix for the `<title>`. Defaults to the brand name. */
  appName?: string
  /** Anything rendered outside the shell: modals, drawers, page scripts. */
  extra?: string

  head?: BaseLayoutParams['head']
  styles?: BaseLayoutParams['styles']
  scripts?: BaseLayoutParams['scripts']
}

/**
 * The standard app screen: sidebar on the left, one glass panel on the right.
 * This is the layout to reach for unless the screen is deliberately full-bleed.
 *
 *   renderAppLayout({
 *     title: 'My Servers', pageDescription: 'Manage your SSH connections',
 *     nav: NAV, active: 'servers', user: { name: session.username },
 *     content: cardGrid(servers.map(serverCard).join('')),
 *   })
 */
export function renderAppLayout(params: AppLayoutParams): string {
  const appName = params.appName ?? tokens.brand.name

  const shell = /* html */ `
  <div class="relative min-h-screen p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <p class="text-xs uppercase tracking-widest text-gray-400">${escHtml(params.eyebrow ?? tokens.brand.domain)}</p>
      </div>
      <div class="flex flex-col lg:flex-row gap-6">
        ${sidebar({
          items: params.nav,
          active: params.active,
          footerItems: params.navFooter,
          user: params.user,
        })}
        <main class="flex-1 min-w-0 glass rounded-3xl p-6 md:p-8">
          ${pageHeader({
            title: params.pageTitle ?? params.title,
            description: params.pageDescription,
            actions: params.pageActions,
          })}
          ${params.content}
        </main>
      </div>
    </div>
  </div>
  ${params.extra ?? ''}
  ${toastHost()}`

  return renderBaseLayout({
    title: `${params.title} — ${appName}`,
    content: shell,
    head: params.head,
    styles: params.styles,
    scripts: params.scripts,
  })
}

/**
 * Centred single-card screen: sign-in, an error page, a "pick a workspace"
 * step. No sidebar, nothing to navigate to yet.
 */
export function renderAuthLayout(params: {
  title: string
  heading: string
  subheading?: string
  content: string
  /** Line under the card — a help link, a legal note. */
  footer?: string
  appName?: string
  icon?: string
}): string {
  const appName = params.appName ?? tokens.brand.name
  const body = /* html */ `
    <div class="relative min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <p class="text-xs uppercase tracking-widest text-gray-400 text-center mb-6">${escHtml(tokens.brand.domain)}</p>
        <div class="glass rounded-3xl p-8">
          <div class="text-center mb-8">
            ${when(params.icon, `<div class="mb-4 flex justify-center">${params.icon}</div>`)}
            <h1 class="text-2xl font-bold text-white">${escHtml(params.heading)}</h1>
            ${when(params.subheading, `<p class="text-gray-400 text-sm mt-2">${escHtml(params.subheading)}</p>`)}
          </div>
          ${params.content}
        </div>
        ${when(params.footer, `<p class="text-center text-xs text-gray-500 mt-6">${params.footer}</p>`)}
      </div>
    </div>
    ${toastHost()}`

  return renderBaseLayout({ title: `${params.title} — ${appName}`, content: body })
}

/**
 * Full-height chrome for tool screens: a fixed top bar and a content area that
 * fills the rest. Used by the SSH terminal; also fits editors, maps, canvases.
 */
export function renderShellLayout(params: {
  title: string
  /** Contents of the top bar. */
  topbar: string
  /** Fills the remaining height; it is `position: relative`. */
  content: string
  /** Second bar under the top one — mode switch, status. */
  subbar?: string
  appName?: string
  head?: string
  styles?: string
  scripts?: string
  extra?: string
}): string {
  const body = /* html */ `
  <div class="h-screen flex flex-col overflow-hidden">
    <div class="glass border-b border-white/10 flex items-center shrink-0" style="min-height:46px">${params.topbar}</div>
    ${when(params.subbar, `<div class="glass border-b border-white/10 px-4 py-1 flex items-center gap-3 shrink-0" style="min-height:38px">${params.subbar}</div>`)}
    <div class="flex-1 relative overflow-hidden">${params.content}</div>
  </div>
  ${params.extra ?? ''}
  ${toastHost()}`

  return renderBaseLayout({
    title: `${params.title} — ${params.appName ?? tokens.brand.name}`,
    content: body,
    blobs: false,
    head: params.head,
    styles: params.styles,
    scripts: params.scripts,
  })
}
