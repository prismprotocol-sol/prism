"use client";

import { useEffect, useState } from "react";

const SEGMENT_COUNT = 10;

/**
 * Brief black-canvas reveal shown on first load, echoing the reference's
 * "page revealing itself" sequence rather than a conventional spinner.
 * Removed from the DOM once hidden so it never blocks interaction.
 */
export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      return;
    }

    // Scroll is locked for the overlay's full lifetime — including its exit
    // wipe — so a user can't get a page underneath moving while the curtain
    // is still mid-flight; it's released the instant the wipe finishes
    // (650ms after `hidden` flips, matching the overlay's transition below),
    // not only once the node is removed from the DOM.
    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = "hidden";

    // Timed to let the segmented indicator finish its left-to-right sweep
    // (last cell locks in ~1.38s in) before the black curtain starts to
    // lift, so the choreography never gets cut off mid-sequence.
    const hideTimer = setTimeout(() => setHidden(true), 1450);
    const unlockTimer = setTimeout(() => {
      style.overflow = previousOverflow;
    }, 1450 + 650);
    const removeTimer = setTimeout(() => setGone(true), 2200);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(unlockTimer);
      clearTimeout(removeTimer);
      style.overflow = previousOverflow;
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--z-loading)] flex items-center justify-center bg-black transition-transform duration-[650ms] ease-out will-change-transform data-[hidden=true]:pointer-events-none data-[hidden=true]:-translate-y-full"
      data-hidden={hidden}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-4">
        <span className="font-display text-[22px] font-semibold tracking-[0.02em] text-fg opacity-0 animate-mark-resolve">
          PRISM<sup style={{ fontSize: "0.5em" }}>®</sup>
        </span>
        <div className="flex items-center gap-2 font-mono text-sm text-muted-2 opacity-0 animate-bracket-resolve">
          <span>[</span>
          <span className="flex gap-[3px]">
            {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
              <span
                key={i}
                className="h-3.5 w-3 border border-line-soft bg-surface-3 [animation:activateSegment_260ms_steps(1,end)_forwards] [animation-delay:calc(420ms+var(--i)*78ms)]"
                style={{ ["--i" as string]: i }}
              />
            ))}
          </span>
          <span>]</span>
        </div>
      </div>
    </div>
  );
}
