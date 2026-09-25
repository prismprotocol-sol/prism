"use client";

import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { getAccount, getMint, unpackAccount } from "@solana/spl-token";
import { useProgram } from "./useVault";
import { reservePda, lpMintPda, ata } from "./client";

export type PoolView = {
  address: PublicKey;
  mintA: PublicKey;
  mintB: PublicKey;
  lpMint: PublicKey;
  feeBps: number;
  frozen: boolean;
  reserveA: BN;
  reserveB: BN;
  lpSupply: BN;
};

/** Every pool, with live reserve balances. */
export function usePools() {
  const program = useProgram();
  const { connection } = useConnection();
  const [pools, setPools] = useState<PoolView[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!program) return;
    setLoading(true);
    try {
      const all = await (program.account as any).pool.all();
      const views = await Promise.all(
        all.map(async (a: any) => {
          const address = a.publicKey;
          const [ra, rb, supply] = await Promise.all([
            getAccount(connection, reservePda(address, "a"))
              .then((x) => new BN(x.amount.toString()))
              .catch(() => new BN(0)),
            getAccount(connection, reservePda(address, "b"))
              .then((x) => new BN(x.amount.toString()))
              .catch(() => new BN(0)),
            getMint(connection, lpMintPda(address))
              .then((m) => new BN(m.supply.toString()))
              .catch(() => new BN(0)),
          ]);
          return {
            address,
            mintA: a.account.mintA,
            mintB: a.account.mintB,
            lpMint: a.account.lpMint,
            feeBps: a.account.feeBps,
            frozen: a.account.frozen,
            reserveA: ra,
            reserveB: rb,
            lpSupply: supply,
          };
        })
      );
      setPools(views);
    } catch {
      setPools([]);
    } finally {
      setLoading(false);
    }
  }, [program, connection]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { pools, loading, refresh };
}

/** Balance of an SPL token account, zero if it does not exist. */
export function useTokenBalance(mint: PublicKey | null) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<BN>(new BN(0));

  const refresh = useCallback(async () => {
    if (!mint || !publicKey) return setBalance(new BN(0));
    try {
      const acc = await getAccount(connection, ata(mint, publicKey));
      setBalance(new BN(acc.amount.toString()));
    } catch {
      setBalance(new BN(0));
    }
  }, [connection, mint, publicKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { balance, refresh };
}

/** Balances for several mints at once. */
export function useTokenBalances(mints: PublicKey[]) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balances, setBalances] = useState<Record<string, BN>>({});

  const key = mints.map((m) => m.toBase58()).join(",");

  const refresh = useCallback(async () => {
    if (!publicKey || mints.length === 0) return setBalances({});
    // One batched getMultipleAccountsInfo instead of one getAccount call per
    // mint — the free devnet RPC rate-limits by request count, and a
    // portfolio with several tranche positions was firing that many
    // concurrent requests every time this hook ran.
    const atas = mints.map((m) => ata(m, publicKey));
    const infos = await connection.getMultipleAccountsInfo(atas);
    const out: Record<string, BN> = {};
    mints.forEach((m, i) => {
      const info = infos[i];
      if (!info) {
        out[m.toBase58()] = new BN(0);
        return;
      }
      try {
        out[m.toBase58()] = new BN(unpackAccount(atas[i], info).amount.toString());
      } catch {
        out[m.toBase58()] = new BN(0);
      }
    });
    setBalances(out);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, publicKey, key]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { balances, refresh };
}
