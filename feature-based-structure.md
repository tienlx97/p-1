# Feature-Based Structure

Compact structure guide for AI coding agents working in this Next.js App Router repo.

## Project Shape

Source folders live at the repository root, not under `src/`.

```txt
app/       routes, layouts, framework files, global CSS entry
features/  business feature UI and behavior
entities/  shared domain data, models, and pure helpers
shared/    generic UI, helpers, and styles with no business meaning
public/    static assets
DOCS/      supporting documentation
```

Path alias: `@/* -> ./*`.

## Main Rules

- Organize by feature/domain first, technical role second.
- Keep `app/` route files thin. Pages should compose feature components.
- Keep feature-specific state, workflows, map logic, filters, drawers, and forms out of `app/`.
- Do not create empty template folders.
- Prefer feature-local code until reuse and ownership are clear.
- Use JavaScript/JSX only unless a TypeScript migration is requested.

Thin route example:

```jsx
import { MemoryLibraryPage } from '@/features/memory'

export default function Page() {
  return <MemoryLibraryPage />
}
```

## Ownership

- `features/map`: map view, Leaflet markers, map controls, map-specific helpers/constants.
- `features/memory`: memory/checkin library, detail views, drawers, media viewer, add-memory UI.
- `features/profile`: profile UI.
- `entities/memory`: mock memory/checkin data and shared domain helpers.
- `shared`: generic components, helpers, styles, and tokens only.

If code serves one feature, keep it in that feature. If reused with business meaning, consider `entities/`. If reused with no business meaning, consider `shared/`.

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

Cross-feature imports must use the other feature's public API:

```javascript
import { MemoryHoverPreview } from '@/features/memory'
```

Avoid deep imports across feature boundaries:

```javascript
import { MemoryHoverPreview } from '@/features/memory/components/memory-hover-preview'
```

Same-feature internal imports are allowed.

## Public APIs

Each feature/entity exposes its public surface from `index.js`.

```javascript
export { MapSection } from './components/map-section'
```

Export route-level page components, reusable feature components, external hooks, and domain helpers. Keep private helpers private.

## New Feature Shape

Start minimal:

```txt
features/example/
├── components/
│   └── example-page.jsx
└── index.js
```

Add optional folders only when they contain real files:

- `components/`: feature UI.
- `hooks/`: reusable feature state/effects.
- `api/`: HTTP calls for that feature.
- `services/`: feature-specific orchestration or wrappers.
- `schemas/`: validation for forms/API payloads.
- `utils/`: pure feature helpers used by multiple files.
- `constants/`: repeated feature values.
- `tests/`: tests for meaningful logic or risky UI.

Avoid vague folders like `helpers/` unless the repo already uses that name. Prefer `utils/` for pure helpers, `services/` for orchestration, and `shared/lib/` for generic business-free helpers.

## Naming

- Files: `.js` / `.jsx`
- File names: kebab-case, for example `memory-detail-page.jsx`
- Components: PascalCase
- Functions/hooks: camelCase
- Constants: UPPER_SNAKE_CASE
- No `.tsx` or TypeScript syntax unless explicitly requested.

## Styling

Current style locations:

```txt
app/globals.css
shared/styles/styles.module.css
shared/styles/partials/*.css
shared/styles/*.stylex.js
```

Keep broad reusable styles in `shared/styles`. Keep feature-specific class names clearly tied to the owning feature/UI area. Do not move one-off feature styling into `shared`.

## State And Data

Keep state as local as practical:

1. Component state
2. Feature component/hook state
3. URL/search params
4. Server state library when real API data exists
5. Global store only for app-wide concerns

Good global concerns: auth user, theme, language, global toasts, app-wide modal state. Avoid global state for one drawer, one map hover, or one form.

## Agent Checklist

Before editing:

- Read the relevant files and the feature's `index.js`.
- Check current naming, import, and style patterns.
- Preserve existing user changes in the working tree.

Before final response:

- Keep changes small and in the right owner.
- Update public exports when adding public components/hooks.
- Do not create empty folders.
- Run `pnpm lint` and `pnpm type-check` when appropriate.
- Run `pnpm build` for larger route, build, or Next.js runtime changes.

## Final Rule

Feature-based structure is for file discovery and ownership, not bureaucracy. When unsure, keep code in the owning feature first; move it to `entities/` or `shared/` only when reuse and ownership are clear.
