/** @type {[number, number]} Latitude/longitude center for the initial map viewport. */
export const DEFAULT_CENTER = [10.7757, 106.7004]

/** Initial desktop zoom level before responsive map adjustments run. */
export const DEFAULT_ZOOM = 11

/** Zoom level that keeps Ho Chi Minh City markers readable on narrow screens. */
export const MOBILE_HO_CHI_MINH_ZOOM = 13

/** Media query shared by map viewport logic and responsive controls. */
export const MOBILE_MAP_MEDIA_QUERY = '(max-width: 820px)'

/** Minimum zoom at which individual place labels can be shown without clutter. */
export const PLACE_LABEL_MIN_ZOOM = 15

/** Bump this when marker SVG internals change and cached browser assets need a new key. */
export const REACTION_MARKER_ICON_VERSION = 1

export const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty'
