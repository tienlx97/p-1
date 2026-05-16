"use client";

import { useMemo, useState } from "react";
import { categories, checkins, moods } from "@/lib/mock-data";
import { CheckinCard } from "@/components/checkin-card";
import { Field, SelectField, SelectItem } from "@/components/ui";

import { cx } from "@/lib/styles";

export function CheckinFilters() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [moodId, setMoodId] = useState("all");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...checkins]
      .filter((checkin) => {
        const queryMatch =
          !normalizedQuery ||
          checkin.title.toLowerCase().includes(normalizedQuery) ||
          checkin.locationName.toLowerCase().includes(normalizedQuery) ||
          checkin.city.toLowerCase().includes(normalizedQuery);
        const categoryMatch = categoryId === "all" || checkin.categoryId === categoryId;
        const moodMatch = moodId === "all" || checkin.moodId === moodId;
        return queryMatch && categoryMatch && moodMatch;
      })
      .sort((a, b) => {
        const left = new Date(a.checkinTime).getTime();
        const right = new Date(b.checkinTime).getTime();
        return sort === "newest" ? right - left : left - right;
      });
  }, [categoryId, moodId, query, sort]);

  return (
    <>
      <section className={cx("filter-panel")} aria-label="Tìm kiếm và lọc kỷ niệm">
        <div className={cx("search-field")}>
          <span aria-hidden="true">⌕</span>
          <Field
            aria-label="Tìm tiêu đề, ghi chú hoặc địa điểm"
            className={cx("search-field-input")}
            value={query}
            onChange={setQuery}
            placeholder="Tìm tiêu đề, ghi chú hoặc địa điểm"
          />
        </div>

        <SelectField
          className={cx("aria-select filter-select")}
          selectedKey={categoryId}
          onSelectionChange={setCategoryId}
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
          onSelectionChange={setMoodId}
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
          onSelectionChange={setSort}
        >
          <SelectItem id="newest">Mới nhất</SelectItem>
          <SelectItem id="oldest">Cũ nhất</SelectItem>
        </SelectField>
      </section>

      <section className={cx("library-summary")} aria-label="Tổng quan thư viện">
        <div>
          <span>{filtered.length}</span>
          <strong>kỷ niệm phù hợp</strong>
        </div>
        <p>Thư viện ưu tiên ảnh lớn, metadata gọn và bộ lọc nhanh theo nơi chốn, nhóm và cảm xúc.</p>
      </section>

      <section className={cx("checkin-grid gallery-grid")} aria-label="Danh sách kỷ niệm">
        {filtered.map((checkin) => (
          <CheckinCard checkin={checkin} key={checkin.id} />
        ))}
      </section>
    </>
  );
}
