import ArrowButton from "@/components/global/ArrowButton";
import ImageRotator from "@/components/global/ImageRotator";
import Reveal from "@/components/global/Reveal";
import { articles } from "@/lib/data";

const ROTATOR_IMAGES = [
  "/images/rotator-65.png",
  "/images/rotator-66.png",
  "/images/rotator-67.png",
  "/images/rotator-68.png",
] as const;

export default function Articles() {
  return (
    <section className="grid grid-cols-[minmax(180px,1fr)_minmax(0,2.4fr)] gap-8 p-[clamp(48px,7vw,96px)_clamp(20px,4vw,64px)] border-b border-line-soft max-tablet:grid-cols-1 max-tablet:gap-[clamp(32px,6vw,56px)]">
      <div className="flex flex-col justify-between max-tablet:flex-row max-tablet:items-center max-mobile:flex-col max-mobile:items-start max-mobile:gap-6">
        <p className="m-0 font-mono text-xs tracking-[0.12em] text-muted uppercase">[ Latest Articles ]</p>
        <div className="relative aspect-square w-[clamp(140px,16vw,220px)] overflow-hidden border border-line-soft bg-surface-2 max-tablet:w-24">
          <ImageRotator images={ROTATOR_IMAGES} className="block" />
        </div>
      </div>

      <div className="flex flex-col">
        <Reveal>
          <p className="mb-[clamp(48px,7vw,88px)] max-w-[46ch] font-serif text-[clamp(24px,2.8vw,36px)] leading-[1.35] font-normal text-fg max-mobile:mb-[clamp(32px,8vw,56px)] max-mobile:text-[clamp(22px,5vw,28px)]">
            Thoughts on credit, liquidity, and building the market infrastructure that
            crypto skipped over. Straight from the team.
          </p>
        </Reveal>

        <div className="flex flex-col">
          {articles.map((a, i) => (
            <Reveal
              as="article"
              key={a.title}
              delay={i * 100}
              className="border-t border-line-soft last:border-b"
            >
              <a
                className="block py-[clamp(24px,3.6vw,36px)] transition-opacity duration-[var(--dur-micro)] ease-out hover:opacity-80"
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="mb-3 flex items-baseline justify-between gap-4">
                  <span className="font-display text-[clamp(17px,1.8vw,21px)] leading-[1.25] font-medium text-fg">
                    {a.title}
                  </span>
                  <span className="flex-none font-mono text-[13px] tracking-[0.08em] text-muted">{a.index}</span>
                </div>
                <p className="mb-3 max-w-[62ch] font-sans text-sm leading-[1.6] text-muted">{a.excerpt}</p>
                <span className="font-mono text-[11px] tracking-[0.1em] text-muted-2 uppercase">
                  {a.author} · x.com
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={articles.length * 100} className="mt-[clamp(32px,5vw,48px)] flex justify-end">
          <ArrowButton href="https://x.com/prismprotoc0l/" target="_blank" rel="noopener noreferrer">
            View All Articles
          </ArrowButton>
        </Reveal>
      </div>
    </section>
  );
}
