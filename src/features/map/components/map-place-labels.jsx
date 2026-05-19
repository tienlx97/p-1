'use client'

import { memo, useCallback, useEffect, useRef } from 'react'
import { Marker } from 'react-map-gl/maplibre'

import { getCategory } from '@/entities/memory'
import { getCheckinLngLat } from '@/features/map/utils/map.utils'
import styles from './map-place-labels.module.css'

const LABEL_COLLISION_GAP = 4
const LABEL_TOOLTIP_OFFSET = [0, 8]

/**
 * @param {DOMRect} first
 * @param {DOMRect} second
 * @param {number} [gap]
 * @returns {boolean}
 */
function doRectsCollide(first, second, gap = LABEL_COLLISION_GAP) {
  return !(
    first.right + gap <= second.left ||
    first.left >= second.right + gap ||
    first.bottom + gap <= second.top ||
    first.top >= second.bottom + gap
  )
}

/**
 * Hides lower-priority permanent labels that overlap visible higher-priority labels.
 *
 * @param {import("maplibre-gl").Map} map
 * @returns {void}
 */
function applyPlaceLabelCollisions(map) {
  const mapContainer = map.getContainer()
  const tooltipElements = [...mapContainer.querySelectorAll(`.${styles.tooltip}`)]
  const labelItems = tooltipElements
    .map((tooltipElement, index) => {
      const labelElement = tooltipElement.querySelector('[data-map-place-label]')

      return {
        index,
        labelElement,
        priority: Number(labelElement?.dataset.labelPriority ?? 0),
        tooltipElement,
      }
    })
    .filter((item) => item.labelElement)
    .toSorted((first, second) => second.priority - first.priority || first.index - second.index)
  const occupiedRects = []

  for (const item of labelItems) {
    item.tooltipElement.style.visibility = 'visible'
  }

  for (const item of labelItems) {
    const rect = item.tooltipElement.getBoundingClientRect()
    const hasSize = rect.width > 0 && rect.height > 0
    const collides = hasSize && occupiedRects.some((occupied) => doRectsCollide(rect, occupied))

    if (!hasSize || collides) {
      item.tooltipElement.style.visibility = 'hidden'
      continue
    }

    occupiedRects.push(rect)
  }
}

/**
 * Splits a place name into one or two balanced tooltip lines.
 *
 * @param {string} text
 * @param {number} [maxLineLength]
 * @returns {string[]}
 */
function splitTooltipTwoLines(text, maxLineLength = 14) {
  const cleaned = text.trim()

  if (cleaned.length <= maxLineLength) {
    return [cleaned]
  }

  const words = cleaned.split(/\s+/)

  if (words.length <= 2) {
    return [cleaned]
  }

  let bestIndex = 1
  let bestScore = Infinity

  for (let i = 1; i < words.length; i++) {
    const line1 = words.slice(0, i).join(' ')
    const line2 = words.slice(i).join(' ')

    if (line1.length < 4 || line2.length < 4) {
      continue
    }

    const diff = Math.abs(line1.length - line2.length)
    let score = diff

    if (line1.length > maxLineLength) {
      score += (line1.length - maxLineLength) * 2
    }

    if (line2.length > maxLineLength) {
      score += (line2.length - maxLineLength) * 2
    }

    if (line1.endsWith('-')) {
      score += 10
    }

    if (score < bestScore) {
      bestScore = score
      bestIndex = i
    }
  }

  return [words.slice(0, bestIndex).join(' '), words.slice(bestIndex).join(' ')]
}

const CheckinPlaceLabel = memo(function CheckinPlaceLabel({ checkin }) {
  const category = getCategory(checkin.categoryId)
  const [longitude, latitude] = getCheckinLngLat(checkin)
  const lines = splitTooltipTwoLines(checkin.locationName)

  if (category.id === 'home') {
    return null
  }

  return (
    <Marker anchor="top" latitude={latitude} longitude={longitude} offset={LABEL_TOOLTIP_OFFSET}>
      <div className={styles.tooltip}>
        <div
          className={styles.label}
          data-label-priority={new Date(checkin.checkinTime).getTime()}
          data-map-place-label
        >
          {lines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>
    </Marker>
  )
})

/**
 * @typedef {object} AdaptivePlaceLabelsProps
 * @property {import("maplibre-gl").Map | null} map
 * @property {import("@/entities/memory/mock-data").MemoryCheckin[]} places
 * @property {boolean} visible
 */

/**
 * @param {AdaptivePlaceLabelsProps} props
 */
export function AdaptivePlaceLabels({ map, places, visible }) {
  const rafIdsRef = useRef([])

  const cancelScheduledCollision = useCallback(() => {
    for (const rafId of rafIdsRef.current) {
      globalThis.cancelAnimationFrame(rafId)
    }

    rafIdsRef.current = []
  }, [])

  const scheduleCollisionUpdate = useCallback(() => {
    cancelScheduledCollision()

    if (!map || !visible) {
      return
    }

    const firstFrameId = globalThis.requestAnimationFrame(() => {
      const secondFrameId = globalThis.requestAnimationFrame(() => {
        applyPlaceLabelCollisions(map)
        rafIdsRef.current = []
      })

      rafIdsRef.current = [secondFrameId]
    })

    rafIdsRef.current = [firstFrameId]
  }, [cancelScheduledCollision, map, visible])

  useEffect(() => {
    if (!map) {
      return
    }

    const eventNames = ['moveend', 'zoomend', 'resize']

    for (const eventName of eventNames) {
      map.on(eventName, scheduleCollisionUpdate)
    }

    return () => {
      for (const eventName of eventNames) {
        map.off(eventName, scheduleCollisionUpdate)
      }
    }
  }, [map, scheduleCollisionUpdate])

  useEffect(() => {
    scheduleCollisionUpdate()

    return cancelScheduledCollision
  }, [cancelScheduledCollision, places, scheduleCollisionUpdate, visible])

  if (!visible) {
    return null
  }

  return places.map((checkin) => (
    <CheckinPlaceLabel key={`${checkin.id}-label`} checkin={checkin} />
  ))
}
