"use client";

import dynamic from "next/dynamic";

import { cx } from "@/shared/lib/styles";

const CheckinMap = dynamic(
  () => import("@/features/map/components/checkin-map").then((module) => module.CheckinMap),
  {
    ssr: false,
    loading: () => (
      <section className={cx("map-workspace")}>
        <div className={cx("map-loading")}>Đang tải bản đồ kỷ niệm...</div>
      </section>
    )
  }
);

export function MapSection() {
  return (
    <div className={cx("overview-map-page")}>
      <CheckinMap />
    </div>
  );
}
