"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function WalletButton() {
  const { publicKey, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  if (publicKey) {
    const base58 = publicKey.toBase58();
    const short = `${base58.slice(0, 4)}…${base58.slice(-4)}`;
    return (
      <button
        onClick={() => disconnect()}
        className="inline-flex items-center gap-2 rounded-full border border-line-soft px-4 py-2 font-mono text-xs tracking-[0.06em] text-fg uppercase transition-colors duration-[var(--dur-micro)] ease-out hover:border-line-strong"
      >
        <span className="h-1.5 w-1.5 bg-fg" aria-hidden="true" />
        {short}
      </button>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      disabled={connecting}
      className="inline-flex items-center gap-2 rounded-lg bg-accent-bg px-4 py-2 font-mono text-xs tracking-[0.06em] text-accent uppercase transition-opacity duration-[var(--dur-micro)] ease-out hover:opacity-90 disabled:opacity-50"
    >
      {connecting ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
