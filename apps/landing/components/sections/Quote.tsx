"use client";

import Image from "next/image";
import Reveal from "@/components/global/Reveal";
import { useScrollProgress } from "@/components/global/useScrollProgress";

export default function Quote() {
  const { ref, progress } = useScrollProgress<HTMLElement>();

  const imageStyle = {
    transform: `translateY(${progress * -30}px) scale(${1 + progress * 0.03})`,
  };

  return (
    <section ref={ref} className="border-b border-line-soft">
      <Reveal className="p-[clamp(48px,8vw,96px)_clamp(20px,6vw,120px)_clamp(32px,5vw,56px)] text-center">
        <p className="mx-auto mb-6 max-w-[22ch] font-serif text-[clamp(22px,4.4vw,56px)] leading-[1.15] font-normal text-fg">
          “We have to have money. We have to have credit. Otherwise the fruits of
          production could not be exchanged.”
        </p>
        <span className="font-mono text-xs tracking-[0.12em] text-muted">- Henry Ford</span>
      </Reveal>
      <Reveal delay={100} className="relative aspect-video w-full overflow-hidden border-t border-line-soft max-mobile:aspect-square">
        <div className="absolute -inset-10" style={imageStyle}>
          <Image
            src="/images/quote-bg.webp"
            alt="Halftone-processed photograph, in gold tone, of a race official waving the checkered flag as a car crosses the finish line"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <span className="grain" />
      </Reveal>
    </section>
  );
}
