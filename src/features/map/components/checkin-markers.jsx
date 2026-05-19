'use client'

import { memo, useMemo } from 'react'
import { Button } from 'react-aria-components'
import { Marker } from 'react-map-gl/maplibre'

import { createCheckinMarkerImage, getCheckinLngLat } from '@/features/map/utils/map.utils'
import { MemoryHoverPreview } from '@/features/memory'
import styles from './checkin-markers.module.css'

function stopMapInteraction(event) {
  event.stopPropagation()
}

/**
 * @typedef {object} CheckinMarkerProps
 * @property {import("@/entities/memory/mock-data").MemoryCheckin} checkin
 * @property {boolean} isActive
 * @property {boolean} isPreviewOpen
 * @property {function(string, number=): void} onOpenMemoryDetail
 * @property {function(string): void} onShowHoverPreview
 * @property {function(): void} onScheduleCloseHoverPreview
 * @property {function(): void} onKeepPreviewOpen
 */

/**
 * @param {CheckinMarkerProps} props
 */
const CheckinMarker = memo(function CheckinMarker({
  checkin,
  isActive,
  isPreviewOpen,
  onOpenMemoryDetail,
  onShowHoverPreview,
  onScheduleCloseHoverPreview,
  onKeepPreviewOpen,
}) {
  const markerImage = useMemo(() => createCheckinMarkerImage(checkin, isActive), [checkin, isActive])
  const [longitude, latitude] = getCheckinLngLat(checkin)

  return (
    <Marker
      anchor="bottom"
      latitude={latitude}
      longitude={longitude}
      style={{
        zIndex: isPreviewOpen ? 120 : isActive ? 80 : 30,
      }}
    >
      <Button
        type="button"
        className={styles.markerButton}
        aria-label={`Mở kỷ niệm ${checkin.title}`}
        onClick={stopMapInteraction}
        onPointerDown={stopMapInteraction}
        onMouseEnter={() => onShowHoverPreview(checkin.id)}
        onMouseLeave={onScheduleCloseHoverPreview}
        onPress={() => onOpenMemoryDetail(checkin.id)}
      >
        <img
          className={styles.markerImage}
          src={markerImage.src}
          width={markerImage.width}
          height={markerImage.height}
          alt=""
          aria-hidden="true"
        />
      </Button>
      {isPreviewOpen ? (
        <div
          className={styles.hoverTooltip}
          onClick={stopMapInteraction}
          onPointerDown={stopMapInteraction}
          onMouseEnter={onKeepPreviewOpen}
          onMouseLeave={onScheduleCloseHoverPreview}
        >
          <MemoryHoverPreview
            checkin={checkin}
            onPress={(mediaIndex) => onOpenMemoryDetail(checkin.id, mediaIndex)}
          />
        </div>
      ) : null}
    </Marker>
  )
})

/**
 * @typedef {object} CheckinMarkersProps
 * @property {import("@/entities/memory/mock-data").MemoryCheckin[]} checkins
 * @property {"add" | "memory" | null} drawerMode
 * @property {string | null} activeId
 * @property {string | null} hoveredPreviewId
 * @property {function(string, number=): void} onOpenMemoryDetail
 * @property {function(string): void} onShowHoverPreview
 * @property {function(): void} onScheduleCloseHoverPreview
 * @property {function(): void} onKeepPreviewOpen
 */

/**
 * @param {CheckinMarkersProps} props
 */
export const CheckinMarkers = memo(function CheckinMarkers({
  checkins,
  drawerMode,
  activeId,
  hoveredPreviewId,
  onOpenMemoryDetail,
  onShowHoverPreview,
  onScheduleCloseHoverPreview,
  onKeepPreviewOpen,
}) {
  return checkins.map((checkin) => (
    <CheckinMarker
      key={checkin.id}
      checkin={checkin}
      isActive={
        (drawerMode === 'memory' && checkin.id === activeId) || checkin.id === hoveredPreviewId
      }
      isPreviewOpen={hoveredPreviewId === checkin.id}
      onOpenMemoryDetail={onOpenMemoryDetail}
      onShowHoverPreview={onShowHoverPreview}
      onScheduleCloseHoverPreview={onScheduleCloseHoverPreview}
      onKeepPreviewOpen={onKeepPreviewOpen}
    />
  ))
})
