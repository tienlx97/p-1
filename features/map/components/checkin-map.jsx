"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMapEvents } from "react-leaflet";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  PLACE_LABEL_MIN_ZOOM
} from "@/features/map/components/map.constants";
import { createCheckinIcon } from "@/features/map/components/map.utils";
import { MapControls } from "@/features/map/components/map-controls";
import { MapFilterPanel } from "@/features/map/components/map-filter-panel";
import { AddMemoryDrawer, MemoryDetailDrawer, MemoryHoverPreview } from "@/features/memory";
import { checkins } from "@/entities/memory";
import { cx } from "@/shared/lib/styles";

function MapZoomWatcher({ onZoomChange }) {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    }
  });

  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);

  return null;
}

export function CheckinMap() {
  const [activeId, setActiveId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [initialMediaIndex, setInitialMediaIndex] = useState(null);
  const [drawerMode, setDrawerMode] = useState(null);
  const [hoveredPreviewId, setHoveredPreviewId] = useState(null);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const hoverCloseTimerRef = useRef(null);
  const showPlaceLabels = mapZoom >= PLACE_LABEL_MIN_ZOOM;

  const filteredCheckins = useMemo(
    () =>
      checkins.filter((checkin) => {
        const matchesCategory = categoryFilter === "all" || checkin.categoryId === categoryFilter;

        return matchesCategory;
      }),
    [categoryFilter]
  );

  const mapPlaces = useMemo(() => {
    const places = new Map();

    for (const checkin of filteredCheckins) {
      const current = places.get(checkin.locationName);

      if (
        !current ||
        new Date(checkin.checkinTime).getTime() > new Date(current.checkinTime).getTime()
      ) {
        places.set(checkin.locationName, checkin);
      }
    }

    return [...places.values()];
  }, [filteredCheckins]);

  const activeCheckin = activeId
    ? filteredCheckins.find((checkin) => checkin.id === activeId) ?? null
    : null;

  useEffect(() => {
    return () => {
      if (hoverCloseTimerRef.current) {
        globalThis.clearTimeout(hoverCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const activeStillVisible = !activeId || filteredCheckins.some((checkin) => checkin.id === activeId);
    const previewStillVisible =
      !hoveredPreviewId || filteredCheckins.some((checkin) => checkin.id === hoveredPreviewId);

    if (!activeStillVisible) {
      setActiveId(null);
      setInitialMediaIndex(null);
      setDrawerMode(null);
    }

    if (!previewStillVisible) {
      setHoveredPreviewId(null);
    }
  }, [activeId, filteredCheckins, hoveredPreviewId]);

  function keepPreviewOpen() {
    if (hoverCloseTimerRef.current) {
      globalThis.clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
  }

  function showHoverPreview(checkinId) {
    keepPreviewOpen();
    setHoveredPreviewId(checkinId);
  }

  function scheduleCloseHoverPreview() {
    keepPreviewOpen();
    hoverCloseTimerRef.current = globalThis.setTimeout(() => {
      setHoveredPreviewId(null);
    }, 180);
  }

  function openAddMemoryDrawer() {
    setActiveId(null);
    setInitialMediaIndex(null);
    setDrawerMode("add");
  }

  function openMemoryDetail(checkinId, mediaIndex = null) {
    keepPreviewOpen();
    setActiveId(checkinId);
    setInitialMediaIndex(mediaIndex);
    setHoveredPreviewId(null);
    setDrawerMode("memory");
  }

  function closeDrawer() {
    setDrawerMode(null);
    setHoveredPreviewId(null);
    setInitialMediaIndex(null);

    if (drawerMode === "memory") {
      setActiveId(null);
    }
  }

  return (
    <section className={cx("map-workspace")}>
      <div className={cx("map-body")}>
        <div className={cx("leaflet-map-shell")}>
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
                className={cx("checkin-leaflet-map")}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapZoomWatcher onZoomChange={setMapZoom} />
                <MapControls
                  activeCheckin={activeCheckin}
                  visibleCheckins={mapPlaces}
                  onAddMemory={openAddMemoryDrawer}
                />

                {mapPlaces.map((checkin) => {
                  const isActive =
                    (drawerMode === "memory" && checkin.id === activeId) ||
                    checkin.id === hoveredPreviewId;

                  return (
                    <Marker
                      key={checkin.id}
                      position={[checkin.latitude, checkin.longitude]}
                      icon={createCheckinIcon(checkin, isActive, showPlaceLabels)}
                      eventHandlers={{
                        click: () => openMemoryDetail(checkin.id),
                        mouseover: () => showHoverPreview(checkin.id),
                        mouseout: scheduleCloseHoverPreview
                      }}
                    >
                      {hoveredPreviewId === checkin.id ? (
                        <Tooltip
                          className={cx("memory-hover-tooltip")}
                          direction="top"
                          interactive
                          offset={[0, 0]}
                          opacity={1}
                          permanent
                        >
                          <MemoryHoverPreview
                            checkin={checkin}
                            onMouseEnter={keepPreviewOpen}
                            onMouseLeave={scheduleCloseHoverPreview}
                            onPress={(mediaIndex) => openMemoryDetail(checkin.id, mediaIndex)}
                          />
                        </Tooltip>
                      ) : null}
                    </Marker>
                  );
                })}
              </MapContainer>
              {mapPlaces.length === 0 ? (
                <div className={cx("map-empty-state map-filter-empty-state")}>
                  <h2>Không có kỷ niệm phù hợp</h2>
                  <p>Thử đổi nhóm để xem lại hành trình khác.</p>
                </div>
              ) : null}
            </>
          ) : (
            <div className={cx("map-empty-state")}>
              <h2>Chưa có kỷ niệm phù hợp</h2>
              <p>Thử đổi bộ lọc nhóm hoặc cảm xúc.</p>
            </div>
          )}
        </div>

        {drawerMode === "add" ? <AddMemoryDrawer onClose={closeDrawer} /> : null}
        {drawerMode === "memory" ? (
          <MemoryDetailDrawer
            checkin={activeCheckin}
            initialMediaIndex={initialMediaIndex}
            onClose={closeDrawer}
          />
        ) : null}
      </div>
    </section>
  );
}
