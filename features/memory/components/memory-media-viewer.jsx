"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePreventScroll } from "react-aria";
import { Button, Tab, TabList, Tabs } from "react-aria-components";
import { FreeMode, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { LoadableImage } from "@/features/memory/components/loadable-image";
import { MediaPreview } from "@/features/memory/components/media-preview";
import { formatDate } from "@/entities/memory";
import { cx } from "@/shared/lib/styles";

export function MemoryMediaViewer({ activeIndex, checkin, media, onClose, onSelect, preserveDrawer = false }) {
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

    globalThis.addEventListener("keydown", handleKeyDown, true);
    return () => globalThis.removeEventListener("keydown", handleKeyDown, true);
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
