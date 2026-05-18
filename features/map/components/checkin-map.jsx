'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { MapContainer, Marker, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet'
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
import { MapPlaceSearch } from '@/features/map/components/map-place-search'
import { AddMemoryDrawer, MemoryDetailDrawer, MemoryHoverPreview } from '@/features/memory'
import { checkins } from '@/entities/memory'
import { cx } from '@/shared/lib/styles'

const LABEL_COLLISION_GAP = 4
const LABEL_TOOLTIP_OFFSET = [0, 8]

function doRectsCollide(first, second, gap = LABEL_COLLISION_GAP) {
  return !(
    first.right + gap <= second.left ||
    first.left >= second.right + gap ||
    first.bottom + gap <= second.top ||
    first.top >= second.bottom + gap
  )
}

function applyPlaceLabelCollisions(map) {
  const mapContainer = map.getContainer()
  const tooltipElements = [...mapContainer.querySelectorAll('.google-map-tooltip')]
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

function MapPreviewDismissWatcher({ onDismissPreview }) {
  useMapEvents({
    click: onDismissPreview,
    dragstart: onDismissPreview,
  })

  return null
}

function AdaptivePlaceLabels({ places, visible }) {
  const map = useMap()
  const rafIdsRef = useRef([])

  const cancelScheduledCollision = useCallback(() => {
    for (const rafId of rafIdsRef.current) {
      globalThis.cancelAnimationFrame(rafId)
    }

    rafIdsRef.current = []
  }, [])

  const scheduleCollisionUpdate = useCallback(() => {
    cancelScheduledCollision()

    if (!visible) {
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
    map.on('moveend zoomend resize', scheduleCollisionUpdate)

    return () => {
      map.off('moveend zoomend resize', scheduleCollisionUpdate)
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

const CheckinPlaceLabel = memo(function CheckinPlaceLabel({ checkin }) {
  const labelIcon = useMemo(() => createCheckinLabelAnchorIcon(checkin), [checkin])

  const lines = splitTooltipTwoLines(checkin.locationName)

  if (!labelIcon) {
    return null
  }

  return (
    <Marker
      position={[checkin.latitude, checkin.longitude]}
      icon={labelIcon}
      interactive={false}
      keyboard={false}
      zIndexOffset={-20}
    >
      <Tooltip
        className={cx('google-map-tooltip')}
        direction="bottom"
        offset={LABEL_TOOLTIP_OFFSET}
        opacity={1}
        permanent
      >
        <div
          className={cx('google-map-label')}
          data-label-priority={new Date(checkin.checkinTime).getTime()}
          data-map-place-label
        >
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

  const closeHoverPreview = useCallback(() => {
    keepPreviewOpen()
    setHoveredPreviewId(null)
  }, [keepPreviewOpen])

  const openAddMemoryDrawer = useCallback(() => {
    setActiveId(null)
    setInitialMediaIndex(null)
    setDrawerMode('add')
  }, [])

  useEffect(() => {
    const eventName = 'photo-mem:open-add-memory'

    function handleOpenAddMemory() {
      openAddMemoryDrawer()
    }

    globalThis.addEventListener(eventName, handleOpenAddMemory)

    if (sessionStorage.getItem(eventName) === '1') {
      sessionStorage.removeItem(eventName)
      openAddMemoryDrawer()
    }

    return () => globalThis.removeEventListener(eventName, handleOpenAddMemory)
  }, [openAddMemoryDrawer])

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
                <MapPreviewDismissWatcher onDismissPreview={closeHoverPreview} />
                <MapControls
                  activeCheckin={activeCheckin}
                  visibleCheckins={mapPlaces}
                />
                <MapPlaceSearch places={mapPlaces} onShowHoverPreview={showHoverPreview} />

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
