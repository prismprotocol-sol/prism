import { BN } from "@coral-xyz/anchor";
import { redemptionValueBps, UNIT, type VaultView, type TrancheView } from "@prism/solana";
import { SeriesChart } from "./SeriesChart";

type Position = { vault: VaultView; tranche: TrancheView; amount: BN; redeemed: boolean };

/**
 * Sum of every live position's redemption value, sampled only at the exact
 * points where the aggregate can kink — each position's `activatedAt` and
 * maturity, plus `now` — so the reconstruction is exact, not an
 * approximation from arbitrary sampling: between any two consecutive
 * breakpoints every contributing position is independently linear (or flat,
 * pre-activation), so the sum is too.
 */
export function PortfolioGrowthChart({ positions, now, className }: { positions: Position[]; now: number; className?: string }) {
  const live = positions.filter((p) => !p.redeemed);
  const accruing = live.filter((p) => p.vault.state === "active" || p.vault.state === "matured");
  if (accruing.length === 0 || now <= 0) return null;

  const starts = accruing.map((p) => p.vault.activatedAt);
  const ends = accruing.map((p) => p.vault.activatedAt + p.vault.termSeconds);
  const start = Math.min(...starts);
  const end = Math.max(...ends);
  const nowT = Math.min(Math.max(now, start), end);

  const valueAt = (t: number) =>
    live.reduce((sum, p) => {
      if (p.vault.state === "funding") return sum.add(p.amount);
      const clamped = Math.min(Math.max(t, p.vault.activatedAt), p.vault.activatedAt + p.vault.termSeconds);
      const rv = redemptionValueBps(p.tranche.clearingBps, p.tranche.committed, p.tranche.loss, p.vault.activatedAt, p.vault.termSeconds, clamped);
      return sum.add(p.amount.muln(rv).divn(10_000));
    }, new BN(0));

  const breakpoints = Array.from(new Set([start, nowT, end, ...starts, ...ends]))
    .filter((t) => t >= start && t <= end)
    .sort((a, b) => a - b);
  const points = breakpoints.map((t) => ({ t, v: Number(valueAt(t).toString()) }));

  const fmtUsd = (raw: number) => `$${(raw / UNIT).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const nowV = points.find((p) => p.t === nowT)?.v ?? points[0].v;

  return (
    <SeriesChart
      points={points}
      nowT={nowT}
      startLabel={fmtUsd(points[0].v)}
      nowLabel={`${fmtUsd(nowV)} now`}
      endLabel={`${fmtUsd(points[points.length - 1].v)} at maturity`}
      className={className}
    />
  );
}
