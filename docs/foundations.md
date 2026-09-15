# Foundations

Run `bun run dev` and open http://localhost:3100 to see all of this rendered.

## Tones

Seven tones, each carrying one meaning. `src/ds/tones.ts` turns a tone into
Tailwind classes; `src/ds/tokens/index.ts` holds the raw hex for canvas, xterm
and charts.

| Tone | Tailwind | Hex | Means |
| --- | --- | --- | --- |
| `primary` | green-400 | `#4ade80` | act, succeed, "this is yours" |
| `secondary` | purple-400 | `#c084fc` | shared, collaborative, AI |
| `info` | blue-400 | `#60a5fa` | neutral data, files, members |
| `danger` | red-400/500 | `#f87171` | destroy, fail |
| `warning` | yellow-400 | `#facc15` | pending, careful |
| `accent` | cyan-400 | `#22d3ee` | highlight, metrics |
| `muted` | gray-400 | `#9ca3af` | chrome, secondary actions |

Each tone exposes the same shape:

```ts
import { t } from '@/ds'

t('secondary').solid            // bg-purple-400/80 hover:bg-purple-400 text-black
t('secondary').soft             // bg-purple-400/20 text-purple-300
t('secondary').chip             // bg-purple-400/20         (icon chips)
t('secondary').softInteractive  // soft + hover states
t('secondary').text             // text-purple-400
t('secondary').textSoft         // text-purple-300
t('secondary').border           // border-purple-400/20
t('secondary').ring             // focus:ring-purple-400
t('secondary').alert            // fill + border + text for an alert block
t('secondary').hex              // #c084fc
```

**Never** build a class by concatenating a colour name. Tailwind's CDN scanner
only sees classes that literally appear in the HTML, so `` `bg-${tone}-400` ``
renders nothing. That is the whole reason this file exists.

## Background

A fixed diagonal gradient, gray-900 → cyan-800 → green-700, with two blurred
colour blobs behind the content. `renderBaseLayout` puts it in place; pass
`blobs: false` for full-height tool screens where they would sit under a
terminal.

```
linear-gradient(to bottom right, #111827, #155e75, #15803d)
```

## Surfaces

Three depths, and only three:

| Class | Depth | Use |
| --- | --- | --- |
| `.glass` (`rgba(0,0,0,.2)` + `blur(20px)`) | shell | sidebar, main panel, modal |
| `bg-white/5 border border-white/10` | raised | cards, rows, sections |
| `bg-black/30` | sunken | code, logs, terminal output |

`.glass-deep` exists for overlays that float above everything (dropdown menus,
slide-over panels) and needs a darker base to stay readable.

Never nest `.glass` inside `.glass` — the backdrop blurs compound and the
content behind turns to mud.

## Radius

The level says what kind of thing it is:

| Class | Size | Thing |
| --- | --- | --- |
| `rounded-lg` | 8px | badges, kbd, icon chips in dense rows |
| `rounded-xl` | 12px | buttons, inputs, list rows, alerts |
| `rounded-2xl` | 16px | cards |
| `rounded-3xl` | 24px | shell panels, modals |

## Typography

**Inter** for the UI, **JetBrains Mono** for anything the machine wrote — commands,
paths, keys, IDs, log output.

| Role | Classes |
| --- | --- |
| Page title | `text-3xl font-bold text-white` |
| Section | `text-xl font-bold text-white` |
| Card title | `font-bold text-white` |
| Field label | `text-sm font-bold text-white uppercase tracking-wider` |
| Eyebrow | `text-xs font-bold text-gray-400 uppercase tracking-widest` |
| Body | `text-gray-300` |
| Supporting | `text-gray-400 text-sm` |
| Hint | `text-gray-500 text-xs` |

Four greys, no more. The uppercase-tracked label is the system's signature —
it is what makes a GaetanDev form recognisable.

## Spacing

| Context | Value |
| --- | --- |
| Page padding | `p-4 md:p-8` |
| Shell panel padding | `p-6 md:p-8` |
| Card padding | `p-5` |
| Row padding | `px-4 py-3` |
| Gap between cards | `gap-4` |
| Gap between shell columns | `gap-6` |
| Form field rhythm | `space-y-6` |
| Space under a page header | `mb-8` |

Content is capped at `max-w-7xl`; forms at `max-w-xl`. A form wider than that
gets hard to scan.

## Motion

| Duration | Use |
| --- | --- |
| `100ms` | hovers on dense rows and icon buttons |
| `150ms` | default UI feedback |
| `300ms` | buttons, cards, toasts — anything the eye follows |

Available animation classes: `.anim-in`, `.anim-out`, `.anim-pop`,
`.anim-slide-left`, `.anim-pulse`, `.anim-spin`. All of them are disabled under
`prefers-reduced-motion: reduce`.

## Icons

Heroicons v1 outline, 24×24, `stroke="currentColor"` — they take the text colour,
so tint them with a class and never with `fill`.

```ts
icon('server', 'w-5 h-5 text-green-400')
icon('users', 'w-16 h-16 text-gray-500', 1.5)  // thinner stroke reads better big
```

`iconNames` lists everything available; the showcase's Icons page renders them
all and copies a name on click.

## Dark only

There is no light theme and no theme switch. Every colour in the system assumes
the dark gradient behind it. Do not add `dark:` variants or
`prefers-color-scheme` blocks.
