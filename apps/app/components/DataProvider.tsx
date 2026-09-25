"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useVaults, useCommitments, type VaultView } from "@prism/solana";

type CommitmentItem = ReturnType<typeof useCommitments>["items"][number];

type DataContextValue = {
  vaults: VaultView[];
  vaultsLoading: boolean;
  refreshVaults: () => Promise<void>;
  commitments: CommitmentItem[];
  refreshCommitments: () => Promise<void>;
};

const DataContext = createContext<DataContextValue | null>(null);

/**
 * Fetches vaults and the connected wallet's commitments once per app
 * session instead of once per page. Every page previously called
 * `useVaults()`/`useCommitments()` independently, so navigating
 * Dashboard → Vaults → Portfolio re-ran the same two RPC scans on every
 * hop — a major, avoidable contributor to 429s against the free devnet
 * endpoint. Pages read from `useAppData()` and call `refreshVaults()` /
 * `refreshCommitments()` explicitly after a transaction, instead of each
 * mounting its own copy of these hooks.
 */
export function DataProvider({ children }: { children: ReactNode }) {
  const { vaults, loading: vaultsLoading, refresh: refreshVaults } = useVaults();
  const { items: commitments, refresh: refreshCommitments } = useCommitments();

  return (
    <DataContext.Provider value={{ vaults, vaultsLoading, refreshVaults, commitments, refreshCommitments }}>
      {children}
    </DataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useAppData must be used within a DataProvider");
  return ctx;
}
