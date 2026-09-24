"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Cycles through a fixed set of images, one per second, as a hard cut —
 * not a crossfade. All images are mounted and stacked from the start (so
 * they're fully decoded ahead of time) and only visibility toggles each
 * tick; swapping a single <img>'s src on an interval instead flashes blank
 * for a frame whenever that image isn't already decoded. Pauses under
 * prefers-reduced-motion, holding on the first image.
 */
export default function ImageRotator({
  images,
  className,
}: {
  images: readonly string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 1000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="220px"
          className={className}
          style={{ objectFit: "cover", visibility: i === index ? "visible" : "hidden" }}
        />
      ))}
    </>
  );
}
