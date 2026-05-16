import { CheckinFormMock } from "@/components/checkin-form-mock";
import { PageHeader } from "@/components/ui";

import { cx } from "@/lib/styles";

export default function NewCheckinPage() {
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
