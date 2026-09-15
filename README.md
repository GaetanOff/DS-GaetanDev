# DS-GaetanDev

The design system behind every [gaetandev.fr](https://gaetandev.fr) app, extracted
from SSH-GaetanDev. Clone it, delete the showcase, and start the app — the look,
the components and the instructions Claude Code needs are already there.

```bash
git clone https://github.com/GaetanOff/DS-GaetanDev.git my-app
cd my-app && bun install && bun run dev
# → http://localhost:3100
```

## What's inside

```
src/ds/                  ← the design system (this is what you keep)
  tokens/index.ts        raw values: colours, radii, motion, xterm theme
  tones.ts               the seven tones → Tailwind class recipes
  styles.ts              global stylesheet: gradient, glass, keyframes
  icons.ts               50 outline icons
  utils.ts               escHtml, cx, attrs, each, when
  layouts/               app shell, auth screen, full-height tool shell
  components/            buttons, cards, forms, feedback, nav, overlays, data
src/showcase/            living styleguide — delete it in a real app
src/index.ts             showcase server — replace with your routes
CLAUDE.md                the rules Claude Code follows when building UI here
docs/                    reference for humans
.claude/skills/          `/gaetandev-ui` skill for building a screen
```

## Stack

Bun · Elysia · TypeScript · Tailwind (CDN) · htmx 2 · Inter + JetBrains Mono.
Server-rendered HTML template literals, no build step, no client framework.

## Using it

```ts
import { renderAppLayout, cardGrid, card, button } from '@/ds'

renderAppLayout({
  title: 'My Servers',
  nav: NAV, active: 'servers',
  user: { name: session.username },
  content: cardGrid(servers.map(s => card({
    title: s.name,
    subtitle: `${s.username}@${s.host}`,
    icon: 'server',
    actions: button({ label: 'Connect', href: `/terminal/${s.id}`, size: 'sm', full: true }),
  })).join('')),
})
```

Every component is a function returning a `string`. They compose with template
literals and escape their inputs.

## Documentation

- [`CLAUDE.md`](CLAUDE.md) — the rules, and what Claude Code reads automatically
- [`docs/foundations.md`](docs/foundations.md) — tones, surfaces, type, spacing
- [`docs/components.md`](docs/components.md) — every component's API
- [`docs/patterns.md`](docs/patterns.md) — whole screens, copy-pasteable
- `bun run dev` — the showcase, which is the same code your app calls

## Scripts

| Command | Does |
| --- | --- |
| `bun run dev` | showcase with hot reload on :3100 |
| `bun run start` | showcase without watch |
| `bun run typecheck` | `tsc --noEmit` |
