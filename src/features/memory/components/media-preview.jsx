"use client";

import { LoadableImage } from "@/features/memory/components/loadable-image";

/**
 * @typedef {object} MediaPreviewProps
 * @property {import("@/entities/memory/mock-data").MemoryMediaItem | undefined} item
 * @property {string} alt
 * @property {string} [className]
 */

/**
 * @param {MediaPreviewProps} props
 */
export function MediaPreview({ item, alt, className }) {
  if (item?.type === "video") {
    return (
      <video
        aria-hidden="true"
        className={className}
        muted
        playsInline
        preload="metadata"
        src={item.url}
      />
    );
  }

  return (
    <LoadableImage
      className={className}
      src={item?.url}
      alt={alt}
      fill
      sizes="(max-width: 820px) 34vw, 160px"
    />
  );
}
