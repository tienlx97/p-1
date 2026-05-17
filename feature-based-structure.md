# Feature-Based Structure Guide

> Purpose: This document explains the project structure, coding conventions, and implementation rules for AI coding agents such as Codex, Claude Code, and other agentic development tools.

This project follows a **feature-based architecture**. Code should be organized by business feature, not only by technical type.

---

## 1. Core Principle

Group code by **feature/domain** first.

Each feature should contain everything it needs:

- UI components
- hooks
- services
- API logic
- types
- validation schemas
- constants
- utilities
- tests

Avoid scattering feature logic across unrelated global folders.

---

## 2. Recommended Project Structure

```txt
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── ...
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── api/
│   │   ├── tests/
│   │   └── index.js
│   │
│   ├── memory/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── api/
│   │   ├── tests/
│   │   └── index.js
│   │
│   └── map/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── schemas/
│       ├── types/
│       ├── utils/
│       ├── constants/
│       ├── api/
│       ├── tests/
│       └── index.js
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   ├── constants/
│   └── lib/
│
├── entities/
│   ├── user/
│   ├── memory/
│   └── location/
│
├── services/
│   ├── http/
│   ├── storage/
│   └── analytics/
│
├── config/
│   ├── env.js
│   └── routes.js
│
└── styles/
    ├── globals.css
    └── tokens.css
```

---

## 3. Folder Responsibility

### `app/`

Contains routing, layouts, pages, route handlers, and framework-level files.

Rules:

- Keep pages thin.
- Do not place business logic directly in pages.
- Pages should compose feature components.
- Route-level data loading is allowed, but feature logic should stay inside `features/`.

Example:

```tsx
import { MemoryMapPage } from '@/features/memory'

export default function Page() {
  return <MemoryMapPage />
}
```

---

### `features/`

Contains business features.

A feature is a user-facing or business capability.

Examples:

- `auth`
- `memory`
- `map`
- `timeline`
- `profile`
- `settings`
- `notification`

Each feature may contain:

```txt
feature-name/
├── components/
├── hooks/
├── services/
├── api/
├── schemas/
├── types/
├── utils/
├── constants/
├── tests/
└── index.js
```

Rules:

- Keep feature-specific logic inside the feature folder.
- Do not import from another feature’s internal folders.
- Cross-feature usage must go through the feature `index.js`.
- If logic is reused by multiple features, move it to `shared/`.

Allowed:

```javascript
import { MemoryCard } from '@/features/memory'
```

Avoid:

```javascript
import { MemoryCard } from '@/features/memory/components/MemoryCard'
```

---

### `shared/`

Contains reusable, feature-independent code.

Use `shared/` only for code that is truly generic.

Examples:

- buttons
- inputs
- modal components
- formatting utilities
- common hooks
- common TypeScript helpers
- layout primitives

Rules:

- `shared/` must not depend on `features/`.
- `shared/` must not contain business-specific logic.
- If a component mentions a business entity, it probably belongs in `features/` or `entities/`.

---

### `entities/`

Contains core domain models shared across features.

Examples:

```txt
entities/
├── user/
│   ├── types.js
│   ├── schemas.js
│   └── utils.js
│
├── memory/
│   ├── types.js
│   ├── schemas.js
│   └── utils.js
│
└── location/
    ├── types.js
    ├── schemas.js
    └── utils.js
```

Use `entities/` for stable business objects.

Examples:

- `User`
- `Memory`
- `Location`
- `Place`
- `Photo`
- `Comment`

Rules:

- Entity code should be reusable across features.
- Entity code should not contain UI page logic.
- Entity code may include types, validation schemas, formatters, and pure helpers.

---

### `services/`

Contains infrastructure-level integrations.

Examples:

- HTTP client
- database client
- storage service
- authentication provider wrapper
- analytics service
- logging service

Rules:

- Keep external tool/provider logic here.
- Do not mix business UI logic into `services/`.
- Feature-specific service wrappers should stay inside the relevant feature.

---

### `config/`

Contains project-level configuration.

Examples:

- environment variables
- route constants
- app metadata
- feature flags
- navigation config

Rules:

- Validate environment variables in one place.
- Avoid reading `process.env` directly across the app.
- Use typed config exports.

---

## 4. Feature Folder Template

Use this template when creating a new feature:

```txt
features/[feature-name]/
├── components/
│   └── [FeatureName]View.tsx
│
├── hooks/
│   └── use[FeatureName].js
│
├── services/
│   └── [feature-name].service.js
│
├── api/
│   └── [feature-name].api.js
│
├── schemas/
│   └── [feature-name].schema.js
│
├── types/
│   └── [feature-name].types.js
│
├── utils/
│   └── [feature-name].utils.js
│
├── constants/
│   └── [feature-name].constants.js
│
├── tests/
│   └── [feature-name].test.js
│
└── index.js
```

