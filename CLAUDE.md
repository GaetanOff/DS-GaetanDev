# GaetanDev Design System

This repo is the starting point for every GaetanDev app. `src/ds/` is the design
system; everything else is a showcase you replace with the real app.

**Read this file before writing any UI.** The point of the system is that every
GaetanDev app looks like the same product. A screen built by ignoring these rules
and restyling from scratch is a bug, even if it looks fine on its own.

---

## Starting a new app from this repo

1. `bun install`
2. `bun run dev` → http://localhost:3100 renders the showcase. Look at it once;
   it is the fastest way to see what already exists.
3. Delete `src/showcase/` and rewrite `src/index.ts` with the real routes.
4. **Keep `src/ds/` as it is.** Treat it as a dependency, not as app code.
5. Rename the project in `package.json` and update the app name passed to the
   layouts (`appName`).

The app's own code goes in `src/routes/`, `src/services/`, `src/views/pages/`,
mirroring the SSH-GaetanDev layout.

---

## Stack

- **Bun** runtime, **Elysia** HTTP, **TypeScript** strict.
- **Server-rendered HTML in template literals.** No React, no JSX, no client
  framework. Every component is a function returning a `string`.
- **Tailwind via CDN** (`cdn.tailwindcss.com`) — no build step, no config file.
- **htmx 2** for interactivity. `hx-boost="true"` is on the `<body>`, so
  navigation is already partial-swapped.
- **Inter** for UI, **JetBrains Mono** for anything the machine wrote.

Consequences worth remembering:

- Tailwind classes must appear **literally** in the rendered HTML. Never build a
  class by concatenating a colour name (`` `bg-${color}-400` ``) — that class
  will not exist. Use the tone recipes in `src/ds/tones.ts`.
- Anything user-supplied goes through `escHtml()`. Every DS component already
  escapes the strings you hand it; you only need it in your own markup.

---

## How to build a page

```ts
import { renderAppLayout, cardGrid, card, button, badge, type NavItem } from '@/ds'

const NAV: NavItem[] = [
  { key: 'servers', label: 'My Servers', href: '/', icon: 'server' },
  { key: 'teams',   label: 'My Teams',   href: '/teams', icon: 'users' },
]
const NAV_FOOTER: NavItem[] = [
  { key: 'logout', label: 'Logout', href: '/auth/logout', icon: 'logout', noBoost: true },
]

export function renderServersPage({ username, servers, flash, error }: Params): string {
  return renderAppLayout({
    title: 'My Servers',
    pageDescription: 'Manage your saved SSH connections',
    pageActions: button({ label: 'Add server', icon: 'plus', href: '/servers/new' }),
    nav: NAV, navFooter: NAV_FOOTER, active: 'servers',
    user: { name: username },
    appName: 'SSH GaetanDev',
    content: flashes({ flash, error }) + cardGrid(
      servers.map(s => card({
        title: s.name,
        subtitle: `${s.username}@${s.host}:${s.port}`,
        icon: 'server',
        actions: button({ label: 'Connect', href: `/terminal/${s.id}`, size: 'sm', full: true }),
      })).join(''),
    ),
  })
}
```

Route handlers return the string with the right content type:

```ts
.get('/', ({ session }) => new Response(renderServersPage({ ... }), {
  headers: { 'Content-Type': 'text/html; charset=utf-8' },
}))
```

### Which layout

| Layout | Use it for |
| --- | --- |
| `renderAppLayout` | Anything with navigation. **This is the default.** |
| `renderAuthLayout` | Sign-in, a single centred card, an error page. |
| `renderShellLayout` | Full-height tool screens: terminal, editor, canvas. |
| `renderBaseLayout` | Only when none of the above fit. You are on your own. |

---

## The rules

**Tones.** Seven, each with one meaning. Pick by meaning, never by taste.

| Tone | Means | Typical use |
| --- | --- | --- |
| `primary` (green) | act, succeed, "this is yours" | primary buttons, own resources, success |
| `secondary` (purple) | shared, collaborative, AI | teams, assistants, generated content |
| `info` (blue) | neutral data | files, members, read-only detail |
| `danger` (red) | destroy, fail | delete, errors |
| `warning` (yellow) | pending, be careful | in-progress, risky-but-allowed |
| `accent` (cyan) | highlight | metrics, charts |
| `muted` (grey) | everything else | secondary actions, chrome |

