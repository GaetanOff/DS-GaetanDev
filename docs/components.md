# Components

Every component is a function taking one params object and returning a `string`.
They escape the strings you hand them. Import everything from `@/ds`.

Options shared by most components: `tone` (one of the seven), `class` (extra
Tailwind classes), `attrs` (an arbitrary attribute bag — `hx-*`, `data-*`, `id`).

---

## Layouts

### `renderAppLayout(params)`

The default screen: sidebar + one glass content panel.

| Param | Type | Notes |
| --- | --- | --- |
| `title` | `string` | tab title; `" — <appName>"` is appended |
| `pageTitle` | `string?` | heading; defaults to `title` |
| `pageDescription` | `string?` | line under the heading |
| `pageActions` | `string?` | rendered buttons, right of the heading |
| `content` | `string` | page body |
| `nav` | `NavItem[]` | sidebar items |
| `active` | `string` | `key` of the current item |
| `navFooter` | `NavItem[]?` | pinned below a rule — settings, logout |
| `user` | `{ name, caption? }?` | identity block at the top of the sidebar |
| `appName` | `string?` | title suffix; defaults to `GaetanDev` |
| `eyebrow` | `string?` | small line above the shell; defaults to `gaetandev.fr` |
| `extra` | `string?` | modals, drawers, page scripts — rendered outside the shell |
| `head` / `styles` / `scripts` | `string?` | passed through to the document |

`NavItem`: `{ key, label, href, icon?, badge?, noBoost? }`. Set `noBoost: true`
on links htmx must not intercept (logout, downloads, external).

### `renderAuthLayout(params)`

Centred single card: `title`, `heading`, `subheading?`, `content`, `footer?`,
`icon?`. For sign-in and error screens.

### `renderShellLayout(params)`

Full-height tool chrome: `topbar`, optional `subbar`, and `content` filling the
rest inside a `position: relative` box. Blobs are off. This is what the SSH
terminal uses.

### `renderBaseLayout(params)`

The document itself. Only reach for it when the three above genuinely don't fit.
Options: `title`, `content`, `description?`, `head?`, `styles?`, `scripts?`,
`bodyClass?`, `blobs?`, `htmx?`, `lang?`.

---

## Actions

### `button(params)`

```ts
button({ label: 'Add server', icon: 'plus', href: '/servers/new' })
button({ label: 'Delete', tone: 'danger', variant: 'soft', size: 'sm' })
button({ label: 'Save', type: 'submit', attrs: { form: 'serverForm' } })
```

`label?`, `href?` (renders an `<a>`), `type?`, `tone?`, `variant?`
(`solid` | `soft` | `ghost`), `size?` (`sm` | `md` | `lg`, default `lg`),
`icon?`, `iconRight?`, `full?`, `disabled?`, `onclick?`, `title?`.

**One solid button per screen.** `buttonClass(...)` returns the classes alone if
you need to style something the system doesn't cover.

### `iconButton(params)`

Square icon-only button for dense rows. `icon` and `title` are required — the
title is the accessible label.

### `confirmButton(params)`

A POST form plus a `confirm()` dialog, for destructive actions.

```ts
confirmButton({ action: `/servers/${s.id}/delete`, confirm: 'Delete this server?' })
```

### `dropdown(params)` + `dropdownScript()`

`{ id, trigger, items: [{ label, href?, onclick?, icon?, danger? }], align? }`.
Render `dropdownScript()` once per page.

### `spinner(cls?)`

Inline pending indicator.

---

## Content

### `card(params)` / `cardGrid(cards, cols?)`

```ts
cardGrid(servers.map(s => card({
  title: s.name,
  subtitle: `${s.username}@${s.host}:${s.port}`,
  icon: 'server',
  badge: badge({ label: s.env, tone: 'info' }),
  actions: button({ label: 'Connect', size: 'sm', full: true }),
})).join(''))
```

`title`, `subtitle?`, `icon?`, `tone?`, `badge?`, `body?`, `actions?`, `href?`
(whole card becomes a link), `tinted?` (tone-coloured border), `class?`.

`cardGrid` takes `cols: 2 | 3` (default 3).

### `row(params)` / `rowList(rows)`

The compact sibling of `card`, for members, files, settings. Actions live in
`.row-actions` and fade in on hover.

### `stat(params)`

`{ label, value, hint?, icon?, tone? }` — a metric tile for dashboards.

### `table(params)`

```ts
table({
  columns: [{ label: 'Name' }, { label: 'Size', align: 'right' }, { label: '' }],
  rows: files.map(f => [escHtml(f.name), formatSize(f.size), actions(f)]),
  hoverActions: true,
  empty: emptyState({ title: 'No files here' }),
})
```

Cells are raw HTML, so they can hold badges and buttons. The container scrolls
sideways on narrow screens.

### `definitionList(items)`

Label/value pairs for detail panels. Values are raw HTML.

