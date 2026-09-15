# Patterns

Whole screens, assembled from the components. Copy one and change the nouns.
`bun run dev` → `/patterns` renders these.

## Project skeleton

```
src/
  index.ts                  Elysia app: routes → render functions
  config/env.ts             typed environment
  db/                       schema + queries
  routes/*.routes.ts        one file per resource
  services/*.service.ts     business logic, no HTML
  views/
    nav.ts                  the NAV constant, shared by every page
    pages/*.page.ts         one render function per screen
  ds/                       the design system — do not edit per-app
```

Views render, services decide, routes wire the two together. A `.page.ts` file
never talks to the database; a `.service.ts` file never returns HTML.

## The shared nav

```ts
// src/views/nav.ts
import type { NavItem } from '@/ds'

export const NAV: NavItem[] = [
  { key: 'servers', label: 'My Servers', href: '/', icon: 'server' },
  { key: 'teams', label: 'My Teams', href: '/teams', icon: 'users' },
  { key: 'quick', label: 'Quick Connect', href: '/quick-connect', icon: 'bolt' },
]

export const NAV_FOOTER: NavItem[] = [
  { key: 'logout', label: 'Logout', href: '/auth/logout', icon: 'logout', noBoost: true },
]

export const APP_NAME = 'SSH GaetanDev'
```

Define it once. A page that hand-rolls its own nav array will drift.

---

## List page

Header with the primary action, a grid of cards, an empty state that offers the
same action.

```ts
import { renderAppLayout, cardGrid, card, button, badge, flashes, emptyState } from '@/ds'
import { NAV, NAV_FOOTER, APP_NAME } from '../nav'

export function renderServersPage({ username, servers, flash, error }: Params): string {
  const add = button({ label: 'Add server', icon: 'plus', href: '/servers/new' })

  const body = servers.length === 0
    ? emptyState({
        icon: 'server',
        title: 'No saved servers yet',
        description: 'Add your first SSH server to get started',
        action: add,
      })
    : cardGrid(servers.map(s => card({
        title: s.name,
        subtitle: `${s.username}@${s.host}:${s.port}`,
        icon: 'server',
        actions:
          button({ label: 'Connect', href: `/terminal/${s.id}`, size: 'sm', full: true }) +
          iconButton({ icon: 'edit', title: 'Edit', href: `/servers/${s.id}/edit` }) +
          confirmButton({ action: `/servers/${s.id}/delete`, confirm: 'Delete this server?' }),
      })).join(''))

  return renderAppLayout({
    title: 'My Servers',
    pageDescription: 'Manage your saved SSH connections',
    pageActions: servers.length > 0 ? add : undefined,
    nav: NAV, navFooter: NAV_FOOTER, active: 'servers',
    user: { name: username },
    appName: APP_NAME,
    content: flashes({ flash, error }) + body,
  })
}
```

## A second, shared section

When a page shows both "yours" and "shared with you", the second section switches
tone to `secondary` and its cards are `tinted`. That colour shift is how the
system says *this isn't only yours*.

```ts
sectionHeader({
  title: 'Team servers',
  description: 'Servers shared with you through teams',
  icon: 'users', tone: 'secondary', count: shared.length,
}) +
cardGrid(shared.map(s => card({
  title: s.name,
  subtitle: `${s.username}@${s.host}:${s.port}`,
  icon: 'server', tone: 'secondary', tinted: true,
  badge: badge({ label: s.team_name, tone: 'secondary' }),
  actions: button({ label: 'Connect', tone: 'secondary', size: 'sm', full: true }),
})).join(''))
```

## Form page

```ts
export function renderServerFormPage({ username, server, error }: Params): string {
  const isEdit = !!server

  return renderAppLayout({
    title: isEdit ? 'Edit server' : 'Add server',
    pageDescription: isEdit ? `Editing ${server.name}` : 'Add a new SSH server',
    nav: NAV, navFooter: NAV_FOOTER, active: 'servers',
    user: { name: username },
    appName: APP_NAME,
    content: flashes({ error }) + form({
      action: isEdit ? `/servers/${server.id}` : '/servers',
      fields:
        input({ name: 'name', label: 'Connection name', value: server?.name,
                placeholder: 'e.g. Production VPS', required: true }) +
        fieldRow([
          input({ name: 'host', label: 'Host', value: server?.host, required: true, class: 'md:col-span-2' }),
          input({ name: 'port', label: 'Port', type: 'number', value: server?.port ?? 22, required: true }),
        ], 3) +
        radioGroup({
          name: 'authType', label: 'Authentication',
          value: server?.auth_type ?? 'password',
          options: [{ value: 'password', label: 'Password' }, { value: 'key', label: 'SSH key' }],
          onchange: 'toggleAuth()',
        }) +
        input({ name: 'password', label: 'Password', type: 'password',
                required: !isEdit, class: 'js-auth-password',
                hint: isEdit ? 'Leave blank to keep the current one' : undefined }) +
        textarea({ name: 'privateKey', label: 'Private key', rows: 6, mono: true,
                   class: 'js-auth-key hidden' }),
      submit: isEdit ? 'Update server' : 'Save server',
      cancelHref: '/',
    }),
  })
}
```

