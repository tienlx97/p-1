import { CheckinCard } from "@/features/memory/components/checkin-card";
import { cx } from "@/shared/lib/styles";

export function RelatedMemoriesSection({ memories }) {
  if (memories.length === 0) {
    return null;
  }

  return (
    <section className={cx("section-block")}>
      <div className={cx("section-heading")}>
        <div>
          <p className={cx("eyebrow")}>Gợi ý</p>
          <h2>Kỷ niệm khác</h2>
        </div>
      </div>
      <div className={cx("checkin-grid two")}>
        {memories.map((item) => (
          <CheckinCard checkin={item} key={item.id} compact />
        ))}
      </div>
    </section>
  );
}
