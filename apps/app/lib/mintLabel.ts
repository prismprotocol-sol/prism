import type { PublicKey } from "@solana/web3.js";
import { TRANCHES, type VaultView } from "@prism/solana";
import { assetLabel } from "@/lib/assetLabel";

export type MintInfo = { label: string; sub?: string };

/**
 * Resolves a mint to a real label by checking it against every loaded
 * vault's underlying and tranche mints. Tranche mints are per-vault
 * (`trancheMintPda(vault, seniority)`), so "pALPHA" alone is ambiguous —
 * two different vaults each mint their own pALPHA, as different SPL mints.
 */
export function resolveMint(mint: PublicKey, vaults: VaultView[]): MintInfo {
  for (const vault of vaults) {
    if (vault.underlyingMint.equals(mint)) {
      return { label: assetLabel(vault.underlyingMint) };
    }
    for (const t of TRANCHES) {
      if (vault.tranches[t.id].mint.equals(mint)) {
        return { label: t.name, sub: vault.address.toBase58().slice(0, 6) };
      }
    }
  }
  const base58 = mint.toBase58();
  return { label: `${base58.slice(0, 4)}…${base58.slice(-4)}` };
}
