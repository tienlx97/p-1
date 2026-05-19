---
name: photo-mem-project-structure
description: Follow the photo-mem repository's Next.js App Router feature-based architecture. Use when creating, moving, refactoring, or reviewing files, routes, imports, feature ownership, public exports, JavaScript/JSX naming, JSDoc types, or app/features/entities/shared boundaries in this project.
---

# Photo Mem Project Structure

Use this skill to keep code changes in the correct owner and preserve the repository's feature-based architecture.

## Required Reading

Before creating, moving, or refactoring code, read:

- `AGENTS.md`
- `feature-based-structure.md`
- the owning feature or entity `index.js`
- the files directly touched by the task

Read `style.md` too when the task changes UI styles, CSS Modules, Tailwind utilities, React Aria controls, StyleX, or global CSS.

## Project Shape

Keep application source under `src/`:

```txt
src/app/       routes, layouts, framework files, global CSS entry
src/features/  business feature UI and behavior
src/entities/  shared domain data, models, and pure helpers
src/shared/    generic UI, helpers, and styles with no business meaning
public/        static assets
DOCS/          supporting documentation
```

Use `@/*` imports for `src/*` paths.

Use JavaScript and JSX only. Do not add TypeScript, `.ts`, or `.tsx` files unless a TypeScript migration is explicitly requested.

Use JSDoc when type clarity is useful. Do not use TypeScript syntax in JavaScript files.

## Ownership Rules

Choose the narrowest clear owner:

- `src/app`: thin route files that compose features.
- `src/features/map`: map view, Leaflet containers, markers, clusters, labels, map controls, map filters, and map-specific state/helpers.
- `src/features/memory`: memory/checkin library, detail views, drawers, media viewer, add-memory UI, and memory workflows.
- `src/features/auth`: login, auth gate, auth session UI/hooks, and account constants.
- `src/features/profile`: profile UI and profile-specific behavior.
- `src/entities/memory`: mock memory/checkin data and shared memory domain helpers.
- `src/shared`: generic components, helpers, providers, and utilities with no business meaning.

If code serves one feature, keep it in that feature. Move code to `entities/` only when it has shared business meaning. Move code to `shared/` only when it is truly generic.

## Routes

Keep `src/app` route files thin. Pages should import and render feature-level page components.

```jsx
import { MemoryLibraryPage } from '@/features/memory'

export default function Page() {
  return <MemoryLibraryPage />
}
```

Do not put feature state, drawers, map logic, filters, forms, or business workflows directly in route files.

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

Forbidden:

```txt
shared -> features
shared -> app
entities -> features
entities -> app
features/a/components -> features/b/components
```

When one feature needs another feature's public component or hook, import through that feature's public API:

```js
import { MemoryHoverPreview } from '@/features/memory'
```

Avoid deep imports across feature boundaries:

```js
// Avoid across feature boundaries
import { MemoryHoverPreview } from '@/features/memory/components/memory-hover-preview'
```

Same-feature internal imports are allowed.

## Public APIs

Each feature/entity exposes public code from `index.js`.

Export route-level page components, reusable feature components, external hooks, and domain helpers:

```js
export { MapSection } from './components/map-section'
```

Keep private helpers private. Update the owning `index.js` when adding a component/hook/helper that outside code should import.

## New Code Shape

Start minimal. Do not create empty folders.

```txt
src/features/example/
├── components/
│   └── example-page.jsx
└── index.js
```

Add optional folders only when they contain real files:

- `components/` for feature UI
- `hooks/` for reusable feature state/effects
- `api/` for HTTP calls
- `services/` for orchestration/wrappers
- `schemas/` for validation
- `utils/` for pure helpers used by multiple files
- `constants/` for repeated feature values
- `tests/` for meaningful logic or risky UI

Prefer `utils/` for pure helpers and `services/` for orchestration. Avoid vague new folder names unless the repo already uses them.

## Naming

- Files: `.js` or `.jsx`
- File names: kebab-case
- React components: PascalCase
- Functions and hooks: camelCase
- Constants: UPPER_SNAKE_CASE

## JSDoc Types

Use JSDoc for shared domain shapes, non-obvious function contracts, callbacks, config objects, and component props that benefit from editor hints or safer refactors.

Prefer colocating types with their owner:

- feature-specific UI props near the component or feature module
- shared memory/checkin domain shapes in `src/entities/memory`
- generic helper types near the shared helper that owns them

Use standard JSDoc tags:

```js
/**
 * @typedef {object} MemoryLocation
 * @property {number} lat
 * @property {number} lng
 * @property {string} label
 */
```

```js
/**
 * @param {MemoryLocation[]} locations
 * @param {string} query
 * @returns {MemoryLocation[]}
 */
export function filterLocations(locations, query) {
  return locations.filter((location) => location.label.includes(query))
}
```

For component props, define a local `Props` typedef when props are reused, complex, or easy to misuse:

```jsx
/**
 * @typedef {object} MapPlaceSearchProps
 * @property {string} value
 * @property {function(string): void} onChange
 * @property {boolean} [isDisabled]
 */

/**
 * @param {MapPlaceSearchProps} props
 */
export function MapPlaceSearch({ value, onChange, isDisabled = false }) {
  // ...
}
```

Use `@type` for complex constants:

```js
/**
 * @typedef {object} MemoryCategoryMeta
 * @property {string} label
 * @property {string} color
 */

/** @type {Object.<string, MemoryCategoryMeta>} */
export const MEMORY_CATEGORY_META = {
  travel: { label: 'Travel', color: '#2563eb' },
}
```

Use `@template` for truly generic utilities:

```js
/**
 * @template T
 * @param {T[]} items
 * @param {function(T): string} getKey
 * @returns {Map.<string, T>}
 */
export function indexBy(items, getKey) {
  return new Map(items.map((item) => [getKey(item), item]))
}
```

Avoid over-typing obvious local variables, trivial one-off functions, and JSX that is already self-explanatory. Avoid importing TypeScript-only types or adding `// @ts-check` broadly unless the task explicitly asks for type-checking migration.

## State Placement

Keep state as local as practical:

1. Component state
2. Feature component/hook state
3. URL/search params
4. Server state library when real API data exists
5. Global store only for app-wide concerns

Good global concerns include auth user, theme, language, global toasts, and app-wide modal state. Avoid global state for one drawer, one map hover, one filter panel, or one form.

## Before Editing

Check:

- relevant files and the owning `index.js`
- existing naming, import, and style patterns
- current working tree changes so user edits are preserved

## Before Final Response

Verify:

- changes are small and in the correct owner
- public exports are updated when needed
- no empty folders were created
- `pnpm lint` and `pnpm type-check` were run when appropriate
- `pnpm build` was run for larger route, build, or Next.js runtime changes
