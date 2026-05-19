import { REACTION_MARKER_ICON_VERSION } from '@/features/map/constants/map.constants'
import { getCategory, getMood } from '@/entities/memory'

/**
 * @typedef {object} FitMapOptions
 * @property {[number, number]} [padding]
 * @property {number} [maxZoom]
 * @property {number} [zoom]
 */

const moodMarkerIconsV1 = {
  chill: `
    <svg class="reaction-icon reaction-smile" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <circle cx="8.5" cy="10.2" r="1.1" fill="#4b2f13" />
      <circle cx="15.5" cy="10.2" r="1.1" fill="#4b2f13" />
      <path d="M8.2 14.8c2.1 1.5 5.5 1.5 7.6 0" fill="none" stroke="#4b2f13" stroke-linecap="round" stroke-width="1.8" />
    </svg>
  `,
  explore: `
    <svg class="reaction-icon reaction-wow" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <circle cx="8.5" cy="10" r="1.4" fill="#4b2f13" />
      <circle cx="15.5" cy="10" r="1.4" fill="#4b2f13" />
      <ellipse cx="12" cy="15.5" rx="2.1" ry="2.7" fill="#4b2f13" />
    </svg>
  `,
  happy: `
    <svg class="reaction-icon reaction-haha" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <path d="M7.2 9.5c1.1.9 2.1.9 3.2 0M13.6 9.5c1.1.9 2.1.9 3.2 0" fill="none" stroke="#4b2f13" stroke-linecap="round" stroke-width="1.8" />
      <path d="M7.7 13.9c1.1 3.2 7.5 3.2 8.6 0Z" fill="#4b2f13" />
      <path d="M9.2 15.4c1.6.9 4 .9 5.6 0" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.1" opacity=".72" />
    </svg>
  `,
  memorable: `
    <svg class="reaction-icon reaction-like" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#2f80ed" />
      <path d="M6.1 10.9h3v7h-3Z" fill="#d8eaff" opacity=".96" />
      <path d="M9.1 10.8c1.2-1.2 2-2.8 2.4-4.6.1-.5.5-.9 1-.9 1.2 0 2.1 1 1.9 2.2l-.3 1.8h3.7c1 0 1.7.9 1.5 1.8l-.9 4.9c-.2 1.1-1.1 1.9-2.2 1.9H9.1Z" fill="#fff" />
      <path d="M9.1 10.8v7.1M14.1 9.3h3.7" fill="none" stroke="#cfe2ff" stroke-linecap="round" stroke-width="1" opacity=".8" />
    </svg>
  `,
  peaceful: `
    <svg class="reaction-icon reaction-sad" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <circle cx="8.4" cy="10.2" r="1.1" fill="#4b2f13" />
      <circle cx="15.6" cy="10.2" r="1.1" fill="#4b2f13" />
      <path d="M8.5 15.8c1.9-1.4 5.1-1.4 7 0" fill="none" stroke="#4b2f13" stroke-linecap="round" stroke-width="1.8" />
      <path class="reaction-tear" d="M17.5 12.3c1.5 1.6 2.1 2.8 2.1 3.8a2.1 2.1 0 0 1-4.2 0c0-1 .6-2.2 2.1-3.8Z" fill="#4fc3f7" stroke="#1b75bb" stroke-linejoin="round" stroke-width=".8" />
    </svg>
  `,
  romantic: `
    <svg class="reaction-icon reaction-love" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f33e58" />
      <path d="M12 18.5S6.1 14.9 6.1 10.7c0-1.9 1.3-3.2 3-3.2 1.1 0 2.1.6 2.9 1.6.8-1 1.8-1.6 2.9-1.6 1.7 0 3 1.3 3 3.2 0 4.2-5.9 7.8-5.9 7.8Z" fill="#fff" />
    </svg>
  `,
  sad: `
    <svg class="reaction-icon reaction-sad" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <circle cx="8.4" cy="10.2" r="1.1" fill="#4b2f13" />
      <circle cx="15.6" cy="10.2" r="1.1" fill="#4b2f13" />
      <path d="M8.5 15.8c1.9-1.4 5.1-1.4 7 0" fill="none" stroke="#4b2f13" stroke-linecap="round" stroke-width="1.8" />
      <path class="reaction-tear" d="M17.5 12.3c1.5 1.6 2.1 2.8 2.1 3.8a2.1 2.1 0 0 1-4.2 0c0-1 .6-2.2 2.1-3.8Z" fill="#4fc3f7" stroke="#1b75bb" stroke-linejoin="round" stroke-width=".8" />
    </svg>
  `,
}

