import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  children,
  className,
  textured,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  /** Adds a faint film-grain overlay — reserve for the one or two panels per page that should read as a highlight. */
  textured?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-line-soft bg-surface-2 p-6 ${className ?? ""}`}>
      {textured && <div className="grain" aria-hidden="true" />}
      {(title || subtitle) && (
        <div className="relative mb-5 flex items-baseline justify-between gap-4 border-b border-line-soft pb-3">
          {title && <h3 className="font-sans text-sm text-fg">{title}</h3>}
          {subtitle && (
            <span className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">{subtitle}</span>
          )}
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
