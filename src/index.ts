/**
 * Showcase server for the GaetanDev design system.
 *
 *   bun install && bun run dev   →   http://localhost:3100
 *
 * When you start a real app from this repo, replace this file with your own
 * routes and delete src/showcase — src/ds is the part you keep.
 */
import { Elysia } from 'elysia'
import {
  showcaseComponents,
  showcaseFoundations,
  showcaseIcons,
  showcasePatterns,
} from './showcase/showcase.page'

const PORT = Number(process.env.PORT ?? 3100)

const html = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })

new Elysia()
  .get('/', () => html(showcaseFoundations()))
  .get('/components', () => html(showcaseComponents()))
  .get('/patterns', () => html(showcasePatterns()))
  .get('/icons', () => html(showcaseIcons()))
  .listen(PORT)

console.log(`GaetanDev DS showcase → http://localhost:${PORT}`)
