# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project Basics

- This is a React project built with Next.js App Router.
- The codebase uses JavaScript/JSX. Do not add TypeScript or `.tsx` files unless a TypeScript migration is explicitly requested.
- Source folders live under `src/`.
- The project follows a feature-based structure. Read `feature-based-structure.md` before creating, moving, or refactoring code.

## Styling

- Use CSS Modules for component and feature styles unless an existing file clearly uses another established local pattern.
- Keep global resets and framework-level imports in `src/app/globals.css`.
- Keep generic shared styles in `src/shared/styles`.
- Keep feature-specific styles with the owning feature or use class names that clearly identify the feature/UI area.
- Do not move one-off feature styles into `shared` unless they are truly reusable and business-agnostic.

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
