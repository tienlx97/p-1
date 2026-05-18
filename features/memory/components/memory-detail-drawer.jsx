"use client";

import { useRef } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { FocusScope, mergeProps, useDialog, useOverlay } from "react-aria";
import { Button } from "react-aria-components";
import { MemoryDetailContent } from "@/features/memory/components/memory-detail-content";
import { DRAWER_SCROLL_OPTIONS } from "@/features/memory/components/memory-drawer-constants";
import { cx } from "@/shared/lib/styles";

export function MemoryDetailDrawer({ checkin, initialMediaIndex, onClose }) {
  const drawerRef = useRef(null);
  const titleRef = useRef(null);
  const title = checkin?.title ?? "Thông tin kỷ niệm";
  const { overlayProps, underlayProps } = useOverlay(
    {
      isDismissable: false,
      isKeyboardDismissDisabled: false,
      isOpen: true,
      onClose,
      shouldCloseOnInteractOutside: () => false
    },
    drawerRef
  );
  const { dialogProps, titleProps } = useDialog({}, drawerRef);
  const drawerProps = mergeProps(overlayProps, dialogProps);

  if (!checkin) {
    return null;
  }

  return (
    <FocusScope restoreFocus>
      <div {...underlayProps} className={cx("drawer-backdrop")} role="presentation" />
      <aside {...drawerProps} ref={drawerRef} className={cx("map-drawer memory-drawer")}>
        <span className={cx("drawer-handle")} aria-hidden="true" />
        <div className={cx("drawer-head memory-drawer-head")}>
          <h2 {...titleProps} ref={titleRef} className={cx("sr-only")}>
            {title}
          </h2>
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
          className={cx("drawer-scroll")}
          defer
          options={DRAWER_SCROLL_OPTIONS}
        >
          <MemoryDetailContent checkin={checkin} initialMediaIndex={initialMediaIndex} />
        </OverlayScrollbarsComponent>
      </aside>
    </FocusScope>
  );
}
