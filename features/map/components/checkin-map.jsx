'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { MapContainer, Marker, TileLayer, Tooltip, useMapEvents } from 'react-leaflet'
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MARKER_CLUSTER_DISABLE_AT_ZOOM,
  PLACE_LABEL_MIN_ZOOM,
  SHOW_CLUSTER_LOCATIONS_ON_CLICK,
  USE_MARKER_CLUSTERING,
  USE_DEFAULT_LEAFLET_MARKERS,
  ZOOM_TO_CLUSTER_BOUNDS_ON_CLICK,
} from '@/features/map/components/map.constants'
import {
  createCheckinClusterIcon,
  createCheckinIcon,
  createCheckinLabelAnchorIcon,
} from '@/features/map/components/map.utils'
import { MapControls } from '@/features/map/components/map-controls'
import { MapFilterPanel } from '@/features/map/components/map-filter-panel'
import { AddMemoryDrawer, MemoryDetailDrawer, MemoryHoverPreview } from '@/features/memory'
import { checkins } from '@/entities/memory'
import { cx } from '@/shared/lib/styles'

const LABEL_BOX_WIDTH = 132
const LABEL_BOX_HEIGHT = 44
const LABEL_VIEWPORT_PADDING = 8
const LABEL_EDGE_HORIZONTAL_GAP = 8
const LABEL_VERTICAL_GAP = 8
const LABEL_EDGE_VERTICAL_OFFSET = 36
const LABEL_TOOLTIP_OFFSETS = {
  right: [18, -27],
  left: [-18, -27],
  'top-right': [74, -36],
  'top-left': [-74, -36],
  'bottom-right': [74, 10],
  'bottom-left': [-74, 10],
}
const LABEL_TOOLTIP_DIRECTIONS = {
  right: 'right',
  left: 'left',
  'top-right': 'top',
  'top-left': 'top',
  'bottom-right': 'bottom',
  'bottom-left': 'bottom',
}

function chooseLabelPlacement(point, mapSize) {
  const hasRoomRight =
    point.x + LABEL_EDGE_HORIZONTAL_GAP + LABEL_BOX_WIDTH <= mapSize.x - LABEL_VIEWPORT_PADDING
  const hasRoomLeft =
    point.x - LABEL_EDGE_HORIZONTAL_GAP - LABEL_BOX_WIDTH >= LABEL_VIEWPORT_PADDING
  const hasRoomAbove =
    point.y - LABEL_EDGE_VERTICAL_OFFSET - LABEL_BOX_HEIGHT >= LABEL_VIEWPORT_PADDING
  const hasRoomBelow =
    point.y + LABEL_VERTICAL_GAP + LABEL_BOX_HEIGHT <= mapSize.y - LABEL_VIEWPORT_PADDING
  const sideLabelTop = point.y - 46
  const sideLabelBottom = point.y - 2
  const sideLabelFitsVertically =
    sideLabelTop >= LABEL_VIEWPORT_PADDING && sideLabelBottom <= mapSize.y - LABEL_VIEWPORT_PADDING

  if (
    !sideLabelFitsVertically &&
    sideLabelBottom > mapSize.y - LABEL_VIEWPORT_PADDING &&
    hasRoomAbove
  ) {
    return hasRoomRight || !hasRoomLeft ? 'top-right' : 'top-left'
  }

  if (!sideLabelFitsVertically && sideLabelTop < LABEL_VIEWPORT_PADDING && hasRoomBelow) {
    return hasRoomRight || !hasRoomLeft ? 'bottom-right' : 'bottom-left'
  }

  if (!hasRoomRight && hasRoomLeft) {
    return hasRoomAbove ? 'top-left' : 'left'
  }

  if (!hasRoomLeft && hasRoomRight) {
    return hasRoomAbove ? 'top-right' : 'right'
  }

  if (!hasRoomRight && !hasRoomLeft) {
    return hasRoomBelow && !hasRoomAbove ? 'bottom-right' : 'top-right'
  }

  if (!hasRoomAbove && !hasRoomBelow) {
    return hasRoomRight ? 'right' : 'left'
  }

  return hasRoomRight ? 'right' : 'left'
}

