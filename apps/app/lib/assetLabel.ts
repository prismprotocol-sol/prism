import type { PublicKey } from "@solana/web3.js";

/** Known mint labels for this cluster. Falls back to a truncated address for anything unrecognized. */
const KNOWN_MINTS: Record<string, string> = {
  // The devnet-only 6-decimal test mint the reference deployment's setup script mints as a USDC stand-in.
  G2NfKHkNPJWoT8kTHLe6mCUDZXY1ScgEqMbSxZAZHMYP: "USDC",
};

export function assetLabel(mint: PublicKey): string {
  const base58 = mint.toBase58();
  return KNOWN_MINTS[base58] ?? `${base58.slice(0, 4)}…`;
}