const moodMarkerIconsV2 = {
  chill: `
    <svg class="reaction-icon reaction-smile" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="chillFace" cx="34%" cy="26%" r="76%">
          <stop stop-color="#fff7b3"/>
          <stop offset=".42" stop-color="#ffd95a"/>
          <stop offset="1" stop-color="#f7a928"/>
        </radialGradient>
        <linearGradient id="chillShade" x1="8" x2="16" y1="14" y2="18" gradientUnits="userSpaceOnUse">
          <stop stop-color="#7c4a15"/>
          <stop offset="1" stop-color="#5c3510"/>
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#chillFace)" />
      <ellipse cx="8.6" cy="10.2" rx="1.15" ry="1.35" fill="#5c3510" />
      <ellipse cx="15.4" cy="10.2" rx="1.15" ry="1.35" fill="#5c3510" />
      <path d="M7.8 14.3c2.2 1.65 6.2 1.65 8.4 0" fill="none" stroke="url(#chillShade)" stroke-linecap="round" stroke-width="1.9" />
      <ellipse cx="8.1" cy="6.8" rx="2.2" ry=".9" fill="#fff8d6" opacity=".58" transform="rotate(-24 8.1 6.8)" />
    </svg>
  `,
  explore: `
    <svg class="reaction-icon reaction-wow" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="wowFace" cx="34%" cy="26%" r="76%">
          <stop stop-color="#fff4ad"/>
          <stop offset=".45" stop-color="#ffc94a"/>
          <stop offset="1" stop-color="#f59b1a"/>
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#wowFace)" />
      <ellipse cx="8.45" cy="9.6" rx="1.45" ry="1.8" fill="#56320e" />
      <ellipse cx="15.55" cy="9.6" rx="1.45" ry="1.8" fill="#56320e" />
      <ellipse cx="12" cy="15.15" rx="2.45" ry="3.05" fill="#56320e" />
      <ellipse cx="11.25" cy="14.1" rx=".7" ry=".42" fill="#8a5518" opacity=".54" />
      <ellipse cx="8.1" cy="6.7" rx="2.2" ry=".85" fill="#fff8d6" opacity=".55" transform="rotate(-24 8.1 6.7)" />
    </svg>
  `,
  happy: `
    <svg class="reaction-icon reaction-haha" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="laughFace" cx="34%" cy="25%" r="77%">
          <stop stop-color="#fff3aa"/>
          <stop offset=".44" stop-color="#ffd246"/>
          <stop offset="1" stop-color="#f69b18"/>
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#laughFace)" />
      <path d="M6.9 9.35c1.08 1.05 2.3 1.05 3.38 0M13.72 9.35c1.08 1.05 2.3 1.05 3.38 0" fill="none" stroke="#573410" stroke-linecap="round" stroke-width="1.85" />
      <path d="M7.45 13.25h9.1c-.38 3.1-2.1 4.7-4.55 4.7s-4.17-1.6-4.55-4.7Z" fill="#573410" />
      <path d="M9 15.35c1.65.82 4.35.82 6 0" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.15" opacity=".86" />
      <ellipse cx="8.1" cy="6.75" rx="2.2" ry=".85" fill="#fff8d6" opacity=".56" transform="rotate(-24 8.1 6.75)" />
    </svg>
  `,
  memorable: `
    <svg class="reaction-icon reaction-like" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="likeBadge" cx="32%" cy="24%" r="78%">
          <stop stop-color="#7cc4ff"/>
          <stop offset=".45" stop-color="#2f8df1"/>
          <stop offset="1" stop-color="#1767d1"/>
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#likeBadge)" />
      <path d="M6.4 10.7h2.75v7H6.4Z" fill="#dcebff" opacity=".98" />
      <path d="M9.15 10.65c1.18-1.14 1.96-2.58 2.32-4.3.12-.56.54-.95 1.08-.95 1.18 0 2.03 1.02 1.82 2.18l-.33 1.75h3.6c.98 0 1.68.9 1.47 1.85l-.95 4.46c-.25 1.18-1.18 2.06-2.4 2.06H9.15Z" fill="#fff" />
      <path d="M9.15 10.65v7.05" fill="none" stroke="#cae1ff" stroke-linecap="round" stroke-width=".9" />
      <ellipse cx="8.3" cy="6.8" rx="2.35" ry=".78" fill="#dff0ff" opacity=".5" transform="rotate(-24 8.3 6.8)" />
    </svg>
  `,
  peaceful: `
    <svg class="reaction-icon reaction-sad" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="peaceFace" cx="34%" cy="25%" r="77%">
          <stop stop-color="#fff1a8"/>
          <stop offset=".43" stop-color="#ffd25c"/>
          <stop offset="1" stop-color="#e9a533"/>
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#peaceFace)" />
      <path d="M7.2 10.1c.9-.65 1.82-.65 2.72 0M14.08 10.1c.9-.65 1.82-.65 2.72 0" fill="none" stroke="#5a3711" stroke-linecap="round" stroke-width="1.75" />
      <path d="M8.35 15c1.85 1.2 5.45 1.2 7.3 0" fill="none" stroke="#5a3711" stroke-linecap="round" stroke-width="1.65" opacity=".9" />
      <path d="M17.25 5.85c1.15.65 1.5 2 .92 3.1-.47.9-1.38 1.34-2.35 1.16.85-.55 1.23-1.38 1.02-2.34-.14-.65-.54-1.28-1.08-1.75.5-.28 1.04-.33 1.49-.17Z" fill="#fff6c9" opacity=".82" />
    </svg>
  `,
  romantic: `
    <svg class="reaction-icon reaction-love" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="loveBadge" cx="34%" cy="24%" r="78%">
          <stop stop-color="#ff8fac"/>
          <stop offset=".48" stop-color="#f43f66"/>
          <stop offset="1" stop-color="#c9184a"/>
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#loveBadge)" />
      <path d="M12 18.25S6.05 14.7 6.05 10.55c0-1.82 1.28-3.12 2.98-3.12 1.14 0 2.12.62 2.97 1.75.85-1.13 1.83-1.75 2.97-1.75 1.7 0 2.98 1.3 2.98 3.12 0 4.15-5.95 7.7-5.95 7.7Z" fill="#fff" />
      <ellipse cx="8.45" cy="6.55" rx="2.15" ry=".75" fill="#ffd9e3" opacity=".65" transform="rotate(-24 8.45 6.55)" />
    </svg>
  `,
  sad: `
    <svg class="reaction-icon reaction-sad" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="sadFace" cx="34%" cy="25%" r="77%">
          <stop stop-color="#fff1a8"/>
          <stop offset=".43" stop-color="#ffd15a"/>
          <stop offset="1" stop-color="#f0a022"/>
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#sadFace)" />
      <ellipse cx="8.5" cy="10.2" rx="1.12" ry="1.3" fill="#5a3711" />
      <ellipse cx="15.5" cy="10.2" rx="1.12" ry="1.3" fill="#5a3711" />
      <path d="M8.4 16.05c1.9-1.35 5.3-1.35 7.2 0" fill="none" stroke="#5a3711" stroke-linecap="round" stroke-width="1.8" />
      <path class="reaction-tear" d="M17.55 12.5c1.28 1.43 1.82 2.46 1.82 3.35a1.82 1.82 0 0 1-3.64 0c0-.89.54-1.92 1.82-3.35Z" fill="#72d7ff" stroke="#2196d3" stroke-width=".62" />
      <ellipse cx="8.1" cy="6.8" rx="2.15" ry=".78" fill="#fff8d6" opacity=".5" transform="rotate(-24 8.1 6.8)" />
    </svg>
  `,
}

