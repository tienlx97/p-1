import { CheckinFormMock } from "@/features/memory/components/checkin-form-mock";
import { PageHeader } from "@/shared/components/ui";
import { cx } from "@/shared/lib/styles";

export function MemoryCreatePage() {
  return (
    <div className={cx("page-stack")}>
      <PageHeader
        eyebrow="Thêm kỷ niệm"
        title="Lưu ảnh, ngày, ghi chú và địa điểm trong một form."
        description="Nhập thông tin chính trước, sau đó thêm ảnh/video và gắn địa điểm để lưu kỷ niệm."
      />
      <CheckinFormMock />
    </div>
  );
}
