import Reveal from "@/components/global/Reveal";

const LOGOS = [
  { name: "Solana", src: "/logos/solana.svg" },
  { name: "Superteam India", src: "/logos/superteam-india.svg" },
  { name: "Rust", src: "/logos/rust.svg" },
  { name: "Claude", src: "/logos/claude.svg" },
  { name: "Anchor", src: "/logos/anchor.svg" },
];

/**
 * Continuous horizontal ticker of the stack this was built on/for. Two
 * identical tracks sit side by side, each independently animated from
 * translateX(0) to translateX(-100%) at the same speed — the moment the
 * first fully exits left, the second (which started immediately to its
 * right) is sitting exactly where the first began, so the loop is
 * seamless. Edges fade via mask-image; hovering anywhere pauses the loop
 * and brightens every logo together. Logos are real brand marks (see
 * public/logos/) recolored to plain white via a filter chain, matching the
 * rest of the site's monochrome icon language rather than each mark's own
 * brand colors — the source files are inked for a light background, ours
 * is dark. Respects prefers-reduced-motion via `motion-safe:`.
 */
export default function Marquee() {
  return (
    <section className="border-t border-b border-line-soft bg-black" aria-hidden="true">
      <Reveal className="group marquee-edge-mask overflow-hidden py-6 max-mobile:py-4">
        <div className="flex w-max">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex flex-none items-center motion-safe:animate-marquee-scroll group-hover:[animation-play-state:paused]"
            >
              {LOGOS.map((logo) => (
                <span
                  className="flex flex-none items-center px-[clamp(40px,7vw,88px)] max-mobile:px-8"
                  key={logo.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="block h-[26px] w-auto object-contain opacity-50 grayscale brightness-0 invert transition-opacity duration-[var(--dur-micro)] ease-out group-hover:opacity-100 max-mobile:h-[19px]"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