const moodMarkerIcons = REACTION_MARKER_ICON_VERSION === 2 ? moodMarkerIconsV2 : moodMarkerIconsV1

const homeMarkerIcon = `
  <svg class="home-heart-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path class="home-heart-icon-main" d="M8.3 17.7S3.7 14.9 3.7 11.5c0-1.7 1.2-2.9 2.7-2.9.9 0 1.7.4 2.2 1.2.5-.8 1.3-1.2 2.2-1.2 1.5 0 2.7 1.2 2.7 2.9 0 3.4-5.2 6.2-5.2 6.2Z" fill="#ff5c8a" stroke="#b5164f" stroke-linejoin="round" stroke-width="1" />
    <path class="home-heart-icon-secondary" d="M15.6 14.8s-4.3-2.6-4.3-5.8c0-1.5 1.1-2.7 2.5-2.7.8 0 1.6.4 2.1 1.1.5-.7 1.3-1.1 2.1-1.1 1.4 0 2.5 1.2 2.5 2.7 0 3.2-4.9 5.8-4.9 5.8Z" fill="#ff8fb0" stroke="#b5164f" stroke-linejoin="round" stroke-width="1" />
  </svg>
`

const MARKER_ICON_WIDTH = 44
const MARKER_ICON_HEIGHT = 70
const MARKER_VIEWBOX_TOP_PADDING = 16
const MARKER_GRADIENT_START = '#a78bfa'
const MARKER_GRADIENT_END = '#6d28d9'
const MARKER_ACTIVE_GRADIENT_START = '#c4b5fd'
const MARKER_ACTIVE_GRADIENT_END = '#5b21b6'
const MARKER_ACTIVE_STROKE = '#4c1d95'
const HOME_MARKER_GRADIENT_START = '#ff8fb0'
const HOME_MARKER_GRADIENT_END = '#e83f72'
const HOME_MARKER_ACTIVE_GRADIENT_START = '#ff9fbd'
const HOME_MARKER_ACTIVE_GRADIENT_END = '#d91f62'
const HOME_MARKER_ACTIVE_STROKE = '#b5164f'
const checkinIconCache = new Map()

