# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project Basics

- This is a React project built with Next.js App Router.
- The codebase uses JavaScript/JSX. Do not add TypeScript or `.tsx` files unless a TypeScript migration is explicitly requested.
- Source folders live at the repository root; there is no `src/` directory.
- The project follows a feature-based structure. Read `feature-based-structure.md` before creating, moving, or refactoring code.

## Architecture

Keep routes in `app/` thin. Route files should import and compose feature-level components instead of owning business logic, workflows, filters, drawer state, map behavior, or large data transformations.

Preferred route shape:

```jsx
import { MemoryLibraryPage } from '@/features/memory'

export default function Page() {
  return <MemoryLibraryPage />
}
```

Use the established ownership model:

```txt
app/       Next.js routes, layout, and framework files
features/  business feature UI and behavior
entities/  shared domain data, models, and pure helpers
shared/    generic UI, helpers, and styles with no business meaning
public/    static assets
DOCS/      documentation
```

## Import Boundaries

Allowed:

```txt
app -> features
app -> entities
app -> shared
features -> entities
features -> shared
entities -> shared
```

Not allowed:

```txt
shared -> features
shared -> app
entities -> features
entities -> app
features/a/components -> features/b/components
```

When code from another feature is needed, import through that feature's public API:

```javascript
import { MemoryHoverPreview } from '@/features/memory'
```

Avoid deep imports from another feature's internals:

```javascript
import { MemoryHoverPreview } from '@/features/memory/components/memory-hover-preview'
```

## Styling

- Use CSS Modules for component and feature styles unless an existing file clearly uses another established local pattern.
- Keep global resets and framework-level imports in `app/globals.css`.
- Keep generic shared styles in `shared/styles`.
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
