"use client";

import { categories, moods } from "@/entities/memory";
import { Field, SelectField, SelectItem } from "@/shared/components/ui";
import { cx } from "@/shared/lib/styles";

export function CheckinFilters({
  categoryId,
  moodId,
  onCategoryChange,
  onMoodChange,
  onQueryChange,
  onSortChange,
  query,
  sort
}) {
  return (
    <section className={cx("filter-panel")} aria-label="Tìm kiếm và lọc kỷ niệm">
      <div className={cx("search-field")}>
        <span aria-hidden="true">⌕</span>
        <Field
          aria-label="Tìm tiêu đề, ghi chú hoặc địa điểm"
          className={cx("search-field-input")}
          value={query}
          onChange={onQueryChange}
          placeholder="Tìm tiêu đề, ghi chú hoặc địa điểm"
        />
      </div>

      <SelectField
        className={cx("aria-select filter-select")}
        selectedKey={categoryId}
        onSelectionChange={onCategoryChange}
      >
        <SelectItem id="all">Tất cả nhóm</SelectItem>
        {categories.map((category) => (
          <SelectItem id={category.id} key={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectField>

      <SelectField
        className={cx("aria-select filter-select")}
        selectedKey={moodId}
        onSelectionChange={onMoodChange}
      >
        <SelectItem id="all">Tất cả cảm xúc</SelectItem>
        {moods.map((mood) => (
          <SelectItem id={mood.id} key={mood.id}>
            {mood.name}
          </SelectItem>
        ))}
      </SelectField>

      <SelectField
        className={cx("aria-select filter-select")}
        selectedKey={sort}
        onSelectionChange={onSortChange}
      >
        <SelectItem id="newest">Mới nhất</SelectItem>
        <SelectItem id="oldest">Cũ nhất</SelectItem>
      </SelectField>
    </section>
  );
}
