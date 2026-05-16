import Image from "next/image";
import { CheckinCard } from "@/components/checkin-card";
import { PageHeader, StatCard } from "@/components/ui";
import { categories, checkins, coupleSpace, formatDate } from "@/lib/mock-data";

import { cx } from "@/lib/styles";

export default function ProfilePage() {
  const firstMemory = checkins[checkins.length - 1];
  const latestMemory = checkins[0];

  return (
    <div className={cx("page-stack")}>
      <PageHeader
        eyebrow="Không gian của chúng mình"
        title={coupleSpace.spaceName}
        description="Thông tin chung, người trong không gian, ngày bắt đầu và các cột mốc đã lưu."
      />

      <section className={cx("profile-hero")}>
        <div className={cx("profile-hero-image")}>
          <Image
            src={coupleSpace.coverImage}
            alt=""
            fill
            priority
            sizes="(max-width: 820px) 100vw, 360px"
          />
        </div>
        <div>
          <p className={cx("eyebrow")}>Bắt đầu {formatDate(coupleSpace.startDate)}</p>
          <h2>{coupleSpace.name}</h2>
          <p>{coupleSpace.bio}</p>
          <div className={cx("people-row profile-people")}>
            {coupleSpace.people.map((person) => (
              <span key={person.id}>
                <Image src={person.avatar} alt={person.displayName} width={48} height={48} />
                {person.displayName}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className={cx("stats-grid")}>
        <StatCard label="Kỷ niệm" value={coupleSpace.stats.memories} accent="#2f7d6f" />
        <StatCard label="Địa điểm" value={coupleSpace.stats.places} accent="#d9654f" />
        <StatCard label="Ảnh" value={coupleSpace.stats.photos} accent="#2b8fb8" />
        <StatCard label="Ngày bên nhau" value={coupleSpace.stats.daysTogether} accent="#6e63b6" />
      </section>

      <section className={cx("profile-grid")}>
        <div className={cx("section-block")}>
          <div className={cx("section-heading")}>
            <div>
              <p className={cx("eyebrow")}>Cột mốc</p>
              <h2>Dấu mốc chính</h2>
            </div>
          </div>
          <div className={cx("preference-list")}>
            <div>
              <span style={{ background: "#2f7d6f" }}>1</span>
              <strong>Kỷ niệm đầu tiên</strong>
              <small>{firstMemory.title}</small>
            </div>
            <div>
              <span style={{ background: "#d9654f" }}>2</span>
              <strong>Gần đây nhất</strong>
              <small>{latestMemory.title}</small>
            </div>
            <div>
              <span style={{ background: "#6e63b6" }}>3</span>
              <strong>Nhóm lưu nhiều</strong>
              <small>{categories[0].name}</small>
            </div>
          </div>
        </div>

        <div className={cx("profile-map")}>
          {checkins.map((checkin) => (
            <span
              key={checkin.id}
              style={{
                left: `${checkin.mapPosition.x}%`,
                top: `${checkin.mapPosition.y}%`
              }}
            />
          ))}
        </div>
      </section>

      <section className={cx("section-block")}>
        <div className={cx("section-heading")}>
          <div>
            <p className={cx("eyebrow")}>Gần đây</p>
            <h2>Kỷ niệm gần đây</h2>
          </div>
        </div>
        <div className={cx("checkin-grid three")}>
          {checkins.slice(0, 3).map((checkin) => (
            <CheckinCard checkin={checkin} key={checkin.id} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
