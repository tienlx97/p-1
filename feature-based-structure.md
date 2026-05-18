# Next.js Feature-Based Structure Prompt

> Purpose: Use this as the project prompt for Codex, Claude Code, and other AI coding agents working in this repository.
>
> This project uses Next.js App Router with JavaScript/JSX files. The source folders live at the repository root, not under `src/`.

---

## 1. Project Shape

Current root-level structure:

```txt
app/
features/
entities/
shared/
public/
DOCS/
```

Path alias:

```txt
@/* -> ./*
```

Use imports like:

```javascript
import { MapSection } from '@/features/map'
import { checkins } from '@/entities/memory'
import { cx } from '@/shared/lib/styles'
```

---

## 2. Architecture Rule

Organize code by feature/domain first, then by technical role.

Keep pages thin. Route files in `app/` should compose feature components and pass route-level params/data only when needed.

Prefer this:

```jsx
import { MemoryLibraryPage } from '@/features/memory'

export default function Page() {
  return <MemoryLibraryPage />
}
```

Avoid putting business UI, state machines, map logic, memory filtering, or drawer behavior directly inside `app/` pages.

---

## 3. Current Folder Status

The current folder set is enough for the app as it exists today.

```txt
app/
├── layout.jsx
├── page.jsx
├── globals.css
├── checkins/
│   ├── page.jsx
│   └── [id]/page.jsx
└── profile/page.jsx

features/
├── map/
│   ├── components/
│   └── index.js
├── memory/
│   ├── components/
│   └── index.js
└── profile/
    ├── components/
    └── index.js

entities/
└── memory/
    ├── mock-data.js
    └── index.js

shared/
├── components/
├── lib/
└── styles/
```

Notes:

- `features/map`, `features/memory`, and `features/profile` are present and exported through `index.js`.
- `entities/memory` is present and currently owns mock memory/checkin data.
- `shared/components`, `shared/lib`, and `shared/styles` are present.
- `services/`, `config/`, `hooks/`, `api/`, `schemas/`, `types/`, and `tests/` are not required yet. Add them only when real code needs them.
- `app/checkins/new/` currently exists as an empty directory. Either add a route there when needed or remove the empty folder during cleanup.

Do not create empty folders just to satisfy a template.

---

## 4. Folder Responsibilities

### `app/`

Owns Next.js routing and framework files:

- `layout.jsx`
- `page.jsx`
- route groups
- dynamic routes
- route handlers, if added later
- global CSS import entry

Rules:

- Keep route files small.
- Compose feature-level page components.
- Do not place reusable business logic in route files.

### `features/`

Owns user-facing capabilities.

Current features:

- `features/map`: map view, Leaflet markers, map controls, map-specific utilities/constants.
- `features/memory`: memory library, detail drawer/page, media viewer, add-memory UI.
- `features/profile`: profile page UI.

Feature internals may include:

```txt
features/[feature]/
├── components/
├── hooks/       optional
├── api/         optional
├── services/    optional
├── schemas/     optional
├── types/       optional, or use JSDoc in JS files
├── utils/       optional
├── constants/   optional
├── tests/       optional
└── index.js
```

Rules:

- Keep feature-specific code inside its feature.
- Export cross-feature public pieces from `features/[feature]/index.js`.
- Do not import from another feature's internal folders unless there is a strong local reason.
- Move code to `shared/` only after reuse is clear and the code is business-agnostic.

### `entities/`

Owns stable domain data and pure domain helpers shared by features.

Current entity:

- `entities/memory`: mock checkin data and memory exports.

Good entity candidates:

- `memory`
- `location`
- `media`
- `profile`
- `user`, if auth is added

Rules:

- No page UI.
- No feature-specific component state.
- Domain constants, schemas, mock data, pure formatters, and shared model helpers are allowed.

### `shared/`

Owns reusable code with no business ownership.

Current shared areas:

- `shared/components`: app shell, aria providers, generic UI wrappers.
- `shared/lib`: generic helpers such as class name merging.
- `shared/styles`: shared CSS and StyleX tokens/constants.

Rules:

- `shared/` must not import from `features/` or `app/`.
- If a component name or behavior depends on memories, maps, checkins, locations, or profile concepts, it probably belongs in a feature.
- Keep shared components boring and reusable.

### `public/`

Owns static assets such as icons and manifest files.

### `DOCS/`

Owns supporting documentation.

---

## 5. Import Boundaries

Preferred direction:

```txt
app -> features
app -> entities
app -> shared
features -> entities
features -> shared
entities -> shared
```

Forbidden direction:

```txt
shared -> features
shared -> app
entities -> features
entities -> app
features/[a]/components -> features/[b]/components
```

Feature-to-feature imports should use the public API:

```javascript
import { MemoryHoverPreview } from '@/features/memory'
```

Avoid:

```javascript
import { MemoryHoverPreview } from '@/features/memory/components/memory-hover-preview'
```

Exception: inside the same feature, importing sibling internals is allowed.

---

## 6. Public API Rule

