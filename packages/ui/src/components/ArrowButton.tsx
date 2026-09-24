type Props = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
};

const CORNER_BASE = "pointer-events-none absolute h-[9px] w-[9px] border-line-strong";
const CORNERS = [
  `${CORNER_BASE} top-[-1px] left-[-1px] border-t border-l`,
  `${CORNER_BASE} top-[-1px] right-[-1px] border-t border-r`,
  `${CORNER_BASE} bottom-[-1px] left-[-1px] border-b border-l`,
  `${CORNER_BASE} bottom-[-1px] right-[-1px] border-b border-r`,
];

/** Bracket-cornered technical button with an arrow that nudges on hover. Renders as a link when `href` is given, otherwise a button. */
export default function ArrowButton({ children, href, className, onClick, disabled, type = "button" }: Props) {
  const classes = `group relative inline-flex items-center justify-between gap-6 border border-line-soft bg-surface-3 px-[22px] py-[18px] font-mono text-xs tracking-[0.08em] text-fg uppercase transition-[background-color,border-color] duration-[var(--dur-micro)] ease-out hover:border-line-strong hover:bg-[#1b1b1b] disabled:opacity-40 disabled:pointer-events-none ${className ?? ""}`;

  const content = (
    <>
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
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
