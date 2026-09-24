"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooths scroll physics for the main content pane specifically — the
 * sidebar and top bar sit outside it and are never meant to scroll.
 * Native scrollbar and keyboard/touch scrolling keep working; this only
 * smooths the motion between input and position.
 */
export function SmoothScroll({ target }: { target: React.RefObject<HTMLElement | null> }) {
  useEffect(() => {
    if (!target.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      wrapper: target.current,
      content: target.current.firstElementChild as HTMLElement,
      lerp: 0.1,
      wheelMultiplier: 0.85,
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
  }, [target]);

  return null;
}
