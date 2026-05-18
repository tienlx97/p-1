"use client";

import { useRef } from "react";
import { Button } from "react-aria-components";
import { categories } from "@/entities/memory";
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

function stopMapInteraction(event) {
  event.stopPropagation();
}

export function MapFilterPanel({
  categoryId,
  onCategoryChange,
  totalCount,
  visibleCount
}) {
  const railRef = useRef(null);
  const categoryOptions = [{ id: "all", name: "Tất cả địa điểm" }, ...categories];
  const countLabel =
    visibleCount === totalCount
      ? `${totalCount} địa điểm`
      : `${visibleCount}/${totalCount} địa điểm`;

  function scrollRail(direction) {
    railRef.current?.scrollBy({
      left: direction * 220,
      behavior: "smooth"
    });
  }

  return (
    <section
      className={cx("map-filter-panel")}
      aria-label="Lọc nhanh bản đồ"
      onDoubleClick={stopMapInteraction}
      onPointerDown={stopMapInteraction}
      onWheel={stopMapInteraction}
    >
      <Button
        type="button"
        className={cx("map-filter-scroll", "is-left")}
        aria-label="Cuộn bộ lọc sang trái"
        onPress={() => scrollRail(-1)}
      >
        <span className={cx("map-filter-scroll-icon")} aria-hidden="true" />
      </Button>

      <div ref={railRef} className={cx("map-filter-row")} aria-label="Lọc theo nhóm">
        <span className={cx("map-filter-count")} aria-label={countLabel}>
          {countLabel}
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
      </div>

      <Button
        type="button"
        className={cx("map-filter-scroll", "is-right")}
        aria-label="Cuộn bộ lọc sang phải"
        onPress={() => scrollRail(1)}
      >
        <span className={cx("map-filter-scroll-icon")} aria-hidden="true" />
      </Button>
    </section>
  );
}
