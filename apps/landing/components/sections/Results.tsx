import Image from "next/image";
import ArrowButton from "@/components/global/ArrowButton";
import Reveal from "@/components/global/Reveal";
import CountUp from "@/components/global/CountUp";
import { metrics } from "@/lib/data";
import { SITE_URLS } from "@prism/config";

export default function Results() {
  return (
    <section className="border-b border-line-soft">
      <div className="grid grid-cols-2 max-mobile:grid-cols-1">
        <Reveal className="flex flex-col border-r border-line-soft max-mobile:border-r-0 max-mobile:border-b max-mobile:border-line-soft">
          {metrics.map((m) => (
            <div key={m.value} className="grid grid-cols-2 border-b border-line-soft last:border-b-0">
              <div className="flex items-center p-[clamp(24px,4vw,48px)_clamp(18px,2.4vw,32px)] font-pixel text-[clamp(28px,3.4vw,46px)] text-fg">
                <CountUp value={m.value} />
              </div>
              <div className="flex items-center border-l border-line-soft p-[clamp(24px,4vw,48px)_clamp(18px,2.4vw,32px)] font-sans text-[16.5px] leading-[1.4] text-muted">
                {m.label}
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal delay={100} className="relative min-h-[420px] overflow-hidden">
          <Image
            src="/images/testimonial-bg.webp"
            alt="Halftone-processed archival photograph of a mission control room"
            fill
            sizes="(max-width: 809px) 100vw, 50vw"
            // Heavy defocus, not a soft-focus touch-up: the photograph should
            // read as color/light masses (person, screen, room structure
            // vaguely sensed, no detail legible), not a recognizable scene —
            // that's what pushes the quote in front of it into "premium
            // foreground" rather than "blurry photo." contrast/brightness
            // keep tonal separation strong even as spatial detail
            // disappears, so blacks still collapse toward black instead of
            // graying out. Scaled up well past the blur radius so no edge
            // ever shows through.
            className="scale-[1.18] blur-[20px] contrast-[1.1] brightness-[.72]"
            style={{ objectFit: "cover" }}
          />
          {/* Flat, subtle — just enough to guarantee the sharp white serif
              text reads over whatever color the blurred photo lands on, not
              a directional vignette (that was doing the readability work
              blur+brightness now handle on their own). */}
          <div className="absolute inset-0 z-[var(--z-panel)] flex items-start bg-black/[.22] p-[clamp(24px,4vw,56px)] max-mobile:bg-[linear-gradient(to_bottom,rgba(0,0,0,.45)_0%,rgba(0,0,0,.55)_50%,rgba(0,0,0,.85)_100%)]">
            <p className="m-0 max-w-[34ch] font-serif text-[clamp(26px,3.2vw,42px)] leading-[1.28] font-normal text-fg">
              Prism gives you transparent access to private credit yield you could never
              reach before, with the liquidity to move when you need to.
            </p>
          </div>
          <ArrowButton
            href={SITE_URLS.docs}
            className="absolute right-[clamp(24px,4vw,56px)] bottom-[clamp(20px,3vw,32px)] z-[var(--z-text)]"
          >
            Read Docs
          </ArrowButton>
        </Reveal>
      </div>
    </section>
  );
}
