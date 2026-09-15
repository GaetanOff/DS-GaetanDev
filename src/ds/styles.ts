/**
 * GaetanDev Design System — global stylesheet.
 *
 * Injected once by `renderBaseLayout`. Everything here is either impossible or
 * ugly to express as a Tailwind class: the gradient background, the glass
 * effect, keyframes, scrollbars and autofill overrides.
 */

export const globalStyles = /* css */ `
  html, body {
    width: 100%;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  body::-webkit-scrollbar { display: none; }

  body {
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
    background: linear-gradient(to bottom right, #111827, #155e75, #15803d);
    background-attachment: fixed;
    min-height: 100vh;
    color: white;
  }

  .gradient-bg {
    background: linear-gradient(to bottom right, #111827, #155e75, #15803d);
    background-attachment: fixed;
    min-height: 100vh;
  }

  /* Soft colour blobs floating behind the content. */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    z-index: -1;
    pointer-events: none;
  }

  /* The signature frosted panel. */
  .glass {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Deeper frosted surface for overlays and dropdown menus. */
  .glass-deep {
    background: rgba(15, 15, 20, 0.95);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Thin scrollbar for panes that must show one (lists, logs, chat). */
  .scroll-thin {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }
  .scroll-thin::-webkit-scrollbar { width: 6px; height: 6px; }
  .scroll-thin::-webkit-scrollbar-track { background: transparent; }
  .scroll-thin::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  /* Fully hidden scrollbar, for horizontal tab strips. */
  .scroll-none { scrollbar-width: none; -ms-overflow-style: none; }
  .scroll-none::-webkit-scrollbar { display: none; }

  .font-mono, .mono {
    font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace;
  }

  /* Chrome paints autofilled inputs bright blue — undo that. */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-text-fill-color: white;
    -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.05) inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  /* Native selects render their popup with the OS background; force ours. */
  select option { background: #1f2937; color: #fff; }

  /* ─── Motion ─────────────────────────────────────────────────────────── */
  @keyframes ds-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes ds-spin  { to { transform: rotate(360deg); } }
  @keyframes ds-in    { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes ds-out   { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(12px); } }
  @keyframes ds-pop   { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes ds-slide-left { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  .anim-in    { animation: ds-in 300ms ease-out; }
  .anim-out   { animation: ds-out 300ms ease-in forwards; }
  .anim-pop   { animation: ds-pop 150ms ease-out; }
  .anim-slide-left { animation: ds-slide-left 200ms ease-out; }
  .anim-pulse { animation: ds-pulse 1.5s infinite; }
  .anim-spin  { animation: ds-spin 800ms linear infinite; }

  /* ─── Status dot ─────────────────────────────────────────────────────── */
  .status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .status-dot.is-pending      { background: #facc15; animation: ds-pulse 1.5s infinite; }
  .status-dot.is-online       { background: #4ade80; }
  .status-dot.is-offline      { background: #6b7280; }
  .status-dot.is-error        { background: #f87171; }

  /* ─── Rows that reveal their actions on hover ────────────────────────── */
  .hover-row .row-actions { opacity: 0; transition: opacity 100ms; }
  .hover-row:hover .row-actions,
  .hover-row:focus-within .row-actions { opacity: 1; }

  /* ─── Accessibility ──────────────────────────────────────────────────── */
  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`

/**
 * Extra `<style>` rules a page can append to the global sheet.
 * `renderBaseLayout({ styles })` takes raw CSS; this just wraps it.
 */
export function styleTag(css: string): string {
  return `<style>${css}</style>`
}