Each feature and entity should expose only the public surface through `index.js`.

Example:

```javascript
export { MapSection } from './components/map-section'
```

Good public exports:

- route-level page components
- reusable feature components needed by another feature
- feature hooks meant for external use
- domain data/helpers from entities

Avoid exporting every internal helper by default. Keep private implementation details private.

---

## 7. Naming Rules

This repo currently uses:

- JavaScript and JSX: `.js`, `.jsx`
- kebab-case file names: `memory-detail-page.jsx`
- PascalCase component names: `MemoryDetailPage`
- camelCase function/hook names: `splitTooltipTwoLines`, `useMemories`
- UPPER_SNAKE_CASE constants: `DEFAULT_CENTER`

Keep this style unless doing a deliberate migration.

Do not introduce `.tsx` or TypeScript-only syntax unless the project is explicitly migrated to TypeScript.

---

## 8. When To Add Folders

Add folders only when the feature has real code for them.

Use this decision guide:

- `components/`: UI with feature meaning.
- `hooks/`: reusable feature state/effects.
- `api/`: HTTP calls for that feature.
- `services/`: feature-specific orchestration or wrappers.
- `schemas/`: validation for forms/API payloads.
- `types/`: TypeScript types, or skip in this JavaScript repo unless migrating.
- `utils/`: pure feature-specific helpers used by multiple files.
- `constants/`: repeated values used by multiple files.
- `tests/`: tests for meaningful business logic or risky UI behavior.

Do not create `hooks/`, `api/`, `services/`, `schemas/`, `types/`, `utils/`, `constants/`, or `tests/` as empty placeholders.

---

## 9. Styling Rules

Current styling is split between:

- `app/globals.css`
- `shared/styles/styles.module.css`
- `shared/styles/partials/*.css`
- StyleX token/constant files in `shared/styles/`

Rules:

- Keep global resets and app-level imports in `app/globals.css`.
- Keep broad shared styles in `shared/styles`.
- Keep feature-specific class names clearly named by feature or UI area.
- Avoid moving one-off feature styling into shared files unless it is truly reused.

---

## 10. State And Data Rules

Keep state as local as possible.

Preferred order:

1. Component state
2. Feature component/hook state
3. URL/search params
4. Server state library, when real API data exists
5. Global store only for app-wide concerns

Valid global concerns:

- auth user
- theme
- language
- global toasts
- app-wide modal state

Avoid global state for one drawer, one map hover state, or one form.

---

## 11. AI Agent Workflow

When modifying this repo:

1. Read the relevant feature and its `index.js`.
2. Check existing naming/style before adding files.
3. Keep pages in `app/` thin.
4. Prefer feature-local code over premature shared abstractions.
5. Use public imports across features.
6. Preserve existing user changes in the working tree.
7. Add tests only when there is an existing test setup or when adding one is part of the task.
8. Run available checks before the final response:

```txt
pnpm lint
pnpm type-check
```

Run `pnpm build` for larger routing, bundling, or Next.js behavior changes.

---

## 12. New Feature Checklist

When adding a new feature:

- [ ] Create `features/[feature-name]/`.
- [ ] Add `components/` with the first real component.
- [ ] Add `index.js` and export only the public API.
- [ ] Add optional folders only when they contain real files.
- [ ] Put domain data/model helpers in `entities/` if multiple features need them.
- [ ] Compose the feature from an `app/` route.
- [ ] Use `@/features/[feature-name]` from outside the feature.
- [ ] Run lint/type-check.

Minimal feature:

```txt
features/example/
├── components/
│   └── example-page.jsx
└── index.js
```

Larger feature, only when needed:

```txt
features/example/
├── components/
├── hooks/
├── api/
├── schemas/
├── utils/
├── constants/
├── tests/
└── index.js
```

---

## 13. Refactoring Checklist

When refactoring:

- [ ] Identify the owning feature.
- [ ] Move route business UI from `app/` into `features/`.
- [ ] Move shared domain data/helpers into `entities/`.
- [ ] Move generic UI/helpers into `shared/`.
- [ ] Keep feature internals private unless another layer needs them.
- [ ] Update imports to use public APIs where appropriate.
- [ ] Check for circular dependencies.
- [ ] Run lint/type-check.

---

## 14. Anti-Patterns

Avoid:

```txt
components/
hooks/
utils/
types/
```

at the repo root as dumping grounds.

Avoid importing another feature's internals:

```javascript
import { Something } from '@/features/other-feature/components/something'
```

Avoid moving code to `shared/` only because two files use it once.

Prefer small duplication until the abstraction is obvious.

Avoid template-driven empty folders. The structure should describe real code, not wishes.

---

## 15. Final Rule

Feature-based structure is a navigation system, not bureaucracy.

Optimize for:

- easy file discovery
- clear ownership
- stable import boundaries
- thin routes
- small, focused changes
- no premature global abstractions

When unsure, keep code inside the owning feature first. Move it to `entities/` or `shared/` only when reuse is real and the ownership is clear.
