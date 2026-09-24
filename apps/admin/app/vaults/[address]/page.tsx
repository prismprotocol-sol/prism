"use client";

import { use, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import {
  useProgram,
  useVaults,
  configPda,
  vaultAuthorityPda,
  escrowPda,
  trancheMintPda,
  ata,
  fmt,
  pct,
  toBase,
  TRANCHES,
  SENIORITY,
  TOKEN_PROGRAM,
  RENT_SYSVAR,
} from "@prism/solana";
import { Card, Stat, StatusTag, Button, AmountInput, Note, Empty } from "@prism/ui";
import { TxPanel } from "@/components/TxPanel";
import { useTx } from "@/lib/useTx";
import { useAccess } from "@/lib/useAccess";
import { vaultStatus } from "@/lib/statusTone";

/** Illustrative default — the protocol has no on-chain way to derive expected loss; it must be supplied here. */
const DEFAULT_EL = { alpha: 962, core: 296, prime: 4 };

type CommitmentRow = {
  address: PublicKey;
  investor: PublicKey;
  seniority: number;
  amount: BN;
  redeemed: boolean;
};

export default function AdminVaultDetailPage({ params }: PageProps<"/vaults/[address]">) {
  const { address } = use(params);
  let vaultAddress: PublicKey | null = null;
  try {
    vaultAddress = new PublicKey(address);
  } catch {
    vaultAddress = null;
  }
  if (!vaultAddress) {
    return (
      <div className="px-6 py-10">
        <Empty>Not a valid vault address.</Empty>
      </div>
    );
  }
  return <AdminVaultDetail vaultAddress={vaultAddress} />;
}

function AdminVaultDetail({ vaultAddress }: { vaultAddress: PublicKey }) {
  const program = useProgram();
  const { publicKey } = useWallet();
  const { vaults, refresh } = useVaults();
  const { state, run } = useTx();
  const { operatedVaults } = useAccess();
  const [el, setEl] = useState(DEFAULT_EL);
  const [loss, setLoss] = useState("");
  const [commitments, setCommitments] = useState<CommitmentRow[]>([]);

  const vault = vaults.find((v) => v.address.equals(vaultAddress));
  const isAuthority = !!(publicKey && vault && vault.authority.equals(publicKey));
  const canAct = isAuthority || operatedVaults.some((v) => v.address.equals(vaultAddress));

  useEffect(() => {
    (program.account as any).commitment
      .all([{ memcmp: { offset: 9, bytes: vaultAddress.toBase58() } }])
      .then((rows: any[]) =>
        setCommitments(
          rows.map((r) => ({
            address: r.publicKey,
            investor: r.account.investor,
            seniority: r.account.seniority,
            amount: r.account.amount,
            redeemed: r.account.redeemed,
          }))
        )
      )
      .catch(() => setCommitments([]));
  }, [program, vaultAddress]);

  const clearVault = () =>
    run("Vault cleared", async () => {
      if (!publicKey || !vault) throw new Error("Connect a wallet first.");
      const sig = await program.methods
        .clearVault([el.alpha, el.core, el.prime])
        .accounts({
          authority: publicKey,
          config: configPda(),
          vault: vault.address,
          vaultAuthority: vaultAuthorityPda(vault.address),
          alphaMint: trancheMintPda(vault.address, SENIORITY.ALPHA),
          coreMint: trancheMintPda(vault.address, SENIORITY.CORE),
          primeMint: trancheMintPda(vault.address, SENIORITY.PRIME),
          tokenProgram: TOKEN_PROGRAM,
          systemProgram: SystemProgram.programId,
          rent: RENT_SYSVAR,
        })
        .rpc();
      await refresh();
      return sig;
    });

  const matureVault = () =>
    run("Vault matured", async () => {
      if (!publicKey || !vault) throw new Error("Connect a wallet first.");
      const sig = await program.methods.matureVault().accounts({ authority: publicKey, vault: vault.address }).rpc();
      await refresh();
      return sig;
    });

  const declareLoss = () =>
    run("Loss declared", async () => {
      if (!publicKey || !vault) throw new Error("Connect a wallet first.");
      const sig = await program.methods
        .declareLoss(toBase(loss))
        .accounts({ authority: publicKey, vault: vault.address })
        .rpc();
      await refresh();
      return sig;
    });

  const disburse = () =>
    run("Disbursed", async () => {
      if (!publicKey || !vault) throw new Error("Connect a wallet first.");
      const sig = await program.methods
        .disburse()
        .accounts({
          authority: publicKey,
          vault: vault.address,
          vaultAuthority: vaultAuthorityPda(vault.address),
          escrow: escrowPda(vault.address),
          borrowerToken: ata(vault.underlyingMint, vault.borrower),
          treasuryToken: ata(vault.underlyingMint, vault.authority),
          tokenProgram: TOKEN_PROGRAM,
        })
        .rpc();
      await refresh();
      return sig;
    });

  if (!vault) {
    return (
      <div className="px-6 py-10">
        <Empty>Vault not found, or still loading.</Empty>
      </div>
    );
  }

  const subscribed = vault.totalCommitted.eq(vault.principalTarget);

  return (
    <div className="space-y-8 px-6 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <span className="font-mono text-xs tracking-[0.08em] text-muted uppercase">{vault.address.toBase58()}</span>
          <h1 className="mt-2 font-serif text-3xl text-fg">Vault administration</h1>
        </div>
        <StatusTag {...vaultStatus(vault.state)} />
      </header>

      {!canAct && (
        <Card>
          <Empty>
            Your connected wallet is not this vault&rsquo;s authority — everything below is read-only. Only{" "}
            <span className="font-mono text-fg">{vault.authority.toBase58().slice(0, 8)}…</span> can act on it.
          </Empty>
        </Card>
      )}

      <Card>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <Stat label="Principal target" value={`$${fmt(vault.principalTarget, 0)}`} />
          <Stat label="Coupon" value={pct(vault.couponBps, 0)} />
          <Stat
            label="Committed"
            value={`$${fmt(vault.totalCommitted, 0)}`}
            sub={vault.principalTarget.isZero() ? undefined : `${vault.totalCommitted.muln(100).div(vault.principalTarget).toNumber()}% subscribed`}
          />
          <Stat label="Realized loss" value={`$${fmt(vault.realizedLoss, 0)}`} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {TRANCHES.map((t) => {
          const tr = vault.tranches[t.id];
          return (
            <Card key={t.id} title={t.name} subtitle={t.risk}>
              <Stat label="Committed" value={`$${fmt(tr.committed, 0)}`} />
              {vault.state !== "funding" && <Stat label="Clearing rate" value={pct(tr.clearingBps)} sub="fixed at clearing" />}
              {!tr.loss.isZero() && <Stat label="Loss absorbed" value={`$${fmt(tr.loss, 0)}`} />}
            </Card>
          );
        })}
      </div>

      {canAct && (
        <Card title="Lifecycle actions" subtitle="Every write below requires this wallet's signature and on-chain confirmation">
          {vault.state === "funding" && (
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-3">
                {(["alpha", "core", "prime"] as const).map((k) => (
                  <div key={k} className="space-y-1.5">
                    <label className="block font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
                      {k.toUpperCase()} EL (bps)
                    </label>
                    <AmountInput value={String(el[k])} onChange={(v) => setEl({ ...el, [k]: parseInt(v) || 0 })} />
                  </div>
                ))}
              </div>
              <Button onClick={clearVault} disabled={state.status === "pending" || !subscribed}>
                {subscribed ? "Run launch gate (clear vault)" : "Not fully subscribed"}
              </Button>
              <Note>
                Clearing runs 5 gates (subscription, Alpha floor, concentration caps, rate ordering, solvency). Any
                failure moves the vault to Cancelled — refundable — rather than erroring the transaction.
              </Note>
            </div>
          )}

          {vault.state === "active" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {!vault.disbursed && (
                  <Button variant="ghost" onClick={disburse} disabled={state.status === "pending"}>
                    Disburse ${fmt(vault.principalTarget, 0)} to borrower
                  </Button>
                )}
                <Button variant="ghost" onClick={matureVault} disabled={state.status === "pending"}>
                  Mark matured
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-44">
                  <AmountInput value={loss} onChange={setLoss} placeholder="Loss amount" />
                </div>
                <Button onClick={declareLoss} disabled={state.status === "pending" || !loss}>
                  Declare loss
                </Button>
              </div>
            </div>
          )}

          {(vault.state === "matured" || vault.state === "cancelled") && (
            <Empty>This vault has settled — no further lifecycle actions apply.</Empty>
          )}

          <div className="mt-4">
            <TxPanel state={state} />
          </div>
        </Card>
      )}

      <section className="space-y-3">
        <h2 className="font-sans text-sm text-fg">Positions ({commitments.length})</h2>
        {commitments.length === 0 ? (
          <Empty>No commitments yet.</Empty>
        ) : (
          <div className="space-y-1">
            {commitments.map((c) => (
              <div key={c.address.toBase58()} className="flex items-center justify-between border border-line-soft px-4 py-2.5 font-mono text-xs">
                <span className="text-muted">{c.investor.toBase58().slice(0, 16)}…</span>
                <span className="text-muted">{TRANCHES.find((t) => t.id === c.seniority)?.name}</span>
                <span className="text-fg">${fmt(c.amount, 0)}</span>
                <span className="text-muted-2">{c.redeemed ? "redeemed" : "open"}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
