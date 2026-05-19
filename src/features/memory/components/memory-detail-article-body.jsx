import { cx } from "@/shared/lib/styles";

export function MemoryDetailArticleBody({ category, checkin, mood }) {
  return (
    <div className={cx("article-prose")}>
      <div className={cx("tag-row")}>
        <span className={cx("pill")} style={{ "--pill-color": category.color }}>
          {category.icon} · {category.name}
        </span>
        <span className={cx("pill muted")}>{mood.icon} · {mood.name}</span>
        <span className={cx("pill muted")}>Chỉ hai người</span>
      </div>

      <p className={cx("article-lead")}>{checkin.caption}</p>
      <p>
        Đây là phần bài viết dài hơn cho kỷ niệm. Khi backend sẵn sàng, nội dung này có thể lấy từ
        trường `note` hoặc `articleBody`, cho phép lưu lại câu chuyện đầy đủ sau mỗi chuyến đi, buổi
        hẹn hoặc một khoảnh khắc nhỏ đáng nhớ.
      </p>
    </div>
  );
}
