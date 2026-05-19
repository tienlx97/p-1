"use client";

import { usePathname, useRouter } from "next/navigation";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useEffect, useState } from "react";
import { Button, Link, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

import { cx } from "@/shared/lib/cx";
import styles from "./app-shell.module.css";

const navItems = [
  { href: "/", label: "Bản đồ", icon: "map" },
  { href: "/profile", label: "Hồ sơ", icon: "profile" }
];

const ADD_MEMORY_EVENT = "photo-mem:open-add-memory";
const PAGE_SCROLL_OPTIONS = {
  overflow: { x: "hidden" },
  scrollbars: {
    autoHide: "leave",
    autoHideDelay: 120,
    theme: "os-theme-google-map"
  }
};

export function AppShell({ children, currentUser, onSignOut }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const isRouteLoading = Boolean(pendingHref);
  const isHomeRoute = pathname === "/";

  function openAddMemory() {
    if (pathname !== "/") {
      sessionStorage.setItem(ADD_MEMORY_EVENT, "1");
      setPendingHref("/");
      router.push("/");
      return;
    }

    globalThis.dispatchEvent(new CustomEvent(ADD_MEMORY_EVENT));
  }

  return (
    <div className={styles.root}>
      <OverlayScrollbarsComponent
        element="main"
        className={cx(styles.mainPanel, isHomeRoute && styles.homeMainPanel)}
        aria-busy={isRouteLoading}
        defer
        options={PAGE_SCROLL_OPTIONS}
      >
        {isRouteLoading ? <RouteSkeleton /> : null}
        {children}
      </OverlayScrollbarsComponent>

      <nav className={styles.bottomNav} aria-label="Điều hướng chính">
        {navItems.slice(0, 1).map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cx(styles.bottomNavItem, isActive && styles.active)}
              onPress={() => {
                if (!isActive) {
                  setPendingHref(item.href);
                }
              }}
            >
              <span className={styles.bottomNavIcon} aria-hidden="true">
                <NavIcon name={item.icon} />
              </span>
              <small className={styles.bottomNavLabel}>{item.label}</small>
            </Link>
          );
        })}
        <Button
          className={styles.bottomNavAdd}
          type="button"
          aria-label="Thêm kỷ niệm"
          onPress={openAddMemory}
        >
          <span className={styles.bottomNavAddIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 6.5v11" />
              <path d="M6.5 12h11" />
            </svg>
          </span>
        </Button>
        {navItems.slice(1).map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cx(styles.bottomNavItem, isActive && styles.active)}
              onPress={() => {
                if (!isActive) {
                  setPendingHref(item.href);
                }
              }}
            >
              <span className={styles.bottomNavIcon} aria-hidden="true">
                <NavIcon name={item.icon} />
              </span>
              <small className={styles.bottomNavLabel}>{item.label}</small>
            </Link>
          );
        })}
      </nav>

      {currentUser ? (
        <div className={styles.userMenu}>
          <MenuTrigger>
            <Button
              className={styles.userMenuButton}
              type="button"
              aria-label={`Tài khoản ${currentUser.shortName}`}
              style={{ "--user-accent": currentUser.accent }}
            >
              <span className={styles.userAvatar} aria-hidden="true">
                {currentUser.initials}
              </span>
            </Button>
            <Popover className={styles.userMenuPopover} placement="bottom end">
              <Menu className={styles.userMenuList} aria-label="Tài khoản">
                <MenuItem
                  className={styles.userMenuItem}
                  textValue="Đăng xuất"
                  onAction={onSignOut}
                >
                  Đăng xuất
                </MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
        </div>
      ) : null}
    </div>
  );
}

function NavIcon({ name }) {
  if (name === "map") {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="m9 5-6 3v13l6-3 6 3 6-3V5l-6 3-6-3Z" />
        <path d="M9 5v13" />
        <path d="M15 8v13" />
      </svg>
    );
  }

  if (name === "memories") {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 16.5v-9Z" />
        <path d="M8.5 15.5 11 13l1.6 1.6 2.9-3.1 2.5 4" />
        <path d="M9 9.5h.01" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M12 12.25a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function RouteSkeleton() {
  return (
    <div className={styles.routeSkeleton} role="status" aria-live="polite" aria-label="Đang chuyển tab">
      <div className={styles.routeSkeletonTop}>
        <span />
        <span />
      </div>
      <div className={styles.routeSkeletonBody}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
