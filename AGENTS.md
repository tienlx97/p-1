# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project Basics

- This is a React project built with Next.js App Router.
- The codebase uses JavaScript/JSX. Do not add TypeScript or `.tsx` files unless a TypeScript migration is explicitly requested.
- Source folders live under `src/`.
- The project follows a feature-based structure. Read `feature-based-structure.md` before creating, moving, or refactoring code.
- Read `style.md` before creating or changing UI styles, React Aria controls, Tailwind utilities, CSS Modules, or global CSS.

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
