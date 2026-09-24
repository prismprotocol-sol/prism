"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import { useVaults, useCommitments, fmt, redemptionValueBps, type Seniority } from "@prism/solana";
import { Card, Stat, StatusTag, Empty, PageHeader } from "@prism/ui";
import { vaultStatus } from "@/lib/statusTone";

export default function Dashboard() {
  const { connected } = useWallet();
  const { vaults, loading } = useVaults();
  const { items: commitments } = useCommitments();

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
        return { vault, seniority, amount, current, redeemed: c.account.redeemed as boolean };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }, [commitments, vaults, now]);

  const totals = useMemo(() => {
    const invested = positions.reduce((a, p) => (p.redeemed ? a : a.add(p.amount)), new BN(0));
    const current = positions.reduce((a, p) => (p.redeemed ? a : a.add(p.current)), new BN(0));
    return { invested, current };
  }, [positions]);

  const funding = vaults.filter((v) => v.state === "funding");

  return (
    <div className="space-y-10 px-10 py-10">
      <PageHeader eyebrow="app.prism.credit" title="Dashboard" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <Stat label="Portfolio value" value={connected ? `$${fmt(totals.current, 0)}` : "—"} />
        </Card>
        <Card>
          <Stat label="Invested" value={connected ? `$${fmt(totals.invested, 0)}` : "—"} />
        </Card>
        <Card>
          <Stat label="Active positions" value={connected ? positions.filter((p) => !p.redeemed).length : "—"} />
        </Card>
        <Card>
          <Stat label="Open for funding" value={funding.length} />
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-sans text-sm text-fg">Available opportunities</h2>
          <Link href="/vaults" className="font-mono text-xs tracking-[0.06em] text-muted uppercase hover:text-fg">
            All vaults →
          </Link>
        </div>
        {loading ? (
          <Empty>Loading vaults…</Empty>
        ) : funding.length === 0 ? (
          <Empty>No vaults are open for funding right now.</Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {funding.slice(0, 3).map((v) => (
              <Link key={v.address.toBase58()} href={`/vaults/${v.address.toBase58()}`}>
                <Card>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-xs text-muted">{v.address.toBase58().slice(0, 10)}…</span>
                    <StatusTag {...vaultStatus(v.state)} />
                  </div>
                  <Stat
                    label="Principal target"
                    value={`$${fmt(v.principalTarget, 0)}`}
                    sub={`${v.principalTarget.isZero() ? 0 : v.totalCommitted.muln(100).div(v.principalTarget).toNumber()}% subscribed`}
                  />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {connected && (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-sans text-sm text-fg">Recent positions</h2>
            <Link href="/portfolio" className="font-mono text-xs tracking-[0.06em] text-muted uppercase hover:text-fg">
              Full portfolio →
            </Link>
          </div>
          {positions.length === 0 ? (
            <Empty>You have no positions yet.</Empty>
          ) : (
            <div className="space-y-2">
              {positions.slice(0, 4).map((p, i) => (
                <Link
                  key={i}
                  href={`/vaults/${p.vault.address.toBase58()}`}
                  className="flex items-center justify-between border border-line-soft px-4 py-3 transition-colors duration-[var(--dur-micro)] ease-out hover:border-line-strong"
                >
                  <span className="font-mono text-xs text-muted">{p.vault.address.toBase58().slice(0, 16)}…</span>
                  <span className="font-mono text-xs text-fg">${fmt(p.current, 0)}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
