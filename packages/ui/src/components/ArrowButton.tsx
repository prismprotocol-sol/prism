type Props = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
};

/**
 * Rounded button with an arrow that nudges on hover. Renders as a link when
 * `href` is given, otherwise a button. Used to have sharp corner brackets —
 * dropped because they clash with a rounded box; `apps/landing` keeps its
 * own separate local `ArrowButton` with the bracket treatment intact.
 */
export default function ArrowButton({ children, href, className, onClick, disabled, type = "button" }: Props) {
  const classes = `group relative inline-flex items-center justify-between gap-6 rounded-lg border border-line-soft bg-surface-3 px-[22px] py-[18px] font-mono text-xs tracking-[0.08em] text-fg uppercase transition-[background-color,border-color] duration-[var(--dur-micro)] ease-out hover:border-line-strong hover:bg-[#1b1b1b] disabled:opacity-40 disabled:pointer-events-none ${className ?? ""}`;

  const content = (
    <>
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
