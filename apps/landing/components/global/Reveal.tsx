"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode, type CSSProperties } from "react";

type Props = {
  as?: ElementType;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * One-shot scroll reveal: fades/lifts an element in the first time it
 * crosses into the viewport, then leaves it alone. Uses IntersectionObserver
 * rather than a scroll listener, so it never competes with the smooth-scroll
 * driver. Respects prefers-reduced-motion by rendering fully visible.
 */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", style, children }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${inView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"} transition-[opacity,transform] duration-[var(--dur-section)] ease-out will-change-[opacity,transform] motion-reduce:translate-y-0 motion-reduce:opacity-100 ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}
