import Image from "next/image";
import ArrowButton from "@/components/global/ArrowButton";
import Reveal from "@/components/global/Reveal";
import { caseStudies } from "@/lib/data";

export default function Work() {
  return (
    <section id="services" className="border-b border-line-soft">
      <Reveal className="flex items-end justify-between gap-8 border-b border-line-soft pt-[clamp(28px,4vw,56px)] px-5 pb-[clamp(20px,3vw,32px)] max-mobile:flex-col max-mobile:items-start max-mobile:gap-4">
        <h2 className="m-0 max-w-[26ch] font-serif text-[clamp(28px,3.4vw,44px)] leading-[1.15] font-normal text-fg">
          We structure credit, we don&apos;t originate it. Originators bring the receivables,
          we tranche them, price the risk, and keep every position liquid on Solana.
        </h2>
        <ArrowButton href="#footer" className="flex-none">
          Bring a pool
        </ArrowButton>
      </Reveal>

      <div className="grid grid-cols-[1.85fr_1fr] gap-[clamp(20px,2.6vw,32px)] pb-[clamp(20px,3vw,32px)] max-tablet:grid-cols-1">
        {caseStudies.map((study, i) => (
          <Reveal as="article" key={study.name} delay={i * 100} className="group flex flex-col">
            <div className="relative h-[clamp(320px,34vw,560px)] w-full overflow-hidden bg-surface-2 max-tablet:h-[clamp(240px,46vw,420px)]">
              <Image
                src={study.image}
                alt={study.alt}
                fill
                sizes={study.size === "large" ? "(max-width: 809px) 100vw, 64vw" : "(max-width: 809px) 100vw, 32vw"}
                className="transition-transform duration-[var(--dur-section)] ease-out group-hover:scale-[1.04]"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="mt-4 pl-[10px]">
              <h3 className="m-0 font-display text-[clamp(18px,1.8vw,22px)] font-normal text-fg">{study.name}</h3>
            </div>
            <p className="mt-2 max-w-[52ch] pl-[10px] font-sans text-[13.5px] leading-[1.55] text-muted">
              {study.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
