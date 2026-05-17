import L from "leaflet";
import { getCategory, getCoverImage } from "@/entities/memory";
import { cx } from "@/shared/lib/styles";

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
  const coverImage = getCoverImage(checkin);
  const markerActiveColor = category.id === "home" ? "#b5164f" : category.color;
  const width = 44;
  const height = 54;
  const anchorY = 50;
  const markerClassName = cx(
    "explory-memory-marker",
    category.id === "home" && "home-marker",
    isActive && "active"
  );

  return L.divIcon({
    className: cx("checkin-leaflet-icon"),
    html: `
      <span class="${markerClassName}" style="--marker-color: ${category.color}; --marker-active-color: ${markerActiveColor}">
        ${isActive ? `<span class="${cx("explory-marker-pulse")}"></span>` : ""}
        <span class="${cx("explory-marker-core")}">
          <span class="${cx("explory-marker-photo")}" style="background-image: url('${coverImage}')"></span>
          <span class="${cx("explory-marker-glass")}"></span>
          <span class="${cx("explory-marker-camera")}" aria-hidden="true"></span>
        </span>
        <span class="${cx("explory-marker-tip")}" aria-hidden="true"></span>
      </span>
    `,
    iconSize: [width, height],
    iconAnchor: [width / 2, anchorY],
    popupAnchor: [0, -anchorY],
    tooltipAnchor: [0, -(anchorY + 8)]
  });
}
