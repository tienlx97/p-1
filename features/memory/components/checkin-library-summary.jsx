"use client";

import { cx } from "@/shared/lib/styles";

export function CheckinLibrarySummary({ count }) {
  return (
    <section className={cx("library-summary")} aria-label="Tổng quan thư viện">
      <div>
        <span>{count}</span>
        <strong>kỷ niệm phù hợp</strong>
      </div>
      <p>Thư viện ưu tiên ảnh lớn, metadata gọn và bộ lọc nhanh theo nơi chốn, nhóm và cảm xúc.</p>
    </section>
  );
}
