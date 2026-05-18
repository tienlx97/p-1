import L from "leaflet";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { getCategory, getMood } from "@/entities/memory";
import { cx } from "@/shared/lib/styles";

const getLeafletAssetUrl = (asset) => asset?.src ?? asset;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: getLeafletAssetUrl(markerIcon2xUrl),
  iconUrl: getLeafletAssetUrl(markerIconUrl),
  shadowUrl: getLeafletAssetUrl(markerShadowUrl)
});

const moodMarkerIcons = {
  chill: `
    <svg class="${cx("reaction-icon reaction-smile")}" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <circle cx="8.5" cy="10.2" r="1.1" fill="#4b2f13" />
      <circle cx="15.5" cy="10.2" r="1.1" fill="#4b2f13" />
      <path d="M8.2 14.8c2.1 1.5 5.5 1.5 7.6 0" fill="none" stroke="#4b2f13" stroke-linecap="round" stroke-width="1.8" />
    </svg>
  `,
  explore: `
    <svg class="${cx("reaction-icon reaction-wow")}" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <circle cx="8.5" cy="10" r="1.4" fill="#4b2f13" />
      <circle cx="15.5" cy="10" r="1.4" fill="#4b2f13" />
      <ellipse cx="12" cy="15.5" rx="2.1" ry="2.7" fill="#4b2f13" />
    </svg>
  `,
  happy: `
    <svg class="${cx("reaction-icon reaction-haha")}" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <path d="M7.2 9.5c1.1.9 2.1.9 3.2 0M13.6 9.5c1.1.9 2.1.9 3.2 0" fill="none" stroke="#4b2f13" stroke-linecap="round" stroke-width="1.8" />
      <path d="M7.7 13.9c1.1 3.2 7.5 3.2 8.6 0Z" fill="#4b2f13" />
      <path d="M9.2 15.4c1.6.9 4 .9 5.6 0" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.1" opacity=".72" />
    </svg>
  `,
  memorable: `
    <svg class="${cx("reaction-icon reaction-like")}" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#2f80ed" />
      <path d="M6.1 10.9h3v7h-3Z" fill="#d8eaff" opacity=".96" />
      <path d="M9.1 10.8c1.2-1.2 2-2.8 2.4-4.6.1-.5.5-.9 1-.9 1.2 0 2.1 1 1.9 2.2l-.3 1.8h3.7c1 0 1.7.9 1.5 1.8l-.9 4.9c-.2 1.1-1.1 1.9-2.2 1.9H9.1Z" fill="#fff" />
      <path d="M9.1 10.8v7.1M14.1 9.3h3.7" fill="none" stroke="#cfe2ff" stroke-linecap="round" stroke-width="1" opacity=".8" />
    </svg>
  `,
  peaceful: `
    <svg class="${cx("reaction-icon reaction-sad")}" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <circle cx="8.4" cy="10.2" r="1.1" fill="#4b2f13" />
      <circle cx="15.6" cy="10.2" r="1.1" fill="#4b2f13" />
      <path d="M8.5 15.8c1.9-1.4 5.1-1.4 7 0" fill="none" stroke="#4b2f13" stroke-linecap="round" stroke-width="1.8" />
      <path class="${cx("reaction-tear")}" d="M17.5 12.3c1.5 1.6 2.1 2.8 2.1 3.8a2.1 2.1 0 0 1-4.2 0c0-1 .6-2.2 2.1-3.8Z" fill="#4fc3f7" stroke="#1b75bb" stroke-linejoin="round" stroke-width=".8" />
    </svg>
  `,
  romantic: `
    <svg class="${cx("reaction-icon reaction-love")}" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f33e58" />
      <path d="M12 18.5S6.1 14.9 6.1 10.7c0-1.9 1.3-3.2 3-3.2 1.1 0 2.1.6 2.9 1.6.8-1 1.8-1.6 2.9-1.6 1.7 0 3 1.3 3 3.2 0 4.2-5.9 7.8-5.9 7.8Z" fill="#fff" />
    </svg>
  `,
  sad: `
    <svg class="${cx("reaction-icon reaction-sad")}" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <circle cx="8.4" cy="10.2" r="1.1" fill="#4b2f13" />
      <circle cx="15.6" cy="10.2" r="1.1" fill="#4b2f13" />
      <path d="M8.5 15.8c1.9-1.4 5.1-1.4 7 0" fill="none" stroke="#4b2f13" stroke-linecap="round" stroke-width="1.8" />
      <path class="${cx("reaction-tear")}" d="M17.5 12.3c1.5 1.6 2.1 2.8 2.1 3.8a2.1 2.1 0 0 1-4.2 0c0-1 .6-2.2 2.1-3.8Z" fill="#4fc3f7" stroke="#1b75bb" stroke-linejoin="round" stroke-width=".8" />
    </svg>
  `
};

