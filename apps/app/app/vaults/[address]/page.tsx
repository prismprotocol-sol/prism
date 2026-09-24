"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  useProgram,
  useVaults,
  useCommitments,
  configPda,
  vaultAuthorityPda,
  escrowPda,
  trancheMintPda,
  commitmentPda,
  ata,
  fmt,
  pct,
  toBase,
  redemptionValueBps,
  attachment,
  TRANCHES,
  TOKEN_PROGRAM,
  ATA_PROGRAM,
  type Seniority,
} from "@prism/solana";
import { explorerUrl } from "@prism/config";
import { Card, Stat, StatusTag, Button, ArrowButton, AmountInput, Note, Empty } from "@prism/ui";
import { TxPanel } from "@/components/TxPanel";
import { useTx } from "@/lib/useTx";
import { vaultStatus } from "@/lib/statusTone";

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
  const program = useProgram();
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { vaults, refresh } = useVaults();
  const { items: commitments, refresh: refreshCommits } = useCommitments();
  const { state, run } = useTx();
  const [amounts, setAmounts] = useState<Record<number, string>>({});
  const [signatures, setSignatures] = useState<{ signature: string; slot: number }[]>([]);

  const vault = vaults.find((v) => v.address.equals(vaultAddress));

  useEffect(() => {
    connection
      .getSignaturesForAddress(vaultAddress, { limit: 10 })
      .then((sigs) => setSignatures(sigs.map((s) => ({ signature: s.signature, slot: s.slot }))))
      .catch(() => setSignatures([]));
  }, [connection, vaultAddress]);

  const now = Math.floor(Date.now() / 1000);
  const myCommitment = (seniority: number) =>
    commitments.find((c) => c.account.vault.equals(vaultAddress) && c.account.seniority === seniority);

  const commit = (seniority: Seniority) =>
    run("Commit", async () => {
      if (!publicKey || !vault) throw new Error("Connect a wallet first.");
      const sig = await program.methods
        .commit(seniority, toBase(amounts[seniority] ?? "0"))
        .accounts({
          investor: publicKey,
          config: configPda(),
          vault: vault.address,
          underlyingMint: vault.underlyingMint,
          investorToken: ata(vault.underlyingMint, publicKey),
          escrow: escrowPda(vault.address),
          commitment: commitmentPda(vault.address, publicKey, seniority),
          tokenProgram: TOKEN_PROGRAM,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      await Promise.all([refresh(), refreshCommits()]);
      return sig;
    });

  const claim = (seniority: Seniority) =>
    run("Claim tokens", async () => {
      if (!publicKey || !vault) throw new Error("Connect a wallet first.");
      const mint = trancheMintPda(vault.address, seniority);
      const sig = await program.methods
        .claimTokens()
        .accounts({
          investor: publicKey,
          vault: vault.address,
          commitment: commitmentPda(vault.address, publicKey, seniority),
          vaultAuthority: vaultAuthorityPda(vault.address),
          trancheMint: mint,
          investorTrancheToken: ata(mint, publicKey),
          tokenProgram: TOKEN_PROGRAM,
          associatedTokenProgram: ATA_PROGRAM,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      await Promise.all([refresh(), refreshCommits()]);
      return sig;
    });

  const redeem = (seniority: Seniority) =>
    run("Redeem", async () => {
      if (!publicKey || !vault) throw new Error("Connect a wallet first.");
      const mint = trancheMintPda(vault.address, seniority);
      const sig = await program.methods
        .redeem()
        .accounts({
          investor: publicKey,
          vault: vault.address,
          commitment: commitmentPda(vault.address, publicKey, seniority),
          vaultAuthority: vaultAuthorityPda(vault.address),
          trancheMint: mint,
          investorTrancheToken: ata(mint, publicKey),
          escrow: escrowPda(vault.address),
          investorUnderlying: ata(vault.underlyingMint, publicKey),
          tokenProgram: TOKEN_PROGRAM,
        })
        .rpc();
      await Promise.all([refresh(), refreshCommits()]);
      return sig;
    });

  const refund = (seniority: Seniority) =>
    run("Refund", async () => {
      if (!publicKey || !vault) throw new Error("Connect a wallet first.");
      const sig = await program.methods
        .refund()
        .accounts({
          investor: publicKey,
          vault: vault.address,
          commitment: commitmentPda(vault.address, publicKey, seniority),
          vaultAuthority: vaultAuthorityPda(vault.address),
          escrow: escrowPda(vault.address),
          investorUnderlying: ata(vault.underlyingMint, publicKey),
          tokenProgram: TOKEN_PROGRAM,
        })
        .rpc();
      await Promise.all([refresh(), refreshCommits()]);
      return sig;
    });

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
          <span className="font-mono text-xs tracking-[0.08em] text-muted uppercase">
            {vault.address.toBase58()}
          </span>
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
          <div className="mt-6 flex h-2 border border-line-soft">
            {TRANCHES.slice()
              .reverse()
              .map((t) => {
                const tr = vault.tranches[t.id];
                const widthPct = tr.committed.muln(1000).div(vault.principalTarget).toNumber() / 10;
                return (
                  <div
                    key={t.id}
                    style={{ width: `${widthPct}%` }}
                    className={t.id === 2 ? "bg-fg" : t.id === 1 ? "bg-muted" : "bg-muted-2"}
                    title={`${t.label}: $${fmt(tr.committed, 0)}`}
                  />
                );
              })}
          </div>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {TRANCHES.map((t) => {
          const tr = vault.tranches[t.id];
          const mine = myCommitment(t.id);
          const [lo, hi] = attachment(vault.tranches, vault.principalTarget, t.id as Seniority);
          const rv =
            vault.state === "active" || vault.state === "matured"
              ? redemptionValueBps(tr.clearingBps, tr.committed, tr.loss, vault.activatedAt, vault.termSeconds, now)
              : 10_000;

          return (
            <Card key={t.id} title={t.name} subtitle={t.risk}>
              <div className="mb-4 space-y-3">
                <Stat label="Committed" value={`$${fmt(tr.committed, 0)}`} sub={t.blurb} />
                {vault.state !== "funding" && (
                  <>
                    <Stat label="Clearing rate" value={pct(tr.clearingBps)} />
                    <Stat
                      label="Redemption value"
                      value={(rv / 10_000).toFixed(4)}
                      sub={`attach ${pct(lo, 0)}–${pct(hi, 0)}`}
                    />
                  </>
                )}
                {!tr.loss.isZero() && <Stat label="Loss absorbed" value={`$${fmt(tr.loss, 0)}`} />}
              </div>

              {vault.state === "funding" && (
                <div className="space-y-2">
                  <AmountInput
                    value={amounts[t.id] ?? ""}
                    onChange={(v) => setAmounts({ ...amounts, [t.id]: v })}
                    placeholder="Amount (USDC)"
                  />
                  <ArrowButton
                    onClick={() => commit(t.id as Seniority)}
                    disabled={state.status === "pending" || !amounts[t.id]}
                    className="w-full"
                  >
                    Commit
                  </ArrowButton>
                </div>
              )}

              {mine && (
                <div className="mt-3 border-t border-line-soft pt-3">
                  <div className="mb-2 font-mono text-xs text-muted">
                    Your position: <span className="text-fg">${fmt(mine.account.amount, 0)}</span>
                    {mine.account.redeemed && " · redeemed"}
                  </div>
                  <div className="flex gap-2">
                    {vault.state === "active" && !mine.account.redeemed && (
                      <Button variant="ghost" onClick={() => claim(t.id as Seniority)} disabled={state.status === "pending"}>
                        Claim tokens
                      </Button>
                    )}
                    {vault.state === "matured" && !mine.account.redeemed && (
                      <Button onClick={() => redeem(t.id as Seniority)} disabled={state.status === "pending"}>
                        Redeem
                      </Button>
                    )}
                    {vault.state === "cancelled" && !mine.account.redeemed && (
                      <Button onClick={() => refund(t.id as Seniority)} disabled={state.status === "pending"}>
                        Refund
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <TxPanel state={state} />

      <Note>
        Redemption value is what the contract owes: deterministic, accruing with time, stepped down by any loss. It
        is not market price. If this vault&rsquo;s clearing gate failed at close, it moves to Cancelled and every
        commitment is fully refundable rather than erroring out.
      </Note>

      <section className="space-y-3">
        <h2 className="font-sans text-sm text-fg">Recent activity</h2>
        {signatures.length === 0 ? (
          <Empty>No on-chain activity recorded for this vault yet.</Empty>
        ) : (
          <div className="space-y-1">
            {signatures.map((s) => (
              <a
                key={s.signature}
                href={explorerUrl(s.signature)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border border-line-soft px-4 py-2.5 font-mono text-xs text-muted hover:border-line-strong hover:text-fg"
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
