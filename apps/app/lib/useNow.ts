"use client";

import { useEffect, useState } from "react";

/**
 * Ticks once a second. Redemption value is a deterministic function of
 * elapsed time (see `redemptionValueBps`), so re-running that formula
 * against a live clock — instead of a value.at-mount timestamp — is what
 * makes it actually accrue on screen rather than only updating on the next
 * navigation. Starts at 0 and is set for real inside the effect so the
 * clock read never happens during render.
 */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    const tick = () => setNow(Math.floor(Date.now() / 1000));
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
