"use client";

import { useEffect, useState } from "react";

/**
 * Types out each phrase, holds, deletes it, then types the next — looping
 * forever. Starts only after `startDelay` (default matches the hero
 * headline's own entrance fade — see Hero.tsx's animate-enter-headline) so
 * the reveal never uncovers a headline that's already mid-cycle, and the
 * first phrase renders complete from the very first paint so there's
 * nothing to lay out around before the timer fires. Pauses under
 * prefers-reduced-motion, holding the first phrase statically — the caret
 * itself freezes for free via the site-wide reduced-motion rule in
 * tokens.css, so no extra handling is needed for it here.
 */
export default function TypingHeadline({
  phrases,
  className,
  typingSpeed = 95,
  deletingSpeed = 45,
  holdDuration = 2000,
  startDelay = 3100,
}: {
  phrases: readonly string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  holdDuration?: number;
  startDelay?: number;
}) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState(phrases[0] ?? "");
  const [deleting, setDeleting] = useState(false);
  const [started, setStarted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(id);
  }, [reducedMotion, startDelay]);

  useEffect(() => {
    if (!started || reducedMotion || phrases.length < 2) return;
    const current = phrases[phraseIndex % phrases.length];

    if (!deleting) {
      if (text.length < current.length) {
        const id = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setDeleting(true), holdDuration);
      return () => clearTimeout(id);
    }

    if (text.length > 0) {
      const id = setTimeout(() => setText(text.slice(0, -1)), deletingSpeed);
      return () => clearTimeout(id);
    }

    setDeleting(false);
    setPhraseIndex((i) => (i + 1) % phrases.length);
  }, [started, reducedMotion, text, deleting, phraseIndex, phrases, typingSpeed, deletingSpeed, holdDuration]);

  return (
    <>
      <span aria-hidden="true" className={className}>
        {text}
        <span className="ml-1 inline-block h-[0.78em] w-[0.07em] translate-y-[0.12em] animate-caret-blink bg-current align-middle" />
      </span>
      <span className="sr-only">{phrases.join(". ")}</span>
    </>
  );
}
