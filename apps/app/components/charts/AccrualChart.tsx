import type { BN } from "@coral-xyz/anchor";
import { redemptionValueBps } from "@prism/solana";
import { SeriesChart } from "./SeriesChart";

/**
 * Redemption value is `10000 + floor(clearingBps * elapsed / termSeconds) -
 * lossBps` (see `redemptionValueBps` in packages/solana/src/client.ts) — a
 * straight line in elapsed with loss held constant, not a stored series.
 * The segment up to `now` is real/realized; the segment after is a
 * deterministic projection assuming no further loss — SeriesChart's
 * solid/dashed split is what keeps that distinction honest.
 */
export function AccrualChart({
  clearingBps,
  committed,
  loss,
  activatedAt,
  termSeconds,
  now,
  showLabels = true,
  className,
}: {
  clearingBps: number;
  committed: BN;
  loss: BN;
  activatedAt: number;
  termSeconds: number;
  now: number;
  showLabels?: boolean;
  className?: string;
}) {
  if (termSeconds <= 0 || now <= 0) return null;

  const end = activatedAt + termSeconds;
  const nowT = Math.min(Math.max(now, activatedAt), end);
  const vAt = (t: number) => redemptionValueBps(clearingBps, committed, loss, activatedAt, termSeconds, t);
  const fmtMultiple = (v: number) => (v / 10_000).toFixed(4);

  const points = [
    { t: activatedAt, v: vAt(activatedAt) },
    { t: nowT, v: vAt(nowT) },
    { t: end, v: vAt(end) },
  ].sort((a, b) => a.t - b.t);

  return (
    <SeriesChart
      points={points}
      nowT={nowT}
      startLabel={fmtMultiple(points[0].v)}
      nowLabel={`${fmtMultiple(vAt(nowT))} now`}
      endLabel={`${fmtMultiple(vAt(end))} at maturity`}
      showLabels={showLabels}
      className={className}
    />
  );
}
