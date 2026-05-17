"use client";

import { LoadableImage } from "@/features/memory/components/loadable-image";

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
