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
import { cx } from "@/shared/lib/cx";
import styles from "./memory-media-viewer.module.css";

export function MemoryMediaViewer({ activeIndex, checkin, media, onClose, onSelect, preserveDrawer = false }) {
  const activeItem = media[activeIndex] ?? media[0];
  const [mainSwiper, setMainSwiper] = useState(null);
  const [mediaFilter, setMediaFilter] = useState("all");

  usePreventScroll();

  useEffect(() => {
    document.body.classList.add("media-viewer-open");
    return () => document.body.classList.remove("media-viewer-open");
  }, []);

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
      className={cx(styles.viewer, preserveDrawer && styles.drawerStageViewer)}
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh và video"
    >
      {preserveDrawer ? null : (
        <>
          <nav className={styles.miniNav} aria-label="Điều hướng media">
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
            <span className={styles.active}>
              <i aria-hidden="true">▣</i>
              Media
            </span>
          </nav>

          <aside className={styles.rail} aria-label="Danh sách media">
            <div className={styles.search}>
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
              <TabList className={styles.tabs}>
                <Tab id="all">Tất cả</Tab>
                <Tab id="latest">Mới nhất</Tab>
                <Tab id="video">Video</Tab>
                <Tab id="saved">Đã lưu</Tab>
              </TabList>
            </Tabs>
            <Swiper
              className={styles.thumbs}
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
                <SwiperSlide className={styles.thumbSlide} key={item.id}>
                  <Button
                    className={index === activeIndex ? styles.active : undefined}
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

      <section className={styles.stage}>
        <div className={styles.topcard}>
          <strong>{checkin.title}</strong>
          <span>{checkin.createdBy} · {formatDate(checkin.checkinTime)}</span>
          <small>{activeItem?.type === "video" ? "Video" : "Photo"} · {activeIndex + 1}/{media.length}</small>
        </div>

        <div className={styles.actions}>
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
              className={cx(styles.navButton, styles.prev)}
              type="button"
              aria-label="Media trước"
              onPress={() => move(-1)}
            >
              ‹
            </Button>
            <Button
              className={cx(styles.navButton, styles.next)}
              type="button"
              aria-label="Media tiếp theo"
              onPress={() => move(1)}
            >
              ›
            </Button>
          </>
        ) : null}

        <Swiper
          className={styles.main}
          initialSlide={activeIndex}
          keyboard={{ enabled: true }}
          modules={[Keyboard]}
          slidesPerView={1}
          onSlideChange={(swiper) => onSelect(swiper.activeIndex)}
          onSwiper={setMainSwiper}
        >
          {media.map((item) => (
            <SwiperSlide className={styles.slide} key={item.id}>
              {item.type === "video" ? (
                <video key={item.id} controls preload="metadata" src={item.url} />
              ) : (
                <div className={styles.imageFrame}>
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
