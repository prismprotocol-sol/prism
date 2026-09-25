"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  useProgram,
  useVaultCommitments,
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
import { Stat, StatusTag, AmountInput, Note, Empty, Modal } from "@prism/ui";
import { Card, Button } from "@/components/ui";
import { useTx } from "@/lib/useTx";
import { vaultStatus } from "@/lib/statusTone";
import { assetLabel } from "@/lib/assetLabel";
import { useNow } from "@/lib/useNow";
import { TRANCHE_DOT } from "@/lib/trancheColor";
import { VISITED_VAULT_KEY } from "@/components/QuickStartGuide";
import { AccrualChart } from "@/components/charts/AccrualChart";
import { useAppData } from "@/components/DataProvider";

export default function TokenDetailPage({ params }: PageProps<"/vaults/[address]/[seniority]">) {
  const { address, seniority: seniorityParam } = use(params);

  let vaultAddress: PublicKey | null = null;
  try {
    vaultAddress = new PublicKey(address);
  } catch {
    vaultAddress = null;
  }
  const meta = TRANCHES.find((t) => t.id === Number(seniorityParam));

  if (!vaultAddress || !meta) {
    return (
      <div className="px-10 py-10">
        <Empty>Not a valid tranche.</Empty>
      </div>
    );
  }

  return <TokenDetail vaultAddress={vaultAddress} seniority={meta.id as Seniority} />;
}