function MapZoomWatcher({ onPlaceLabelVisibilityChange }) {
  const map = useMapEvents({
    zoomend: () => {
      onPlaceLabelVisibilityChange(map.getZoom() >= PLACE_LABEL_MIN_ZOOM)
    },
  })

  useEffect(() => {
    onPlaceLabelVisibilityChange(map.getZoom() >= PLACE_LABEL_MIN_ZOOM)
  }, [map, onPlaceLabelVisibilityChange])

  return null
}

function AdaptivePlaceLabels({ places, visible }) {
  const [placements, setPlacements] = useState({})
  const map = useMapEvents({
    moveend: () => updatePlacements(),
    resize: () => updatePlacements(),
    zoomend: () => updatePlacements(),
  })

  const updatePlacements = useCallback(() => {
    if (!visible || places.length === 0) {
      setPlacements({})
      return
    }

    const mapSize = map.getSize()
    const nextPlacements = {}

    for (const checkin of places) {
      const point = map.latLngToContainerPoint([checkin.latitude, checkin.longitude])
      nextPlacements[checkin.id] = chooseLabelPlacement(point, mapSize)
    }

    setPlacements(nextPlacements)
  }, [map, places, visible])

  useEffect(() => {
    updatePlacements()
  }, [updatePlacements])

  if (!visible) {
    return null
  }

  return places.map((checkin) => (
    <CheckinPlaceLabel
      key={`${checkin.id}-label`}
      checkin={checkin}
      placement={placements[checkin.id] ?? 'right'}
    />
  ))
}

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

