import Image from "next/image";

import { cx } from "@/shared/lib/styles";

export function MemoryDetailMediaGrid({ checkin, media }) {
  return (
    <section className={cx("article-media")} aria-label="Ảnh và video của kỷ niệm">
      {media.map((item, index) => (
        <figure
          className={index === 0 ? cx("article-media-item featured") : cx("article-media-item")}
          key={item.id}
        >
          {item.type === "video" ? (
            <video controls preload="metadata">
              <source src={item.url} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={item.url}
              alt={item.alt || checkin.title}
              fill
              sizes={
                index === 0 ? "(max-width: 820px) 100vw, 720px" : "(max-width: 820px) 50vw, 360px"
              }
            />
          )}
          {item.type === "video" ? <figcaption>Video</figcaption> : null}
        </figure>
      ))}
    </section>
  );
}
