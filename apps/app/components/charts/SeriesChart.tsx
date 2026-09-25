const WIDTH = 320;
const HEIGHT = 96;
const PAD_X = 2;
const PAD_TOP = 10;
const PAD_BOTTOM = 4;

export type SeriesPoint = { t: number; v: number };

/**
 * Generic realized/projected line chart — the shared rendering primitive
 * behind AccrualChart and PortfolioGrowthChart. `points` must be sorted by
 * `t` ascending and include an exact point at `t === nowT` (callers compute
 * that themselves, since only they know how to evaluate their series at an
 * arbitrary time). Everything at or before `nowT` renders as a solid,
 * filled line (realized); everything from `nowT` onward renders dashed, no
 * fill (a deterministic projection, not settled history).
 */
export function SeriesChart({
  points,
  nowT,
  startLabel,
  nowLabel,
  endLabel,
  showLabels = true,
  className,
}: {
  points: SeriesPoint[];
  nowT: number;
  startLabel: string;
  nowLabel: string;
  endLabel: string;
  /** false for a bare sparkline (table cells) — skips the start/now/end label row. */
  showLabels?: boolean;
  className?: string;
}) {
  if (points.length < 2) return null;

  const tMin = points[0].t;
  const tMax = points[points.length - 1].t;
  const tSpan = Math.max(tMax - tMin, 1);
  const vMin = Math.min(...points.map((p) => p.v));
  const vMax = Math.max(...points.map((p) => p.v));
  const vSpan = Math.max(vMax - vMin, 1);

  const x = (t: number) => PAD_X + ((t - tMin) / tSpan) * (WIDTH - PAD_X * 2);
  const y = (v: number) => HEIGHT - PAD_BOTTOM - ((v - vMin) / vSpan) * (HEIGHT - PAD_TOP - PAD_BOTTOM);
  const baseline = HEIGHT - PAD_BOTTOM;
  const toPath = (pts: SeriesPoint[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.t)},${y(p.v)}`).join(" ");

  const realized = points.filter((p) => p.t <= nowT);
  const projected = points.filter((p) => p.t >= nowT);
  const realizedLine = toPath(realized);
  const projectedLine = toPath(projected);
  const realizedArea = realized.length
    ? `${realizedLine} L${x(realized[realized.length - 1].t)},${baseline} L${x(realized[0].t)},${baseline} Z`
    : "";
  const nowV = points.find((p) => p.t === nowT)?.v ?? realized[realized.length - 1]?.v ?? points[0].v;

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="h-full w-full">
        <line x1={PAD_X} y1={baseline} x2={WIDTH - PAD_X} y2={baseline} className="stroke-line-soft" strokeWidth="1" />
        {realizedArea && <path d={realizedArea} className="fill-accent" fillOpacity="0.12" stroke="none" />}
        {realized.length > 1 && (
          <path d={realizedLine} className="stroke-accent" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {projected.length > 1 && (
          <path
            d={projectedLine}
            className="stroke-line-strong"
            fill="none"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        <line x1={x(nowT)} y1={PAD_TOP} x2={x(nowT)} y2={baseline} className="stroke-accent" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx={x(nowT)} cy={y(nowV)} r="2.75" className="fill-accent" />
      </svg>
      {showLabels && (
        <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] text-muted-2">
          <span>{startLabel}</span>
          <span className="text-accent">{nowLabel}</span>
          <span>{endLabel}</span>
        </div>
      )}
    </div>
  );
}