function splitTooltipTwoLines(text, maxLineLength = 14) {
  const cleaned = text.trim()

  // Text ngắn -> giữ nguyên 1 dòng
  if (cleaned.length <= maxLineLength) {
    return [cleaned]
  }

  const words = cleaned.split(/\s+/)

  // Ít từ quá -> không split
  if (words.length <= 2) {
    return [cleaned]
  }

  let bestIndex = 1
  let bestScore = Infinity

  for (let i = 1; i < words.length; i++) {
    const line1 = words.slice(0, i).join(' ')
    const line2 = words.slice(i).join(' ')

    // Không cho 1 dòng quá ngắn
    if (line1.length < 4 || line2.length < 4) {
      continue
    }

    const diff = Math.abs(line1.length - line2.length)

    // Ưu tiên cân bằng chiều dài
    let score = diff

    // Phạt nếu dòng quá dài
    if (line1.length > maxLineLength) {
      score += (line1.length - maxLineLength) * 2
    }

    if (line2.length > maxLineLength) {
      score += (line2.length - maxLineLength) * 2
    }

    // Tránh split sau ký tự "-"
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

const CheckinPlaceLabel = memo(function CheckinPlaceLabel({ checkin, placement }) {
  const labelIcon = useMemo(() => createCheckinLabelAnchorIcon(checkin), [checkin])

  const lines = splitTooltipTwoLines(checkin.locationName)

  if (!labelIcon) {
    return null
  }

  const normalizedPlacement = LABEL_TOOLTIP_OFFSETS[placement] ? placement : 'right'

  return (
    <Marker
      position={[checkin.latitude, checkin.longitude]}
      icon={labelIcon}
      interactive={false}
      keyboard={false}
      zIndexOffset={-20}
    >
      <Tooltip
        // className={cx('checkin-place-label-tooltip', `label-${normalizedPlacement}`)}
        className={cx('google-map-tooltip')}
        direction={LABEL_TOOLTIP_DIRECTIONS[normalizedPlacement]}
        offset={LABEL_TOOLTIP_OFFSETS[normalizedPlacement]}
        opacity={1}
        permanent
      >
        <div
          // className={cx('explory-marker-label-text')}
          className={cx('google-map-label')}
        >
          {/* {checkin.locationName} */}
          {lines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </Tooltip>
    </Marker>
  )
})

const CheckinMarkers = memo(function CheckinMarkers({
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

export function CheckinMap() {
  const [activeId, setActiveId] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [initialMediaIndex, setInitialMediaIndex] = useState(null)
  const [drawerMode, setDrawerMode] = useState(null)
  const [hoveredPreviewId, setHoveredPreviewId] = useState(null)
  const [showPlaceLabels, setShowPlaceLabels] = useState(DEFAULT_ZOOM >= PLACE_LABEL_MIN_ZOOM)
  const hoverCloseTimerRef = useRef(null)

  const filteredCheckins = useMemo(
    () =>
      checkins.filter((checkin) => {
        const matchesCategory = categoryFilter === 'all' || checkin.categoryId === categoryFilter

        return matchesCategory
      }),
    [categoryFilter]
  )

  const mapPlaces = useMemo(() => {
    const places = new Map()

    for (const checkin of filteredCheckins) {
      const current = places.get(checkin.locationName)

      if (
        !current ||
        new Date(checkin.checkinTime).getTime() > new Date(current.checkinTime).getTime()
      ) {
        places.set(checkin.locationName, checkin)
      }
    }

    return [...places.values()]
  }, [filteredCheckins])

  const clusterablePlaces = useMemo(
    () => mapPlaces.filter((checkin) => checkin.categoryId !== 'home'),
    [mapPlaces]
  )
  const standalonePlaces = useMemo(
    () => mapPlaces.filter((checkin) => checkin.categoryId === 'home'),
    [mapPlaces]
  )

  const activeCheckin = useMemo(
    () => (activeId ? (filteredCheckins.find((checkin) => checkin.id === activeId) ?? null) : null),
    [activeId, filteredCheckins]
  )

  useEffect(() => {
    return () => {
      if (hoverCloseTimerRef.current) {
        globalThis.clearTimeout(hoverCloseTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const activeStillVisible =
      !activeId || filteredCheckins.some((checkin) => checkin.id === activeId)
    const previewStillVisible =
      !hoveredPreviewId || filteredCheckins.some((checkin) => checkin.id === hoveredPreviewId)

    if (!activeStillVisible) {
      setActiveId(null)
      setInitialMediaIndex(null)
      setDrawerMode(null)
    }

    if (!previewStillVisible) {
      setHoveredPreviewId(null)
    }
  }, [activeId, filteredCheckins, hoveredPreviewId])

  const keepPreviewOpen = useCallback(() => {
    if (hoverCloseTimerRef.current) {
      globalThis.clearTimeout(hoverCloseTimerRef.current)
      hoverCloseTimerRef.current = null
    }
  }, [])

  const showHoverPreview = useCallback(
    (checkinId) => {
      keepPreviewOpen()
      setHoveredPreviewId(checkinId)
    },
    [keepPreviewOpen]
  )

  const scheduleCloseHoverPreview = useCallback(() => {
    keepPreviewOpen()
    hoverCloseTimerRef.current = globalThis.setTimeout(() => {
      setHoveredPreviewId(null)
    }, 180)
  }, [keepPreviewOpen])

  const openAddMemoryDrawer = useCallback(() => {
    setActiveId(null)
    setInitialMediaIndex(null)
    setDrawerMode('add')
  }, [])

  const openMemoryDetail = useCallback(
    (checkinId, mediaIndex = null) => {
      keepPreviewOpen()
      setActiveId(checkinId)
      setInitialMediaIndex(mediaIndex)
      setHoveredPreviewId(null)
      setDrawerMode('memory')
    },
    [keepPreviewOpen]
  )

  const closeDrawer = useCallback(() => {
    setDrawerMode(null)
    setHoveredPreviewId(null)
    setInitialMediaIndex(null)

    if (drawerMode === 'memory') {
      setActiveId(null)
    }
  }, [drawerMode])

  return (
    <section className={cx('map-workspace')}>
      <div className={cx('map-body')}>
        <div className={cx('leaflet-map-shell')}>
          {checkins.length > 0 ? (
            <>
              <MapFilterPanel
                categoryId={categoryFilter}
                totalCount={checkins.length}
                visibleCount={filteredCheckins.length}
                onCategoryChange={setCategoryFilter}
              />
              <MapContainer
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                minZoom={4}
                maxZoom={18}
                attributionControl={false}
                zoomControl={false}
                scrollWheelZoom
                className={cx('checkin-leaflet-map', showPlaceLabels && 'show-place-labels')}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapZoomWatcher onPlaceLabelVisibilityChange={setShowPlaceLabels} />
                <MapControls
                  activeCheckin={activeCheckin}
                  visibleCheckins={mapPlaces}
                  onAddMemory={openAddMemoryDrawer}
                />

                {USE_MARKER_CLUSTERING ? (
                  <MarkerClusterGroup
                    chunkedLoading
                    disableClusteringAtZoom={MARKER_CLUSTER_DISABLE_AT_ZOOM}
                    iconCreateFunction={createCheckinClusterIcon}
                    removeOutsideVisibleBounds
                    showCoverageOnHover={false}
                    spiderfyOnEveryZoom={false}
                    spiderfyOnMaxZoom={SHOW_CLUSTER_LOCATIONS_ON_CLICK}
                    zoomToBoundsOnClick={ZOOM_TO_CLUSTER_BOUNDS_ON_CLICK}
                    maxClusterRadius={54}
                  >
                    <CheckinMarkers
                      checkins={clusterablePlaces}
                      drawerMode={drawerMode}
                      activeId={activeId}
                      hoveredPreviewId={hoveredPreviewId}
                      onOpenMemoryDetail={openMemoryDetail}
                      onShowHoverPreview={showHoverPreview}
                      onScheduleCloseHoverPreview={scheduleCloseHoverPreview}
                      onKeepPreviewOpen={keepPreviewOpen}
                    />
                  </MarkerClusterGroup>
                ) : (
                  <CheckinMarkers
                    checkins={clusterablePlaces}
                    drawerMode={drawerMode}
                    activeId={activeId}
                    hoveredPreviewId={hoveredPreviewId}
                    onOpenMemoryDetail={openMemoryDetail}
                    onShowHoverPreview={showHoverPreview}
                    onScheduleCloseHoverPreview={scheduleCloseHoverPreview}
                    onKeepPreviewOpen={keepPreviewOpen}
                  />
                )}
                <CheckinMarkers
                  checkins={standalonePlaces}
                  drawerMode={drawerMode}
                  activeId={activeId}
                  hoveredPreviewId={hoveredPreviewId}
                  onOpenMemoryDetail={openMemoryDetail}
                  onShowHoverPreview={showHoverPreview}
                  onScheduleCloseHoverPreview={scheduleCloseHoverPreview}
                  onKeepPreviewOpen={keepPreviewOpen}
                />
                <AdaptivePlaceLabels places={mapPlaces} visible={showPlaceLabels} />
              </MapContainer>
              {/* {mapPlaces.length === 0 ? (
                <div className={cx('map-empty-state map-filter-empty-state')}>
                  <h2>Không có kỷ niệm phù hợp</h2>
                  <p>Thử đổi nhóm để xem lại hành trình khác.</p>
                </div>
              ) : null} */}
            </>
          ) : (
            <div className={cx('map-empty-state')}>
              <h2>Chưa có kỷ niệm phù hợp</h2>
              <p>Thử đổi bộ lọc nhóm hoặc cảm xúc.</p>
            </div>
          )}
        </div>

        {drawerMode === 'add' ? <AddMemoryDrawer onClose={closeDrawer} /> : null}
        {drawerMode === 'memory' ? (
          <MemoryDetailDrawer
            checkin={activeCheckin}
            initialMediaIndex={initialMediaIndex}
            onClose={closeDrawer}
          />
        ) : null}
      </div>
    </section>
  )
}
