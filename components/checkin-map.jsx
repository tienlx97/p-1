"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import L from "leaflet";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import { FreeMode, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FocusScope,
  mergeProps,
  useDialog,
  useModal,
  useOverlay,
  usePreventScroll
} from "react-aria";
import { Button, Link, Pressable, Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { QuickMemoryPanel } from "@/components/quick-memory-panel";
import {
  checkins,
  formatDate,
  getCategory,
  getCoverImage,
  getMemoryMedia,
  getMediaSummary,
  getMood
} from "@/lib/mock-data";
import { cx } from "@/lib/styles";

const DEFAULT_CENTER = [10.7757, 106.7004];
const DEFAULT_ZOOM = 11;
const DRAWER_SCROLL_OPTIONS = {
  overflow: { x: "hidden" },
  scrollbars: {
    autoHide: "leave",
    autoHideDelay: 120,
    theme: "os-theme-google-map"
  }
};

function fitMapToCheckins(map, visibleCheckins, options = {}) {
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

function createCheckinIcon(checkin, isActive) {
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

function MapControls({ activeCheckin, visibleCheckins, onAddMemory }) {
  const map = useMap();
  const [locationStatus, setLocationStatus] = useState("");

  function resetView() {
    if (activeCheckin) {
      map.flyTo([activeCheckin.latitude, activeCheckin.longitude], 13, { duration: 0.55 });
      return;
    }

    if (visibleCheckins.length === 1) {
      fitMapToCheckins(map, visibleCheckins);
      return;
    }

    map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 0.55 });
  }

  function locateUser() {
    if (!navigator.geolocation) {
      setLocationStatus("Trình duyệt không hỗ trợ vị trí");
      return;
    }

    setLocationStatus("Đang lấy vị trí...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo([latitude, longitude], 14, { duration: 0.55 });
        setLocationStatus("Đã đến vị trí hiện tại");
      },
      () => {
        setLocationStatus("Chưa cấp quyền vị trí");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60000,
        timeout: 10000
      }
    );
  }

  return (
    <div className={cx("explory-map-controls")} aria-label="Điều khiển bản đồ">
      <div className={cx("explory-control-group")}>
        <Button
          type="button"
          title="Phóng to"
          aria-label="Phóng to"
          onPress={() => map.zoomIn()}
        >
          +
        </Button>
        <span aria-hidden="true" />
        <Button
          type="button"
          title="Thu nhỏ"
          aria-label="Thu nhỏ"
          onPress={() => map.zoomOut()}
        >
          -
        </Button>
      </div>

      <div className={cx("explory-control-button")}>
        <Button type="button" title="Đưa về hành trình" aria-label="Đưa về hành trình" onPress={resetView}>
          <span className={cx("control-compass")} aria-hidden="true" />
        </Button>
      </div>

      <div className={cx("explory-control-button")}>
        <Button type="button" title="Vị trí hiện tại" aria-label="Vị trí hiện tại" onPress={locateUser}>
          <span className={cx("control-location")} aria-hidden="true" />
        </Button>
      </div>

      <div className={cx("explory-control-button primary")}>
        <Button type="button" title="Thêm kỷ niệm" aria-label="Thêm kỷ niệm" onPress={onAddMemory}>
          +
        </Button>
      </div>

      {locationStatus ? <p className={cx("explory-location-status")}>{locationStatus}</p> : null}
    </div>
  );
}

