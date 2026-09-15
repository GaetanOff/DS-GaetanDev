---
name: gaetandev-ui
description: Build or change a screen in a GaetanDev app using the DS-GaetanDev design system. Use whenever the task involves adding a page, a form, a list, a dashboard, a modal, or any other UI in a repo that contains src/ds/ — and before writing any HTML, Tailwind classes or CSS.
---

# Building UI with the GaetanDev design system

`src/ds/` is the design system. Everything visible in a GaetanDev app is built
from it. Work through the steps below in order.

## 1. Find out what already exists

Before writing markup, check whether a component covers the case:

```bash
grep -rn "^export function" src/ds/components src/ds/layouts
```

`CLAUDE.md` in the repo root lists them grouped by purpose. If something almost
fits, extend the component in `src/ds/` — do not write a one-off styled `<div>`
in a page. A restyled-from-scratch screen is a bug even when it looks fine.

## 2. Pick the layout

| Layout | For |
| --- | --- |
| `renderAppLayout` | anything with navigation — **the default** |
| `renderAuthLayout` | sign-in, a single centred card, an error page |
| `renderShellLayout` | full-height tool screens: terminal, editor, canvas |
| `renderBaseLayout` | only when none of the above fit |

Pass the app's shared `NAV` / `NAV_FOOTER` / `APP_NAME` constants (usually
`src/views/nav.ts`). Create them there if they don't exist yet; never inline a
nav array in a page.

## 3. Pick tones by meaning

`primary` act/succeed · `secondary` shared/AI · `info` neutral data ·
`danger` destroy · `warning` pending · `accent` highlight · `muted` chrome.

Never choose a tone because it looks nice. A "shared with you" section is
purple because it is shared, not because purple is pretty.

## 4. Write the page

One render function per screen, in `src/views/pages/<name>.page.ts`, returning a
`string`. It takes already-fetched data as parameters — no database access, no
business logic in a view.

```ts
import { renderAppLayout, cardGrid, card, button, flashes, emptyState } from '@/ds'
import { NAV, NAV_FOOTER, APP_NAME } from '../nav'

export function renderThingsPage({ username, things, flash, error }: Params): string {
  const add = button({ label: 'Add thing', icon: 'plus', href: '/things/new' })
  return renderAppLayout({
    title: 'Things',
    pageDescription: '…',
    pageActions: things.length ? add : undefined,
    nav: NAV, navFooter: NAV_FOOTER, active: 'things',
    user: { name: username },
    appName: APP_NAME,
    content: flashes({ flash, error }) + (things.length === 0
      ? emptyState({ icon: 'folder', title: 'Nothing here yet', description: '…', action: add })
      : cardGrid(things.map(t => card({ title: t.name, subtitle: t.detail, icon: 'folder',
          actions: button({ label: 'Open', href: `/things/${t.id}`, size: 'sm', full: true }) })).join(''))),
  })
}
```

Then wire the route:

```ts
.get('/things', ({ session }) => new Response(renderThingsPage({ … }), {
  headers: { 'Content-Type': 'text/html; charset=utf-8' },
}))
```

## 5. Respect the hard rules

- **Never build a Tailwind class by concatenation.** `` `bg-${tone}-400` `` does
  not exist at runtime — the CDN only sees literal classes. Use `t(tone).soft`
  and friends from `src/ds/tones.ts`.
- **One solid primary button per screen.** Everything else is `soft` or `ghost`.
- **Escape user input** with `escHtml()` in any markup you write yourself. DS
  components already escape what you pass them.
- **Radius is semantic**: `rounded-lg` badges → `rounded-xl` controls →
  `rounded-2xl` cards → `rounded-3xl` shell panels.
- **Never nest `.glass` inside `.glass`.**
- **Empty states offer the next step.** `emptyState()` without an `action` is a
  dead end.
- **Destructive actions confirm** — use `confirmButton()`.
- **Dark only.** No `dark:` variants, no `prefers-color-scheme`.
- **Opt-in scripts**: a page using `modal()` must also render `modalScript()`
  once (via the layout's `extra`); same for `dropdownScript()` and
  `drawerScript()`. `toastHost()` is already in every layout.

## 6. Verify

```bash
bun run typecheck
bun run dev    # then open the page and look at it
```

Check the page at ~400px wide as well — the shell stacks to one column on
mobile and a `min-w` wider than the screen will break it.

## Extending the design system

Justified when a pattern appears in a second app or a second page.

- **New icon** → add its path to `PATHS` in `src/ds/icons.ts`, alphabetical,
  Heroicons v1 outline 24×24.
- **New component** → `src/ds/components/<name>.ts`, exported from
  `src/ds/index.ts`; single params object in, `string` out; escapes its inputs;
  accepts `tone` and `class` where sensible. Add it to `src/showcase/` and to
  `docs/components.md`.
- **New colour** → no. Use one of the seven tones. If a genuinely new meaning
  appears, add a complete entry to `tones` rather than a loose class.
