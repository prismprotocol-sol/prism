"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Central smooth-scroll motion state. This is the ONE driver of scroll
 * physics for the page — everything else (reveals, ambient motion) reads
 * from native scroll position / IntersectionObserver, not from its own
 * wheel/scroll listeners. Native scrollbar and keyboard/touch scrolling
 * keep working; this only smooths the motion between input and position.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.75,
      touchMultiplier: 1,
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
