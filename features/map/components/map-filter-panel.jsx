"use client";

import { useRef } from "react";
import { Button } from "react-aria-components";
import { categories, moods } from "@/entities/memory";
import { cx } from "@/shared/lib/styles";

const categoryIcons = {
  all: "•",
  beach: "≋",
  coffee: "☕",
  culture: "▦",
  food: "⌁",
  home: "⌂",
  mountain: "△",
  travel: "✈"
};

const moodIcons = {
  all: "•",
  chill: "~",
  explore: "⌖",
  happy: "+",
  memorable: "★",
  peaceful: "○",
  romantic: "♡"
};

export function MapFilterPanel({
  categoryId,
  moodId,
  onCategoryChange,
  onMoodChange,
  totalCount,
  visibleCount
}) {
  const railRef = useRef(null);
  const categoryOptions = [{ id: "all", name: "Tất cả địa điểm" }, ...categories];
  const moodOptions = [{ id: "all", name: "Mọi cảm xúc" }, ...moods];

  function scrollRail(direction) {
    railRef.current?.scrollBy({
      left: direction * 220,
      behavior: "smooth"
    });
  }

  return (
    <section className={cx("map-filter-panel")} aria-label="Lọc nhanh bản đồ">
      <Button
        type="button"
        className={cx("map-filter-scroll")}
        aria-label="Cuộn bộ lọc sang trái"
        onPress={() => scrollRail(-1)}
      >
        ‹
      </Button>

      <div ref={railRef} className={cx("map-filter-row")} aria-label="Lọc theo nhóm và cảm xúc">
        <span className={cx("map-filter-count")} aria-label={`${visibleCount} trên ${totalCount} kỷ niệm`}>
          {visibleCount}/{totalCount}
        </span>

        {categoryOptions.map((category) => {
          const isActive = categoryId === category.id;

          return (
            <Button
              key={category.id}
              type="button"
              className={cx("map-filter-chip", isActive && "active")}
              style={category.color ? { "--chip-color": category.color } : undefined}
              aria-pressed={isActive}
              onPress={() => onCategoryChange(category.id)}
            >
              <span className={cx("map-filter-icon")} aria-hidden="true">
                {categoryIcons[category.id] ?? "•"}
              </span>
              {category.name}
            </Button>
          );
        })}

        <span className={cx("map-filter-divider")} aria-hidden="true" />

        {moodOptions.map((mood) => {
          const isActive = moodId === mood.id;

          return (
            <Button
              key={mood.id}
              type="button"
              className={cx("map-filter-chip", "mood", isActive && "active")}
              aria-pressed={isActive}
              onPress={() => onMoodChange(mood.id)}
            >
              <span className={cx("map-filter-icon")} aria-hidden="true">
                {moodIcons[mood.id] ?? "•"}
              </span>
              {mood.name}
            </Button>
          );
        })}
      </div>

      <Button
        type="button"
        className={cx("map-filter-scroll")}
        aria-label="Cuộn bộ lọc sang phải"
        onPress={() => scrollRail(1)}
      >
        ›
      </Button>
    </section>
  );
}
