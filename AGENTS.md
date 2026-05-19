# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project Basics

- This is a React project built with Next.js App Router.
- The codebase uses JavaScript/JSX. Do not add TypeScript or `.tsx` files unless a TypeScript migration is explicitly requested.
- Source folders live under `src/`.
- The project follows a feature-based structure. Read `feature-based-structure.md` before creating, moving, or refactoring code.
- Read `style.md` before creating or changing UI styles, React Aria controls, Tailwind utilities, CSS Modules, or global CSS.
- Product/domain note: treat this as the main banking product context ("ngan hang chinh") when making wording, UX, data, or architecture decisions unless a task explicitly says otherwise.

## Project Libraries

- Framework/runtime: Next.js App Router, React, and React DOM.
- Styling: Tailwind CSS, CSS Modules, Geist fonts, `clsx`, `tailwind-merge`, and legacy StyleX support while migration remains.
- Accessible UI: React Aria Components and React Aria hooks. Use these for buttons, inputs, textareas, selects, tabs, dialogs, overlays, and other interactive primitives.
- Maps: MapLibre GL, `react-map-gl`, and OpenFreeMap styles/tiles. Keep map container, markers, labels, controls, filters, and MapLibre-specific logic in the map feature unless shared ownership is clear.
- Scroll/media UI: `overlayscrollbars` and `overlayscrollbars-react` for app, drawer, and custom scroll containers; `swiper` for media carousels, thumbnail rails, and touch sliders; `blurhash` for image placeholders.
- State/data utilities: TanStack Query for server/cache data, Zustand for app-wide client state, Zod for validation, usehooks-ts for common hooks, Sonner for toasts, Motion for animation, and React Error Boundary for recoverable UI errors.
- Build/tooling: ESLint, Next ESLint config, StyleX Babel/ESLint/PostCSS/SWC tooling, PostCSS, Autoprefixer, and Tailwind CSS.

## Styling

- Follow `style.md`.
- Use React Aria Components for interactive controls.
- Use colocated CSS Modules for custom component and feature styles.
- Use Tailwind utilities for small local layout/utility classes.
- Keep `src/app/globals.css` minimal: Tailwind import, StyleX directive if still required, CSS variables, base reset rules, and external library selectors.
- Do not add new feature-specific styles to `src/shared/styles`; migrate touched components toward local `*.module.css` files.
- Use `@/shared/lib/cx` for class merging in new or migrated code. Do not use `@/shared/lib/styles` in new code.

## Naming

- Files: `.js` / `.jsx`
- File names: kebab-case
- React components: PascalCase
- Functions and hooks: camelCase
- Constants: UPPER_SNAKE_CASE

## Checklist Before Responding

- Read the relevant files and the owning feature's `index.js`.
- Keep changes small and in the correct owner.
- Preserve existing user changes in the working tree.
- Do not create empty folders.
- Update public exports when adding public components or hooks.
- Run `pnpm lint` and `pnpm type-check` when appropriate.
- Run `pnpm build` for larger route, build, or Next.js runtime changes.