Fields that appear and disappear get a `js-` class and a small inline script in
`scripts`. Keep that script next to the form it drives.

## Detail page

Breadcrumb, owner-only actions, then sections of rows.

```ts
content:
  flashes({ flash, error }) +
  breadcrumb([{ label: 'Teams', href: '/teams' }, { label: team.name }]) +
  (isOwner ? `<div class="flex gap-2 mb-8">
     ${button({ label: 'Edit name', href: `/teams/${team.id}/edit`, variant: 'ghost', size: 'sm' })}
     ${confirmButton({ action: `/teams/${team.id}/delete`, label: 'Delete team',
                       confirm: 'Delete this team? This cannot be undone.' })}
   </div>` : '') +
  sectionHeader({ title: 'Members', icon: 'users', tone: 'secondary', count: members.length }) +
  rowList(members.map(m => row({
    title: m.username,
    subtitle: m.role === 'owner' ? 'Owner' : 'Member',
    icon: 'user',
    tone: m.role === 'owner' ? 'secondary' : 'info',
    actions: isOwner && m.role !== 'owner'
      ? confirmButton({ action: `/teams/${team.id}/members/${m.id}/remove`,
                        label: 'Remove', confirm: 'Remove this member?' })
      : '',
  })).join(''))
```

## Dashboard

Stats across the top, detail underneath.

```ts
content: `
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
    ${stat({ label: 'Servers', value: counts.servers, icon: 'server' })}
    ${stat({ label: 'Teams', value: counts.teams, icon: 'users', tone: 'secondary' })}
    ${stat({ label: 'Sessions', value: counts.sessions, icon: 'terminal', tone: 'accent' })}
    ${stat({ label: 'Alerts', value: counts.alerts, icon: 'warning', tone: 'warning' })}
  </div>
  ${sectionHeader({ title: 'Recent activity', icon: 'clock' })}
  ${timeline(events.map(e => ({ title: e.title, caption: e.when, tone: e.tone, icon: e.icon })))}
`
```

## Sign-in

```ts
renderAuthLayout({
  title: 'Sign in',
  heading: 'SSH GaetanDev',
  subheading: 'Sign in with your gaetandev.fr account',
  icon: icon('terminal', 'w-12 h-12 text-green-400'),
  content: button({ label: 'Continue with SSO', href: '/auth/login', icon: 'key', full: true }),
  footer: 'Sessions expire after 12 hours.',
})
```

## Full-height tool screen

```ts
renderShellLayout({
  title: 'Terminal',
  topbar: `
    <a href="/" class="flex items-center gap-2 px-4 text-gray-400 hover:text-white transition-colors">
      ${icon('arrowLeft', 'w-4 h-4')}<span class="text-xs font-medium">Dashboard</span>
    </a>
    <div class="w-px h-6 bg-white/10"></div>
    <div id="tabBar" class="flex items-center flex-1 min-w-0 overflow-x-auto scroll-none"></div>
    <div class="flex items-center gap-2 px-4">${avatar({ name: username, size: 'sm' })}</div>`,
  subbar: `
    ${segmented({ items: [{ key: 'term', label: 'Terminal', onclick: "setMode('terminal')" },
                          { key: 'sftp', label: 'SFTP', onclick: "setMode('sftp')" }], active: 'term' })}
    <div class="flex-1"></div>
    ${status('online', 'Connected')}`,
  content: `<div id="terminalArea" class="absolute inset-0"></div>`,
  styles: `.xterm { height: 100%; width: 100%; }`,
  scripts: `<script>/* … */</script>`,
})
```

## htmx

`hx-boost` is already on the `<body>`, so links and forms swap without a full
reload. For partial updates, return a fragment from the route and target it:

```ts
searchInput({
  placeholder: 'Filter servers…',
  attrs: {
    'hx-get': '/servers/search',
    'hx-trigger': 'keyup changed delay:300ms',
    'hx-target': '#serverGrid',
  },
})

// route
.get('/servers/search', ({ query }) => cardGrid(search(query.q).map(serverCard).join('')))
```

Add `noBoost: true` (or `hx-boost="false"`) to links htmx must not intercept:
logout, file downloads, anything leaving the app.
