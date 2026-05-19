'use client'

import { useEffect, useRef } from 'react'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { FocusScope, mergeProps, useDialog, useOverlay } from 'react-aria'
import { Button } from 'react-aria-components'
import { MemoryDetailContent } from '@/features/memory/components/memory-detail-content'
import { DRAWER_SCROLL_OPTIONS } from '@/features/memory/constants/memory-drawer-constants'
import { cx } from '@/shared/lib/cx'
import styles from './memory-detail-drawer.module.css'

const DRAWER_OPEN_CLASS = 'memory-drawer-open'

export function MemoryDetailDrawer({ checkin, initialMediaIndex, onClose }) {
  const drawerRef = useRef(null)
  const titleRef = useRef(null)
  const title = checkin?.title ?? 'Thông tin kỷ niệm'
  const { overlayProps, underlayProps } = useOverlay(
    {
      isDismissable: false,
      isKeyboardDismissDisabled: false,
      isOpen: true,
      onClose,
      shouldCloseOnInteractOutside: () => false,
    },
    drawerRef
  )
  const { dialogProps, titleProps } = useDialog({}, drawerRef)
  const drawerProps = mergeProps(overlayProps, dialogProps)

  useEffect(() => {
    if (checkin) {
      document.body.classList.add(DRAWER_OPEN_CLASS)

      return () => {
        document.body.classList.remove(DRAWER_OPEN_CLASS)
      }
    }
  }, [checkin])

  if (!checkin) {
    return null
  }

  return (
    <FocusScope restoreFocus>
      <div {...underlayProps} className={styles.backdrop} role="presentation" />
      <aside {...drawerProps} ref={drawerRef} className={cx(styles.drawer, styles.memoryDrawer)}>
        <span className={styles.handle} aria-hidden="true" />
        <div className={styles.head}>
          <h2 {...titleProps} ref={titleRef} className={styles.srOnly}>
            {title}
          </h2>
          <Button
            aria-label="Đóng drawer"
            className={styles.iconButton}
            type="button"
            onPress={onClose}
          >
            <span aria-hidden="true">×</span>
            <span className={styles.srOnly}>Đóng</span>
          </Button>
        </div>

        <OverlayScrollbarsComponent
          className={styles.scroll}
          defer
          options={DRAWER_SCROLL_OPTIONS}
        >
          <MemoryDetailContent checkin={checkin} initialMediaIndex={initialMediaIndex} />
        </OverlayScrollbarsComponent>
      </aside>
    </FocusScope>
  )
}
