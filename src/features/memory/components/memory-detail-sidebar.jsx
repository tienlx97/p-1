import { DetailActions } from "@/features/memory/components/detail-actions";
import { formatDate } from "@/entities/memory";
import { cx } from "@/shared/lib/styles";

export function MemoryDetailSidebar({ category, checkin, mediaSummary }) {
  return (
    <aside className={cx("article-aside")}>
      <dl className={cx("meta-list")}>
        <div>
          <dt>Địa điểm</dt>
          <dd>{checkin.locationName}</dd>
        </div>
        <div>
          <dt>Địa chỉ</dt>
          <dd>{checkin.address}</dd>
        </div>
        <div>
          <dt>Ngày kỷ niệm</dt>
          <dd>{formatDate(checkin.checkinTime)}</dd>
        </div>
        <div>
          <dt>Người thêm</dt>
          <dd>{checkin.createdBy}</dd>
        </div>
        <div>
          <dt>Media</dt>
          <dd>
            {mediaSummary.photos} ảnh{mediaSummary.videos ? `, ${mediaSummary.videos} video` : ""}
          </dd>
        </div>
      </dl>

      <div className={cx("mini-map")}>
        <span
          style={{
            left: `${checkin.mapPosition.x}%`,
            top: `${checkin.mapPosition.y}%`,
            "--marker-color": category.color
          }}
        />
      </div>

      <DetailActions />
    </aside>
  );
}
