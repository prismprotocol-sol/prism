"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { CLUSTER, PRISM_PROGRAM_ID, explorerUrl } from "@prism/config";
import { Card, Stat, Empty, PageHeader } from "@prism/ui";
import { useAccess } from "@/lib/useAccess";

export default function WalletPage() {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const { isProtocolAdmin, operatedVaults } = useAccess();

  return (
    <div className="space-y-8 px-6 py-10">
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
                <a
                  href={explorerUrl(publicKey.toBase58(), "address")}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-muted"
                >
                  {publicKey.toBase58().slice(0, 4)}…{publicKey.toBase58().slice(-4)}
                </a>
              }
            />
            <Stat label="Cluster" value={CLUSTER} />
            <Stat label="RPC endpoint" value={connection.rpcEndpoint} />
            <Stat
              label="Prism program"
              value={
                <a
                  href={explorerUrl(PRISM_PROGRAM_ID, "address")}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-muted"
                >
                  {PRISM_PROGRAM_ID.slice(0, 4)}…{PRISM_PROGRAM_ID.slice(-4)}
                </a>
              }
            />
            <Stat label="Access" value={isProtocolAdmin ? "Protocol admin" : operatedVaults.length > 0 ? `Authority on ${operatedVaults.length}` : "None"} />
          </div>
        </Card>
      )}
    </div>
  );
}
