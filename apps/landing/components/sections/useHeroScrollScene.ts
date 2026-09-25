"use client";

import { useLayoutEffect, useRef } from "react";

// How far (px) the page scrolls before the hero image's resting keystone
// tilt fully straightens out, and the tilt angle at scrollY 0.
const TILT_STRAIGHTEN_DISTANCE = 350;
const TILT_MAX_DEG = 8;

/**
 * Straightens the hero image out of its resting keystone tilt (columns
 * fanning outward, as if leaning back) as the page scrolls — tied to raw
 * scrollY over a fixed distance, not to any pinned/hijacked scroll scene.
 * The page scrolls normally throughout; this only ever writes a transform
 * to tiltRef's element, straight from a rAF-throttled scroll listener, so
 * scrolling never triggers a re-render.
 */
export function useHeroScrollScene() {
  const tiltRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let rafId = 0;
    function applyTilt() {
      rafId = 0;
      if (!tiltRef.current) return;
      const t = Math.min(Math.max(window.scrollY / TILT_STRAIGHTEN_DISTANCE, 0), 1);
      const angle = TILT_MAX_DEG * (1 - t);
      tiltRef.current.style.transform = `perspective(1200px) rotateX(${angle.toFixed(2)}deg)`;
    }

    function onScroll() {
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    }

    applyTilt();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return { tiltRef };
}
