"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { PageTransition } from "./PageTransition";

/** The one scrolling surface in the app shell — sidebar and top bar sit outside it, fixed. */
export function ScrollArea({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  return (
    <main ref={ref} className="h-full overflow-y-auto">
      <SmoothScroll target={ref} />
      <PageTransition>{children}</PageTransition>
    </main>
  );
}
