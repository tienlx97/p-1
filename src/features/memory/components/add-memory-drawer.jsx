"use client";

import { useRef } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { FocusScope, mergeProps, useDialog, useModal, useOverlay, usePreventScroll } from "react-aria";
import { Button } from "react-aria-components";
import { DRAWER_SCROLL_OPTIONS } from "@/features/memory/constants/memory-drawer-constants";
import { QuickMemoryPanel } from "@/features/memory/components/quick-memory-panel";
import { cx } from "@/shared/lib/styles";

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

  return (
    <FocusScope autoFocus contain restoreFocus>
      <div {...underlayProps} className={cx("drawer-backdrop")} role="presentation" />
      <aside {...drawerProps} ref={drawerRef} className={cx("map-drawer add-drawer")}>
        <span className={cx("drawer-handle")} aria-hidden="true" />
        <div className={cx("drawer-head")}>
          <div>
            <p className={cx("eyebrow")}>Thêm mới</p>
            <h2 {...titleProps} ref={titleRef}>
              Thêm kỷ niệm
            </h2>
          </div>
          <Button
            aria-label="Đóng drawer"
            className={cx("icon-btn")}
            type="button"
            onPress={onClose}
          >
            <span aria-hidden="true">×</span>
            <span className={cx("sr-only")}>Đóng</span>
          </Button>
        </div>

        <OverlayScrollbarsComponent
          className={cx("add-drawer-scroll")}
          defer
          options={DRAWER_SCROLL_OPTIONS}
        >
          <QuickMemoryPanel embedded />
        </OverlayScrollbarsComponent>
      </aside>
    </FocusScope>
  );
}
