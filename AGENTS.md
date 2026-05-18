# AGENTS.md

These instructions are for AI coding agents when creating, editing, or refactoring code in this repository.

This repo uses Next.js App Router with JavaScript/JSX. Source folders live at the repository root; there is no `src/` directory.

Before coding, also read the detailed structure guidelines in:

```txt
feature-based-structure.md
```

## Core Principles

Code must follow a feature-based structure:

```txt
app/       Next.js routes, layout, and global framework files
features/  UI and logic grouped by business feature
entities/  shared domain data, models, and helpers used across features
shared/    generic UI, helpers, and styles with no business meaning
public/    static assets
DOCS/      documentation
```

Keep routes in `app/` thin. Pages should only import and compose components from `features/`.

Correct example:

```jsx
import { MemoryLibraryPage } from '@/features/memory'

export default function Page() {
  return <MemoryLibraryPage />
}
```

Do not put business logic, form workflows, drawer state, map behavior, filter logic, or large data transformations directly in `app/page.jsx`.

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

When code from another feature is needed, import it through that feature's public API:

```javascript
import { MemoryHoverPreview } from '@/features/memory'
```

Avoid deep imports from another feature's internal folders:

```javascript
import { MemoryHoverPreview } from '@/features/memory/components/memory-hover-preview'
```

## When Creating A New Feature

Create the minimal feature shape:

```txt
features/[feature-name]/
├── components/
│   └── [feature-page].jsx
└── index.js
```

Only add these folders once they contain real files that are needed:

```txt
hooks/
api/
services/
schemas/
utils/
constants/
tests/
```

Do not create empty template folders.

After creating a public component, export it from `features/[feature-name]/index.js`:

```javascript
export { ExamplePage } from './components/example-page'
```

## When Adding Code To An Existing Feature

Choose the correct owner:

- Map, markers, Leaflet, and map controls: `features/map`
- Memory/checkin library, detail views, drawers, and media viewer: `features/memory`
- Profile UI: `features/profile`
- Mock memory/checkin data or shared domain helpers: `entities/memory`
- Generic UI/helpers with no business-specific meaning: `shared`

If code only serves one feature, keep it inside that feature.

If code is used by multiple features and has business meaning, consider moving it to `entities/`.

If code is generic and does not depend on the business domain, move it to `shared/`.

## Naming

This repo currently uses:

```txt
.js / .jsx
kebab-case file names
PascalCase React components
camelCase functions/hooks
UPPER_SNAKE_CASE constants
```

Examples:

```txt
memory-detail-page.jsx
map-section.jsx
map.utils.js
map.constants.js
```

Do not add `.tsx` files or TypeScript syntax unless a TypeScript migration is explicitly requested.

## Styling

Styling currently lives in:

```txt
app/globals.css
shared/styles/styles.module.css
shared/styles/partials/*.css
shared/styles/*.stylex.js
```

Keep generic styles in `shared/styles`.

Styles with business meaning, or styles used by only one feature, should use class names that clearly match the feature or UI area. Do not turn `shared` into a dumping ground for everything.

## Checklist Before Responding

Before the final response, agents should:

- Read the relevant files and the feature's `index.js`.
- Keep changes small and in the correct owner.
- Do not revert existing user changes in the working tree.
- Do not create empty folders.
- Update the public export when adding a public component or hook.
- Run checks when appropriate:

```txt
pnpm lint
pnpm type-check
```

For larger changes related to routes, builds, or Next.js runtime behavior, also run:

```txt
pnpm build
```

## Final Rule

Feature-based structure is for easier file discovery and clear ownership, not for creating many folders.

When you are unsure where code belongs, keep it in the feature that owns the behavior first. Move it to `entities/` or `shared/` only when reuse is truly clear.
