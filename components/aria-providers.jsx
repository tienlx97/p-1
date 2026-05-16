"use client";

import { OverlayProvider } from "react-aria";
import { RouterProvider } from "react-aria-components";
import { useRouter } from "next/navigation";

export function AriaProviders({ children }) {
  const router = useRouter();

  return (
    <RouterProvider navigate={router.push}>
      <OverlayProvider>{children}</OverlayProvider>
    </RouterProvider>
  );
}
