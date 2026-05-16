import { CheckinFilters } from "@/components/checkin-filters";
import { PageHeader, PrimaryLink } from "@/components/ui";

import { cx } from "@/lib/styles";

export default function CheckinsPage() {
  return (
    <div className={cx("page-stack")}>
      <PageHeader
        eyebrow="Thư viện kỷ niệm"
        title="Gallery riêng cho ảnh, video và những nơi hai người đã đi qua."
        description="Thiết kế lại theo hướng photo-first: lọc nhanh, card lớn, xem chi tiết hoặc quay lại bản đồ khi cần."
        action={<PrimaryLink href="/checkins/new">Thêm kỷ niệm</PrimaryLink>}
      />
      <CheckinFilters />
    </div>
  );
}
