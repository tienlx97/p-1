"use client";

import { useState } from "react";
import { Button, Pressable } from "react-aria-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { MediaPreview } from "@/features/memory/components/media-preview";
import { formatDate, getMemoryMedia } from "@/entities/memory";
import { cx } from "@/shared/lib/cx";
import styles from "./memory-hover-preview.module.css";

/**
 * @typedef {object} MemoryHoverPreviewProps
 * @property {import("@/entities/memory/mock-data").MemoryCheckin} checkin
 * @property {function(): void} onMouseEnter
 * @property {function(): void} onMouseLeave
 * @property {function(number | null): void} onPress
 */

/**
 * @param {MemoryHoverPreviewProps} props
 */
export function MemoryHoverPreview({ checkin, onMouseEnter, onMouseLeave, onPress }) {
  const media = getMemoryMedia(checkin);
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

  return (
    <Pressable onPress={() => onPress(activeSlide?.type === "video" ? activeSlideIndex : null)}>
      <article
        className={styles.card}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={`Xem chi tiết ${checkin.title}`}
      >
        <div className={styles.slider}>
          <Swiper
            className={styles.swiper}
            loop={media.length > 1}
            slidesPerView={1}
            preventClicks
            preventClicksPropagation
            onSlideChange={(swiper) => setActiveSlideIndex(swiper.realIndex)}
            onSwiper={setHoverSwiper}
          >
            {media.map((item) => (
              <SwiperSlide className={styles.slide} key={item.id}>
                <MediaPreview
                  className={styles.photo}
                  item={item}
                  alt={item.alt ?? checkin.title}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={styles.scrim} aria-hidden="true" />

          {activeSlide?.type === "video" ? (
            <span className={styles.play} aria-label="Video">
              <span aria-hidden="true" />
            </span>
          ) : null}

          {media.length > 1 ? (
            <>
              <Button
                className={cx(styles.slideButton, styles.prev)}
                type="button"
                aria-label="Media trước"
                onPress={() => moveSlide(-1)}
              >
                ‹
              </Button>
              <Button
                className={cx(styles.slideButton, styles.next)}
                type="button"
                aria-label="Media tiếp theo"
                onPress={() => moveSlide(1)}
              >
                ›
              </Button>
            </>
          ) : null}

          {media.length > 1 ? (
            <div className={styles.progress} aria-label={`${activeSlideIndex + 1} / ${media.length}`}>
              {media.map((item, index) => (
                <span
                  className={index === activeSlideIndex ? styles.active : undefined}
                  key={item.id}
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.body}>
          <h3>{checkin.title}</h3>
          <p>{formatDate(checkin.checkinTime)}</p>
        </div>
      </article>
    </Pressable>
  );
}
