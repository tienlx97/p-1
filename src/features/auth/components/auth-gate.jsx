"use client";

import { AppShell } from "@/shared/components/app-shell";
import { LoginPage } from "@/features/auth/components/login-page";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import styles from "./auth-gate.module.css";

/**
 * @param {{ children: import("react").ReactNode }} props
 */
export function AuthGate({ children }) {
  const { activeAccount, isAuthenticated, isReady, signOut } = useAuthSession();

  if (!isReady) {
    return <div className={styles.loading} role="status" aria-label="Đang tải phiên đăng nhập" />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppShell currentUser={activeAccount} onSignOut={signOut}>
      {children}
    </AppShell>
  );
}
