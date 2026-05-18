"use client";

import { useMemo, useState } from "react";
import { Button, Link, Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { LoadableImage } from "@/features/memory/components/loadable-image";
import { MemoryMediaViewer } from "@/features/memory/components/memory-media-viewer";
import { PlaceVisitTimeline } from "@/features/memory/components/place-visit-timeline";
import {
  checkins,
  formatDate,
  getCoverImage,
  getMemoryMedia
} from "@/entities/memory";
import { cx } from "@/shared/lib/styles";

export function MemoryDetailContent({ checkin, initialMediaIndex }) {
  const media = getMemoryMedia(checkin);
  const placeVisits = useMemo(() => {
    return checkins
      .filter((item) => item.locationName === checkin.locationName)
      .toSorted((a, b) => new Date(b.checkinTime).getTime() - new Date(a.checkinTime).getTime());
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
              <span className={cx("google-place-fact-icon")} aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M12 21s6.5-5.52 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5.48 6.5 11 6.5 11Z" />
                  <circle cx="12" cy="10" r="2.4" />
                </svg>
              </span>
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