const homeMarkerIcon = `
  <svg class="${cx("home-heart-icon")}" viewBox="0 0 24 24" aria-hidden="true">
    <path class="${cx("home-heart-icon-main")}" d="M8.3 17.7S3.7 14.9 3.7 11.5c0-1.7 1.2-2.9 2.7-2.9.9 0 1.7.4 2.2 1.2.5-.8 1.3-1.2 2.2-1.2 1.5 0 2.7 1.2 2.7 2.9 0 3.4-5.2 6.2-5.2 6.2Z" fill="#ff5c8a" stroke="#b5164f" stroke-linejoin="round" stroke-width="1" />
    <path class="${cx("home-heart-icon-secondary")}" d="M15.6 14.8s-4.3-2.6-4.3-5.8c0-1.5 1.1-2.7 2.5-2.7.8 0 1.6.4 2.1 1.1.5-.7 1.3-1.1 2.1-1.1 1.4 0 2.5 1.2 2.5 2.7 0 3.2-4.9 5.8-4.9 5.8Z" fill="#ff8fb0" stroke="#b5164f" stroke-linejoin="round" stroke-width="1" />
  </svg>
`;

const MARKER_ICON_WIDTH = 44;
const MARKER_ICON_HEIGHT = 54;
const MARKER_TIP_Y = 52;

function svgToDataUrl(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getSvgContent(svg) {
  const match = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);

  return match ? match[1] : svg;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createMarkerSvg({ markerColor, markerActiveColor, moodIcon, isActive }) {
  const pinColor = escapeHtml(isActive ? markerActiveColor : markerColor);
  const pinStroke = escapeHtml(isActive ? markerActiveColor : "#ffffff");
  const reactionSvg = getSvgContent(moodIcon);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${MARKER_ICON_WIDTH}" height="${MARKER_ICON_HEIGHT}" viewBox="0 0 ${MARKER_ICON_WIDTH} ${MARKER_ICON_HEIGHT}">
      <defs>
        <filter id="pinShadow" x="-25%" y="-18%" width="150%" height="145%" color-interpolation-filters="sRGB">
          <feDropShadow dx="0" dy="3" stdDeviation="2.2" flood-color="#3c4043" flood-opacity="0.28"/>
        </filter>
      </defs>
      <path d="M22 52C22 52 5 31.3 5 19C5 9.6 12.6 2 22 2S39 9.6 39 19C39 31.3 22 52 22 52Z" fill="${pinColor}" filter="url(#pinShadow)"/>
      <path d="M22 52C22 52 5 31.3 5 19C5 9.6 12.6 2 22 2S39 9.6 39 19C39 31.3 22 52 22 52Z" fill="none" stroke="${pinStroke}" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="22" cy="19" r="12.8" fill="#ffffff"/>
      <circle cx="17" cy="12.5" r="4.2" fill="#ffffff" opacity="0.45"/>
      <svg x="10" y="7" width="24" height="24" viewBox="0 0 24 24">
        ${reactionSvg}
      </svg>
    </svg>
  `;
}

export function fitMapToCheckins(map, visibleCheckins, options = {}) {
  if (!map || visibleCheckins.length === 0) {
    return;
  }

  if (visibleCheckins.length === 1) {
    const [checkin] = visibleCheckins;
    map.flyTo([checkin.latitude, checkin.longitude], options.zoom ?? 13, {
      duration: 0.55
    });
    return;
  }

  const bounds = visibleCheckins.map((checkin) => [checkin.latitude, checkin.longitude]);

  map.fitBounds(bounds, {
    padding: options.padding ?? [58, 58],
    maxZoom: options.maxZoom ?? 9,
    animate: true
  });
}

export function createCheckinIcon(checkin, isActive) {
  const category = getCategory(checkin.categoryId);
  const mood = getMood(checkin.moodId);
  const markerActiveColor = category.id === "home" ? "#b5164f" : category.color;
  const moodIcon = category.id === "home" ? homeMarkerIcon : moodMarkerIcons[mood.id] ?? moodMarkerIcons.happy;
  const markerSvg = createMarkerSvg({
    markerColor: category.color,
    markerActiveColor,
    moodIcon,
    isActive
  });

  return L.icon({
    iconUrl: svgToDataUrl(markerSvg),
    iconSize: [MARKER_ICON_WIDTH, MARKER_ICON_HEIGHT],
    iconAnchor: [MARKER_ICON_WIDTH / 2, MARKER_TIP_Y],
    popupAnchor: [0, -MARKER_TIP_Y],
    tooltipAnchor: [0, -(MARKER_TIP_Y + 8)],
    className: cx("checkin-leaflet-svg-icon")
  });
}
