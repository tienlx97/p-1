import L from "leaflet";
import { getCategory, getCoverImage, getMood } from "@/entities/memory";
import { MARKER_VISUAL_MODE } from "@/features/map/components/map.constants";
import { cx } from "@/shared/lib/styles";

const moodMarkerIcons = {
  chill: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <circle cx="8.5" cy="10.2" r="1.1" fill="#4b2f13" />
      <circle cx="15.5" cy="10.2" r="1.1" fill="#4b2f13" />
      <path d="M8.2 14.8c2.1 1.5 5.5 1.5 7.6 0" fill="none" stroke="#4b2f13" stroke-linecap="round" stroke-width="1.8" />
    </svg>
  `,
  explore: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <circle cx="8.5" cy="10" r="1.4" fill="#4b2f13" />
      <circle cx="15.5" cy="10" r="1.4" fill="#4b2f13" />
      <ellipse cx="12" cy="15.5" rx="2.1" ry="2.7" fill="#4b2f13" />
    </svg>
  `,
  happy: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <path d="M7.2 9.5c1.1.9 2.1.9 3.2 0M13.6 9.5c1.1.9 2.1.9 3.2 0" fill="none" stroke="#4b2f13" stroke-linecap="round" stroke-width="1.8" />
      <path d="M7.7 13.9c1.1 3.2 7.5 3.2 8.6 0Z" fill="#4b2f13" />
      <path d="M9.2 15.4c1.6.9 4 .9 5.6 0" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.1" opacity=".72" />
    </svg>
  `,
  memorable: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1877f2" />
      <path d="M10.3 18.1h6.3c.9 0 1.6-.6 1.8-1.5l.9-4.7c.2-1-.5-1.9-1.5-1.9h-3.1l.4-2.4c.2-1.2-.6-2.2-1.8-2.2h-.4l-3 5.1v7.6Z" fill="#fff" />
      <path d="M5.6 10.3h2.7v7.8H5.6Z" fill="#fff" opacity=".92" />
    </svg>
  `,
  peaceful: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <circle cx="8.4" cy="10.2" r="1.1" fill="#4b2f13" />
      <circle cx="15.6" cy="10.2" r="1.1" fill="#4b2f13" />
      <path d="M8.5 15.8c1.9-1.4 5.1-1.4 7 0" fill="none" stroke="#4b2f13" stroke-linecap="round" stroke-width="1.8" />
      <path d="M17.5 12.3c1.5 1.6 2.1 2.8 2.1 3.8a2.1 2.1 0 0 1-4.2 0c0-1 .6-2.2 2.1-3.8Z" fill="#4fc3f7" stroke="#1b75bb" stroke-linejoin="round" stroke-width=".8" />
    </svg>
  `,
  romantic: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f33e58" />
      <path d="M12 18.5S6.1 14.9 6.1 10.7c0-1.9 1.3-3.2 3-3.2 1.1 0 2.1.6 2.9 1.6.8-1 1.8-1.6 2.9-1.6 1.7 0 3 1.3 3 3.2 0 4.2-5.9 7.8-5.9 7.8Z" fill="#fff" />
    </svg>
  `,
  sad: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f7b928" />
      <circle cx="8.4" cy="10.2" r="1.1" fill="#4b2f13" />
      <circle cx="15.6" cy="10.2" r="1.1" fill="#4b2f13" />
      <path d="M8.5 15.8c1.9-1.4 5.1-1.4 7 0" fill="none" stroke="#4b2f13" stroke-linecap="round" stroke-width="1.8" />
      <path d="M17.5 12.3c1.5 1.6 2.1 2.8 2.1 3.8a2.1 2.1 0 0 1-4.2 0c0-1 .6-2.2 2.1-3.8Z" fill="#4fc3f7" stroke="#1b75bb" stroke-linejoin="round" stroke-width=".8" />
    </svg>
  `
};

const homeMarkerIcon = `
  <svg class="${cx("home-heart-icon")}" viewBox="0 0 24 24" aria-hidden="true">
    <path class="${cx("home-heart-icon-main")}" d="M8.3 17.7S3.7 14.9 3.7 11.5c0-1.7 1.2-2.9 2.7-2.9.9 0 1.7.4 2.2 1.2.5-.8 1.3-1.2 2.2-1.2 1.5 0 2.7 1.2 2.7 2.9 0 3.4-5.2 6.2-5.2 6.2Z" fill="#ff5c8a" stroke="#b5164f" stroke-linejoin="round" stroke-width="1" />
    <path class="${cx("home-heart-icon-secondary")}" d="M15.6 14.8s-4.3-2.6-4.3-5.8c0-1.5 1.1-2.7 2.5-2.7.8 0 1.6.4 2.1 1.1.5-.7 1.3-1.1 2.1-1.1 1.4 0 2.5 1.2 2.5 2.7 0 3.2-4.9 5.8-4.9 5.8Z" fill="#ff8fb0" stroke="#b5164f" stroke-linejoin="round" stroke-width="1" />
  </svg>
`;

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
  const coverImage = getCoverImage(checkin);
  const markerActiveColor = category.id === "home" ? "#b5164f" : category.color;
  const moodIcon = category.id === "home" ? homeMarkerIcon : moodMarkerIcons[mood.id] ?? moodMarkerIcons.happy;
  const width = 44;
  const height = 54;
  const anchorY = 50;
  const markerClassName = cx(
    "explory-memory-marker",
    category.id === "home" && "home-marker",
    isActive && "active"
  );
  const markerPhotoContent =
    MARKER_VISUAL_MODE === "mood"
      ? `<span class="${cx("explory-marker-photo")}"></span>`
      : `<span class="${cx("explory-marker-photo")}" style="background-image: url('${coverImage}')"></span>`;

  return L.divIcon({
    className: cx("checkin-leaflet-icon"),
    html: `
      <span class="${markerClassName}" style="--marker-color: ${category.color}; --marker-active-color: ${markerActiveColor}">
        ${isActive ? `<span class="${cx("explory-marker-pulse")}"></span>` : ""}
        <span class="${cx("explory-marker-core")}">
          ${markerPhotoContent}
          <span class="${cx("explory-marker-glass")}"></span>
          ${
            MARKER_VISUAL_MODE === "mood"
              ? `<span class="${cx("explory-marker-camera mood-camera")}" aria-hidden="true">${moodIcon}</span>`
              : `<span class="${cx("explory-marker-camera")}" aria-hidden="true"></span>`
          }
        </span>
        ${MARKER_VISUAL_MODE === "photo" ? `<span class="${cx("explory-marker-mood")}" aria-hidden="true">${moodIcon}</span>` : ""}
        <span class="${cx("explory-marker-tip")}" aria-hidden="true"></span>
      </span>
    `,
    iconSize: [width, height],
    iconAnchor: [width / 2, anchorY],
    popupAnchor: [0, -anchorY],
    tooltipAnchor: [0, -(anchorY + 8)]
  });
}
