'use client'

import dynamic from 'next/dynamic'

import styles from './map-section.module.css'

const CheckinMap = dynamic(
  () => import('@/features/map/components/checkin-map').then((module) => module.CheckinMap),
  {
    ssr: false,
    loading: () => (
      <section className={styles.fallbackWorkspace}>
        <div className={styles.loading}>Đang tải bản đồ kỷ niệm...</div>
      </section>
    ),
  }
)

export function MapSection() {
  return (
    <div className={styles.root}>
      <CheckinMap />
    </div>
  )
}
