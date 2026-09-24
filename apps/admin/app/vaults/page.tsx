"use client";

import Link from "next/link";
import { useVaults, fmt, pct } from "@prism/solana";
import { Card, Stat, StatusTag, Empty, PageHeader } from "@prism/ui";
import { vaultStatus } from "@/lib/statusTone";

export default function VaultsPage() {
  const { vaults, loading } = useVaults();

  return (
    <div className="space-y-8 px-6 py-10">
      <PageHeader
        eyebrow="vaults"
        title="Vaults"
        action={
          <Link
            href="/vaults/create"
            className="border border-line-soft px-4 py-2.5 font-mono text-xs tracking-[0.08em] text-fg uppercase transition-colors duration-[var(--dur-micro)] ease-out hover:border-line-strong"
          >
            + Create vault
          </Link>
        }
      />

      {loading ? (
        <Empty>Loading vaults…</Empty>
      ) : vaults.length === 0 ? (
        <Empty>No vaults exist yet.</Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vaults.map((v) => (
            <Link key={v.address.toBase58()} href={`/vaults/${v.address.toBase58()}`}>
              <Card>
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">{v.address.toBase58().slice(0, 12)}…</span>
                  <StatusTag {...vaultStatus(v.state)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Stat label="Principal" value={`$${fmt(v.principalTarget, 0)}`} />
                  <Stat label="Coupon" value={pct(v.couponBps, 0)} />
                  <Stat
                    label="Committed"
                    value={`$${fmt(v.totalCommitted, 0)}`}
                    sub={
                      v.principalTarget.isZero()
                        ? undefined
                        : `${v.totalCommitted.muln(100).div(v.principalTarget).toNumber()}% subscribed`
                    }
                  />
                  <Stat label="Disbursed" value={v.disbursed ? "yes" : "no"} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