**One solid primary button per screen.** The main action is `variant: 'solid'`.
Everything else is `soft` or `ghost`. Two competing solid greens means neither
reads as the action.

**Radius is semantic**, not decorative: `rounded-lg` badges → `rounded-xl`
buttons/inputs/rows → `rounded-2xl` cards → `rounded-3xl` shell panels. Do not mix
levels inside one component.

**Three surface depths.** `.glass` for shell panels, `bg-white/5 + border-white/10`
for cards on top of them, `bg-black/30` for code and logs. Never nest a glass
panel inside a glass panel — the blur compounds and turns to mud.

**Labels are uppercase.** `text-sm font-bold uppercase tracking-wider` for field
labels, `text-xs ... tracking-widest text-gray-400` for eyebrows. The form
components do this for you.

**Text hierarchy.** White for headings, `text-gray-300` for body, `text-gray-400`
for supporting copy, `text-gray-500` for hints. Do not invent a fourth grey.

**Empty states always offer the next step.** `emptyState()` without an `action`
is a dead end; give it one unless there is genuinely nothing the user can do.

**Destructive actions confirm.** Use `confirmButton()` — it wraps the form and the
`confirm()` for you.

---

## What already exists

Check this list before writing markup. If a component covers the case, use it;
if it almost covers it, extend the component in `src/ds/` rather than writing a
one-off in a page.

**Layout** — `renderAppLayout`, `renderAuthLayout`, `renderShellLayout`,
`renderBaseLayout`, `sidebar`, `pageHeader`, `sectionHeader`, `breadcrumb`,
`tabs`, `segmented`

**Content** — `card`, `cardGrid`, `row`, `rowList`, `stat`, `table`,
`definitionList`, `codeBlock`, `code`, `timeline`, `progress`, `avatar`

**Actions** — `button`, `iconButton`, `confirmButton`, `dropdown`, `spinner`

**Forms** — `form`, `fieldRow`, `input`, `textarea`, `select`, `radioGroup`,
`checkbox`, `searchInput`

**Feedback** — `alert`, `flashes`, `badge`, `status`, `statusDot`, `emptyState`,
`skeleton`, `toastHost` + `toast()`, `kbd`

**Overlays** — `modal` + `modalScript`, `drawer` + `drawerScript`, `overlay`,
`dropdownScript`

**Foundations** — `tokens` (raw values), `tones` / `t()` (class recipes),
`icon()` + `iconNames`, `globalStyles`, `escHtml`, `cx`, `attrs`, `each`, `when`,
`formatSize`

Scripts are opt-in: a page using `modal()` must also render `modalScript()` once,
usually via the layout's `extra`. `toastHost()` is already in every layout, so
`toast('Saved', 'success')` works anywhere.

---

## Extending the system

Adding to `src/ds/` is encouraged when a pattern shows up in a second app.
Adding a one-off styled `<div>` to a page is not.

- **New icon** → add the path to `PATHS` in `src/ds/icons.ts`, keep it
  alphabetical, Heroicons v1 outline 24×24.
- **New component** → a file in `src/ds/components/`, exported from
  `src/ds/index.ts`, taking a single params object, returning a `string`,
  escaping its inputs, accepting `tone` and `class` where it makes sense.
  Add it to the showcase so it stays visible.
- **New colour** → don't. Use an existing tone. If a genuinely new meaning
  appears, add a full entry to `tones` (all fields) rather than a loose class.

After changing `src/ds/`: `bun run typecheck`, then `bun run dev` and look at the
showcase page for the component you touched.

---

## Do not

- Do not add a CSS framework, a component library, or a bundler.
- Do not write raw `<style>` for something the system already covers.
- Do not build Tailwind class names by string concatenation.
- Do not use a colour that is not one of the seven tones.
- Do not interpolate unescaped user input into HTML.
- Do not put light-mode styling anywhere. The system is dark, one theme only.