/**
 * @param {string} svg
 * @returns {string}
 */
function svgToDataUrl(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

/**
 * @param {string} svg
 * @returns {string}
 */
function getSvgContent(svg) {
  const match = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)

  return match ? match[1] : svg
}

/**
 * @param {string | number | null | undefined} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

/**
 * @param {string} moodId
 * @returns {string}
 */
function getReactionAnimationClass(moodId) {
  if (moodId === 'happy') {
    return 'reaction-motion reaction-happy'
  }

  if (moodId === 'romantic' || moodId === 'home') {
    return 'reaction-motion reaction-love-beat'
  }

  if (moodId === 'explore') {
    return 'reaction-motion reaction-pop'
  }

  if (moodId === 'memorable') {
    return 'reaction-motion reaction-bounce'
  }

  if (moodId === 'peaceful' || moodId === 'sad') {
    return 'reaction-motion reaction-sway'
  }

  return 'reaction-motion reaction-bob'
}

/**
 * @param {object} options
 * @param {string} options.moodIcon
 * @param {string} options.moodId
 * @param {boolean} options.isActive
 * @param {{ start: string, end: string, activeStart: string, activeEnd: string, activeStroke: string }} [options.pinColors]
 * @returns {string}
 */
function createMarkerSvg({ moodIcon, moodId, isActive, pinColors }) {
  const pinGradientStart = escapeHtml(
    isActive
      ? (pinColors?.activeStart ?? MARKER_ACTIVE_GRADIENT_START)
      : (pinColors?.start ?? MARKER_GRADIENT_START)
  )
  const pinGradientEnd = escapeHtml(
    isActive
      ? (pinColors?.activeEnd ?? MARKER_ACTIVE_GRADIENT_END)
      : (pinColors?.end ?? MARKER_GRADIENT_END)
  )
  const activeStroke = pinColors?.activeStroke ?? MARKER_ACTIVE_STROKE
  const pinStroke = escapeHtml(isActive ? activeStroke : '#ffffff')
  const activeShadowColor = escapeHtml(activeStroke)
  const reactionSvg = getSvgContent(moodIcon)
  const reactionAnimationClass = getReactionAnimationClass(moodId)
  const pinAnimationClass = isActive ? 'pin-art pin-art-active' : 'pin-art'
  const activeDropShadow = isActive
    ? `<feDropShadow dx="0" dy="5" stdDeviation="3.2" flood-color="${activeShadowColor}" flood-opacity="0.36"/>`
    : ''

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${MARKER_ICON_WIDTH}" height="${MARKER_ICON_HEIGHT}" viewBox="0 -${MARKER_VIEWBOX_TOP_PADDING} ${MARKER_ICON_WIDTH} ${MARKER_ICON_HEIGHT}">
      <defs>
        <filter id="pinShadow" x="-25%" y="-18%" width="150%" height="145%" color-interpolation-filters="sRGB">
          <feDropShadow dx="0" dy="3" stdDeviation="2.2" flood-color="#3c4043" flood-opacity="0.28"/>
          ${activeDropShadow}
        </filter>
        <linearGradient id="pinFill" x1="22" x2="22" y1="2" y2="52" gradientUnits="userSpaceOnUse">
          <stop stop-color="${pinGradientStart}"/>
          <stop offset="1" stop-color="${pinGradientEnd}"/>
        </linearGradient>
      </defs>
      <style>
        .reaction-motion,
        .pin-art,
        .reaction-tear,
        .home-heart-icon-main,
        .home-heart-icon-secondary {
          transform-box: fill-box;
          transform-origin: center;
        }

        .reaction-bob {
          animation: reaction-bob 2.4s ease-in-out infinite;
        }

        .pin-art-active {
          animation: pin-lift 560ms ease-in-out infinite alternate;
        }

        .reaction-happy {
          animation: reaction-happy 1.7s ease-in-out infinite;
        }

        .reaction-pop {
          animation: reaction-pop 1.8s ease-in-out infinite;
        }

        .reaction-bounce {
          animation: reaction-bounce 1.9s ease-in-out infinite;
        }

        .reaction-sway {
          animation: reaction-sway 2.2s ease-in-out infinite;
        }

        .reaction-love-beat {
          animation: reaction-love-beat 1.2s ease-in-out infinite;
        }

        .reaction-tear {
          animation: reaction-tear-drop 2.2s ease-in-out infinite;
        }

        .home-heart-icon-main {
          animation: reaction-love-beat 1.12s ease-in-out infinite;
        }

        .home-heart-icon-secondary {
          animation: reaction-love-beat 1.12s ease-in-out 120ms infinite;
        }

        @keyframes reaction-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.6px); }
        }

        @keyframes pin-lift {
          from { transform: translateY(0) scale(1); }
          to { transform: translateY(-7px) scale(1.13); }
        }

        @keyframes reaction-happy {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(-6deg); }
          60% { transform: rotate(6deg); }
        }

        @keyframes reaction-pop {
          0%, 100% { transform: scale(1); }
          45% { transform: scale(1.14); }
          72% { transform: scale(0.98); }
        }

        @keyframes reaction-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          45% { transform: translateY(-2px) scale(1.06); }
          75% { transform: translateY(0) scale(0.98); }
        }

        @keyframes reaction-sway {
          0%, 100% { transform: rotate(0deg); }
          35% { transform: rotate(-3.5deg); }
          70% { transform: rotate(3deg); }
        }

        @keyframes reaction-love-beat {
          0%, 100% { transform: scale(1); }
          42% { transform: scale(1.14); }
          70% { transform: scale(0.98); }
        }

        @keyframes reaction-tear-drop {
          0%, 58%, 100% { opacity: 1; transform: translateY(0); }
          78% { opacity: .78; transform: translateY(1.6px); }
        }
      </style>
      <g class="${pinAnimationClass}">
        <path d="M22 52C22 52 5 31.3 5 19C5 9.6 12.6 2 22 2S39 9.6 39 19C39 31.3 22 52 22 52Z" fill="url(#pinFill)" filter="url(#pinShadow)"/>
        <path d="M22 52C22 52 5 31.3 5 19C5 9.6 12.6 2 22 2S39 9.6 39 19C39 31.3 22 52 22 52Z" fill="none" stroke="${pinStroke}" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="22" cy="19" r="12.8" fill="#ffffff"/>
        <circle cx="17" cy="12.5" r="4.2" fill="#ffffff" opacity="0.45"/>
        <g transform="translate(10 7)">
          <g class="${reactionAnimationClass}">
            ${reactionSvg}
          </g>
        </g>
      </g>
    </svg>
  `
}

/**
 * @param {import("@/entities/memory/mock-data").MemoryCheckin} checkin
 * @returns {[number, number]}
 */
export function getCheckinLngLat(checkin) {
  return [checkin.longitude, checkin.latitude]
}

/**
 * @param {[number, number]} center
 * @returns {[number, number]}
 */
export function latLngToLngLat(center) {
  return [center[1], center[0]]
}

/**
 * Fits or flies the MapLibre map to the currently visible checkins.
 *
 * @param {import("maplibre-gl").Map | null | undefined} map
 * @param {import("@/entities/memory/mock-data").MemoryCheckin[]} visibleCheckins
 * @param {FitMapOptions} [options]
 * @returns {void}
 */
export function fitMapToCheckins(map, visibleCheckins, options = {}) {
  if (!map || visibleCheckins.length === 0) {
    return
  }

  if (visibleCheckins.length === 1) {
    const [checkin] = visibleCheckins
    map.flyTo({
      center: getCheckinLngLat(checkin),
      duration: 550,
      zoom: options.zoom ?? 13,
    })
    return
  }

  const longitudes = visibleCheckins.map((checkin) => checkin.longitude)
  const latitudes = visibleCheckins.map((checkin) => checkin.latitude)
  const bounds = [
    [Math.min(...longitudes), Math.min(...latitudes)],
    [Math.max(...longitudes), Math.max(...latitudes)],
  ]
  const padding = Array.isArray(options.padding) ? options.padding[0] : options.padding

  map.fitBounds(bounds, {
    duration: 550,
    maxZoom: options.maxZoom ?? 9,
    padding: padding ?? 58,
  })
}

/**
 * Builds and caches the marker image for one checkin and active state.
 *
 * @param {import("@/entities/memory/mock-data").MemoryCheckin} checkin
 * @param {boolean} isActive
 * @returns {{ src: string, width: number, height: number }}
 */
export function createCheckinMarkerImage(checkin, isActive) {
  const cacheKey = `${checkin.id}:${checkin.categoryId}:${checkin.moodId}:${isActive ? 'active' : 'idle'}`
  const cachedImage = checkinIconCache.get(cacheKey)

  if (cachedImage) {
    return cachedImage
  }

  const category = getCategory(checkin.categoryId)
  const mood = getMood(checkin.moodId)
  const isHomeMarker = category.id === 'home'
  const moodIcon =
    category.id === 'home' ? homeMarkerIcon : (moodMarkerIcons[mood.id] ?? moodMarkerIcons.happy)
  const moodId = category.id === 'home' ? 'home' : mood.id
  const markerSvg = createMarkerSvg({
    moodIcon,
    moodId,
    isActive,
    pinColors: isHomeMarker
      ? {
          start: HOME_MARKER_GRADIENT_START,
          end: HOME_MARKER_GRADIENT_END,
          activeStart: HOME_MARKER_ACTIVE_GRADIENT_START,
          activeEnd: HOME_MARKER_ACTIVE_GRADIENT_END,
          activeStroke: HOME_MARKER_ACTIVE_STROKE,
        }
      : undefined,
  })

  const markerImage = {
    height: MARKER_ICON_HEIGHT,
    src: svgToDataUrl(markerSvg),
    width: MARKER_ICON_WIDTH,
  }

  checkinIconCache.set(cacheKey, markerImage)

  return markerImage
}
