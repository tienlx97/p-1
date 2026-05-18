"use client";

import { Button } from "react-aria-components";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { MediaPreview } from "@/features/memory/components/media-preview";
import { formatDate, getMemoryMedia, getMemoryRating } from "@/entities/memory";
import { cx } from "@/shared/lib/styles";

const RATING_STARS = [1, 2, 3, 4, 5];

function VisitRating({ rating }) {
  return (
    <div
      className={cx("timeline-visit-rating")}
      aria-label={`Đánh giá buổi đi chơi: ${rating} trên 5 sao`}
      title={`${rating}/5 sao`}
    >
      {RATING_STARS.map((star) => (
        <span
          aria-hidden="true"
          className={star <= rating ? cx("is-filled") : undefined}
          key={star}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function PlaceVisitTimeline({ visits, onOpenMedia }) {
  return (
    <section className={cx("place-visit-timeline")} aria-label="Timeline ảnh theo ngày">
      <div className={cx("timeline-heading")}>
        <h3>Ảnh theo ngày</h3>
        <span>{visits.length} lần ghé</span>
      </div>

      <div className={cx("timeline-list")}>
        {visits.map((visit) => {
          const visitMedia = getMemoryMedia(visit);
          const rating = getMemoryRating(visit);

          return (
            <article className={cx("timeline-visit")} key={visit.id}>
              <div className={cx("timeline-marker")} aria-hidden="true" />
              <div className={cx("timeline-visit-content")}>
                <div className={cx("timeline-visit-head")}>
                  <div className={cx("timeline-visit-date")}>
                    <strong>{formatDate(visit.checkinTime)}</strong>
                    <span>{visit.title}</span>
                  </div>
                  <VisitRating rating={rating} />
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
