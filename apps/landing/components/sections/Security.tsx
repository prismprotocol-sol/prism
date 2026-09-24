import Image from "next/image";
import Reveal from "@/components/global/Reveal";
import { securityPlates } from "@/lib/data";

const PLATE_POSITION = [
  "self-start max-mobile:self-stretch",
  "self-end mt-[clamp(-8px,-1vw,0px)] max-mobile:self-stretch max-mobile:m-0",
  "self-start ml-[clamp(0px,6vw,90px)] mt-[clamp(-8px,-1vw,0px)] max-mobile:self-stretch max-mobile:m-0",
];

const DOT_POSITION = ["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"];

export default function Security() {
  return (
    <section id="security" className="relative border-b border-line-soft pb-[clamp(48px,6vw,96px)]">
      <div className="techTexture absolute inset-0 z-[var(--z-texture)]" />

      <Reveal className="relative z-[var(--z-text)] p-[clamp(48px,7vw,96px)_clamp(20px,4vw,64px)_clamp(32px,5vw,56px)] text-center">
        <p className="mb-6 font-mono text-xs tracking-[0.12em] text-muted uppercase">[ Security ]</p>
        <h2 className="mx-auto mb-6 max-w-[20ch] font-display text-[clamp(30px,4.4vw,56px)] leading-[1.08] font-normal text-fg">
          Trust Enforced By Code, Not By Promise
        </h2>
        <p className="mx-auto max-w-[56ch] font-sans text-[15px] leading-[1.6] text-muted">
          On-chain private credit has failed before because investors had to take an
          originator&apos;s word for it. Every Prism pool is built so that doesn&apos;t happen again.
        </p>
      </Reveal>

      <div className="relative z-[var(--z-text)] flex flex-col gap-[clamp(18px,2.4vw,28px)] p-[clamp(24px,4vw,40px)_clamp(20px,4vw,64px)_0]">
        {securityPlates.map((plate, i) => (
          <Reveal
            as="article"
            key={plate.index}
            delay={i * 90}
            className={`group relative flex w-full max-w-[760px] border border-line-soft bg-[#0c0c0c] max-mobile:max-w-none max-mobile:flex-col ${PLATE_POSITION[i]}`}
          >
            <div className="flex min-w-0 flex-[1.1] flex-col justify-center gap-2 p-[clamp(18px,2.6vw,32px)]">
              <span className="font-mono text-[11px] tracking-[0.1em] text-muted">[{plate.index}]</span>
              <h3 className="m-0 font-display text-[clamp(22px,2.4vw,30px)] font-normal text-fg">{plate.title}</h3>
              <p className="m-0 font-sans text-[13.5px] leading-[1.5] text-muted">{plate.body}</p>
            </div>
            <div className="relative min-w-[40%] flex-1 overflow-hidden max-mobile:min-h-[160px]">
              <Image
                src={plate.image}
                alt=""
                fill
                sizes="(max-width: 809px) 100vw, 360px"
                className="[transition:filter_var(--dur-micro)_var(--ease-out),transform_var(--dur-section)_var(--ease-out)] group-hover:scale-105 group-hover:brightness-[1.08]"
                style={{ objectFit: "cover" }}
              />
              {DOT_POSITION.map((position) => (
                <span
                  key={position}
                  className={`absolute z-[var(--z-chrome)] h-[5px] w-[5px] rounded-full bg-white/35 ${position}`}
                />
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
