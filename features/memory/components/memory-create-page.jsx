import { CheckinFormMock } from "@/features/memory/components/checkin-form-mock";
import { PageHeader } from "@/shared/components/ui";
import { cx } from "@/shared/lib/styles";

export function MemoryCreatePage() {
  return (
    <div className={cx("page-stack")}>
      <PageHeader
        eyebrow="Thêm kỷ niệm"
        title="Lưu ảnh, ngày, ghi chú và địa điểm trong một form."
        description="Chỉ tiêu đề và ngày là bắt buộc. Địa điểm, ảnh và cảm xúc có thể thêm sau."
      />
      <CheckinFormMock />
    </div>
  );
}