---

## 5. Import Rules

### Preferred Import Direction

```txt
app → features → entities → shared
app → shared
features → entities
features → shared
entities → shared
services → config
```

### Forbidden Import Direction

```txt
shared → features
shared → app
entities → features
entities → app
features/auth/internal → features/memory/internal
```

### Rule

A lower-level layer must not depend on a higher-level layer.

---

## 6. Public API Rule

Every feature should expose its public API through `index.js`.

Example:

```javascript
export { MemoryMapPage } from './components/MemoryMapPage'
export { MemoryCard } from './components/MemoryCard'
export { useMemories } from './hooks/useMemories'
export type { Memory } from './types/memory.types'
```

Only export what other parts of the app need.

Do not export everything by default.

---

## 7. Component Rules

### Feature Components

Feature components belong inside:

```txt
features/[feature]/components/
```

Use for components that contain business meaning.

Examples:

- `MemoryCard`
- `MemoryMap`
- `LoginForm`
- `TimelineList`
- `ProfileHeader`

### Shared Components

Shared components belong inside:

```txt
shared/components/
```

Use for generic UI only.

Examples:

- `Button`
- `Input`
- `Dialog`
- `Dropdown`
- `EmptyState`
- `LoadingSpinner`

---

## 8. Hook Rules

Feature hooks belong inside the feature.

Examples:

```txt
features/memory/hooks/useMemories.js
features/auth/hooks/useLogin.js
features/map/hooks/useMapPins.js
```

Shared hooks belong in:

```txt
shared/hooks/
```

Examples:

- `useDebounce`
- `useMediaQuery`
- `usePrevious`
- `useMounted`

Rules:

- Hooks that call feature APIs stay inside that feature.
- Generic hooks without business meaning may go to `shared/hooks/`.

---

## 9. Type Rules

Use colocated types when the type is feature-specific.

```txt
features/memory/types/memory.types.js
```

Use entity types when shared across multiple features.

```txt
entities/memory/types.js
```

Use shared types only for generic technical helpers.

```txt
shared/types/api.types.js
```

Avoid putting all types into one global `types/` folder.

---

## 10. API and Service Rules

### Feature API

Feature API files handle feature-specific API calls.

```txt
features/memory/api/memory.api.js
```

Example:

```javascript
export async function getMemories() {}
export async function createMemory() {}
export async function updateMemory() {}
export async function deleteMemory() {}
```

### Global Service

Global service files handle infrastructure.

```txt
services/http/client.js
services/storage/storage.service.js
```

Example:

```javascript
export const httpClient = createHttpClient()
```

---

## 11. Naming Conventions

### Files

Use kebab-case for file names:

```txt
memory-card.tsx
use-memories.js
memory.api.js
memory.types.js
memory.schema.js
```

Alternative PascalCase for React components is allowed only if the project already uses it consistently:

```txt
MemoryCard.tsx
MemoryMapPage.tsx
```

Do not mix naming styles randomly.

### Components

Use PascalCase:

```tsx
MemoryCard
MemoryMapPage
LoginForm
```

### Hooks

Use camelCase and start with `use`:

```javascript
useMemories
useLogin
useMapPins
```

### Types

Use PascalCase:

```javascript
Memory
MemoryStatus
CreateMemoryInput
UpdateMemoryPayload
```

### Constants

Use UPPER_SNAKE_CASE:

```javascript
MAX_UPLOAD_SIZE
DEFAULT_PAGE_SIZE
MEMORY_STATUS_OPTIONS
```

---

## 12. State Management Rules

Keep state as close as possible to where it is used.

Preferred order:

1. Local component state
2. Feature-level hook
3. URL/search params
4. Server state library
5. Global store

Use global state only for truly app-wide concerns.

Examples of valid global state:

- authenticated user
- theme
- app language
- global modal
- notification/toast state

Avoid global state for feature-local form data.

---

## 13. Validation Rules

Place validation schemas near the feature or entity they belong to.

Examples:

```txt
features/memory/schemas/create-memory.schema.js
entities/user/schemas.js
```

Rules:

- Use schemas for form validation and API input validation.
- Keep validation messages consistent.
- Reuse entity schemas when possible.

---

## 14. Testing Rules

Feature tests should stay close to the feature.

```txt
features/memory/tests/
```

Test priorities:

