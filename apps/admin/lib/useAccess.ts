"use client";

import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";
import { useConfig, useVaults } from "@prism/solana";

/**
 * Mirrors the on-chain authorization model exactly: a single `Config.admin`
 * pubkey gates protocol settings, and each vault's own `Vault.authority`
 * gates that vault's lifecycle actions. There is no role hierarchy on-chain
 * connecting the two — a wallet can hold either, both, or neither.
 */
export function useAccess() {
  const { publicKey } = useWallet();
  const { config } = useConfig();
  const { vaults } = useVaults();

  const isProtocolAdmin = !!(publicKey && config && publicKey.equals(config.admin as PublicKey));

  const operatedVaults = useMemo(
    () => (publicKey ? vaults.filter((v) => v.authority.equals(publicKey)) : []),
    [vaults, publicKey]
  );

  return {
    publicKey,
    config,
    isProtocolAdmin,
    operatedVaults,
    hasAnyAccess: isProtocolAdmin || operatedVaults.length > 0,
  };
}
