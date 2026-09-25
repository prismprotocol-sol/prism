import Link from "next/link";
import type { VaultView } from "@prism/solana";
import { fmt, pct } from "@prism/solana";
import { assetLabel } from "@/lib/assetLabel";

export function VaultCard({ vault, index = 0 }: { vault: VaultView; index?: number }) {
  const base58 = vault.address.toBase58();
  const subscribedPct = vault.principalTarget.isZero()
    ? 0
    : vault.totalCommitted.muln(100).div(vault.principalTarget).toNumber();

  return (
    <Link href={`/vaults/${base58}`}>
      <div
        style={{ "--i": index } as React.CSSProperties}
        className="animate-fade-up-stagger group flex h-full flex-col rounded-xl border border-line-soft bg-surface-2 p-7 transition-[border-color,transform] duration-[var(--dur-micro)] ease-out hover:-translate-y-0.5 hover:border-line-strong"
      >
        <div className="mb-8 flex items-center gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-[11px] text-fg">
            {base58.slice(0, 2)}
          </span>
          <div className="min-w-0">
            <div className="font-mono text-[11px] tracking-[0.06em] text-muted uppercase">Vault</div>
            <div className="truncate font-serif text-xl text-fg">{assetLabel(vault.underlyingMint)}</div>
          </div>
        </div>

        <div className="space-y-5 text-sm">
          <Row label="Coupon" value={pct(vault.couponBps, 2)} accent />
          <Row label="Operator" value={`${vault.authority.toBase58().slice(0, 4)}…${vault.authority.toBase58().slice(-4)}`} />
          <Row label="Committed" value={`$${fmt(vault.totalCommitted, 0)}`} sub={`${subscribedPct}% subscribed`} />
        </div>

        <div className="mt-8 rounded-lg border border-line-soft bg-surface-3 py-3.5 text-center font-mono text-xs tracking-[0.08em] text-fg uppercase transition-colors duration-[var(--dur-micro)] ease-out group-hover:border-line-strong">
          Open Vault
        </div>
      </div>
    </Link>
  );
}

function Row({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[11px] tracking-[0.06em] text-muted uppercase">{label}</span>
      <span className="flex items-baseline gap-2">
        <span className={`font-mono text-sm ${accent ? "text-accent" : "text-fg"}`}>{value}</span>
        {sub && <span className="font-mono text-[10px] text-muted-2">{sub}</span>}
      </span>
    </div>
  );
}
