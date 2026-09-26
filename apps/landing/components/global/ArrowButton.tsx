type Props = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  target?: string;
  rel?: string;
};

const CORNER_BASE = "pointer-events-none absolute h-[9px] w-[9px] border-line-strong";
const CORNERS = [
  `${CORNER_BASE} top-[-1px] left-[-1px] border-t border-l`,
  `${CORNER_BASE} top-[-1px] right-[-1px] border-t border-r`,
  `${CORNER_BASE} bottom-[-1px] left-[-1px] border-b border-l`,
  `${CORNER_BASE} bottom-[-1px] right-[-1px] border-b border-r`,
];

/** Bracket-cornered technical button with an arrow that nudges on hover. */
export default function ArrowButton({ children, href = "#", className, target, rel }: Props) {
  // The corner brackets are absolutely positioned against this element, so it
  // needs `position` other than static — but a caller placing the whole
  // button (e.g. `absolute` in a corner) must be able to override that,
  // and Tailwind resolves same-specificity conflicts by stylesheet order,
  // not by where a class sits in this string. Only fall back to `relative`
  // when the caller hasn't already set a position of their own.
  const hasPosition = /(?:^|\s)(?:static|relative|absolute|fixed|sticky)(?:\s|$)/.test(
    className ?? ""
  );

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`group ${hasPosition ? "" : "relative"} inline-flex items-center justify-between gap-6 border border-line-soft bg-surface-3 px-[22px] py-[18px] font-mono text-xs tracking-[0.08em] text-fg uppercase transition-[background-color,border-color] duration-[var(--dur-micro)] ease-out hover:border-line-strong hover:bg-[#1b1b1b] ${className ?? ""}`}
    >
      {CORNERS.map((cornerClass) => (
        <span key={cornerClass} className={cornerClass} />
      ))}
      <span className="whitespace-nowrap">{children}</span>
      <span
        className="transition-transform duration-[var(--dur-micro)] ease-out group-hover:translate-x-1.5"
        aria-hidden="true"
      >
        →
      </span>
    </a>
  );
}