export function CheckinMap() {
  const [activeId, setActiveId] = useState(null);
  const [initialMediaIndex, setInitialMediaIndex] = useState(null);
  const [drawerMode, setDrawerMode] = useState(null);
  const [hoveredPreviewId, setHoveredPreviewId] = useState(null);
  const hoverCloseTimerRef = useRef(null);
  const mapPlaces = useMemo(() => {
    const places = new Map();

    for (const checkin of checkins) {
      const current = places.get(checkin.locationName);

      if (
        !current ||
        new Date(checkin.checkinTime).getTime() > new Date(current.checkinTime).getTime()
      ) {
        places.set(checkin.locationName, checkin);
      }
    }

    return Array.from(places.values());
  }, []);

  const activeCheckin = activeId
    ? checkins.find((checkin) => checkin.id === activeId) ?? null
    : null;

  useEffect(() => {
    return () => {
      if (hoverCloseTimerRef.current) {
        window.clearTimeout(hoverCloseTimerRef.current);
      }
    };
  }, []);

  function keepPreviewOpen() {
    if (hoverCloseTimerRef.current) {
      window.clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
  }

  function showHoverPreview(checkinId) {
    keepPreviewOpen();
    setHoveredPreviewId(checkinId);
  }

  function scheduleCloseHoverPreview() {
    keepPreviewOpen();
    hoverCloseTimerRef.current = window.setTimeout(() => {
      setHoveredPreviewId(null);
    }, 180);
  }

  function openMemory(checkinId, mediaIndex = null) {
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
        <Link href="/checkins" className={cx("explory-back-button")} aria-label="Quay lại danh sách">
          <span aria-hidden="true">‹</span>
        </Link>

        <div className={cx("leaflet-map-shell")}>
          {mapPlaces.length > 0 ? (
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
              <MapControls
                activeCheckin={activeCheckin}
                visibleCheckins={mapPlaces}
                onAddMemory={() => {
                  setActiveId(null);
                  setDrawerMode("add");
                }}
              />

              {mapPlaces.map((checkin) => {
                const isActive =
                  (drawerMode === "memory" && checkin.id === activeId) ||
                  checkin.id === hoveredPreviewId;

                return (
                  <Marker
                    key={checkin.id}
                    position={[checkin.latitude, checkin.longitude]}
                    icon={createCheckinIcon(checkin, isActive)}
                    eventHandlers={{
                      click: () => openMemory(checkin.id),
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
                        <MemoryMediaPreview
                          checkin={checkin}
                          onMouseEnter={keepPreviewOpen}
                          onMouseLeave={scheduleCloseHoverPreview}
                          onPress={(mediaIndex) => openMemory(checkin.id, mediaIndex)}
                          variant="hover"
                        />
                      </Tooltip>
                    ) : null}
                  </Marker>
                );
              })}
            </MapContainer>
          ) : (
            <div className={cx("map-empty-state")}>
              <h2>Chưa có kỷ niệm phù hợp</h2>
              <p>Thử đổi bộ lọc nhóm hoặc cảm xúc.</p>
            </div>
          )}
        </div>

        {drawerMode ? (
          <MapDrawerOverlay
            activeCheckin={activeCheckin}
            drawerMode={drawerMode}
            initialMediaIndex={initialMediaIndex}
            onClose={closeDrawer}
          />
        ) : null}
      </div>
    </section>
  );
}

function MapDrawerOverlay({ activeCheckin, drawerMode, initialMediaIndex, onClose }) {
  const drawerRef = useRef(null);
  const titleRef = useRef(null);
  const isAddDrawer = drawerMode === "add";
  const title = isAddDrawer ? "Thêm kỷ niệm" : activeCheckin?.title ?? "Thông tin kỷ niệm";

  const { overlayProps, underlayProps } = useOverlay(
    {
      isDismissable: isAddDrawer,
      isKeyboardDismissDisabled: false,
      isOpen: true,
      onClose,
      shouldCloseOnInteractOutside: () => isAddDrawer
    },
    drawerRef
  );
  const { modalProps } = useModal();
  const { dialogProps, titleProps } = useDialog({}, drawerRef);
  const drawerProps = isAddDrawer
    ? mergeProps(overlayProps, dialogProps, modalProps)
    : mergeProps(overlayProps, dialogProps);

  usePreventScroll({ isDisabled: !isAddDrawer });

  return (
    <FocusScope autoFocus={isAddDrawer} contain={isAddDrawer} restoreFocus>
      {isAddDrawer ? (
        <div
          {...underlayProps}
          className={cx("drawer-backdrop")}
          role="presentation"
        />
      ) : null}
      <aside
        {...drawerProps}
        ref={drawerRef}
        className={isAddDrawer ? cx("map-drawer add-drawer") : cx("map-drawer memory-drawer")}
      >
        <span className={cx("drawer-handle")} aria-hidden="true" />
        <div className={isAddDrawer ? cx("drawer-head") : cx("drawer-head memory-drawer-head")}>
          {isAddDrawer ? (
            <div>
              <p className={cx("eyebrow")}>Thêm mới</p>
              <h2 {...titleProps} ref={titleRef}>
                {title}
              </h2>
            </div>
          ) : (
            <h2 {...titleProps} ref={titleRef} className={cx("sr-only")}>
              {title}
            </h2>
          )}
          <Button
            aria-label="Đóng drawer"
            className={cx("icon-btn")}
            type="button"
            onPress={onClose}
          >
            <span aria-hidden="true">×</span>
            <span className={cx("sr-only")}>Đóng</span>
          </Button>
        </div>

        {isAddDrawer ? (
          <QuickMemoryPanel embedded />
        ) : activeCheckin ? (
          <OverlayScrollbarsComponent
            className={cx("drawer-scroll")}
            defer
            options={DRAWER_SCROLL_OPTIONS}
          >
            <MemoryDrawerContent checkin={activeCheckin} initialMediaIndex={initialMediaIndex} />
          </OverlayScrollbarsComponent>
        ) : null}
      </aside>
    </FocusScope>
  );
}

function MemoryDrawerContent({ checkin, initialMediaIndex }) {
  const media = getMemoryMedia(checkin);
  const placeVisits = useMemo(() => {
    return checkins
      .filter((item) => item.locationName === checkin.locationName)
      .sort((a, b) => new Date(b.checkinTime).getTime() - new Date(a.checkinTime).getTime());
  }, [checkin.locationName]);
  const [viewerState, setViewerState] = useState(() =>
    Number.isInteger(initialMediaIndex)
      ? { checkin, index: initialMediaIndex, media }
      : null
  );

  function openMedia(visit, index) {
    setViewerState({ checkin: visit, index, media: getMemoryMedia(visit) });
  }

  function selectViewerMedia(nextIndex) {
    setViewerState((current) => {
      if (!current) {
        return current;
      }

      const index =
        typeof nextIndex === "function" ? nextIndex(current.index) : nextIndex;
      return { ...current, index };
    });
  }

  return (
    <article className={cx("drawer-memory")}>
      <Button
        className={cx("google-place-hero media-open-button")}
        type="button"
        aria-label={`Mở ảnh ${checkin.title}`}
        onPress={() => openMedia(checkin, 0)}
      >
        <LoadableImage
          src={getCoverImage(checkin)}
          alt={checkin.title}
          fill
          sizes="(max-width: 820px) 100vw, 430px"
        />
      </Button>

      <div className={cx("google-place-summary")}>
        <h2>{checkin.title}</h2>
      </div>

      <Tabs className={cx("drawer-detail-tabs")} defaultSelectedKey="overview">
        <TabList className={cx("drawer-detail-tab-list")} aria-label="Thông tin kỷ niệm">
          <Tab id="overview">Overview</Tab>
          <Tab id="review">Review</Tab>
        </TabList>

        <TabPanel className={cx("drawer-detail-tab-panel")} id="overview">
          <p className={cx("journal-text")}>{checkin.caption}</p>

          <dl className={cx("google-place-facts drawer-meta")}>
            <div>
              <span aria-hidden="true">⌖</span>
              <dt>Địa điểm</dt>
              <dd>
                {checkin.locationName}
                {checkin.googleMapsUrl ? (
                  <Link
                    className={cx("google-place-map-link")}
                    href={checkin.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Mở Google Maps
                  </Link>
                ) : null}
              </dd>
            </div>
          </dl>

          <PlaceVisitTimeline visits={placeVisits} onOpenMedia={openMedia} />
        </TabPanel>

        <TabPanel className={cx("drawer-detail-tab-panel")} id="review">
          <section className={cx("drawer-review-panel")} aria-label="Review kỷ niệm">
            <div>
              <strong>{checkin.createdBy}</strong>
              <span>{formatDate(checkin.checkinTime)}</span>
              <p>{checkin.caption}</p>
            </div>
          </section>
        </TabPanel>
      </Tabs>

      {viewerState ? (
        <MemoryMediaViewer
          activeIndex={viewerState.index}
          checkin={viewerState.checkin}
          media={viewerState.media}
          onClose={() => setViewerState(null)}
          onSelect={selectViewerMedia}
          preserveDrawer
        />
      ) : null}
    </article>
  );
}

function PlaceVisitTimeline({ visits, onOpenMedia }) {
  return (
    <section className={cx("place-visit-timeline")} aria-label="Timeline ảnh theo ngày">
      <div className={cx("timeline-heading")}>
        <h3>Ảnh theo ngày</h3>
        <span>{visits.length} lần ghé</span>
      </div>

      <div className={cx("timeline-list")}>
        {visits.map((visit) => {
          const visitMedia = getMemoryMedia(visit);

          return (
            <article className={cx("timeline-visit")} key={visit.id}>
              <div className={cx("timeline-marker")} aria-hidden="true" />
              <div className={cx("timeline-visit-content")}>
                <div className={cx("timeline-visit-date")}>
                  <strong>{formatDate(visit.checkinTime)}</strong>
                  <span>{visit.title}</span>
                </div>
                <Swiper
                  className={cx("timeline-media-swiper")}
                  freeMode
                  modules={[FreeMode]}
                  slidesPerView="auto"
                  spaceBetween={7}
                  watchSlidesProgress
                >
                  {visitMedia.map((item, index) => (
                    <SwiperSlide className={cx("timeline-media-slide")} key={item.id}>
                      <Button
                        className={cx("memory-preview-tile media-open-button")}
                        type="button"
                        aria-label={`Mở ${item.type === "video" ? "video" : "ảnh"} ${index + 1} ngày ${formatDate(visit.checkinTime)}`}
                        onPress={() => onOpenMedia(visit, index)}
                      >
                        <MediaPreview item={item} alt={item.alt ?? ""} />
                        {item.type === "video" ? <i aria-label="Video" /> : null}
                      </Button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function MemoryMediaViewer({ activeIndex, checkin, media, onClose, onSelect, preserveDrawer = false }) {
  const activeItem = media[activeIndex] ?? media[0];
  const [mainSwiper, setMainSwiper] = useState(null);
  const [mediaFilter, setMediaFilter] = useState("all");

  usePreventScroll();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onClose]);

  useEffect(() => {
    if (mainSwiper && mainSwiper.activeIndex !== activeIndex) {
      mainSwiper.slideTo(activeIndex);
    }
  }, [activeIndex, mainSwiper]);

  function move(direction) {
    onSelect((currentIndex) => {
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0) {
        return media.length - 1;
      }

      if (nextIndex >= media.length) {
        return 0;
      }

      return nextIndex;
    });
  }

  const viewer = (
    <div
      className={preserveDrawer ? cx("memory-media-viewer drawer-stage-viewer") : cx("memory-media-viewer")}
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh và video"
    >
      {preserveDrawer ? null : (
        <>
          <nav className={cx("media-viewer-mini-nav")} aria-label="Điều hướng media">
            <Button type="button" aria-label="Menu">
              ☰
            </Button>
            <span>
              <i aria-hidden="true">▯</i>
              Saved
            </span>
            <span>
              <i aria-hidden="true">◷</i>
              Recents
            </span>
            <span className={cx("active")}>
              <i aria-hidden="true">▣</i>
              Media
            </span>
          </nav>

          <aside className={cx("media-viewer-rail")} aria-label="Danh sách media">
            <div className={cx("media-viewer-search")}>
              <Button type="button" aria-label="Đóng trình xem" onPress={onClose}>
                ←
              </Button>
              <label>
                <span>{checkin.title}</span>
                <i aria-hidden="true">⌕</i>
              </label>
            </div>
            <Tabs
              selectedKey={mediaFilter}
              aria-label="Bộ lọc media"
              onSelectionChange={(key) => setMediaFilter(String(key))}
            >
              <TabList className={cx("media-viewer-tabs")}>
                <Tab id="all">Tất cả</Tab>
                <Tab id="latest">Mới nhất</Tab>
                <Tab id="video">Video</Tab>
                <Tab id="saved">Đã lưu</Tab>
              </TabList>
            </Tabs>
            <Swiper
              className={cx("media-viewer-thumbs")}
              direction="vertical"
              freeMode
              modules={[FreeMode]}
              slidesPerView="auto"
              spaceBetween={0}
              watchSlidesProgress
              breakpoints={{
                0: {
                  direction: "horizontal",
                  spaceBetween: 6
                },
                821: {
                  direction: "vertical",
                  spaceBetween: 0
                }
              }}
            >
              {media.map((item, index) => (
                <SwiperSlide className={cx("media-viewer-thumb-slide")} key={item.id}>
                  <Button
                    className={index === activeIndex ? cx("active") : cx("")}
                    type="button"
                    aria-label={`Chọn ${item.type === "video" ? "video" : "ảnh"} ${index + 1}`}
                    onPress={() => onSelect(index)}
                  >
                    <MediaPreview item={item} alt={item.alt ?? ""} />
                    {item.type === "video" ? <i>Video</i> : null}
                  </Button>
                </SwiperSlide>
              ))}
            </Swiper>
          </aside>
        </>
      )}

      <section className={cx("media-viewer-stage")}>
        <div className={cx("media-viewer-topcard")}>
          <strong>{checkin.title}</strong>
          <span>{checkin.createdBy} · {formatDate(checkin.checkinTime)}</span>
          <small>{activeItem?.type === "video" ? "Video" : "Photo"} · {activeIndex + 1}/{media.length}</small>
        </div>

        <div className={cx("media-viewer-actions")}>
          <Button type="button">
            <span aria-hidden="true">↗</span>
            Chia sẻ
          </Button>
          <Button type="button" aria-label="Đóng" onPress={onClose}>
            ×
          </Button>
        </div>

        {media.length > 1 ? (
          <>
            <Button
              className={cx("media-viewer-nav prev")}
              type="button"
              aria-label="Media trước"
              onPress={() => move(-1)}
            >
              ‹
            </Button>
            <Button
              className={cx("media-viewer-nav next")}
              type="button"
              aria-label="Media tiếp theo"
              onPress={() => move(1)}
            >
              ›
            </Button>
          </>
        ) : null}

        <Swiper
          className={cx("media-viewer-main")}
          initialSlide={activeIndex}
          keyboard={{ enabled: true }}
          modules={[Keyboard]}
          slidesPerView={1}
          onSlideChange={(swiper) => onSelect(swiper.activeIndex)}
          onSwiper={setMainSwiper}
        >
          {media.map((item) => (
            <SwiperSlide className={cx("media-viewer-slide")} key={item.id}>
              {item.type === "video" ? (
                <video key={item.id} controls preload="metadata" src={item.url} />
              ) : (
                <div className={cx("media-viewer-image-frame")}>
                  <LoadableImage
                    key={item.id}
                    src={item.url}
                    alt={item.alt ?? checkin.title}
                    fill
                    sizes="(max-width: 820px) 100vw, calc(100vw - 360px)"
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );

  return createPortal(viewer, document.body);
}

function LoadableImage({ alt, className = "", src, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <>
      {!isLoaded ? <span className={cx("image-load-skeleton")} aria-hidden="true" /> : null}
      <Image
        {...props}
        className={cx(className, "loadable-image", isLoaded && "is-loaded")}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
      />
    </>
  );
}

function MediaPreview({ item, alt, className }) {
  if (item?.type === "video") {
    return (
      <video
        aria-hidden="true"
        className={className}
        muted
        playsInline
        preload="metadata"
        src={item.url}
      />
    );
  }

  return (
    <LoadableImage
      className={className}
      src={item?.url}
      alt={alt}
      fill
      sizes="(max-width: 820px) 34vw, 160px"
    />
  );
}

function MemoryMediaPreview({ checkin, onMouseEnter, onMouseLeave, onPress, variant }) {
  const media = getMemoryMedia(checkin);
  const mediaSummary = getMediaSummary(checkin);
  const visibleMedia = media.slice(0, variant === "drawer" ? 8 : 6);
  const remainingCount = Math.max(media.length - visibleMedia.length, 0);
  const isHoverPreview = variant === "hover";
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [hoverSwiper, setHoverSwiper] = useState(null);
  const activeSlide = media[activeSlideIndex] ?? media[0];

  function moveSlide(direction) {
    if (!hoverSwiper) {
      return;
    }

    if (direction < 0) {
      hoverSwiper.slidePrev();
      return;
    }

    hoverSwiper.slideNext();
  }

  const preview = isHoverPreview ? (
    <article
      className={cx("memory-place-card hover")}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={`Xem chi tiết ${checkin.title}`}
    >
      <div className={cx("memory-place-slider")}>
        <Swiper
          className={cx("memory-place-swiper")}
          loop={media.length > 1}
          slidesPerView={1}
          preventClicks
          preventClicksPropagation
          onSlideChange={(swiper) => setActiveSlideIndex(swiper.realIndex)}
          onSwiper={setHoverSwiper}
        >
          {media.map((item) => (
            <SwiperSlide className={cx("memory-place-slide")} key={item.id}>
              <MediaPreview
                className={cx("memory-place-card-photo")}
                item={item}
                alt={item.alt ?? checkin.title}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={cx("memory-place-scrim")} aria-hidden="true" />

        {activeSlide?.type === "video" ? (
          <span className={cx("memory-place-play")} aria-label="Video">
            <span aria-hidden="true" />
          </span>
        ) : null}

        {media.length > 1 ? (
          <>
            <Button
              className={cx("memory-slide-button prev")}
              type="button"
              aria-label="Media trước"
              onPress={() => moveSlide(-1)}
            >
              ‹
            </Button>
            <Button
              className={cx("memory-slide-button next")}
              type="button"
              aria-label="Media tiếp theo"
              onPress={() => moveSlide(1)}
            >
              ›
            </Button>
          </>
        ) : null}

        {media.length > 1 ? (
          <div className={cx("memory-slide-progress")} aria-label={`${activeSlideIndex + 1} / ${media.length}`}>
            {media.map((item, index) => (
              <span
                className={index === activeSlideIndex ? cx("active") : cx("")}
                key={item.id}
                aria-hidden="true"
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className={cx("memory-place-body")}>
        <h3>{checkin.title}</h3>
        <p>{formatDate(checkin.checkinTime)}</p>
      </div>
    </article>
  ) : (
    <article
      className={cx("memory-media-preview", variant)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={cx("memory-preview-head")}>
        <div>
          <p>{mediaSummary.total} media</p>
          <h3>{checkin.title}</h3>
        </div>
      </div>

      <div className={cx("memory-preview-grid")} aria-label="Ảnh và video trong kỷ niệm">
        {visibleMedia.map((item) => (
          <span className={cx("memory-preview-tile")} key={item.id}>
            <MediaPreview item={item} alt={item.alt ?? ""} />
            {item.type === "video" ? <i aria-label="Video" /> : null}
          </span>
        ))}
        {remainingCount > 0 ? (
          <span className={cx("memory-preview-more")}>
            <strong>+{remainingCount}</strong>
            <small>More</small>
          </span>
        ) : null}
      </div>

      <dl className={cx("memory-preview-meta")}>
        <div>
          <dt>Vị trí</dt>
          <dd className={cx("coordinate-value")}>
            {checkin.latitude.toFixed(4)}° N, {checkin.longitude.toFixed(4)}° E
          </dd>
        </div>
        <div>
          <dt>Thời gian</dt>
          <dd>{formatDate(checkin.checkinTime)}</dd>
        </div>
        {variant === "drawer" ? (
          <div>
            <dt>Media</dt>
            <dd>
              {mediaSummary.photos} ảnh{mediaSummary.videos ? `, ${mediaSummary.videos} video` : ""}
            </dd>
          </div>
        ) : null}
      </dl>
    </article>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={() => onPress(activeSlide?.type === "video" ? activeSlideIndex : null)}
      >
        {preview}
      </Pressable>
    );
  }

  return preview;
}
