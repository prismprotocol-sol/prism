"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { useVaults, useCommitments, useTokenBalances, fmt, pct, redemptionValueBps, attachment, TRANCHES, type Seniority } from "@prism/solana";
import { Card, Stat, StatusTag, Note, Empty, PageHeader } from "@prism/ui";

export default function PortfolioPage() {
  const { connected } = useWallet();
  const { vaults } = useVaults();
  const { items: commitments } = useCommitments();

  const trancheMints = useMemo(
    () => vaults.flatMap((v) => v.tranches.map((t) => t.mint).filter((m) => !m.equals(PublicKey.default))),
    [vaults]
  );
  const { balances } = useTokenBalances(trancheMints);
  const now = Math.floor(Date.now() / 1000);

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

      <Card>
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Invested" value={`$${fmt(totals.invested)}`} />
          <Stat label="Redemption value" value={`$${fmt(totals.current)}`} />
          <Stat
            label="Accrued"
            value={`${totals.gain.isNeg() ? "" : "+"}$${fmt(totals.gain)}`}
            sub={`${gainPct >= 0 ? "+" : ""}${gainPct.toFixed(2)}%`}
          />
        </div>
      </Card>

      <section className="space-y-3">
        <h2 className="font-sans text-sm text-fg">Tranche positions ({positions.length})</h2>
        {positions.length === 0 ? (
          <Empty>
            None yet.{" "}
            <Link href="/vaults" className="text-fg underline underline-offset-2">
              Browse vaults
            </Link>
            .
          </Empty>
        ) : (
          <div className="space-y-3">
            {positions.map((p, i) => {
              const meta = TRANCHES.find((t) => t.id === p.seniority)!;
              const delta = p.current.sub(p.amount);
              return (
                <div key={i} className="border border-line-soft p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-sans text-sm text-fg">{meta.name}</span>
                      <span className="font-mono text-xs text-muted">{meta.risk}</span>
                      {p.redeemed && <StatusTag label="redeemed" tone="muted" />}
                    </div>
                    <Link
                      href={`/vaults/${p.vault.address.toBase58()}`}
                      className="font-mono text-xs text-muted hover:text-fg"
                    >
                      {p.vault.address.toBase58().slice(0, 16)}… →
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <Stat label="Principal" value={`$${fmt(p.amount, 0)}`} />
                    <Stat label="Rate" value={p.vault.state === "funding" ? "pending" : pct(p.tranche.clearingBps)} />
                    <Stat label="Redemption" value={(p.rvBps / 10_000).toFixed(4)} sub={`attach ${pct(p.lo, 0)}–${pct(p.hi, 0)}`} />
                    <Stat label="Value" value={`$${fmt(p.current, 0)}`} sub={`${delta.isNeg() ? "" : "+"}$${fmt(delta)}`} />
                    <Stat label="Tokens held" value={fmt(p.held, 0)} sub={p.held.isZero() ? "not claimed" : undefined} />
                  </div>
                  {!p.tranche.loss.isZero() && (
                    <div className="mt-3 border-t border-line-soft pt-2 font-mono text-xs text-muted-2">
                      Tranche absorbed ${fmt(p.tranche.loss, 0)} of loss
                    </div>
                  )}
                </div>
              );
            })}
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
