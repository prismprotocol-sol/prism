"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useVaults, fmt } from "@prism/solana";
import { useAccess } from "@/lib/useAccess";
import { Card, Stat, StatusTag, Empty, PageHeader } from "@prism/ui";
import { vaultStatus } from "@/lib/statusTone";

export default function Overview() {
  const { connected } = useWallet();
  const { vaults, loading } = useVaults();
  const { isProtocolAdmin, operatedVaults, hasAnyAccess, config } = useAccess();

  const byState = {
    funding: vaults.filter((v) => v.state === "funding").length,
    active: vaults.filter((v) => v.state === "active").length,
    matured: vaults.filter((v) => v.state === "matured").length,
    cancelled: vaults.filter((v) => v.state === "cancelled").length,
  };

  return (
    <div className="space-y-8 px-6 py-10">
      <PageHeader eyebrow="admin.prism.credit" title="Protocol overview" />

      {!connected ? (
        <Card>
          <Empty>Connect a wallet to see your access level.</Empty>
        </Card>
      ) : !config ? (
        <Card>
          <Empty>
            Protocol config has not been initialized on this cluster yet. Go to{" "}
            <Link href="/config" className="text-fg underline underline-offset-2">
              Protocol Settings
            </Link>{" "}
            to create it.
          </Empty>
        </Card>
      ) : (
        <Card title="Your access" subtitle="Derived from Config.admin and each Vault.authority — never a hidden route">
          <div className="flex flex-wrap gap-2">
            {isProtocolAdmin && <StatusTag label="admin" tone="positive" />}
            {isProtocolAdmin && <span className="font-mono text-xs text-fg">Protocol admin (Config.admin)</span>}
          </div>
          {operatedVaults.length > 0 && (
            <p className="mt-2 font-mono text-xs text-fg">
              Authority on {operatedVaults.length} vault{operatedVaults.length === 1 ? "" : "s"}
            </p>
          )}
          {!hasAnyAccess && (
            <p className="font-mono text-xs text-muted-2">
              This wallet holds no admin authority. You can still create a new vault — that makes you its authority
              — but you cannot act on existing vaults or protocol settings.
            </p>
          )}
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <Stat label="Vaults" value={loading ? "…" : vaults.length} />
        </Card>
        <Card>
          <Stat label="Funding" value={byState.funding} />
        </Card>
        <Card>
          <Stat label="Active" value={byState.active} />
        </Card>
        <Card>
          <Stat label="Matured / Cancelled" value={`${byState.matured} / ${byState.cancelled}`} />
        </Card>
      </div>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-sans text-sm text-fg">Vaults</h2>
          <Link href="/vaults" className="font-mono text-xs tracking-[0.06em] text-muted uppercase hover:text-fg">
            Manage vaults →
          </Link>
        </div>
        {vaults.length === 0 ? (
          <Empty>No vaults exist yet.</Empty>
        ) : (
          <div className="space-y-1">
            {vaults.slice(0, 5).map((v) => (
              <Link
                key={v.address.toBase58()}
                href={`/vaults/${v.address.toBase58()}`}
                className="flex items-center justify-between border border-line-soft px-4 py-3 hover:border-line-strong"
              >
                <span className="font-mono text-xs text-muted">{v.address.toBase58().slice(0, 20)}…</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-fg">
                    ${fmt(v.totalCommitted, 0)} / ${fmt(v.principalTarget, 0)}
                  </span>
                  <StatusTag {...vaultStatus(v.state)} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
