'use client'

import { useRef } from 'react'
import { Button } from 'react-aria-components'
import { categories } from '@/entities/memory'
import { cx } from '@/shared/lib/cx'
import styles from './map-filter-panel.module.css'

const categoryIcons = {
  all: '•',
  beach: '≋',
  coffee: '☕',
  culture: '▦',
  food: '⌁',
  home: '⌂',
  mountain: '△',
  travel: '✈',
}

function stopMapInteraction(event) {
  event.stopPropagation()
}

/**
 * @typedef {object} MapFilterPanelProps
 * @property {string} categoryId
 * @property {function(string): void} onCategoryChange
 * @property {number} totalCount
 * @property {number} visibleCount
 */

/**
 * @param {MapFilterPanelProps} props
 */
export function MapFilterPanel({ categoryId, onCategoryChange, totalCount, visibleCount }) {
  const railRef = useRef(null)
  const categoryOptions = [{ id: 'all', name: 'Tất cả' }, ...categories]

  // Dùng sau
  // eslint-disable-next-line no-unused-vars
  const countLabel =
    visibleCount === totalCount
      ? `${totalCount} địa điểm`
      : `${visibleCount}/${totalCount} địa điểm`

  function scrollRail(direction) {
    railRef.current?.scrollBy({
      left: direction * 220,
      behavior: 'smooth',
    })
  }

  return (
    <section
      className={styles.root}
      aria-label="Lọc nhanh bản đồ"
      onClick={stopMapInteraction}
      onDoubleClick={stopMapInteraction}
      onPointerDown={stopMapInteraction}
      onWheel={stopMapInteraction}
    >
      <Button
        type="button"
        className={cx(styles.scrollButton, styles.leftScrollButton)}
        aria-label="Cuộn bộ lọc sang trái"
        onPress={() => scrollRail(-1)}
      >
        <span className={styles.scrollIcon} aria-hidden="true" />
      </Button>

      <div ref={railRef} className={styles.row} aria-label="Lọc theo nhóm">
        {/* <span className={styles.count} aria-label={countLabel}>
          {countLabel}
        </span> */}

        {categoryOptions.map((category) => {
          const isActive = categoryId === category.id

          return (
            <Button
              key={category.id}
              type="button"
              className={cx(styles.chip, isActive && styles.active)}
              style={category.color ? { '--chip-color': category.color } : undefined}
              aria-pressed={isActive}
              onPress={() => onCategoryChange(category.id)}
            >
              <span className={styles.icon} aria-hidden="true">
                {categoryIcons[category.id] ?? '•'}
              </span>
              {category.name}
            </Button>
          )
        })}
      </div>

      <Button
        type="button"
        className={cx(styles.scrollButton, styles.rightScrollButton)}
        aria-label="Cuộn bộ lọc sang phải"
        onPress={() => scrollRail(1)}
      >
        <span className={styles.scrollIcon} aria-hidden="true" />
      </Button>
    </section>
  )
}
