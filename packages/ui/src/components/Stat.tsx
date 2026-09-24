import type { ReactNode } from "react";

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">{label}</div>
      <div className="mt-1.5 font-serif text-2xl text-fg tabular-nums">{value}</div>
      {sub !== undefined && <div className="mt-1 font-mono text-[11px] text-muted-2">{sub}</div>}
    </div>
  );
}
