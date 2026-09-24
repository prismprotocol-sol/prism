import Image from "next/image";
import Reveal from "@/components/global/Reveal";
import { services } from "@/lib/data";

const ICONS = [
  // square corner brackets
  <svg key="0" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M1 8V1h7M27 8V1h-7M1 20v7h7M27 20v7h-7" />
  </svg>,
  // hexagon
  <svg key="1" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M14 1l12 7v12l-12 7-12-7V8z" />
  </svg>,
  // crosshair in brackets
  <svg key="2" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M1 8V1h7M27 8V1h-7M1 20v7h7M27 20v7h-7" />
    <path d="M14 10v8M10 14h8" />
  </svg>,
];

export default function Services() {
  return (
    <section id="services" className="relative min-h-[clamp(560px,62vw,760px)] overflow-hidden border-b border-line-soft max-mobile:min-h-0">
      <div className="absolute inset-0 z-[var(--z-image)]">
        <Image
          src="/images/services-bg.webp"
          alt="Halftone-processed archival photograph of an early biplane at dusk"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="absolute inset-0 z-[var(--z-panel)] bg-[linear-gradient(to_bottom,rgba(0,0,0,.82)_0%,rgba(0,0,0,.72)_38%,rgba(0,0,0,.28)_68%,rgba(0,0,0,.05)_100%)] max-mobile:bg-black/70" />

      <div className="relative z-[var(--z-text)] grid h-full grid-cols-3 max-mobile:grid-cols-1">
        {services.map((service, i) => (
          <Reveal
            as="article"
            key={service.index}
            delay={i * 80}
            className="group flex flex-col border-l border-line-soft p-[clamp(20px,2.6vw,36px)_clamp(18px,2.2vw,32px)_0] first:border-l-0 max-mobile:border-l-0 max-mobile:border-t max-mobile:border-line-soft max-mobile:pt-6 max-mobile:first:border-t-0"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs tracking-[0.08em] text-muted">[{service.index}]</span>
              <span className="text-muted opacity-80 transition-transform duration-[var(--dur-micro)] ease-out group-hover:translate-x-px group-hover:-translate-y-px">
                {ICONS[i]}
              </span>
            </div>
            <h3 className="mt-3 font-display text-[clamp(30px,3.4vw,48px)] font-normal text-fg">{service.title}</h3>
            <div className="relative mt-4 border-t border-line before:absolute before:top-[-8px] before:left-1/2 before:-translate-x-1/2 before:font-mono before:text-[13px] before:text-fg/60 before:content-['+']" />
            <p className="mt-6 max-w-[34ch] font-sans text-[14.5px] leading-[1.65] text-muted">{service.body}</p>
            <div className="mt-auto flex items-center justify-between border-t border-line-soft bg-black/55 p-[16px_clamp(18px,2.2vw,32px)] font-mono text-[11px] tracking-[0.1em] text-muted uppercase max-mobile:relative">
              <span>What we do</span>
              <span>// {service.index}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
