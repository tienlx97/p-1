"use client";

import Image from "next/image";
import { Link } from "react-aria-components";
import { formatDate, getCategory, getCoverImage, getMediaSummary, getMood } from "@/entities/memory";

import { cx } from "@/shared/lib/styles";

export function CheckinCard({ checkin, compact = false }) {
  const category = getCategory(checkin.categoryId);
  const mood = getMood(checkin.moodId);
  const coverImage = getCoverImage(checkin);
  const mediaSummary = getMediaSummary(checkin);

  return (
    <article className={compact ? cx("checkin-card compact") : cx("checkin-card")}>
      <Link href={`/checkins/${checkin.id}`} className={cx("checkin-image-link")} aria-label={checkin.title}>
        <Image
          src={coverImage}
          alt={checkin.title}
          fill
          sizes={compact ? "(max-width: 820px) 100vw, 230px" : "(max-width: 820px) 100vw, 360px"}
        />
        <span className={cx("media-count")}>
          {mediaSummary.photos} ảnh{mediaSummary.videos ? ` · ${mediaSummary.videos} video` : ""}
        </span>
      </Link>
      <div className={cx("checkin-card-body")}>
        <div className={cx("tag-row")}>
          <span className={cx("pill")} style={{ "--pill-color": category.color }}>
            {category.icon} · {category.name}
          </span>
          <span className={cx("pill muted")}>{mood.icon} · {mood.name}</span>
        </div>
        <Link href={`/checkins/${checkin.id}`} className={cx("card-title")}>
          {checkin.title}
        </Link>
        <p>{checkin.caption}</p>
        <div className={cx("card-meta")}>
          <span>{checkin.locationName}</span>
          <span>{formatDate(checkin.checkinTime)}</span>
          <span>{checkin.createdBy} thêm</span>
        </div>
      </div>
    </article>
  );
}
