"use client";

import dynamic from "next/dynamic";

import { cx } from "@/lib/styles";

const CheckinMap = dynamic(
  () => import("@/components/checkin-map").then((module) => module.CheckinMap),
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
  return <CheckinMap />;
}
