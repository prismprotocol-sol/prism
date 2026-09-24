export type Cluster = "localnet" | "devnet" | "mainnet-beta";

/** The protocol is devnet-only today (pre-revenue, no mainnet deployment). */
export const CLUSTER: Cluster =
  (process.env.NEXT_PUBLIC_SOLANA_CLUSTER as Cluster | undefined) ?? "devnet";

export const PRISM_PROGRAM_ID = "ASUM4469PDqUc4UQLQdth3k6e5JUtKsE3fUxmaRvP7tz";

/** Solana Explorer link for a transaction signature or account address. */
export function explorerUrl(
  value: string,
  kind: "tx" | "address" = "tx"
): string {
  const suffix = CLUSTER === "mainnet-beta" ? "" : `?cluster=${CLUSTER}`;
  return `https://explorer.solana.com/${kind}/${value}${suffix}`;
}
