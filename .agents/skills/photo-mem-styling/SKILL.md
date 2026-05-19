---
name: photo-mem-styling
description: Follow the photo-mem repository's UI styling rules. Use when creating or changing React UI styles, CSS Modules, Tailwind utilities, React Aria controls, StyleX migration, shared styles, global CSS, responsive layout, overlays, drawers, forms, buttons, inputs, tabs, dialogs, popovers, or other interactive primitives in this project.
---

# Photo Mem Styling

Use this skill to keep UI work aligned with the repository's current styling system and migration direction.

## Required Reading

Before changing UI or styles, read:

- `style.md`
- `AGENTS.md`
- `feature-based-structure.md` if files may move or ownership is unclear
- the component and CSS files directly touched
- the owning feature or entity `index.js` when adding public UI

Use `src/features/map/components/map-place-search.jsx` and `src/features/map/components/map-place-search.module.css` as the current reference pattern.

## Styling Stack

Use:

- React Aria Components for interactive controls
- colocated CSS Modules for custom component and feature styles
- Tailwind utilities for small local layout or utility concerns
- `@/shared/lib/cx` for class merging
- minimal `src/app/globals.css` for true global CSS and external library selectors

Do not use `@/shared/lib/styles` in new or migrated code.

## React Aria Controls

Use React Aria Components or React Aria hooks for:

- buttons and links
- inputs, textareas, selects, search fields, number fields
- checkboxes, switches, radio groups
- tabs, menus, dialogs, modals, popovers, tooltips
- forms and interactive collections

Prefer styling React Aria states in CSS Modules with data attributes such as `[data-focused]`, `[data-disabled]`, `[data-hovered]`, `[data-pressed]`, and `[data-selected]`.

If a React Aria pattern is unfamiliar, use the `react-aria` skill and load only the specific component reference needed.

## CSS Modules

Place component-specific styles next to the component:

```txt
src/features/map/components/
├── map-place-search.jsx
└── map-place-search.module.css
```

Import CSS Modules directly and merge with `cx`:

```jsx
import styles from './map-place-search.module.css'
import { cx } from '@/shared/lib/cx'

export function MapPlaceSearch({ showResults }) {
  return (
    <form className={cx(styles.root, 'pointer-events-auto')}>
      <div className={cx(styles.field, showResults && styles.hasResults)} />
    </form>
  )
}
```

Use camelCase CSS Module class names so JSX can use dot notation:

```css
.root {}
.field {}
.hasResults {}
.clearButton {}
```

Avoid string class names for CSS Module-owned styles:

```jsx
// Avoid
className={cx('map-place-search')}

// Prefer
className={styles.root}
```

## Tailwind Usage

Use Tailwind for small, obvious local utilities:

- spacing and sizing
- flex/grid helpers
- pointer events
- z-index
- one-off responsive utilities

Prefer CSS Modules for:

- component identity styles
- multi-selector styling
- pseudo-elements
- animations
- complex responsive rules
- React Aria state selectors

Do not mix Tailwind and CSS Modules for the same CSS property on the same element unless the override is intentional and obvious.

## Global CSS

Keep `src/app/globals.css` minimal. It may contain:

- Tailwind import
- StyleX directive while still required
- CSS variables/design tokens
- base reset rules
- `html`, `body`, and root app defaults
- external library selectors such as `.maplibregl-*`, `.swiper-*`, and `.os-*`

Do not put feature or component styles in `globals.css`.

External library selectors belong in global CSS only when the class is produced by the library:

```css
.maplibregl-map {
  font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
}
```

## Ownership

Place styles with their owner:

```txt
src/features/map/components/map-controls.module.css
src/features/memory/components/checkin-card.module.css
src/shared/components/button.module.css
```

Use `src/shared/components/*.module.css` only for truly generic UI. Do not move map, memory, auth, profile, or other business-specific styles into shared.

## Legacy Style Migration

The repo still contains legacy shared CSS under `src/shared/styles`. When meaningful UI work touches a component, prefer migrating only that component to the colocated CSS Module pattern:

1. Create `component-name.module.css` next to the component.
2. Move only styles owned by that component.
3. Import `styles` from the local module.
4. Replace `cx('legacy-class')` with `styles.className`.
5. Use `@/shared/lib/cx` for merging.
6. Remove migrated selectors from `src/shared/styles/partials/*`.
7. Run validation appropriate to CSS/PostCSS impact.

Do not migrate unrelated components in the same change unless the task explicitly asks for a broad migration.

## UI Quality Checks

Before finalizing UI work, check:

- controls are accessible and use React Aria where appropriate
- text does not overlap or overflow on mobile and desktop
- buttons and fixed-format controls have stable dimensions
- feature styling remains in the owning feature
- global CSS did not gain component-specific rules
- no new code imports `@/shared/lib/styles`
- banking product context stays clear, calm, and professional when wording is involved

## Validation

Run `pnpm lint` and `pnpm type-check` when appropriate.

Run `pnpm build` for larger route, build, CSS/PostCSS, or Next.js runtime changes.
