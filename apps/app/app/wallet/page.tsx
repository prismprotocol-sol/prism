"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { CLUSTER, PRISM_PROGRAM_ID, explorerUrl } from "@prism/config";
import { Stat, Empty, PageHeader, CopyButton } from "@prism/ui";
import { Card } from "@/components/ui";

export default function WalletPage() {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();

  return (
    <div className="space-y-8 px-10 py-10">
      <PageHeader eyebrow="wallet" title="Wallet & network" />

      {!publicKey ? (
        <Empty>No wallet connected.</Empty>
      ) : (
        <Card>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            <Stat label="Wallet" value={wallet?.adapter.name ?? "Unknown"} />
            <Stat
              label="Address"
              value={
                <span className="inline-flex items-center gap-2">
                  <a
                    href={explorerUrl(publicKey.toBase58(), "address")}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-muted"
                  >
                    {publicKey.toBase58().slice(0, 4)}…{publicKey.toBase58().slice(-4)}
                  </a>
                  <CopyButton value={publicKey.toBase58()} />
                </span>
              }
            />
            <Stat label="Cluster" value={CLUSTER} />
            <Stat label="RPC endpoint" value={connection.rpcEndpoint} />
            <Stat
              label="Prism program"
              value={
                <span className="inline-flex items-center gap-2">
                  <a
                    href={explorerUrl(PRISM_PROGRAM_ID, "address")}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-muted"
                  >
                    {PRISM_PROGRAM_ID.slice(0, 4)}…{PRISM_PROGRAM_ID.slice(-4)}
                  </a>
                  <CopyButton value={PRISM_PROGRAM_ID} />
                </span>
              }
            />
          </div>
        </Card>
      )}
    </div>
  );
}