1. Business logic
2. Data transformation
3. API service behavior
4. Important UI flows
5. Edge cases and error states

Use shared test utilities only when they are generic.

---

## 15. Error Handling Rules

Each feature should handle:

- loading state
- empty state
- error state
- permission denied state
- invalid input state
- network failure state

Do not silently ignore errors.

Use clear user-facing error messages.

---

## 16. AI Agent Instructions

When modifying this project, follow these rules:

1. Read this document before changing code.
2. Preserve the feature-based structure.
3. Do not create large global folders unless truly necessary.
4. Do not move feature-specific code into `shared/`.
5. Do not import from another feature’s internal files.
6. Use each feature’s `index.js` as the public API.
7. Keep pages thin and move business logic into features.
8. Add or update types when changing data structures.
9. Add or update validation schemas when changing forms or API inputs.
10. Add tests for changed business logic where possible.
11. Run lint/typecheck/test commands before final response if available.
12. Explain changed files and reasoning in the final response.

---

## 17. New Feature Checklist

When creating a new feature:

- [ ] Create `features/[feature-name]/`
- [ ] Add `components/`
- [ ] Add `hooks/` if needed
- [ ] Add `api/` or `services/` if needed
- [ ] Add `types/`
- [ ] Add `schemas/` if forms or API inputs exist
- [ ] Add `utils/` only for feature-specific helpers
- [ ] Add `constants/` if repeated values exist
- [ ] Add `tests/` for important logic
- [ ] Add `index.js`
- [ ] Export only the public API
- [ ] Compose the feature from `app/` route/page

---

## 18. Refactoring Checklist

When refactoring existing code:

- [ ] Identify which feature owns the code
- [ ] Move feature-specific components into `features/[feature]/components/`
- [ ] Move feature-specific hooks into `features/[feature]/hooks/`
- [ ] Move shared UI into `shared/components/`
- [ ] Move shared domain models into `entities/`
- [ ] Remove duplicate types/utilities
- [ ] Fix imports to use public `index.js`
- [ ] Ensure no circular dependencies
- [ ] Run lint/typecheck/tests

---

## 19. Decision Guide

### Put code in `features/` when:

- It belongs to one business capability.
- It contains feature-specific UI.
- It calls feature-specific APIs.
- It contains feature-specific business rules.

### Put code in `shared/` when:

- It is generic.
- It has no business meaning.
- It can be reused by many features.
- It does not depend on feature code.

### Put code in `entities/` when:

- It represents a core business object.
- It is reused across multiple features.
- It contains domain types, schemas, or pure helpers.

### Put code in `services/` when:

- It connects to external systems.
- It wraps infrastructure.
- It is not tied to one feature.

---

## 20. Anti-Patterns to Avoid

Avoid:

```txt
src/components/
src/hooks/
src/utils/
src/types/
```

when these folders become dumping grounds for unrelated code.

Avoid:

```txt
features/memory/components/MemoryCard.tsx
features/map/components/MapView.tsx
features/profile/components/ProfileCard.tsx
```

being imported directly across features.

Avoid:

```javascript
import { something } from '@/features/other-feature/components/...'
```

Prefer:

```javascript
import { Something } from '@/features/other-feature'
```

Avoid moving code to `shared/` only because two files use it once.

Duplicate small code first if abstraction is unclear. Abstract only when the pattern is stable.

---

## 21. Example: Memory Feature

```txt
features/memory/
├── components/
│   ├── MemoryCard.tsx
│   ├── MemoryForm.tsx
│   ├── MemoryMap.tsx
│   └── MemoryTimeline.tsx
│
├── hooks/
│   ├── useMemories.js
│   ├── useCreateMemory.js
│   └── useMemoryFilters.js
│
├── api/
│   └── memory.api.js
│
├── schemas/
│   └── memory.schema.js
│
├── types/
│   └── memory.types.js
│
├── utils/
│   └── memory-formatters.js
│
├── constants/
│   └── memory.constants.js
│
└── index.js
```

Example public API:

```javascript
export { MemoryMap } from './components/MemoryMap'
export { MemoryTimeline } from './components/MemoryTimeline'
export { MemoryForm } from './components/MemoryForm'
export { useMemories } from './hooks/useMemories'
export type { Memory, CreateMemoryInput } from './types/memory.types'
```

---

## 22. Final Rule

Prefer clarity over cleverness.

The folder structure should help humans and AI agents understand:

- where code belongs
- where to add new files
- what can be reused
- what should stay private
- how features connect to the app

When uncertain, keep code inside the feature first. Move it to `shared/` or `entities/` only after reuse is clear.
