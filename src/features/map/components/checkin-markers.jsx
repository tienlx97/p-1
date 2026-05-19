'use client'

import { memo, useMemo } from 'react'
import { Marker, Tooltip } from 'react-leaflet'

import { USE_DEFAULT_LEAFLET_MARKERS } from '@/features/map/constants/map.constants'
import { createCheckinIcon } from '@/features/map/utils/map.utils'
import { MemoryHoverPreview } from '@/features/memory'
import { cx } from '@/shared/lib/styles'

const CheckinMarker = memo(function CheckinMarker({
  checkin,
  isActive,
  isPreviewOpen,
  onOpenMemoryDetail,
  onShowHoverPreview,
  onScheduleCloseHoverPreview,
  onKeepPreviewOpen,
}) {
  const icon = useMemo(
    () => (USE_DEFAULT_LEAFLET_MARKERS ? null : createCheckinIcon(checkin, isActive)),
    [checkin, isActive]
  )
  const eventHandlers = useMemo(
    () => ({
      click: () => onOpenMemoryDetail(checkin.id),
      mouseover: () => onShowHoverPreview(checkin.id),
      mouseout: onScheduleCloseHoverPreview,
    }),
    [checkin.id, onOpenMemoryDetail, onScheduleCloseHoverPreview, onShowHoverPreview]
  )

  return (
    <Marker
      position={[checkin.latitude, checkin.longitude]}
      {...(icon ? { icon } : {})}
      eventHandlers={eventHandlers}
    >
      {isPreviewOpen ? (
        <Tooltip
          className={cx('memory-hover-tooltip')}
          direction="top"
          interactive
          offset={[0, 0]}
          opacity={1}
          permanent
        >
          <MemoryHoverPreview
            checkin={checkin}
            onMouseEnter={onKeepPreviewOpen}
            onMouseLeave={onScheduleCloseHoverPreview}
            onPress={(mediaIndex) => onOpenMemoryDetail(checkin.id, mediaIndex)}
          />
        </Tooltip>
      ) : null}
    </Marker>
  )
})

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
