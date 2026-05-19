"use client";

import Image from "next/image";
import { Button } from "react-aria-components";
import { useAuthSession } from "@/features/auth";
import {
  categories,
  checkins,
  coupleSpace,
  formatDate,
  getCategory,
  getCoverImage,
  getMediaSummary,
  getMood,
} from "@/entities/memory";
import styles from "./profile-page.module.css";

function StatCard({ accent, label, value }) {
  return (
    <div className={styles.statCard} style={accent ? { borderTopColor: accent } : undefined}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function RecentMemoryCard({ checkin }) {
  const category = getCategory(checkin.categoryId);
  const mood = getMood(checkin.moodId);
  const coverImage = getCoverImage(checkin);
  const mediaSummary = getMediaSummary(checkin);

  return (
    <article className={styles.recentCard}>
      <div className={styles.recentImage}>
        <Image src={coverImage} alt={checkin.title} fill sizes="(max-width: 820px) 100vw, 230px" />
        <span>
          {mediaSummary.photos} ảnh{mediaSummary.videos ? ` · ${mediaSummary.videos} video` : ""}
        </span>
      </div>
      <div className={styles.recentBody}>
        <div className={styles.tagRow}>
          <span className={styles.pill} style={{ "--pill-color": category.color }}>
            {category.icon} · {category.name}
          </span>
          <span className={styles.mutedPill}>{mood.icon} · {mood.name}</span>
        </div>
        <h3>{checkin.title}</h3>
        <p>{checkin.caption}</p>
        <div className={styles.recentMeta}>
          <span>{checkin.locationName}</span>
          <span>{formatDate(checkin.checkinTime)}</span>
        </div>
      </div>
    </article>
  );
}

export function ProfilePage() {
  const { activeAccount, signOut } = useAuthSession();
  const firstMemory = checkins.at(-1);
  const latestMemory = checkins[0];

  return (
    <div className={styles.root}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Không gian của chúng mình</p>
          <h1>{coupleSpace.spaceName}</h1>
          <p>Thông tin chung, người trong không gian, ngày bắt đầu và các cột mốc đã lưu.</p>
        </div>
      </header>

      {activeAccount ? (
        <section className={styles.accountPanel} aria-label="Tài khoản đang đăng nhập">
          <span
            className={styles.accountAvatar}
            style={{ "--account-accent": activeAccount.accent }}
            aria-hidden="true"
          >
            {activeAccount.initials}
          </span>
          <div>
            <p className={styles.eyebrow}>Đang đăng nhập</p>
            <h2>{activeAccount.displayName}</h2>
            <span>{activeAccount.role}</span>
          </div>
          <Button className={styles.signOutButton} type="button" onPress={signOut}>
            Đăng xuất
          </Button>
        </section>
      ) : null}

      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src={coupleSpace.coverImage}
            alt=""
            fill
            priority
            sizes="(max-width: 820px) 100vw, 360px"
          />
        </div>
        <div>
          <p className={styles.eyebrow}>Bắt đầu {formatDate(coupleSpace.startDate)}</p>
          <h2>{coupleSpace.name}</h2>
          <p>{coupleSpace.bio}</p>
          <div className={styles.peopleRow}>
            {coupleSpace.people.map((person) => (
              <span key={person.id}>
                <Image src={person.avatar} alt={person.displayName} width={48} height={48} />
                {person.displayName}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.statsGrid}>
        <StatCard label="Kỷ niệm" value={coupleSpace.stats.memories} accent="#2f7d6f" />
        <StatCard label="Địa điểm" value={coupleSpace.stats.places} accent="#d9654f" />
        <StatCard label="Ảnh" value={coupleSpace.stats.photos} accent="#2b8fb8" />
        <StatCard label="Ngày bên nhau" value={coupleSpace.stats.daysTogether} accent="#6e63b6" />
      </section>

      <section className={styles.profileGrid}>
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Cột mốc</p>
              <h2>Dấu mốc chính</h2>
            </div>
          </div>
          <div className={styles.preferenceList}>
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceIndex} style={{ background: "#2f7d6f" }}>1</span>
              <strong>Kỷ niệm đầu tiên</strong>
              <small>{firstMemory.title}</small>
            </div>
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceIndex} style={{ background: "#d9654f" }}>2</span>
              <strong>Gần đây nhất</strong>
              <small>{latestMemory.title}</small>
            </div>
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceIndex} style={{ background: "#6e63b6" }}>3</span>
              <strong>Nhóm lưu nhiều</strong>
              <small>{categories[0].name}</small>
            </div>
          </div>
        </div>

        <div className={styles.profileMap}>
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

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Gần đây</p>
            <h2>Kỷ niệm gần đây</h2>
          </div>
        </div>
        <div className={styles.recentGrid}>
          {checkins.slice(0, 3).map((checkin) => (
            <RecentMemoryCard checkin={checkin} key={checkin.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
