import { navLinks } from "@/lib/data";
import { condensedDisplay } from "@/lib/fonts";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-[var(--z-chrome)] grid h-[76px] grid-cols-[1fr_auto] items-center border-b border-line-soft bg-black ps-[clamp(14px,2.4vw,36px)] pe-[clamp(10px,1.6vw,40px)] max-mobile:h-auto max-mobile:grid-rows-[auto_auto] max-mobile:gap-y-2 max-mobile:py-3.5 max-mobile:ps-3.5 max-mobile:pe-2"
    >
      {/* Left edge matches Hero's headline left padding so the mark lines up
          with the heading text below it. Right edge matches Shell's .inner
          margin-inline — the vertical guide-rule border framing every
          section below — since Header itself renders outside Shell and
          needs this value mirrored by hand to land on the same line. */}
      <a
        href="#home"
        className="flex items-center gap-0.5 justify-self-start text-fg animate-enter-mark max-mobile:col-start-1 max-mobile:row-start-1"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/prism-textured-emblem.svg"
          alt=""
          aria-hidden="true"
          className="block h-10 w-auto object-contain"
        />
        <span className="pt-1.5 font-serif text-4xl font-extralight tracking-[-0.01em] text-fg max-mobile:text-3xl">
          Prism
        </span>
      </a>
      <div className="flex min-w-0 items-center justify-self-end gap-16 max-mobile:col-span-full max-mobile:row-start-2 max-mobile:justify-self-end max-mobile:gap-2">
        <nav
          aria-label="Primary"
          className="flex items-center gap-8 animate-enter-nav max-mobile:gap-3"
        >
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className={`whitespace-nowrap font-sans text-sm tracking-[0.06em] transition-colors duration-[var(--dur-micro)] ease-out hover:text-fg max-mobile:text-[11px] max-[380px]:text-[10px] ${
                i === 0 ? "text-fg" : "text-muted"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex min-w-0 items-center animate-enter-header-side">
          <a
            href="#waitlist"
            className={`${condensedDisplay.className} group inline-flex items-center whitespace-nowrap px-4 py-3 text-2xl tracking-[0.03em] text-white uppercase transition-colors duration-[var(--dur-micro)] ease-out hover:text-muted max-mobile:px-1 max-mobile:py-1 max-mobile:text-xs max-[380px]:text-[8px]`}
          >
            <span
              className="inline-block transition-transform duration-[var(--dur-micro)] ease-out group-hover:-translate-x-1.5"
              aria-hidden="true"
            >
              [
            </span>
            <span className="mx-1.5">Join Waitlist</span>
            <span
              className="inline-block transition-transform duration-[var(--dur-micro)] ease-out group-hover:translate-x-1.5"
              aria-hidden="true"
            >
              ]
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
