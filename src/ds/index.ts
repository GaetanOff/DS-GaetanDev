/**
 * GaetanDev Design System
 *
 * Server-rendered HTML components for Bun + Elysia apps. Everything returns a
 * plain `string`, so components compose with template literals and nothing
 * needs a build step.
 *
 *   import { renderAppLayout, card, button } from '@/ds'
 *
 * See CLAUDE.md for the rules of the system and docs/ for the full reference.
 */

// Foundations
export * from './tokens'
export * from './tones'
export * from './styles'
export * from './icons'
export * from './utils'

// Layouts
export * from './layouts/base.layout'
export * from './layouts/app.layout'

// Components
export * from './components/button'
export * from './components/card'
export * from './components/form'
export * from './components/feedback'
export * from './components/navigation'
export * from './components/overlay'
export * from './components/data'
