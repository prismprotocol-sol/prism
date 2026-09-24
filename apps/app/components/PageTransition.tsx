"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Re-keys on pathname change so the fade-in replays on every route switch. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-page-enter">
      {children}
    </div>
  );
}
