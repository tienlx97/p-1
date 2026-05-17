"use client";

import { useState } from "react";
import { Button, Pressable } from "react-aria-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { MediaPreview } from "@/features/memory/components/media-preview";
import { formatDate, getMemoryMedia } from "@/entities/memory";
import { cx } from "@/shared/lib/styles";

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
    </Pressable>
  );
}
