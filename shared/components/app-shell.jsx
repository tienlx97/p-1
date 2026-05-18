"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Link } from "react-aria-components";

import { cx } from "@/shared/lib/styles";

const navItems = [
  { href: "/", label: "Bản đồ", icon: "map" },
  { href: "/checkins", label: "Kỷ niệm", icon: "memories" },
  { href: "/profile", label: "Hồ sơ", icon: "profile" }
];

const ADD_MEMORY_EVENT = "photo-mem:open-add-memory";

export function AppShell({ children }) {
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
    <div className={cx("app-shell")}>
      <main className={cx("main-panel")} aria-busy={isRouteLoading}>
        {isRouteLoading ? <RouteSkeleton /> : null}
        {children}
      </main>

      <nav className={cx("bottom-nav")} aria-label="Điều hướng chính">
        {navItems.slice(0, 1).map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={isActive ? cx("bottom-nav-item active") : cx("bottom-nav-item")}
              onPress={() => {
                if (!isActive) {
                  setPendingHref(item.href);
                }
              }}
            >
              <span className={cx("bottom-nav-icon")} aria-hidden="true">
                <NavIcon name={item.icon} />
              </span>
              <small className={cx("bottom-nav-label")}>{item.label}</small>
            </Link>
          );
        })}
        <Button
          className={cx("bottom-nav-add")}
          type="button"
          aria-label="Thêm kỷ niệm"
          onPress={openAddMemory}
        >
          <span className={cx("bottom-nav-add-icon")} aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 6v12" />
              <path d="M6 12h12" />
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
              className={isActive ? cx("bottom-nav-item active") : cx("bottom-nav-item")}
              onPress={() => {
                if (!isActive) {
                  setPendingHref(item.href);
                }
              }}
            >
              <span className={cx("bottom-nav-icon")} aria-hidden="true">
                <NavIcon name={item.icon} />
              </span>
              <small className={cx("bottom-nav-label")}>{item.label}</small>
            </Link>
          );
        })}
      </nav>
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
    <div className={cx("route-skeleton")} role="status" aria-live="polite" aria-label="Đang chuyển tab">
      <div className={cx("route-skeleton-top")}>
        <span />
        <span />
      </div>
      <div className={cx("route-skeleton-body")}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
