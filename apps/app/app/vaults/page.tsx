"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { fmt, pct, TRANCHES, type VaultView } from "@prism/solana";
import { useAppData } from "@/components/DataProvider";
import { StatusTag, Empty, Skeleton } from "@prism/ui";
import { vaultStatus } from "@/lib/statusTone";
import { assetLabel } from "@/lib/assetLabel";
import { VaultCard } from "@/components/VaultCard";
import { IconSort } from "@/components/icons";
import { TRANCHE_DOT } from "@/lib/trancheColor";

const STATE_FILTERS = [
  { key: "all", label: "All" },
  { key: "funding", label: "Funding" },
  { key: "active", label: "Active" },
  { key: "matured", label: "Matured" },
] as const;

type StateFilter = (typeof STATE_FILTERS)[number]["key"];

export default function VaultsPage() {
  const { vaults, vaultsLoading: loading } = useAppData();
  const [filter, setFilter] = useState<StateFilter>("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [howItWorks, setHowItWorks] = useState(false);

  const featured = useMemo(() => vaults.filter((v) => v.state === "funding").slice(0, 3), [vaults]);

  const filtered = useMemo(() => {
    const rows = filter === "all" ? vaults : vaults.filter((v) => v.state === filter);
    return rows
      .slice()
      .sort((a, b) => (sortDesc ? b.totalCommitted.cmp(a.totalCommitted) : a.totalCommitted.cmp(b.totalCommitted)));
  }, [vaults, filter, sortDesc]);

  return (
    <div className="space-y-10 px-10 py-10">
      {loading ? (
        <div className="grid gap-5 md:grid-cols-3">
          <VaultCardSkeleton />
          <VaultCardSkeleton />
          <VaultCardSkeleton />
        </div>
      ) : featured.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((v, i) => (
            <VaultCard key={v.address.toBase58()} vault={v} index={i} />
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="rounded-full border border-line-soft bg-surface-2 px-4 py-2 font-sans text-sm text-fg">Vaults</span>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setHowItWorks((v) => !v)}
            className={`flex items-center gap-1.5 font-sans text-sm transition-colors duration-[var(--dur-micro)] ease-out ${
              howItWorks ? "text-fg" : "text-muted hover:text-fg"
            }`}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px]">?</span>
            How it works
          </button>
          <div className="flex items-center gap-1 rounded-full border border-line-soft p-1">
            {STATE_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-4 py-2 font-mono text-xs tracking-[0.06em] uppercase transition-colors duration-[var(--dur-micro)] ease-out ${
                  filter === f.key ? "bg-surface-3 text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {howItWorks && (
        <div className="animate-fade-up rounded-xl border border-line-soft bg-surface-2 p-6">
          <p className="font-sans text-sm leading-relaxed text-muted">
            Each vault tranches a single credit facility into Alpha, Core and Prime. Investors commit capital during
            the funding window; when it closes, the vault clears (mints tranche tokens at fixed rates) or cancels
            (fully refundable) depending on subscription and solvency gates. Coupon is the rate promised at
            clearing — Alpha absorbs losses first and earns the most, Prime is paid first and loses last.
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-line-soft">
        <div className="flex items-center justify-between border-b border-line-soft px-6 py-5">
          <span className="rounded-full border border-line-soft bg-surface-2 px-3 py-1.5 font-mono text-xs tracking-[0.08em] text-muted uppercase">
            Vaults ({filtered.length})
          </span>
        </div>

        {loading ? (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <VaultRowSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <Empty>No vaults match this filter.</Empty>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-line-soft px-6 py-4 font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
              <span>Vault</span>
              <span>Coupon</span>
              <button onClick={() => setSortDesc((v) => !v)} className="flex items-center gap-1.5 text-left transition-colors duration-[var(--dur-micro)] ease-out hover:text-fg">
                <IconSort className="h-2.5 w-2.5" direction={sortDesc ? "desc" : "asc"} />
                Committed
              </button>
              <span>Tranches</span>
              <span>State</span>
            </div>
            <div>
              {filtered.map((v, i) => (
                <VaultRow key={v.address.toBase58()} vault={v} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function VaultRow({ vault, index }: { vault: VaultView; index: number }) {
  const base58 = vault.address.toBase58();
  return (
    <Link
      href={`/vaults/${base58}`}
      style={{ "--i": index } as React.CSSProperties}
      className="animate-fade-up-stagger grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-4 border-b border-line-soft px-6 py-5 transition-colors duration-[var(--dur-micro)] ease-out last:border-b-0 hover:bg-surface-2"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-[10px] font-mono text-muted">
          {base58.slice(0, 2)}
        </span>
        <div className="min-w-0">
          <div className="truncate font-sans text-sm text-fg">{assetLabel(vault.underlyingMint)}</div>
          <div className="truncate font-mono text-[11px] text-muted-2">{base58.slice(0, 12)}…</div>
        </div>
      </div>
      <span className="font-mono text-sm text-accent">{pct(vault.couponBps, 2)}</span>
      <span className="font-mono text-sm text-fg">${fmt(vault.totalCommitted, 0)}</span>
      <div className="flex -space-x-1.5">
        {TRANCHES.filter((t) => !vault.tranches[t.id].committed.isZero()).map((t) => (
          <span
            key={t.id}
            title={t.label}
            className={`flex h-6 w-6 items-center justify-center rounded-full border border-black font-mono text-[10px] text-black ${TRANCHE_DOT[t.id]}`}
          >
            {t.label[0]}
          </span>
        ))}
      </div>
      <StatusTag {...vaultStatus(vault.state)} />
    </Link>
  );
}

function VaultCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-line-soft bg-surface-2 p-7">
      <div className="mb-8 flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-2.5 w-16 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
      </div>
      <div className="space-y-5">
        <Skeleton className="h-3.5 w-full rounded-full" />
        <Skeleton className="h-3.5 w-full rounded-full" />
        <Skeleton className="h-3.5 w-full rounded-full" />
      </div>
      <Skeleton className="mt-8 h-11 w-full rounded-lg" />
    </div>
  );
}

function VaultRowSkeleton() {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-4 border-b border-line-soft px-6 py-5 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-24 rounded-full" />
          <Skeleton className="h-2.5 w-16 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-3.5 w-12 rounded-full" />
      <Skeleton className="h-3.5 w-16 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
  );
}
