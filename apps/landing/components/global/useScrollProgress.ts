"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks how far an element has scrolled past the top of the viewport, as a
 * 0→1 progress value (0 = element's top at/below the viewport top, 1 = its
 * top has scrolled one full viewport height above it). For restrained,
 * scroll-linked exit/parallax accents only — entrances stay on fixed-delay
 * CSS keyframes. Reads native scroll position via a passive listener; it
 * attaches no wheel handling of its own, so it never fights native scroll.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(Math.max(-rect.top / vh, 0), 1);
      setProgress(p);
      rafId = 0;
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return { ref, progress };
}
