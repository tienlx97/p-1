"use client";

import { useEffect, useRef } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { FocusScope, mergeProps, useDialog, useModal, useOverlay, usePreventScroll } from "react-aria";
import { Button } from "react-aria-components";
import { DRAWER_SCROLL_OPTIONS } from "@/features/memory/constants/memory-drawer-constants";
import { QuickMemoryPanel } from "@/features/memory/components/quick-memory-panel";
import { cx } from "@/shared/lib/cx";
import styles from "./add-memory-drawer.module.css";

const DRAWER_OPEN_CLASS = "memory-drawer-open";

export function AddMemoryDrawer({ onClose }) {
  const drawerRef = useRef(null);
  const titleRef = useRef(null);
  const { overlayProps, underlayProps } = useOverlay(
    {
      isDismissable: true,
      isKeyboardDismissDisabled: false,
      isOpen: true,
      onClose,
      shouldCloseOnInteractOutside: () => true
    },
    drawerRef
  );
  const { modalProps } = useModal();
  const { dialogProps, titleProps } = useDialog({}, drawerRef);
  const drawerProps = mergeProps(overlayProps, dialogProps, modalProps);

  usePreventScroll();

  useEffect(() => {
    document.body.classList.add(DRAWER_OPEN_CLASS);

    return () => {
      document.body.classList.remove(DRAWER_OPEN_CLASS);
    };
  }, []);

  return (
    <FocusScope autoFocus contain restoreFocus>
      <div {...underlayProps} className={styles.backdrop} role="presentation" />
      <aside {...drawerProps} ref={drawerRef} className={cx(styles.drawer, styles.addDrawer)}>
        <span className={styles.handle} aria-hidden="true" />
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>Thêm mới</p>
            <h2 {...titleProps} ref={titleRef}>
              Thêm kỷ niệm
            </h2>
          </div>
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
          <QuickMemoryPanel embedded />
        </OverlayScrollbarsComponent>
      </aside>
    </FocusScope>
  );
}
