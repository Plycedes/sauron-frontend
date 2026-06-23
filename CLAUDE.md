# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Read `AGENTS.md` first.** This project pins Next.js `16.2.9` / React `19.2.4`, which has breaking changes versus what is in training data. The bundled docs at `node_modules/next/dist/docs/` are the source of truth — check them before writing or modifying any Next.js code.

## Common commands

All scripts are in `package.json`. There is no test runner configured.

- `npm run dev` — start the Next.js dev server (Turbopack) on http://localhost:3000
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint using the flat config in `eslint.config.mjs` (Next core-web-vitals + TypeScript rules)

To run a single ESLint rule against a path: `npx eslint --rule '{"react/jsx-key":"error"}' app/page.tsx`. There is no Jest/Vitest/Playwright setup — if you need to add one, install it; do not assume one exists.

## Architecture overview

This is a fresh `create-next-app` scaffold, deliberately minimal. The "big picture" worth knowing:

- **App Router only.** The `app/` directory is the source of truth — no `pages/` directory exists. `app/layout.tsx` is the root layout; `app/page.tsx` is the only route (`/`).
- **Single root layout** at `app/layout.tsx` loads two Geist fonts via `next/font/google` (`--font-geist-sans`, `--font-geist-mono`) and binds them onto `<html>` as CSS variables. Tailwind v4 picks them up via `@theme inline` in `app/globals.css`.
- **Styling: Tailwind v4** (not v3). There is no `tailwind.config.js` — configuration lives in `app/globals.css` using `@import "tailwindcss"` and `@theme inline { ... }`. PostCSS plugin is `@tailwindcss/postcss` (see `postcss.config.mjs`).
- **Path alias.** `tsconfig.json` maps `@/*` to the repo root, so imports like `@/app/...` or `@/components/...` work.
- **TypeScript is strict.** `tsconfig.json` enables `strict`, `isolatedModules`, and Next's TypeScript plugin. Use `Read` to inspect `next-env.d.ts` if types behave oddly.
- **ESLint flat config** (`eslint.config.mjs`) extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. `.next/`, `out/`, `build/`, and `next-env.d.ts` are explicitly ignored.
- **No backend, no API routes, no state library, no test framework, no CI config** are present. The page currently just renders `<h1>Hello</h1>`. Add structure as the project grows — do not invent layers that don't exist yet.
- **Static assets** go in `public/`. A `favicon.ico` already lives at `app/favicon.ico` (App Router convention).

## Things that will trip up a future Claude

- `app/page.tsx` currently imports `Image` from `next/image` but does not use it — lint may flag it. Remove the import if you rewrite the page, or use it.
- `app/globals.css` body uses `Arial, Helvetica, sans-serif` despite the Geist fonts being loaded. If you rely on Geist, set `font-family: var(--font-sans)` on `body` instead.
- `next.config.ts` is empty — no rewrites, image domains, or experimental flags.
- `package.json` has no `test` script. Do not run `npm test`; it will fail.
- Windows / Git Bash environment. Use forward slashes in paths and `/dev/null` rather than `NUL` in shell commands.
