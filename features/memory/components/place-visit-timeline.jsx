"use client";

import { Button } from "react-aria-components";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { MediaPreview } from "@/features/memory/components/media-preview";
import { formatDate, getMemoryMedia } from "@/entities/memory";
import { cx } from "@/shared/lib/styles";

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
