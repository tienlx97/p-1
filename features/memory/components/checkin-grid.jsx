"use client";

import { CheckinCard } from "@/features/memory/components/checkin-card";
import { cx } from "@/shared/lib/styles";

export function CheckinGrid({ checkins }) {
  return (
    <section className={cx("checkin-grid gallery-grid")} aria-label="Danh sách kỷ niệm">
      {checkins.map((checkin) => (
        <CheckinCard checkin={checkin} key={checkin.id} />
      ))}
    </section>
  );
}
