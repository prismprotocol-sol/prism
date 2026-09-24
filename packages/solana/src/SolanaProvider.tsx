"use client";

import { useMemo, ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

/** Point at a local validator by default; each app overrides via NEXT_PUBLIC_RPC_URL. */
const ENDPOINT = process.env.NEXT_PUBLIC_RPC_URL ?? "http://127.0.0.1:8899";

export function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = useMemo(
    () => (ENDPOINT === "devnet" ? clusterApiUrl("devnet") : ENDPOINT),
    []
  );

  // Wallet Standard auto-discovers installed wallets, so the adapter list
  // stays empty.
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
