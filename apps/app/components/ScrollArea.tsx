import type { ReactNode } from "react";
import { PageTransition } from "./PageTransition";

/** The one scrolling surface in the app shell — sidebar and top bar sit outside it, fixed. Native scroll, no smoothing library. */
export function ScrollArea({ children }: { children: ReactNode }) {
  return (
    <main className="h-full overflow-y-auto">
      <PageTransition>{children}</PageTransition>
    </main>
  );
}
