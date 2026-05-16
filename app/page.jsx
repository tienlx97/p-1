import { MapSection } from "@/components/map-section";

import { cx } from "@/lib/styles";

export default function HomePage() {
  return (
    <div className={cx("overview-map-page")}>
      <MapSection />
    </div>
  );
}
