'use client'

import { useState } from 'react'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { MapContainer, TileLayer } from 'react-leaflet'

import { CheckinMarkers } from '@/features/map/components/checkin-markers'
import { MapControls } from '@/features/map/components/map-controls'
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_KEEP_BUFFER,
  MAP_TILE_MAX_ZOOM,
  MAP_TILE_UPDATE_WHEN_IDLE,
  MAP_TILE_UPDATE_WHEN_ZOOMING,
  MAP_TILE_URL,
  MARKER_CLUSTER_DISABLE_AT_ZOOM,
  MOBILE_HO_CHI_MINH_ZOOM,
  MOBILE_MAP_MEDIA_QUERY,
  SHOW_CLUSTER_LOCATIONS_ON_CLICK,
  USE_MARKER_CLUSTERING,
  ZOOM_TO_CLUSTER_BOUNDS_ON_CLICK,
} from '@/features/map/constants/map.constants'
import { MapPreviewDismissWatcher, MapZoomWatcher } from '@/features/map/components/map-events'
import { MapFilterPanel } from '@/features/map/components/map-filter-panel'
import { AdaptivePlaceLabels } from '@/features/map/components/map-place-labels'
import { MapPlaceSearch } from '@/features/map/components/map-place-search'
import { createCheckinClusterIcon } from '@/features/map/utils/map.utils'
import { useCheckinMapState } from '@/features/map/hooks/use-checkin-map-state'
import { AddMemoryDrawer, MemoryDetailDrawer } from '@/features/memory'
import { cx } from '@/shared/lib/styles'

function getInitialMapZoom() {
  return globalThis.matchMedia?.(MOBILE_MAP_MEDIA_QUERY).matches
    ? MOBILE_HO_CHI_MINH_ZOOM
    : DEFAULT_ZOOM
}

export function CheckinMap() {
  const [initialZoom] = useState(getInitialMapZoom)
  const {
    activeCheckin,
    activeId,
    categoryFilter,
    closeDrawer,
    closeHoverPreview,
    clusterablePlaces,
    drawerMode,
    filteredCheckins,
    hoveredPreviewId,
    initialMediaIndex,
    keepPreviewOpen,
    mapPlaces,
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

  return (
    <section className={cx('map-workspace')}>
      <div className={cx('map-body')}>
        <div className={cx('leaflet-map-shell')}>
          {totalCheckinCount > 0 ? (
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={initialZoom}
              minZoom={4}
              maxZoom={18}
              attributionControl={false}
              zoomControl={false}
              scrollWheelZoom
              className={cx('checkin-leaflet-map', showPlaceLabels && 'show-place-labels')}
            >
              <MapFilterPanel
                categoryId={categoryFilter}
                totalCount={totalCheckinCount}
                visibleCount={filteredCheckins.length}
                onCategoryChange={setCategoryFilter}
              />
              <TileLayer
                attribution={MAP_TILE_ATTRIBUTION}
                detectRetina
                keepBuffer={MAP_TILE_KEEP_BUFFER}
                maxZoom={MAP_TILE_MAX_ZOOM}
                updateWhenIdle={MAP_TILE_UPDATE_WHEN_IDLE}
                updateWhenZooming={MAP_TILE_UPDATE_WHEN_ZOOMING}
                url={MAP_TILE_URL}
              />
              <MapZoomWatcher onPlaceLabelVisibilityChange={setShowPlaceLabels} />
              <MapPreviewDismissWatcher onDismissPreview={closeHoverPreview} />
              <MapControls activeCheckin={activeCheckin} visibleCheckins={mapPlaces} />
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
                  <CheckinMarkers checkins={clusterablePlaces} {...markerProps} />
                </MarkerClusterGroup>
              ) : (
                <CheckinMarkers checkins={clusterablePlaces} {...markerProps} />
              )}
              <CheckinMarkers checkins={standalonePlaces} {...markerProps} />
              <AdaptivePlaceLabels places={mapPlaces} visible={showPlaceLabels} />
            </MapContainer>
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
