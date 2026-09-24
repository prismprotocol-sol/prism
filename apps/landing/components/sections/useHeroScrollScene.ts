"use client";

import { useLayoutEffect, useRef } from "react";

type Metrics = {
  headerHeight: number;
  travel: number;
};

/**
 * Drives the hero's pinned scroll scene.
 *
 * The outer <section> is given exactly as much scroll distance as the hero
 * composition's own natural height (plus a short release buffer); a sticky
 * inner viewport pins beneath the header for that distance; and the rigid
 * content group inside it (headline + info strip + image, moved as one
 * unit) translates upward in lockstep with scroll progress. The effect is a
 * tall composition being pushed upward through a fixed window: nothing
 * fades, nothing is hard-coded — the group is exactly tall enough that
 * translating it by (its height − the pinned viewport height) always ends
 * with the image's bottom edge flush with the viewport's bottom edge, so
 * the whole image is guaranteed visible with nothing left below the fold.
 *
 * Native scroll position is the only source of truth — this reads
 * getBoundingClientRect() off the real DOM position each frame, which is
 * exactly what the Lenis driver in SmoothScroll already moves (Lenis smooths
 * the real scroll position rather than running a parallel scroll model), so
 * this stays in lockstep with it for free. No React state is written on
 * scroll: layout is applied via CSS custom properties on measurement
 * (rare — mount/resize) and the per-frame transform is written straight to
 * refs from a rAF-throttled scroll listener, so scrolling never triggers a
 * re-render.
 */
export function useHeroScrollScene() {
  const sceneRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const sticky = stickyRef.current;
    const group = groupRef.current;
    if (!scene || !sticky || !group) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const metrics: Metrics = { headerHeight: 0, travel: 0 };

    function clearTransforms() {
      group!.style.transform = "";
      if (depthRef.current) depthRef.current.style.transform = "";
    }

    function measure() {
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const pinnedHeight = Math.max(window.innerHeight - headerHeight, 0);
      const groupHeight = group!.scrollHeight;
      const reduced = reducedMotionQuery.matches;
      const rawTravel = groupHeight - pinnedHeight;
      // Sub-pixel/negative travel means the composition already fits the
      // pinned viewport outright — pin has nothing to do, so it's disabled
      // rather than forced, and reduced-motion disables it outright too.
      const travel = !reduced && rawTravel > 1 ? rawTravel : 0;
      // A short hold at full reveal before the scene releases into normal
      // scroll, so the completed image gets a beat to register before the
      // next section starts arriving.
      const buffer = travel > 0 ? Math.min(160, pinnedHeight * 0.12) : 0;

      metrics.headerHeight = headerHeight;
      metrics.travel = travel;

      sticky!.style.setProperty("--hero-sticky-top", `${headerHeight}px`);
      if (travel > 0) {
        sticky!.style.setProperty("--hero-sticky-height", `${pinnedHeight}px`);
        scene!.style.setProperty("--hero-scene-height", `${pinnedHeight + travel + buffer}px`);
      } else {
        sticky!.style.removeProperty("--hero-sticky-height");
        scene!.style.removeProperty("--hero-scene-height");
        clearTransforms();
      }
    }

    let rafId = 0;
    function applyProgress() {
      rafId = 0;
      if (metrics.travel <= 0) return;
      const rect = scene!.getBoundingClientRect();
      const raw = (metrics.headerHeight - rect.top) / metrics.travel;
      const progress = Math.min(Math.max(raw, 0), 1);
      const y = -progress * metrics.travel;
      group!.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      if (depthRef.current) {
        // Extremely small extra drift so the image reads as sitting
        // slightly in front of the rest of the composition rather than
        // being a flat cutout moving in perfect lockstep with it.
        depthRef.current.style.transform = `translate3d(0, ${(progress * -8).toFixed(2)}px, 0)`;
      }
    }

    function onScroll() {
      if (!rafId) rafId = requestAnimationFrame(applyProgress);
    }
    function onResize() {
      measure();
      applyProgress();
    }
    function onMotionChange() {
      measure();
      applyProgress();
    }

    measure();
    applyProgress();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    reducedMotionQuery.addEventListener("change", onMotionChange);
    // Catches content-driven height changes (webfont swap reflowing the
    // headline, etc.) that a viewport resize alone wouldn't.
    const ro = new ResizeObserver(onResize);
    ro.observe(group);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      reducedMotionQuery.removeEventListener("change", onMotionChange);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return { sceneRef, stickyRef, groupRef, depthRef };
}
