/** @type {[number, number]} Latitude/longitude center for the initial map viewport. */
export const DEFAULT_CENTER = [10.7757, 106.7004]

/** Initial desktop zoom level before responsive map adjustments run. */
export const DEFAULT_ZOOM = 11

/** Zoom level that keeps Ho Chi Minh City markers readable on narrow screens. */
export const MOBILE_HO_CHI_MINH_ZOOM = 13

/** Media query shared by map viewport logic and responsive controls. */
export const MOBILE_MAP_MEDIA_QUERY = '(max-width: 820px)'

/** Minimum zoom at which individual place labels can be shown without clutter. */
export const PLACE_LABEL_MIN_ZOOM = 18

/** Bump this when marker SVG internals change and cached browser assets need a new key. */
export const REACTION_MARKER_ICON_VERSION = 1

export const MAP_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
export const MAP_TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors'
export const MAP_TILE_MAX_ZOOM = 19
export const MAP_TILE_KEEP_BUFFER = 4
export const MAP_TILE_UPDATE_WHEN_IDLE = true
export const MAP_TILE_UPDATE_WHEN_ZOOMING = false

export const MAP_STYLE = {
  version: 8,
  sources: {
    openStreetMap: {
      type: 'raster',
      tiles: [MAP_TILE_URL],
      tileSize: 256,
      attribution: MAP_TILE_ATTRIBUTION,
      maxzoom: MAP_TILE_MAX_ZOOM,
    },
  },
  layers: [
    {
      id: 'open-street-map',
      type: 'raster',
      source: 'openStreetMap',
    },
  ],
}
