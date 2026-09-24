import type { ReactNode } from "react";

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="border-t border-line-soft pt-4 font-sans text-xs leading-relaxed text-muted">{children}</p>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="font-sans text-sm text-muted">{children}</p>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <span className="font-mono text-xs tracking-[0.08em] text-muted uppercase">[ {eyebrow} ]</span>
        <h1 className="mt-2 font-serif text-4xl text-fg">{title}</h1>
        {description && <p className="mt-2 max-w-lg font-sans text-sm text-muted">{description}</p>}
      </div>
      {action}
    </header>
  );
}
