# Style Guide

UI work in this repository should use CSS Modules, React Aria Components, Tailwind utilities, and minimal global CSS with clear ownership.

## Required Stack

- Use React Aria Components for interactive controls: buttons, links, inputs, textareas, selects, radio groups, tabs, dialogs, popovers, menus, and similar UI primitives.
- Use CSS Modules for custom component and feature styles.
- Use Tailwind utilities for small, local layout and utility classes.
- Use `src/app/globals.css` only for truly global CSS.

## CSS Module Pattern

Put component-specific styles next to the component:

```txt
src/features/map/components/
├── map-place-search.jsx
└── map-place-search.module.css
```

Import the module directly:

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

## `cx` Usage

Use `@/shared/lib/cx` for class merging. It is a merge utility only, backed by `clsx` and `tailwind-merge`.

```jsx
import { cx } from '@/shared/lib/cx'

className={cx(styles.button, isActive && styles.active, 'px-3')}
```

Do not add CSS Module lookup behavior to `cx`. Do not use `@/shared/lib/styles` in new or migrated code.

## Tailwind Usage

Use Tailwind for small, obvious utility concerns:

```jsx
className={cx(styles.root, 'pointer-events-auto')}
```

Good Tailwind use cases:

- simple spacing and sizing
- flex/grid helpers
- pointer events and z-index utilities
- one-off responsive utilities

Prefer CSS Modules for:

- component identity styles
- multi-selector styling
- pseudo-elements
- animations
- complex responsive rules
- React Aria state selectors such as `[data-focused]` and `[data-disabled]`

Avoid mixing Tailwind and CSS Modules for the same CSS property on the same element unless the override is intentional and obvious.

## Global CSS

Keep `src/app/globals.css` minimal. It may contain:

- Tailwind import
- StyleX directive if still required
- CSS variables/design tokens
- base reset rules
- `html`, `body`, and root app defaults
- external library selectors such as `.maplibregl-*`, `.swiper-*`, and `.os-*`

Do not put feature or component styles in `globals.css`.

External library selectors belong in global CSS when the class is produced by the library:

```css
.maplibregl-map {
  font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
}

.swiper-wrapper {
  height: 100%;
}
```

## Ownership

Place styles with their owner:

```txt
src/features/map/components/map-controls.module.css
src/features/memory/components/checkin-card.module.css
src/shared/components/button.module.css
```

Use `src/shared/components/*.module.css` only for truly generic UI components. Do not move map, memory, profile, or other business-specific styles into shared.

## Migration Rule

The repository still contains legacy shared CSS Modules under `src/shared/styles`. When touching a component for meaningful UI work, prefer migrating that component to the new pattern:

1. Create `component-name.module.css` next to the component.
2. Move only the styles owned by that component.
3. Import `styles` from the local CSS Module.
4. Replace `cx('legacy-class')` with `styles.className`.
5. Use `@/shared/lib/cx` for merging.
6. Remove migrated selectors from `src/shared/styles/partials/*`.
7. Run `pnpm lint`, `pnpm type-check`, and `pnpm build` for CSS/PostCSS changes.

Do not migrate unrelated components in the same change unless the task explicitly asks for a broad style migration.

## Current Reference

Use `src/features/map/components/map-place-search.jsx` and `src/features/map/components/map-place-search.module.css` as the current reference pattern.
