import type { ReactNode } from "react";
import Link from "next/link";

const VARIANTS = {
  primary: "border-line-soft bg-surface-3 text-fg hover:border-line-strong hover:bg-[#1b1b1b]",
  outline: "border-line-soft text-fg hover:border-line-strong",
  ghost: "border-transparent text-muted hover:border-line-soft hover:text-fg",
};

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: keyof typeof VARIANTS;
  type?: "button" | "submit";
  className?: string;
  href?: string;
};

export function Button({ children, onClick, disabled, variant = "outline", type = "button", className, href }: Props) {
  const classes = `inline-flex items-center justify-center rounded-lg border px-4 py-2.5 font-mono text-xs tracking-[0.08em] uppercase transition-colors duration-[var(--dur-micro)] ease-out disabled:pointer-events-none disabled:opacity-40 ${VARIANTS[variant]} ${className ?? ""}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
