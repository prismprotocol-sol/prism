"use client";

import { useState } from "react";
import Reveal from "@/components/global/Reveal";
import { faqs } from "@/lib/data";

function ToggleIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" aria-hidden="true">
      <line x1="2" y1="9" x2="16" y2="9" strokeWidth="1.3" strokeLinecap="round" />
      <line
        x1="9"
        y1="2"
        x2="9"
        y2="16"
        strokeWidth="1.3"
        strokeLinecap="round"
        style={{
          transformOrigin: "9px 9px",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform var(--dur-micro) var(--ease-out)",
        }}
      />
    </svg>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-line-soft">
      <Reveal className="flex items-center justify-between gap-8 p-[clamp(40px,6vw,72px)_clamp(20px,4vw,64px)_clamp(32px,5vw,56px)] border-b border-line-soft max-mobile:flex-col max-mobile:gap-4">
        <p className="m-0 font-sans text-[clamp(20px,2.4vw,28px)] leading-[1.5] text-muted">
          Got questions?
          <br />
          Say less, we&apos;ve got answers.
        </p>
        <h2 className="m-0 flex items-center gap-3 text-[clamp(32px,4.4vw,56px)] text-fg max-mobile:text-[clamp(28px,8vw,40px)]">
          <span className="font-serif font-normal italic">FAQ&apos;s</span>
          <span className="font-sans font-light" aria-hidden="true">
            ↗
          </span>
        </h2>
      </Reveal>

      <div className="flex flex-col">
        {faqs.map((f, i) => {
          const open = openIndex === i;
          return (
            <Reveal as="div" key={f.question} delay={i * 60} className="border-t border-line-soft last:border-b">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-6 p-[clamp(20px,3vw,28px)_clamp(20px,4vw,64px)] text-left text-fg transition-colors duration-[var(--dur-micro)] ease-out hover:bg-white/[.03]"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
              >
                <span className="font-display text-[clamp(17px,1.9vw,22px)] font-medium tracking-[-0.01em]">
                  {f.question}
                </span>
                <ToggleIcon open={open} />
              </button>
              {open && (
                <p className="m-0 max-w-[62ch] p-[0_clamp(20px,4vw,64px)_clamp(24px,3.6vw,36px)] font-sans text-[14.5px] leading-[1.65] text-muted">
                  {f.answer}
                </p>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
