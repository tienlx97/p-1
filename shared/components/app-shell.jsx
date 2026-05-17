"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Link } from "react-aria-components";

import { cx } from "@/shared/lib/styles";

const navItems = [
  { href: "/", label: "Bản đồ", icon: "⌖" },
  { href: "/checkins", label: "Thư viện", icon: "▥" },
  { href: "/checkins/new", label: "Thêm", icon: "+" },
  { href: "/profile", label: "Hồ sơ", icon: "♡" }
];

export function AppShell({ children }) {
  const pathname = usePathname();
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

  return (
    <div className={cx("app-shell")}>
      <main className={cx("main-panel")} aria-busy={isRouteLoading}>
        {isRouteLoading ? <RouteSkeleton /> : null}
        {children}
      </main>

      <nav className={cx("bottom-nav")} aria-label="Điều hướng chính">
        {navItems.map((item) => {
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
              <span aria-hidden="true">{item.icon}</span>
              <small>{item.label}</small>
            </Link>
          );
        })}
      </nav>
    </div>
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
