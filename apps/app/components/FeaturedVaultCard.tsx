import Link from "next/link";
import { fmt, pct, TRANCHES, type VaultView } from "@prism/solana";
import { assetLabel } from "@/lib/assetLabel";

export function FeaturedVaultCard({ vault }: { vault: VaultView }) {
  const base58 = vault.address.toBase58();
  const borrower = vault.borrower.toBase58();
  const termDays = Math.round(vault.termSeconds / 86_400);
  const subscribedPct = vault.principalTarget.isZero()
    ? 0
    : vault.totalCommitted.muln(100).div(vault.principalTarget).toNumber();

  return (
    <section className="overflow-hidden rounded-xl border border-line-soft bg-surface-2">
      <div className="flex flex-col md:flex-row">
        <div className="techTexture relative h-56 w-full shrink-0 overflow-hidden border-b border-line-soft md:h-auto md:w-[38%] md:border-r md:border-b-0">
          <span className="grain" aria-hidden="true" />
        </div>

        <div className="flex flex-1 flex-col justify-between gap-6 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs tracking-[0.08em] text-muted uppercase">Featured vault</span>
              <h2 className="mt-2 font-serif text-3xl text-fg">{assetLabel(vault.underlyingMint)} Vault</h2>
              <p className="mt-2 font-mono text-xs text-muted">
                Originated by {borrower.slice(0, 4)}…{borrower.slice(-4)}
              </p>
            </div>
            <Link
              href={`/vaults/${base58}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line-soft px-4 py-2.5 font-mono text-xs tracking-[0.08em] text-accent uppercase transition-colors duration-[var(--dur-micro)] ease-out hover:border-line-strong"
            >
              View Vault
            </Link>
          </div>

          <p className="max-w-xl font-sans text-sm leading-relaxed text-muted">
            Tranches this pool&rsquo;s receivables into {TRANCHES.length} risk layers — {TRANCHES.map((t) => t.label).join(", ")} — over a{" "}
            {termDays}-day term, targeting ${fmt(vault.principalTarget, 0)} in commitments.
          </p>

          <div className="flex flex-wrap items-end gap-10 border-t border-line-soft pt-6">
            <div>
              <div className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">Coupon</div>
              <div className="mt-1.5 font-serif text-4xl text-accent tabular-nums">{pct(vault.couponBps, 2)}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">Committed</div>
              <div className="mt-1.5 font-serif text-2xl text-fg tabular-nums">${fmt(vault.totalCommitted, 0)}</div>
              <div className="mt-1 font-mono text-[11px] text-muted-2">{subscribedPct}% subscribed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
