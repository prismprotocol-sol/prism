"use client";

import Image from "next/image";
import TypingHeadline from "@/components/global/TypingHeadline";
import { heroHeadlines } from "@/lib/data";
import { useHeroScrollScene } from "./useHeroScrollScene";

export default function Hero() {
  const { sceneRef, stickyRef, groupRef, depthRef } = useHeroScrollScene();

  return (
    // Falls back to plain auto-height block flow until useHeroScrollScene
    // measures the composition and sets --hero-scene-height — i.e. the
    // exact current static layout — so there's nothing to hydrate away
    // from and no jump the first time JS attaches.
    <section id="home" ref={sceneRef} className="relative h-[var(--hero-scene-height,auto)]">
      {/* Pins beneath the header for the scene's scroll distance.
          Height/overflow likewise default to auto/visible (= normal flow)
          until the scene is measured; overflow-hidden is what makes
          translated-away content disappear by leaving the visible window,
          not by fading. */}
      <div
        ref={stickyRef}
        className="sticky top-[var(--hero-sticky-top,0px)] h-[var(--hero-sticky-height,auto)] overflow-hidden"
      >
        {/* Rigid composition — headline, info strip, and image all move as
            one physical unit, translated upward by useHeroScrollScene in
            lockstep with scroll. Nothing here fades; content leaves the
            viewport purely by being clipped at the sticky viewport's edge. */}
        <div ref={groupRef} className="will-change-transform">
          <h1 className="m-0 animate-enter-headline border-b border-line-soft pt-[clamp(28px,5vw,64px)] px-[clamp(14px,2.4vw,36px)] pb-[clamp(20px,3vw,40px)] font-serif text-[clamp(32px,6.5vw,90px)] leading-[0.92] font-extralight tracking-[-0.01em] text-fg max-mobile:tracking-[-0.02em]">
            <TypingHeadline phrases={heroHeadlines} className="block" />
          </h1>

          <div className="animate-enter-strip">
            {/* Five columns: a standalone icon cell, its own text cell, the
                decorative filler, a second text cell, and Contact Us —
                each split by the same border-right rhythm every cell
                carries, rather than the logo and its text sharing one
                cell. */}
            <div className="grid grid-cols-[minmax(110px,0.35fr)_minmax(90px,0.4fr)_minmax(180px,1.9fr)_minmax(220px,1fr)_minmax(160px,0.6fr)] border-b border-line-soft max-tablet:grid-cols-2 max-mobile:grid-cols-1">
              <div className="flex min-h-[72px] items-center justify-center gap-3 border-r border-line-soft px-[clamp(16px,2.4vw,28px)] py-3 max-mobile:min-h-14 max-mobile:border-r-0 max-mobile:border-b max-mobile:border-line-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/solana-mark.svg"
                  alt="Solana"
                  className="h-8 w-auto flex-none object-contain"
                />
              </div>
              <div className="flex min-h-[72px] items-center justify-center gap-3 border-r border-line-soft px-[clamp(16px,2.4vw,28px)] py-3 max-mobile:min-h-14 max-mobile:border-r-0 max-mobile:border-b max-mobile:border-line-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/superteam-india-badge.png"
                  alt="Superteam India"
                  className="h-12 w-12 flex-none rounded-[10px] object-cover"
                />
              </div>
              <div className="techTexture min-h-[72px] border-r border-line-soft p-0 max-tablet:hidden max-mobile:min-h-14 max-mobile:border-r-0 max-mobile:border-b max-mobile:border-line-soft" />
              <div className="flex min-h-[72px] items-center gap-3 border-r border-line-soft px-[clamp(16px,2.4vw,28px)] py-3 max-mobile:min-h-14 max-mobile:border-r-0 max-mobile:border-b max-mobile:border-line-soft">
                <p className="px-[30px] font-mono text-[15px] leading-[1.4] font-medium tracking-[0.01em] text-fg uppercase">
                  Credit built around real payments.
                </p>
              </div>
              <div className="relative flex min-h-[72px] items-center gap-3 p-0 max-mobile:min-h-14 max-mobile:border-b max-mobile:border-line-soft">
                {/* Viewfinder-style corner brackets framing the contact
                    cell, sitting right at the cell's true edges (the grid
                    divider lines) while the rounded card inside is inset,
                    leaving a visible gap between the two. */}
                <span
                  className="pointer-events-none absolute top-0 left-0 z-[1] h-4 w-4 border-t-[1.5px] border-l-[1.5px] border-white/85"
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute top-0 right-0 z-[1] h-4 w-4 border-t-[1.5px] border-r-[1.5px] border-white/85"
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute bottom-0 left-0 z-[1] h-4 w-4 border-b-[1.5px] border-l-[1.5px] border-white/85"
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute right-0 bottom-0 z-[1] h-4 w-4 border-r-[1.5px] border-b-[1.5px] border-white/85"
                  aria-hidden="true"
                />
                <a
                  href="#footer"
                  className="group flex h-full w-full items-center justify-center gap-8 rounded-[10px] bg-surface-3 font-sans text-sm font-medium tracking-[0.04em] uppercase transition-colors duration-[var(--dur-micro)] ease-out hover:bg-[#1c1c1c]"
                >
                  <span>Contact us</span>
                  <span
                    className="text-xl transition-transform duration-[var(--dur-micro)] ease-out group-hover:translate-x-1.5"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Sized to keep the whole hero (heading + strip + image) close to
              one viewport tall, so the next section is reachable in roughly
              a single scroll rather than requiring a long pinned reveal
              first. useHeroScrollScene still measures and pins/travels if
              the composition ends up taller than the viewport on a given
              screen, but on most screens this now falls back to plain
              static flow (see Hero's own top-of-file comment). object-fit:
              cover keeps the crop centered and undistorted. */}
          <div className="relative h-[55vh] w-full animate-enter-image overflow-hidden bg-black max-tablet:h-[50vh] max-mobile:h-[45vh]">
            {/* The asset already carries the halftone/dither treatment and
                crosshair decorations baked in, so it's used as-is. This
                layer only carries the scroll-scene's tiny extra depth
                offset (see useHeroScrollScene) — kept separate from the
                ambient-drift layer below so the two transforms never
                compete on the same element. */}
            <div ref={depthRef} className="absolute -inset-[50px]">
              <div className="absolute -inset-2 motion-safe:animate-ambient">
                <Image
                  src="/images/hero.webp"
                  alt="Halftone-processed archival photograph of an American flag and an astronaut on the lunar surface"
                  fill
                  priority
                  sizes="100vw"
                  style={{ objectFit: "cover", objectPosition: "50% 65%" }}
                />
              </div>
            </div>
            <span className="grain" />
          </div>
        </div>
      </div>
    </section>
  );
}
