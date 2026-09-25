import type { BN } from "@coral-xyz/anchor";
import { fmt, type Seniority } from "@prism/solana";
import { TRANCHE_DOT, TRANCHE_STROKE } from "@/lib/trancheColor";

const SIZE = 120;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export type AllocationSegment = { label: string; value: BN; seniority: Seniority };

/** Current portfolio composition by tranche seniority — a real snapshot of `positions`, not a time series. */
export function AllocationDonut({ segments, className }: { segments: AllocationSegment[]; className?: string }) {
  const total = segments.reduce((a, s) => a + Number(s.value.toString()), 0);
  if (total <= 0) return null;

  const arcs = segments.reduce<{ seniority: Seniority; dash: number; offset: number }[]>((acc, s) => {
    const num = Number(s.value.toString());
    if (num <= 0) return acc;
    const dash = (num / total) * CIRCUMFERENCE;
    const prev = acc[acc.length - 1];
    acc.push({ seniority: s.seniority, dash, offset: prev ? prev.offset + prev.dash : 0 });
    return acc;
  }, []);

  return (
    <div className={`flex items-center gap-6 ${className ?? ""}`}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-[120px] w-[120px] shrink-0 -rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} className="stroke-line-soft" strokeWidth={STROKE} fill="none" />
        {arcs.map((a, i) => (
          <circle
            key={i}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            className={TRANCHE_STROKE[a.seniority]}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={`${a.dash} ${CIRCUMFERENCE - a.dash}`}
            strokeDashoffset={-a.offset}
          />
        ))}
      </svg>
      <div className="space-y-2.5">
        {segments.map((s, i) => {
          const num = Number(s.value.toString());
          if (num <= 0) return null;
          return (
            <div key={i} className="flex items-center gap-2.5 font-mono text-xs">
              <span className={`h-2 w-2 rounded-full ${TRANCHE_DOT[s.seniority]}`} aria-hidden="true" />
              <span className="w-14 text-muted uppercase tracking-[0.04em]">{s.label}</span>
              <span className="text-fg tabular-nums">${fmt(s.value, 0)}</span>
              <span className="text-muted-2 tabular-nums">{((num / total) * 100).toFixed(0)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
