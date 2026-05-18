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
  createCheckinLabelIcon,
} from '@/features/map/components/map.utils'
import { MapControls } from '@/features/map/components/map-controls'
import { MapFilterPanel } from '@/features/map/components/map-filter-panel'
import { AddMemoryDrawer, MemoryDetailDrawer, MemoryHoverPreview } from '@/features/memory'
import { checkins } from '@/entities/memory'
import { cx } from '@/shared/lib/styles'

const LABEL_BOX_WIDTH = 132
const LABEL_BOX_HEIGHT = 44
const MARKER_BOX_WIDTH = 44
const MARKER_BOX_HEIGHT = 54
const LABEL_VIEWPORT_PADDING = 8
const LABEL_HORIZONTAL_GAP = 18
const LABEL_PLACEMENTS = [
  { id: 'right', dx: LABEL_HORIZONTAL_GAP, dy: -46 },
  { id: 'left', dx: -(LABEL_BOX_WIDTH + LABEL_HORIZONTAL_GAP), dy: -46 },
  { id: 'top-right', dx: 10, dy: -(LABEL_BOX_HEIGHT + 56) },
  { id: 'bottom-right', dx: 10, dy: 8 },
  { id: 'top-left', dx: -(LABEL_BOX_WIDTH + 10), dy: -(LABEL_BOX_HEIGHT + 56) },
  { id: 'bottom-left', dx: -(LABEL_BOX_WIDTH + 10), dy: 8 },
]

function boxesOverlap(first, second) {
  return (
    first.left < second.right &&
    first.right > second.left &&
    first.top < second.bottom &&
    first.bottom > second.top
  )
}

function createBox(left, top, width, height) {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
  }
}

function scoreLabelBox(box, occupiedBoxes, markerBoxes, mapSize) {
  let score = 0

  if (box.left < LABEL_VIEWPORT_PADDING) {
    score += (LABEL_VIEWPORT_PADDING - box.left) * 3
  }

  if (box.top < LABEL_VIEWPORT_PADDING) {
    score += (LABEL_VIEWPORT_PADDING - box.top) * 3
  }

  if (box.right > mapSize.x - LABEL_VIEWPORT_PADDING) {
    score += (box.right - (mapSize.x - LABEL_VIEWPORT_PADDING)) * 3
  }

  if (box.bottom > mapSize.y - LABEL_VIEWPORT_PADDING) {
    score += (box.bottom - (mapSize.y - LABEL_VIEWPORT_PADDING)) * 3
  }

  for (const occupiedBox of occupiedBoxes) {
    if (boxesOverlap(box, occupiedBox)) {
      score += 1000
    }
  }

  for (const markerBox of markerBoxes) {
    if (boxesOverlap(box, markerBox)) {
      score += 650
    }
  }

  return score
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
  const placementsRef = useRef({})
  const map = useMapEvents({
    moveend: () => updatePlacements(),
    resize: () => updatePlacements(),
    zoomend: () => updatePlacements(),
  })

  const updatePlacements = useCallback(() => {
    if (!visible || places.length === 0) {
      placementsRef.current = {}
      setPlacements({})
      return
    }

    const mapSize = map.getSize()
    const projectedPlaces = places.map((checkin) => ({
      checkin,
      point: map.latLngToContainerPoint([checkin.latitude, checkin.longitude]),
    }))
    const markerBoxes = projectedPlaces.map(({ point }) =>
      createBox(point.x - MARKER_BOX_WIDTH / 2, point.y - MARKER_BOX_HEIGHT, MARKER_BOX_WIDTH, MARKER_BOX_HEIGHT),
    )
    const nextPlacements = {}
    const occupiedBoxes = []

    for (const [placeIndex, { checkin, point }] of projectedPlaces.entries()) {
      const previousPlacementId = placementsRef.current[checkin.id]
      const sortedPlacements = previousPlacementId
        ? [
            LABEL_PLACEMENTS.find((placement) => placement.id === previousPlacementId),
            ...LABEL_PLACEMENTS.filter((placement) => placement.id !== previousPlacementId),
          ].filter(Boolean)
        : LABEL_PLACEMENTS
      let selectedPlacement = sortedPlacements[0]
      let selectedBox = null
      let selectedScore = Number.POSITIVE_INFINITY

      for (const placement of sortedPlacements) {
        const box = createBox(
          point.x + placement.dx,
          point.y + placement.dy,
          LABEL_BOX_WIDTH,
          LABEL_BOX_HEIGHT,
        )
        const score = scoreLabelBox(
          box,
          occupiedBoxes,
          markerBoxes.filter((_, markerIndex) => markerIndex !== placeIndex),
          mapSize,
        )

        if (score < selectedScore) {
          selectedPlacement = placement
          selectedBox = box
          selectedScore = score
        }

        if (score === 0) {
          break
        }
      }

      nextPlacements[checkin.id] = selectedPlacement.id

      if (selectedBox) {
        occupiedBoxes.push(selectedBox)
      }
    }

    placementsRef.current = nextPlacements
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
    [checkin, isActive],
  )
  const eventHandlers = useMemo(
    () => ({
      click: () => onOpenMemoryDetail(checkin.id),
      mouseover: () => onShowHoverPreview(checkin.id),
      mouseout: onScheduleCloseHoverPreview,
    }),
    [checkin.id, onOpenMemoryDetail, onScheduleCloseHoverPreview, onShowHoverPreview],
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

const CheckinPlaceLabel = memo(function CheckinPlaceLabel({ checkin, placement }) {
  const labelIcon = useMemo(() => createCheckinLabelIcon(checkin, placement), [checkin, placement])

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
    />
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
      isActive={(drawerMode === 'memory' && checkin.id === activeId) || checkin.id === hoveredPreviewId}
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
    [mapPlaces],
  )
  const standalonePlaces = useMemo(
    () => mapPlaces.filter((checkin) => checkin.categoryId === 'home'),
    [mapPlaces],
  )

  const activeCheckin = useMemo(
    () =>
      activeId
        ? (filteredCheckins.find((checkin) => checkin.id === activeId) ?? null)
        : null,
    [activeId, filteredCheckins],
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

  const showHoverPreview = useCallback((checkinId) => {
    keepPreviewOpen()
    setHoveredPreviewId(checkinId)
  }, [keepPreviewOpen])

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

  const openMemoryDetail = useCallback((checkinId, mediaIndex = null) => {
    keepPreviewOpen()
    setActiveId(checkinId)
    setInitialMediaIndex(mediaIndex)
    setHoveredPreviewId(null)
    setDrawerMode('memory')
  }, [keepPreviewOpen])

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
              {mapPlaces.length === 0 ? (
                <div className={cx('map-empty-state map-filter-empty-state')}>
                  <h2>Không có kỷ niệm phù hợp</h2>
                  <p>Thử đổi nhóm để xem lại hành trình khác.</p>
                </div>
              ) : null}
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
