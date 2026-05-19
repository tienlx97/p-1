import { notFound } from "next/navigation";
import { MemoryDetailArticleBody } from "@/features/memory/components/memory-detail-article-body";
import { MemoryDetailMediaGrid } from "@/features/memory/components/memory-detail-media-grid";
import { MemoryDetailSidebar } from "@/features/memory/components/memory-detail-sidebar";
import { RelatedMemoriesSection } from "@/features/memory/components/related-memories-section";
import { PageHeader, SecondaryLink } from "@/shared/components/ui";
import {
  checkins,
  formatDate,
  getCategory,
  getMemoryMedia,
  getMediaSummary,
  getMood
} from "@/entities/memory";
import { cx } from "@/shared/lib/styles";

export function MemoryDetailPage({ id }) {
  const checkin = checkins.find((item) => item.id === id);

  if (!checkin) {
    notFound();
  }

  const category = getCategory(checkin.categoryId);
  const mood = getMood(checkin.moodId);
  const media = getMemoryMedia(checkin);
  const mediaSummary = getMediaSummary(checkin);
  const related = checkins.filter((item) => item.id !== checkin.id).slice(0, 2);

  return (
    <div className={cx("page-stack article-stack")}>
      <PageHeader
        eyebrow="Bài viết kỷ niệm"
        title={checkin.title}
        description={`${mediaSummary.photos} ảnh${mediaSummary.videos ? ` · ${mediaSummary.videos} video` : ""} · ${checkin.locationName} · ${formatDate(checkin.checkinTime)}`}
        action={
          <SecondaryLink href="/">
            <span aria-hidden="true">←</span>
            Bản đồ
          </SecondaryLink>
        }
      />

      <article className={cx("memory-article")}>
        <MemoryDetailMediaGrid checkin={checkin} media={media} />

        <section className={cx("article-content")}>
          <MemoryDetailArticleBody category={category} checkin={checkin} mood={mood} />
          <MemoryDetailSidebar category={category} checkin={checkin} mediaSummary={mediaSummary} />
        </section>
      </article>

      <RelatedMemoriesSection memories={related} />
    </div>
  );
}
