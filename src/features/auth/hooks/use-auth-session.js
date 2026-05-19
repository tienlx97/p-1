"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  AUTH_ACCOUNTS,
  AUTH_STORAGE_KEY,
  authenticateAccount,
  getAuthAccount
} from "@/features/auth/constants/accounts";

const AuthSessionContext = createContext(null);

export function AuthSessionProvider({ children }) {
  const [activeAccountId, setActiveAccountId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedAccount = getAuthAccount(globalThis.localStorage?.getItem(AUTH_STORAGE_KEY));

    setActiveAccountId(storedAccount?.id ?? null);
    setIsReady(true);
  }, []);

  const value = useMemo(() => {
    const activeAccount = getAuthAccount(activeAccountId);

    function signIn(username, password) {
      const account = authenticateAccount(username, password);

      if (!account) {
        return false;
      }

      globalThis.localStorage?.setItem(AUTH_STORAGE_KEY, account.id);
      setActiveAccountId(account.id);
      return true;
    }

    function signOut() {
      globalThis.localStorage?.removeItem(AUTH_STORAGE_KEY);
      setActiveAccountId(null);
    }

    return {
      accounts: AUTH_ACCOUNTS,
      activeAccount,
      isAuthenticated: Boolean(activeAccount),
      isReady,
      signIn,
      signOut
    };
  }, [activeAccountId, isReady]);

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }

  return context;
}
