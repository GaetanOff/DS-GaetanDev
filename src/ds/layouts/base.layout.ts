import { globalStyles } from '../styles'
import { tokens } from '../tokens'
import { escHtml, when } from '../utils'

export interface BaseLayoutParams {
  title: string
  /** Page body — everything inside `<body>`. */
  content: string
  /** `<meta name="description">`, for pages that are indexed or shared. */
  description?: string
  /** Extra tags injected at the end of `<head>` (CDN scripts, preloads). */
  head?: string
  /** Extra CSS appended to the global sheet. */
  styles?: string
  /** Scripts injected just before `</body>`. */
  scripts?: string
  /** Classes on `<body>`. Defaults to the gradient background. */
  bodyClass?: string
  /** Set `false` for full-height app screens (a terminal, a canvas). */
  blobs?: boolean
  /** Load htmx. On by default — every GaetanDev app uses it. */
  htmx?: boolean
  lang?: string
}

/**
 * The document shell: fonts, Tailwind, htmx, the global stylesheet and the
 * gradient background. Every page in every GaetanDev app goes through it.
 *
 * Prefer `renderAppLayout` for anything with a sidebar; reach for this one
 * directly for full-bleed screens (login, terminal, kiosk views).
 */
export function renderBaseLayout(params: BaseLayoutParams): string {
  const {
    title,
    content,
    bodyClass = 'gradient-bg',
    blobs = true,
    htmx = true,
    lang = 'en',
  } = params

  return /* html */ `<!DOCTYPE html>
<html lang="${escHtml(lang)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="${tokens.background.from}">
  <title>${escHtml(title)}</title>
  ${when(params.description, `<meta name="description" content="${escHtml(params.description)}">`)}
  <link rel="icon" type="image/png" href="${tokens.brand.favicon}">
  <script src="https://cdn.tailwindcss.com"></script>
  ${when(htmx, '<script src="https://unpkg.com/htmx.org@2"></script>')}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${tokens.typography.googleFonts}" rel="stylesheet">
  <style>${globalStyles}${params.styles ?? ''}</style>
  ${params.head ?? ''}
</head>
<body class="${escHtml(bodyClass)}"${htmx ? ' hx-boost="true"' : ''}>
  ${when(blobs, `
  <div class="blob w-72 h-72 bg-teal-300 opacity-10 top-10 -right-10" aria-hidden="true"></div>
  <div class="blob w-72 h-72 bg-lime-400 opacity-5 bottom-10 left-10" aria-hidden="true"></div>`)}
  ${content}
  ${params.scripts ?? ''}
</body>
</html>`
}
