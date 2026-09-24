"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { getProgram, configPda, vaultPda, stateName } from "./client";

export type TrancheView = {
  committed: BN;
  mint: PublicKey;
  clearingBps: number;
  attachLowBps: number;
  attachHighBps: number;
  loss: BN;
};

export type VaultView = {
  address: PublicKey;
  state: string;
  authority: PublicKey;
  borrower: PublicKey;
  underlyingMint: PublicKey;
  principalTarget: BN;
  couponBps: number;
  platformFeeBps: number;
  fundingDeadline: number;
  activatedAt: number;
  termSeconds: number;
  totalCommitted: BN;
  realizedLoss: BN;
  repaid: BN;
  disbursed: boolean;
  tranches: TrancheView[];
};

const READ_ONLY_ERROR = "Connect a wallet to sign transactions.";

/** Lets reads (vault/config/pool listings) work before a wallet connects; any signing attempt throws. */
const READ_ONLY_WALLET = {
  publicKey: PublicKey.default,
  signTransaction: async () => {
    throw new Error(READ_ONLY_ERROR);
  },
  signAllTransactions: async () => {
    throw new Error(READ_ONLY_ERROR);
  },
};

export function useProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  return useMemo(
    () => getProgram(connection, wallet ?? READ_ONLY_WALLET),
    [connection, wallet]
  );
}

/** Decode a raw vault account into a view model. */
function decodeVault(address: PublicKey, v: Record<string, any>): VaultView {
  return {
    address,
    state: stateName(v.state),
    authority: v.authority,
    borrower: v.borrower,
    underlyingMint: v.underlyingMint,
    principalTarget: v.principalTarget,
    couponBps: v.couponBps,
    platformFeeBps: v.platformFeeBps,
    fundingDeadline: v.fundingDeadline.toNumber(),
    activatedAt: v.activatedAt.toNumber(),
    termSeconds: v.termSeconds.toNumber(),
    totalCommitted: v.totalCommitted,
    realizedLoss: v.realizedLoss,
    repaid: v.repaid,
    disbursed: v.disbursed,
    tranches: v.tranches.map((t: Record<string, any>) => ({
      committed: t.committed,
      mint: t.mint,
      clearingBps: t.clearingBps,
      attachLowBps: t.attachLowBps,
      attachHighBps: t.attachHighBps,
      loss: t.loss,
    })),
  };
}

/** Every vault the program knows about. */
export function useVaults() {
  const program = useProgram();
  const [vaults, setVaults] = useState<VaultView[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!program) return;
    setLoading(true);
    try {
      const all = await (program.account as any).vault.all();
      setVaults(
        all.map((a: any) => decodeVault(a.publicKey, a.account))
      );
    } catch {
      setVaults([]);
    } finally {
      setLoading(false);
    }
  }, [program]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { vaults, loading, refresh };
}

/** Protocol config, or null if it has not been created yet. */
export function useConfig() {
  const program = useProgram();
  const [config, setConfig] = useState<Record<string, any> | null>(null);

  const refresh = useCallback(async () => {
    if (!program) return;
    try {
      const c = await (program.account as any).config.fetch(configPda());
      setConfig(c);
    } catch {
      setConfig(null);
    }
  }, [program]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { config, refresh };
}

/** The connected wallet's commitments across all vaults. */
export function useCommitments() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const [items, setItems] = useState<
    { address: PublicKey; account: Record<string, any> }[]
  >([]);

  const refresh = useCallback(async () => {
    if (!program || !publicKey) {
      setItems([]);
      return;
    }
    try {
      const all = await (program.account as any).commitment.all([
        { memcmp: { offset: 8 + 1 + 32, bytes: publicKey.toBase58() } },
      ]);
      setItems(all.map((a: any) => ({ address: a.publicKey, account: a.account })));
    } catch {
      setItems([]);
    }
  }, [program, publicKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, refresh };
}

export { vaultPda };
