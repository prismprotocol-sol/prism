"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import {
  useProgram,
  configPda,
  vaultPda,
  vaultAuthorityPda,
  escrowPda,
  fmt,
  toBase,
  pie,
  TOKEN_PROGRAM,
  RENT_SYSVAR,
} from "@prism/solana";
import { Card, Stat, Button, ArrowButton, AmountInput, Note, PageHeader, Field } from "@prism/ui";
import { TxPanel } from "@/components/TxPanel";
import { useTx } from "@/lib/useTx";

export default function CreateVaultPage() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const router = useRouter();
  const { state, run } = useTx();

  const [principal, setPrincipal] = useState("100000");
  const [coupon, setCoupon] = useState("1400");
  const [fee, setFee] = useState("200");
  const [days, setDays] = useState("90");
  const [mint, setMint] = useState("");
  const [borrower, setBorrower] = useState("");

  const previewPie = useMemo(() => {
    try {
      return pie(toBase(principal), parseInt(coupon) || 0, parseInt(fee) || 0);
    } catch {
      return new BN(0);
    }
  }, [principal, coupon, fee]);

  const createVault = () =>
    run("Vault opened", async () => {
      if (!publicKey) throw new Error("Connect a wallet first.");
      const underlyingMint = new PublicKey(mint);
      const borrowerKey = borrower ? new PublicKey(borrower) : publicKey;
      const vaultId = Keypair.generate().publicKey;
      const vault = vaultPda(vaultId);
      const deadline = Math.floor(Date.now() / 1000) + (parseInt(days) || 0) * 86400;

      const sig = await program.methods
        .initVault(vaultId, toBase(principal), parseInt(coupon), parseInt(fee), new BN(deadline), new BN(0))
        .accounts({
          authority: publicKey,
          borrower: borrowerKey,
          underlyingMint,
          config: configPda(),
          vault,
          vaultAuthority: vaultAuthorityPda(vault),
          escrow: escrowPda(vault),
          tokenProgram: TOKEN_PROGRAM,
          systemProgram: SystemProgram.programId,
          rent: RENT_SYSVAR,
        })
        .rpc();

      router.push(`/vaults/${vault.toBase58()}`);
      return sig;
    });

  return (
    <div className="space-y-8 px-6 py-10">
      <PageHeader
        eyebrow="vaults / create"
        title="Create vault"
        description="Terms are fixed at creation and cannot change after the funding window clears. Underwriting, KYB and legal happen off-chain before this step — the coupon is an input here, not something the program derives."
      />

      <Card title="Vault terms">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Principal (underlying units)">
            <AmountInput value={principal} onChange={setPrincipal} />
          </Field>
          <Field label="Coupon (bps)" hint="1400 = 14%">
            <AmountInput value={coupon} onChange={setCoupon} />
          </Field>
          <Field label="Platform fee (bps)" hint="200 = 2%, must be less than coupon">
            <AmountInput value={fee} onChange={setFee} />
          </Field>
          <Field label="Funding window (days)">
            <AmountInput value={days} onChange={setDays} />
          </Field>
        </div>

        <Field label="Underlying mint" hint="The stablecoin investors commit (e.g. USDC on this cluster)">
          <AmountInput value={mint} onChange={setMint} placeholder="Mint address" />
        </Field>

        <Field label="Borrower wallet" hint="Recorded for reference only — not signer-checked on-chain. Defaults to your wallet.">
          <AmountInput value={borrower} onChange={setBorrower} placeholder={publicKey?.toBase58() ?? "Borrower address"} />
        </Field>

        <div className="my-4 grid grid-cols-3 gap-4 border border-line-soft p-4">
          <Stat
            label="Borrower pays"
            value={`$${fmt(toBase(principal).muln(parseInt(coupon) || 0).divn(10_000), 0)}`}
          />
          <Stat label="Platform fee" value={`$${fmt(toBase(principal).muln(parseInt(fee) || 0).divn(10_000), 0)}`} />
          <Stat label="Pie for investors" value={`$${fmt(previewPie, 0)}`} />
        </div>

        <ArrowButton onClick={createVault} disabled={state.status === "pending" || !mint}>
          Open vault
        </ArrowButton>

        <div className="mt-4">
          <TxPanel state={state} />
        </div>

        <Note>
          Vault creation is permissionless on-chain — any signer can call it and becomes that vault&rsquo;s
          authority. This form is the intended entry point, but it is not the only path to the same instruction.
        </Note>
      </Card>
    </div>
  );
}
