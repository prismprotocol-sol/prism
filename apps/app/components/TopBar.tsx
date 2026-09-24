"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PublicKey } from "@solana/web3.js";
import { IconSearch } from "./icons";
import { EcosystemSwitcher } from "./EcosystemSwitcher";
import { WalletButton } from "./WalletButton";

export function TopBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [invalid, setInvalid] = useState(false);

  const submit = () => {
    try {
      const key = new PublicKey(query.trim());
      setInvalid(false);
      router.push(`/vaults/${key.toBase58()}`);
      setQuery("");
    } catch {
      setInvalid(true);
    }
  };

  return (
    <header className="flex h-24 shrink-0 items-center gap-8 border-b border-line-soft bg-black px-10">
      <div className="flex-1" />
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 border border-line-soft bg-surface-2 px-4 py-3.5 transition-colors duration-[var(--dur-micro)] ease-out focus-within:border-line-strong">
          <IconSearch className="h-4 w-4 shrink-0 text-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setInvalid(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Paste a vault address"
            className="w-full bg-transparent font-sans text-sm text-fg outline-none placeholder:text-muted-2"
          />
          <kbd className="border border-line-soft px-1.5 py-0.5 font-mono text-[10px] text-muted-2">↵</kbd>
        </div>
        {invalid && <p className="mt-1 font-mono text-[11px] text-muted-2">Not a valid address.</p>}
      </div>
      <div className="flex flex-1 items-center justify-end gap-3">
        <EcosystemSwitcher />
        <WalletButton />
      </div>
    </header>
  );
}