function TokenDetail({ vaultAddress, seniority }: { vaultAddress: PublicKey; seniority: Seniority }) {
  const program = useProgram();
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { vaults, commitments, refreshVaults: refresh, refreshCommitments: refreshCommits } = useAppData();
  const { items: vaultCommitments } = useVaultCommitments(vaultAddress);
  const { state, run } = useTx();
  const [amount, setAmount] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [signatures, setSignatures] = useState<{ signature: string; slot: number }[]>([]);

  const vault = vaults.find((v) => v.address.equals(vaultAddress));
  const now = useNow();
  const meta = TRANCHES.find((t) => t.id === seniority)!;
  const mine = commitments.find((c) => c.account.vault.equals(vaultAddress) && c.account.seniority === seniority);
  const holders = vaultCommitments.filter((c) => c.account.seniority === seniority).length;
  // This tranche's own SPL mint — its own on-chain history (mint, claims,
  // transfers), distinct from the vault-level activity on the parent page.
  const mintAddress = trancheMintPda(vaultAddress, seniority);

  useEffect(() => {
    try {
      localStorage.setItem(VISITED_VAULT_KEY, "1");
    } catch {
      // localStorage unavailable — the Quick Start "browse a vault" step just won't flip.
    }
  }, []);

  useEffect(() => {
    connection
      .getSignaturesForAddress(mintAddress, { limit: 10 })
      .then((sigs) => setSignatures(sigs.map((s) => ({ signature: s.signature, slot: s.slot }))))
      .catch(() => setSignatures([]));
  }, [connection, mintAddress]);

  const commit = () =>
    run("Commit", async () => {
      if (!publicKey || !vault) throw new Error("Connect a wallet first.");
      const sig = await program.methods
        .commit(seniority, toBase(amount))
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

  const claim = () =>
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

  const redeem = () =>
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

  const refund = () =>
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

  const tr = vault.tranches[seniority];
  const [lo, hi] = attachment(vault.tranches, vault.principalTarget, seniority);
  const rv =
    vault.state === "active" || vault.state === "matured"
      ? redemptionValueBps(tr.clearingBps, tr.committed, tr.loss, vault.activatedAt, vault.termSeconds, now)
      : 10_000;
  const dotClass = TRANCHE_DOT[seniority];

  return (
    <div className="space-y-8 px-10 py-10">
      <Link
        href={`/vaults/${vault.address.toBase58()}`}
        className="font-mono text-xs tracking-[0.06em] text-muted uppercase hover:text-fg"
      >
        ← {assetLabel(vault.underlyingMint)} Vault
      </Link>

      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} aria-hidden="true" />
            <h1 className="font-serif text-3xl text-fg">{meta.name}</h1>
            <span className="font-mono text-xs tracking-[0.08em] text-muted uppercase">{meta.risk}</span>
          </div>
          <p className="mt-2 max-w-lg font-sans text-sm text-muted">{meta.blurb}</p>
        </div>
        <StatusTag {...vaultStatus(vault.state)} />
      </header>

      <div className="grid gap-4 md:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <Stat label="Committed" value={`$${fmt(tr.committed, 0)}`} sub={`attach ${pct(lo, 0)}–${pct(hi, 0)}`} />
            <Stat label="Coupon" value={vault.state === "funding" ? "pending" : pct(tr.clearingBps)} />
            <Stat label="Holders" value={holders} />
            <Stat label="Loss absorbed" value={tr.loss.isZero() ? "$0" : `$${fmt(tr.loss, 0)}`} />
          </div>

          {vault.state === "active" || vault.state === "matured" ? (
            <AccrualChart
              className="mt-6 h-32"
              clearingBps={tr.clearingBps}
              committed={tr.committed}
              loss={tr.loss}
              activatedAt={vault.activatedAt}
              termSeconds={vault.termSeconds}
              now={now}
            />
          ) : (
            <div className="mt-6 flex h-32 items-center justify-center rounded-lg border border-dashed border-line-soft">
              <span className="max-w-xs text-center font-mono text-xs text-muted-2">
                {vault.state === "funding"
                  ? "Redemption value starts accruing once this vault activates — nothing to chart yet."
                  : "This vault never activated, so no redemption value ever accrued."}
              </span>
            </div>
          )}
        </Card>

        <Card title="Your position">
          {mine ? (
            <div className="space-y-3">
              <Stat label="Principal" value={`$${fmt(mine.account.amount, 0)}`} />
              <Stat label="Redemption value" value={(rv / 10_000).toFixed(4)} sub={mine.account.redeemed ? "redeemed" : undefined} />
              <div className="flex gap-2 pt-1">
                {vault.state === "active" && !mine.account.redeemed && (
                  <Button variant="ghost" onClick={claim} disabled={state.status === "pending"} className="w-full">
                    Claim tokens
                  </Button>
                )}
                {vault.state === "matured" && !mine.account.redeemed && (
                  <Button onClick={redeem} disabled={state.status === "pending"} className="w-full">
                    Redeem
                  </Button>
                )}
                {vault.state === "cancelled" && !mine.account.redeemed && (
                  <Button onClick={refund} disabled={state.status === "pending"} className="w-full">
                    Refund
                  </Button>
                )}
              </div>
            </div>
          ) : vault.state === "funding" ? (
            <div className="space-y-2">
              <AmountInput value={amount} onChange={setAmount} placeholder="Amount (USDC)" />
              <Button
                variant="primary"
                onClick={() => setConfirming(true)}
                disabled={state.status === "pending" || !amount}
                className="w-full"
              >
                Commit
              </Button>
            </div>
          ) : (
            <Empty>This vault is no longer accepting new commitments.</Empty>
          )}
        </Card>
      </div>

      <Note>
        Redemption value is what the contract owes: deterministic, accruing with time, stepped down by any loss. It
        is not market price — a secondary sale on a thin pool could clear lower.
      </Note>

      <section className="space-y-3">
        <h2 className="font-sans text-sm text-fg">Token history</h2>
        {signatures.length === 0 ? (
          <Empty>No on-chain activity recorded for this token yet.</Empty>
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

      {confirming && (
        <Modal open onClose={() => setConfirming(false)} title="Confirm commitment">
          <div className="space-y-4">
            <p className="font-sans text-sm text-muted">
              You&rsquo;re about to commit <span className="text-fg">${amount || "0"}</span> to the{" "}
              <span className="text-fg">{meta.name}</span> tranche of
            </p>
            <p className="break-all font-mono text-xs text-muted-2">{vault.address.toBase58()}</p>
            <p className="font-sans text-xs text-muted-2">This transaction cannot be undone once confirmed on-chain.</p>
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" onClick={() => setConfirming(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setConfirming(false);
                  commit();
                }}
                disabled={state.status === "pending"}
                className="flex-1"
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
