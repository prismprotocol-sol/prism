"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { useTokenBalances, fmt, pct, redemptionValueBps, attachment, TRANCHES, type Seniority } from "@prism/solana";
import { Stat, StatusTag, Note, Empty, PageHeader } from "@prism/ui";
import { Card } from "@/components/ui";
import { useNow } from "@/lib/useNow";
import { useAppData } from "@/components/DataProvider";
import { AllocationDonut } from "@/components/charts/AllocationDonut";
import { PortfolioGrowthChart } from "@/components/charts/PortfolioGrowthChart";
import { TRANCHE_DOT } from "@/lib/trancheColor";

export default function PortfolioPage() {
  const { connected } = useWallet();
  const { vaults, commitments } = useAppData();

  const trancheMints = useMemo(
    () => vaults.flatMap((v) => v.tranches.map((t) => t.mint).filter((m) => !m.equals(PublicKey.default))),
    [vaults]
  );
  const { balances } = useTokenBalances(trancheMints);
  const now = useNow();

  const positions = useMemo(() => {
    return commitments
      .map((c) => {
        const vault = vaults.find((v) => v.address.equals(c.account.vault));
        if (!vault) return null;
        const seniority = c.account.seniority as Seniority;
        const tranche = vault.tranches[seniority];
        const amount: BN = c.account.amount;
        const rvBps =
          vault.state === "active" || vault.state === "matured"
            ? redemptionValueBps(tranche.clearingBps, tranche.committed, tranche.loss, vault.activatedAt, vault.termSeconds, now)
            : 10_000;
        const current = amount.muln(rvBps).divn(10_000);
        const [lo, hi] = attachment(vault.tranches, vault.principalTarget, seniority);
        const held = balances[tranche.mint.toBase58()] ?? new BN(0);
        return { vault, seniority, tranche, amount, rvBps, current, lo, hi, held, redeemed: c.account.redeemed as boolean };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }, [commitments, vaults, balances, now]);

  const totals = useMemo(() => {
    const invested = positions.reduce((a, p) => (p.redeemed ? a : a.add(p.amount)), new BN(0));
    const current = positions.reduce((a, p) => (p.redeemed ? a : a.add(p.current)), new BN(0));
    return { invested, current, gain: current.sub(invested) };
  }, [positions]);

  const hasAccruingPositions = positions.some((p) => !p.redeemed && (p.vault.state === "active" || p.vault.state === "matured"));

  const allocation = useMemo(() => {
    const bySeniority = new Map<Seniority, BN>();
    for (const p of positions) {
      if (p.redeemed) continue;
      bySeniority.set(p.seniority, (bySeniority.get(p.seniority) ?? new BN(0)).add(p.current));
    }
    return TRANCHES.map((t) => ({
      label: t.label,
      value: bySeniority.get(t.id as Seniority) ?? new BN(0),
      seniority: t.id as Seniority,
    }));
  }, [positions]);

  if (!connected) {
    return (
      <div className="px-10 py-10">
        <Empty>Connect a wallet to see your positions.</Empty>
      </div>
    );
  }

  const gainPct = totals.invested.isZero() ? 0 : (Number(totals.gain.toString()) / Number(totals.invested.toString())) * 100;

  return (
    <div className="space-y-8 px-10 py-10">
      <PageHeader
        eyebrow="portfolio"
        title="Your positions"
        description="Valued at redemption value — what the contract owes — not market price."
      />

      <div className="grid gap-4 md:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="grid grid-cols-3 gap-4">
            <Stat label="Invested" value={`$${fmt(totals.invested)}`} />
            <Stat label="Redemption value" value={`$${fmt(totals.current)}`} />
            <Stat
              label="Accrued"
              value={
                <span className={totals.gain.isZero() ? "text-fg" : totals.gain.isNeg() ? "text-muted-2" : "text-accent"}>
                  {totals.gain.isNeg() ? "" : "+"}${fmt(totals.gain)}
                </span>
              }
              sub={`${gainPct >= 0 ? "+" : ""}${gainPct.toFixed(2)}%`}
            />
          </div>
        </Card>
        {positions.length > 0 && (
          <Card title="Allocation" subtitle="by tranche">
            <AllocationDonut segments={allocation} />
          </Card>
        )}
      </div>

      <Card title="Portfolio growth" subtitle="redemption value, realized → projected">
        {hasAccruingPositions ? (
          <PortfolioGrowthChart positions={positions} now={now} className="h-28" />
        ) : (
          <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-line-soft">
            <span className="max-w-xs text-center font-mono text-xs text-muted-2">
              {positions.length === 0
                ? "Commit to a vault to start tracking growth here."
                : "Your positions are still in funding — growth appears once a vault activates."}
            </span>
          </div>
        )}
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-sm text-fg">Tranche positions ({positions.length})</h2>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] text-muted uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
            Live
          </span>
        </div>
        {positions.length === 0 ? (
          <Empty>
            None yet.{" "}
            <Link href="/vaults" className="text-fg underline underline-offset-2">
              Browse vaults
            </Link>
            .
          </Empty>
        ) : (
          <div className="overflow-hidden rounded-xl border border-line-soft">
            <div className="grid grid-cols-[1.8fr_0.9fr_0.8fr_1fr_1fr_0.8fr_0.3fr] gap-4 border-b border-line-soft px-6 py-4 font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
              <span>Tranche</span>
              <span>Principal</span>
              <span>Rate</span>
              <span>Redemption</span>
              <span>Value</span>
              <span>Tokens</span>
              <span />
            </div>
            <div>
              {positions.map((p, i) => {
                const meta = TRANCHES.find((t) => t.id === p.seniority)!;
                const delta = p.current.sub(p.amount);
                const dotClass = TRANCHE_DOT[p.seniority];
                const base58 = p.vault.address.toBase58();
                return (
                  <Link
                    key={i}
                    href={`/vaults/${base58}`}
                    className="grid grid-cols-[1.8fr_0.9fr_0.8fr_1fr_1fr_0.8fr_0.3fr] items-center gap-4 border-b border-line-soft px-6 py-4 transition-colors duration-[var(--dur-micro)] ease-out last:border-b-0 hover:bg-surface-2"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} aria-hidden="true" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-fg">{meta.name}</span>
                          {p.redeemed && <StatusTag label="redeemed" tone="muted" />}
                        </div>
                        <div className="truncate font-mono text-[11px] text-muted-2">
                          {meta.risk} · {base58.slice(0, 10)}…
                          {!p.tranche.loss.isZero() && ` · absorbed $${fmt(p.tranche.loss, 0)} loss`}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-sm text-fg tabular-nums">${fmt(p.amount, 0)}</span>
                    <span className="font-mono text-sm text-fg tabular-nums">
                      {p.vault.state === "funding" ? "pending" : pct(p.tranche.clearingBps)}
                    </span>
                    <div className="font-mono text-sm text-fg tabular-nums">
                      {(p.rvBps / 10_000).toFixed(4)}
                      <div className="font-mono text-[10px] text-muted-2">
                        attach {pct(p.lo, 0)}–{pct(p.hi, 0)}
                      </div>
                    </div>
                    <div className="font-mono text-sm tabular-nums">
                      <span className="text-fg">${fmt(p.current, 0)}</span>
                      <div className={`font-mono text-[10px] ${delta.isZero() || delta.isNeg() ? "text-muted-2" : "text-accent"}`}>
                        {delta.isNeg() ? "" : "+"}${fmt(delta)}
                      </div>
                    </div>
                    <span className="font-mono text-sm text-fg tabular-nums">
                      {fmt(p.held, 0)}
                      {p.held.isZero() && <span className="block font-mono text-[10px] text-muted-2">not claimed</span>}
                    </span>
                    <span className="text-right font-mono text-xs text-muted-2" aria-hidden="true">
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <Note>
        Redemption value accrues with time and steps down when a loss is declared. Market price is a separate
        number, set by the AMM — a position showing 1.09 here could trade lower on a thin pool; that gap is the
        cost of exiting early, not a loss already taken.
      </Note>
    </div>
  );
}
