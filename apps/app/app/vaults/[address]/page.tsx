"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useVaultCommitments, fmt, pct, TRANCHES } from "@prism/solana";
import { useAppData } from "@/components/DataProvider";
import { explorerUrl } from "@prism/config";
import { Stat, StatusTag, Note, Empty, CopyButton } from "@prism/ui";
import { Card } from "@/components/ui";
import { vaultStatus } from "@/lib/statusTone";
import { VISITED_VAULT_KEY } from "@/components/QuickStartGuide";
import { useNow } from "@/lib/useNow";
import { AccrualChart } from "@/components/charts/AccrualChart";
import { TRANCHE_DOT } from "@/lib/trancheColor";

export default function VaultDetailPage({ params }: PageProps<"/vaults/[address]">) {
  const { address } = use(params);

  let vaultAddress: PublicKey | null = null;
  try {
    vaultAddress = new PublicKey(address);
  } catch {
    vaultAddress = null;
  }

  if (!vaultAddress) {
    return (
      <div className="px-10 py-10">
        <Empty>Not a valid vault address.</Empty>
      </div>
    );
  }

  return <VaultDetail vaultAddress={vaultAddress} />;
}

function VaultDetail({ vaultAddress }: { vaultAddress: PublicKey }) {
  const { connection } = useConnection();
  const { vaults, commitments } = useAppData();
  const { items: vaultCommitments } = useVaultCommitments(vaultAddress);
  const [signatures, setSignatures] = useState<{ signature: string; slot: number }[]>([]);

  const vault = vaults.find((v) => v.address.equals(vaultAddress));

  useEffect(() => {
    connection
      .getSignaturesForAddress(vaultAddress, { limit: 10 })
      .then((sigs) => setSignatures(sigs.map((s) => ({ signature: s.signature, slot: s.slot }))))
      .catch(() => setSignatures([]));
  }, [connection, vaultAddress]);

  useEffect(() => {
    try {
      localStorage.setItem(VISITED_VAULT_KEY, "1");
    } catch {
      // localStorage unavailable — the Quick Start "browse a vault" step just won't flip.
    }
  }, []);

  const now = useNow();
  const myCommitment = (seniority: number) =>
    commitments.find((c) => c.account.vault.equals(vaultAddress) && c.account.seniority === seniority);

  if (!vault) {
    return (
      <div className="px-10 py-10">
        <Empty>Vault not found, or still loading.</Empty>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-10 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tracking-[0.08em] text-muted uppercase">
              {vault.address.toBase58()}
            </span>
            <CopyButton value={vault.address.toBase58()} />
          </div>
          <h1 className="mt-2 font-serif text-3xl text-fg">Vault detail</h1>
        </div>
        <StatusTag {...vaultStatus(vault.state)} />
      </header>

      <Card>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <Stat label="Principal target" value={`$${fmt(vault.principalTarget, 0)}`} />
          <Stat label="Coupon" value={pct(vault.couponBps, 0)} />
          <Stat
            label="Committed"
            value={`$${fmt(vault.totalCommitted, 0)}`}
            sub={
              vault.principalTarget.isZero()
                ? undefined
                : `${vault.totalCommitted.muln(100).div(vault.principalTarget).toNumber()}% subscribed`
            }
          />
          <Stat label="Realized loss" value={`$${fmt(vault.realizedLoss, 0)}`} />
        </div>

        {!vault.principalTarget.isZero() && (
          <div className="mt-6 flex h-2 overflow-hidden rounded-full border border-line-soft">
            {TRANCHES.slice()
              .reverse()
              .map((t) => {
                const tr = vault.tranches[t.id];
                const widthPct = tr.committed.muln(1000).div(vault.principalTarget).toNumber() / 10;
                return (
                  <div
                    key={t.id}
                    style={{ width: `${widthPct}%` }}
                    className={TRANCHE_DOT[t.id]}
                    title={`${t.label}: $${fmt(tr.committed, 0)}`}
                  />
                );
              })}
          </div>
        )}
      </Card>

      <div className="overflow-hidden rounded-xl border border-line-soft">
        <div className="grid grid-cols-[1.4fr_0.8fr_0.7fr_1.3fr_0.6fr_0.9fr_0.3fr] gap-4 border-b border-line-soft px-6 py-4 font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
          <span>Tranche</span>
          <span>Committed</span>
          <span>Coupon</span>
          <span>Redemption</span>
          <span>Holders</span>
          <span>Position</span>
          <span />
        </div>
        <div>
          {TRANCHES.map((t) => {
            const tr = vault.tranches[t.id];
            const mine = myCommitment(t.id);
            const holders = vaultCommitments.filter((c) => c.account.seniority === t.id).length;
            const dotClass = TRANCHE_DOT[t.id];
            const accruing = vault.state === "active" || vault.state === "matured";

            return (
              <Link
                key={t.id}
                href={`/vaults/${vault.address.toBase58()}/${t.id}`}
                className="grid grid-cols-[1.4fr_0.8fr_0.7fr_1.3fr_0.6fr_0.9fr_0.3fr] items-center gap-4 border-b border-line-soft px-6 py-5 transition-colors duration-[var(--dur-micro)] ease-out last:border-b-0 hover:bg-surface-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} aria-hidden="true" />
                    <span className="font-mono text-sm text-fg">{t.name}</span>
                  </div>
                  <div className="mt-0.5 truncate font-mono text-[11px] text-muted-2">
                    {t.risk}
                    {!tr.loss.isZero() && ` · absorbed $${fmt(tr.loss, 0)} loss`}
                  </div>
                </div>

                <span className="font-mono text-sm text-fg tabular-nums">${fmt(tr.committed, 0)}</span>
                <span className="font-mono text-sm text-fg tabular-nums">{accruing ? pct(tr.clearingBps) : "—"}</span>

                <div className="h-10 w-full max-w-[160px]">
                  {accruing ? (
                    <AccrualChart
                      className="h-full w-full"
                      clearingBps={tr.clearingBps}
                      committed={tr.committed}
                      loss={tr.loss}
                      activatedAt={vault.activatedAt}
                      termSeconds={vault.termSeconds}
                      now={now}
                      showLabels={false}
                    />
                  ) : (
                    <span className="font-mono text-xs text-muted-2">not yet active</span>
                  )}
                </div>

                <span className="font-mono text-sm text-fg tabular-nums">{holders}</span>

                <span className="font-mono text-sm tabular-nums">
                  {mine ? (
                    <>
                      <span className="text-fg">${fmt(mine.account.amount, 0)}</span>
                      {mine.account.redeemed && <div className="font-mono text-[10px] text-muted-2">redeemed</div>}
                    </>
                  ) : (
                    <span className="text-muted-2">—</span>
                  )}
                </span>

                <span className="text-right font-mono text-xs text-muted-2" aria-hidden="true">
                  →
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <Note>
        Redemption value is what the contract owes: deterministic, accruing with time, stepped down by any loss. It
        is not market price. If this vault&rsquo;s clearing gate failed at close, it moves to Cancelled and every
        commitment is fully refundable rather than erroring out. Open a tranche above to invest, claim, or redeem.
      </Note>

      <section className="space-y-3">
        <h2 className="font-sans text-sm text-fg">Recent activity</h2>
        {signatures.length === 0 ? (
          <Empty>No on-chain activity recorded for this vault yet.</Empty>
        ) : (
          <div className="overflow-hidden rounded-xl border border-line-soft">
            {signatures.map((s) => (
              <a
                key={s.signature}
                href={explorerUrl(s.signature)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border-b border-line-soft px-6 py-3 font-mono text-xs text-muted transition-colors duration-[var(--dur-micro)] ease-out last:border-b-0 hover:bg-surface-2 hover:text-fg"
              >
                <span>{s.signature.slice(0, 24)}…</span>
                <span>slot {s.slot}</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
