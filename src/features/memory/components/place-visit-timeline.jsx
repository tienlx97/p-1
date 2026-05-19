"use client";

import { Button } from "react-aria-components";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { MediaPreview } from "@/features/memory/components/media-preview";
import { formatDate, getMemoryMedia, getMemoryRating } from "@/entities/memory";
import { cx } from "@/shared/lib/cx";
import styles from "./place-visit-timeline.module.css";

const RATING_STARS = [1, 2, 3, 4, 5];

function VisitRating({ rating }) {
  return (
    <div
      className={styles.rating}
      aria-label={`Đánh giá buổi đi chơi: ${rating} trên 5 sao`}
      title={`${rating}/5 sao`}
    >
      {RATING_STARS.map((star) => (
        <span
          aria-hidden="true"
          className={star <= rating ? styles.isFilled : undefined}
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
    <section className={styles.root} aria-label="Timeline ảnh theo ngày">
      <div className={styles.heading}>
        <h3>Ảnh theo ngày</h3>
        <span>{visits.length} lần ghé</span>
      </div>

      <div className={styles.list}>
        {visits.map((visit) => {
          const visitMedia = getMemoryMedia(visit);
          const rating = getMemoryRating(visit);

          return (
            <article className={styles.visit} key={visit.id}>
              <div className={styles.marker} aria-hidden="true" />
              <div className={styles.visitContent}>
                <div className={styles.visitHead}>
                  <div className={styles.visitDate}>
                    <strong>{formatDate(visit.checkinTime)}</strong>
                    <span>{visit.title}</span>
                  </div>
                  <VisitRating rating={rating} />
                </div>
                <Swiper
                  className={styles.mediaSwiper}
                  freeMode
                  modules={[FreeMode]}
                  slidesPerView="auto"
                  spaceBetween={7}
                  watchSlidesProgress
                >
                  {visitMedia.map((item, index) => (
                    <SwiperSlide className={styles.mediaSlide} key={item.id}>
                      <Button
                        className={cx(styles.previewTile, styles.mediaOpenButton)}
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
