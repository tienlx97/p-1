import { CheckinLibrary } from "@/features/memory/components/checkin-library";
import { PageHeader } from "@/shared/components/ui";
import { cx } from "@/shared/lib/styles";

export function MemoryLibraryPage() {
  return (
    <div className={cx("page-stack")}>
      <PageHeader
        eyebrow="Thư viện kỷ niệm"
        title="Gallery riêng cho ảnh, video và những nơi hai người đã đi qua."
        description="Thiết kế lại theo hướng photo-first: lọc nhanh, card lớn, xem chi tiết hoặc quay lại bản đồ khi cần."
      />
      <CheckinLibrary />
    </div>
  );
}
