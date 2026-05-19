'use client'

import { useCallback, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import MaplibreMap, { AttributionControl } from 'react-map-gl/maplibre'

import { CheckinMarkers } from '@/features/map/components/checkin-markers'
import { MapControls } from '@/features/map/components/map-controls'
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MAP_STYLE,
  MAP_TILE_ATTRIBUTION,
  MOBILE_HO_CHI_MINH_ZOOM,
  MOBILE_MAP_MEDIA_QUERY,
  PLACE_LABEL_MIN_ZOOM,
} from '@/features/map/constants/map.constants'
import { MapFilterPanel } from '@/features/map/components/map-filter-panel'
import { AdaptivePlaceLabels } from '@/features/map/components/map-place-labels'
import { MapPlaceSearch } from '@/features/map/components/map-place-search'
import { useCheckinMapState } from '@/features/map/hooks/use-checkin-map-state'
import { AddMemoryDrawer, MemoryDetailDrawer } from '@/features/memory'
import styles from './checkin-map.module.css'

function getInitialMapZoom() {
  return globalThis.matchMedia?.(MOBILE_MAP_MEDIA_QUERY).matches
    ? MOBILE_HO_CHI_MINH_ZOOM
    : DEFAULT_ZOOM
}

export function CheckinMap() {
  const [initialZoom] = useState(getInitialMapZoom)
  const [map, setMap] = useState(null)
  const mapRef = useRef(null)
  const {
    activeCheckin,
    activeId,
    categoryFilter,
    closeDrawer,
    closeHoverPreview,
    drawerMode,
    filteredCheckins,
    hoveredPreviewId,
    initialMediaIndex,
    keepPreviewOpen,
    mapPlaces,
    memoryPlaces,
    openMemoryDetail,
    scheduleCloseHoverPreview,
    setCategoryFilter,
    setShowPlaceLabels,
    showHoverPreview,
    showPlaceLabels,
    standalonePlaces,
    totalCheckinCount,
  } = useCheckinMapState()

  const markerProps = {
    activeId,
    drawerMode,
    hoveredPreviewId,
    onKeepPreviewOpen: keepPreviewOpen,
    onOpenMemoryDetail: openMemoryDetail,
    onScheduleCloseHoverPreview: scheduleCloseHoverPreview,
    onShowHoverPreview: showHoverPreview,
  }
  const syncPlaceLabelVisibility = useCallback(
    (mapInstance) => {
      onMapZoomChange(mapInstance, setShowPlaceLabels)
    },
    [setShowPlaceLabels]
  )

  const handleMapLoad = useCallback(
    (event) => {
      setMap(event.target)
      syncPlaceLabelVisibility(event.target)
    },
    [syncPlaceLabelVisibility]
  )

  const handleZoomEnd = useCallback(
    (event) => {
      syncPlaceLabelVisibility(event.target)
    },
    [syncPlaceLabelVisibility]
  )

  return (
    <section className={styles.workspace}>
      <div className={styles.body}>
        <div className={styles.shell}>
          {totalCheckinCount > 0 ? (
            <MaplibreMap
              ref={mapRef}
              mapLib={maplibregl}
              initialViewState={{
                latitude: DEFAULT_CENTER[0],
                longitude: DEFAULT_CENTER[1],
                zoom: initialZoom,
              }}
              mapStyle={MAP_STYLE}
              minZoom={4}
              maxZoom={18}
              attributionControl={false}
              dragRotate={false}
              pitchWithRotate={false}
              touchPitch={false}
              className={styles.map}
              onClick={closeHoverPreview}
              onDragStart={closeHoverPreview}
              onLoad={handleMapLoad}
              onZoomEnd={handleZoomEnd}
              reuseMaps
            >
              <AttributionControl
                compact
                customAttribution={MAP_TILE_ATTRIBUTION}
                position="bottom-left"
              />
              <MapFilterPanel
                categoryId={categoryFilter}
                totalCount={totalCheckinCount}
                visibleCount={filteredCheckins.length}
                onCategoryChange={setCategoryFilter}
              />
              <MapControls map={map} activeCheckin={activeCheckin} visibleCheckins={mapPlaces} />
              <MapPlaceSearch
                map={map}
                places={mapPlaces}
                onShowHoverPreview={showHoverPreview}
              />
              <CheckinMarkers checkins={memoryPlaces} {...markerProps} />
              <CheckinMarkers checkins={standalonePlaces} {...markerProps} />
              <AdaptivePlaceLabels map={map} places={mapPlaces} visible={showPlaceLabels} />
            </MaplibreMap>
          ) : (
            <div className={styles.emptyState}>
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

/**
 * @param {import("maplibre-gl").Map | null} map
 * @param {function(boolean): void} onPlaceLabelVisibilityChange
 * @returns {void}
 */
function onMapZoomChange(map, onPlaceLabelVisibilityChange) {
  if (!map) {
    return
  }

  onPlaceLabelVisibilityChange(map.getZoom() >= PLACE_LABEL_MIN_ZOOM)
}
