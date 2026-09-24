import Image from "next/image";
import Reveal from "@/components/global/Reveal";
import { whyChooseFeatures } from "@/lib/data";

// Keyed by card index.
const HOVER_IMAGES: Record<number, string> = {
  0: "/images/why-choose-hover-1.png",
  1: "/images/why-choose-hover-2.png",
  2: "/images/why-choose-hover-3.png",
};

export default function WhyChoose() {
  return (
    <section className="border-b border-line-soft">
      <Reveal className="grid grid-cols-2 gap-8 border-b border-line-soft p-[clamp(40px,6vw,72px)_clamp(20px,4vw,64px)] max-tablet:grid-cols-1">
        <div className="min-h-px max-tablet:hidden" />
        <div className="text-right max-tablet:text-left">
          <h2 className="mb-4 font-display text-[clamp(32px,4.2vw,56px)] leading-[1.1] font-medium text-fg">
            Why Should You
            <br />
            <span className="font-serif font-normal italic">Choose Prism</span>
          </h2>
          <p className="ml-auto max-w-[42ch] font-sans text-[15px] leading-[1.6] text-muted max-tablet:m-0">
            For originators raising against receivables, and investors pricing the risk
            on them.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-3 max-mobile:grid-cols-1">
        {whyChooseFeatures.map((f, i) => (
          <Reveal
            key={f.headline}
            delay={i * 90}
            className="group relative flex min-h-[clamp(380px,38vw,560px)] flex-col items-start justify-between overflow-hidden border-r border-line-soft p-[clamp(32px,4.5vw,52px)_clamp(24px,3.2vw,40px)] transition-colors duration-[var(--dur-micro)] ease-out last:border-r-0 hover:bg-white/[.03] max-mobile:border-r-0 max-mobile:border-b max-mobile:border-line-soft max-mobile:last:border-b-0"
          >
            {HOVER_IMAGES[i] && (
              <Image
                src={HOVER_IMAGES[i]}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 1049px) 100vw, 33vw"
                className="z-[var(--z-base)] opacity-0 grayscale-[.6] brightness-[.7] transition-opacity duration-[var(--dur-section)] ease-out group-hover:opacity-[.16]"
                style={{ objectFit: "cover" }}
              />
            )}
            <h3 className="relative z-[var(--z-text)] m-0 max-w-[14ch] font-display text-[clamp(26px,2.6vw,34px)] leading-[1.15] font-medium text-fg">
              {f.headline}
            </h3>
            <div className="relative z-[var(--z-text)] flex flex-col gap-3">
              <p className="m-0 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">{f.eyebrow}</p>
              <p className="m-0 max-w-[34ch] font-sans text-sm leading-[1.6] text-muted">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