### `codeBlock(params)` / `code(text)`

`codeBlock({ code, copyable?, tone?, maxHeight?, label? })` for blocks;
`code('…')` for an inline fragment inside prose.

### `progress(params)`

`{ value: 0-100, tone?, label? }`.

### `timeline(items)`

`{ title, caption?, tone?, icon? }[]` — deploys, audit trails, activity.

### `avatar(params)`

`{ name, tone?, size? }`. The tone is derived from the name when you omit it.

---

## Forms

### `form(params)`

The shell: rhythm plus the submit/cancel row.

```ts
form({
  action: '/servers',
  fields:
    input({ name: 'name', label: 'Connection name', required: true }) +
    fieldRow([
      input({ name: 'host', label: 'Host', required: true, class: 'md:col-span-2' }),
      input({ name: 'port', label: 'Port', type: 'number', value: 22 }),
    ], 3),
  submit: 'Save server',
  cancelHref: '/',
})
```

### Fields

All of them accept `name`, `label?`, `id?` (defaults to `name`), `placeholder?`,
`required?`, `disabled?`, `hint?`, `error?`, `tone?` (focus ring), `class?`,
`attrs?`.

| Function | Extra |
| --- | --- |
| `input` | `type?`, `value?`, `autocomplete?`, `min?`, `max?`, `step?` |
| `textarea` | `value?`, `rows?`, `mono?` |
| `select` | `options: { value, label, disabled? }[]`, `value?`, `placeholder?` |
| `radioGroup` | `options`, `value?`, `onchange?` |
| `checkbox` | `checked?`, `value?`, `hint?` |
| `searchInput` | `value?` — leading magnifier; pair with htmx |

`error` shows a red line and outlines the control; `hint` shows a grey one.
`fieldRow(fields, cols)` lays fields side by side and collapses on mobile.

---

## Feedback

### `alert(params)` / `flashes(params)`

`alert({ message, tone?: 'success' | 'error' | 'warning' | 'info', title?, bare?, class? })`.

`flashes({ flash, error })` renders the pair most pages carry after a redirect
and skips whichever is absent.

### `badge(params)`

`{ label, tone?, icon?, dot?, class? }` — role, environment, count, state.

### `status(kind, label)` / `statusDot(kind)`

`kind` is `pending` | `online` | `offline` | `error`. `pending` pulses.

### `emptyState(params)`

`{ title, description?, icon?, action?, compact? }`. Always give it an `action`
unless there is genuinely nothing the user can do next.

### `skeleton(cls?)`

Placeholder block while content loads.

### `toastHost()` + `toast(message, type, ms?)`

`toastHost()` is already in every layout, so from any client script:

```js
toast('Server saved', 'success')
toast('Connection refused', 'error')
```

### `kbd(key)`

Keyboard shortcut hint.

---

## Overlays

### `modal(params)` + `modalScript()`

```ts
extra: modal({
  id: 'deleteServer',
  title: 'Delete this server?',
  description: 'This cannot be undone.',
  body: '<p class="text-sm text-gray-300">…</p>',
  actions: button({ label: 'Cancel', variant: 'ghost', onclick: "closeModal('deleteServer')" })
         + button({ label: 'Delete', tone: 'danger' }),
}) + modalScript()
```

Open with `openModal('deleteServer')`. Escape and backdrop clicks close it unless
`persistent: true`. Render `modalScript()` once per page.

### `drawer(params)` + `drawerScript()`

Right-hand slide-over: `{ id, title, body, icon?, footer?, width? }`.
Toggle with `toggleDrawer('id')`.

### `overlay(params)`

Full-screen panel pinned inside its relative parent — the "pick something to
start" screen.

---

## Navigation

| Function | Purpose |
| --- | --- |
| `sidebar(params)` | the left rail (the app layout calls it for you) |
| `pageHeader(params)` | title + description + actions |
| `sectionHeader(params)` | heading inside a page, with `count` and `actions` |
| `breadcrumb(items)` | `{ label, href? }[]` |
| `tabs(params)` | underlined strip switching page sections |
| `segmented(params)` | inline mode switch — Terminal / SFTP |

---

## Utilities

```ts
escHtml(value)                  // escape before interpolating
cx('a', cond && 'b', extra)     // join classes, drop falsy
attrs({ 'hx-get': '/x', disabled: true })
each(items, item => `<li>…</li>`)   // map + join('')
when(cond, '<p>…</p>')             // conditional fragment
formatSize(1536)                   // "1.5 KB"
html`<p>${x}</p>`                  // tagged template, for editor highlighting
```

`tokens` holds every raw value: `tokens.palette`, `tokens.background`,
`tokens.surface`, `tokens.text`, `tokens.typography`, `tokens.radius`,
`tokens.motion`, `tokens.terminalTheme`, `tokens.chartPalette`, `tokens.brand`.
