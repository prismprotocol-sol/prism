"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useProgram,
  usePools,
  useTokenBalance,
  poolAuthorityPda,
  reservePda,
  ata,
  fmt,
  pct,
  toBase,
  swapOut,
  priceImpactBps,
  TOKEN_PROGRAM,
  type PoolView,
} from "@prism/solana";
import { Stat, AmountInput, Note, Empty, Modal, PageHeader } from "@prism/ui";
import { Card, Button } from "@/components/ui";
import { useTx } from "@/lib/useTx";
import { useAppData } from "@/components/DataProvider";
import { resolveMint } from "@/lib/mintLabel";

const SLIPPAGE_PRESETS = [10, 50, 100]; // bps: 0.1% / 0.5% / 1%

export default function SwapPage() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const { vaults } = useAppData();
  const { pools, loading, refresh: refreshPools } = usePools();
  const { state, run } = useTx();

  const [selected, setSelected] = useState<string | null>(null);
  const [reversed, setReversed] = useState(false);
  const [fromAmount, setFromAmount] = useState("");
  const [slippageBps, setSlippageBps] = useState(50);
  const [confirming, setConfirming] = useState(false);

  const pool: PoolView | null = selected ? (pools.find((p) => p.address.toBase58() === selected) ?? null) : (pools[0] ?? null);

  const fromMint = pool ? (reversed ? pool.mintB : pool.mintA) : null;
  const toMint = pool ? (reversed ? pool.mintA : pool.mintB) : null;
  const reserveIn = pool ? (reversed ? pool.reserveB : pool.reserveA) : null;
  const reserveOut = pool ? (reversed ? pool.reserveA : pool.reserveB) : null;

  const fromInfo = fromMint ? resolveMint(fromMint, vaults) : null;
  const toInfo = toMint ? resolveMint(toMint, vaults) : null;

  const { balance: fromBalance, refresh: refreshFromBalance } = useTokenBalance(fromMint);
  const { refresh: refreshToBalance } = useTokenBalance(toMint);

  const amountInBase = toBase(fromAmount || "0");
  const quoteOut = pool && reserveIn && reserveOut ? swapOut(reserveIn, reserveOut, amountInBase, pool.feeBps) : null;
  const impactBps = pool && reserveIn && reserveOut ? priceImpactBps(reserveIn, reserveOut, amountInBase) : 0;
  const minOut = quoteOut ? quoteOut.muln(10_000 - slippageBps).divn(10_000) : null;

  const selectPool = (addr: string) => {
    setSelected(addr);
    setReversed(false);
    setFromAmount("");
  };

  const flip = () => {
    setReversed((r) => !r);
    setFromAmount("");
  };

  const swap = () =>
    run("Swap", async () => {
      if (!publicKey) throw new Error("Connect a wallet first.");
      if (!pool || !fromMint || !toMint || !minOut) throw new Error("No pool selected.");
      const sig = await program.methods
        .swap(amountInBase, minOut)
        .accounts({
          trader: publicKey,
          pool: pool.address,
          poolAuthority: poolAuthorityPda(pool.address),
          traderIn: ata(fromMint, publicKey),
          traderOut: ata(toMint, publicKey),
          reserveIn: reservePda(pool.address, reversed ? "b" : "a"),
          reserveOut: reservePda(pool.address, reversed ? "a" : "b"),
          tokenProgram: TOKEN_PROGRAM,
        })
        .rpc();
      await Promise.all([refreshPools(), refreshFromBalance(), refreshToBalance()]);
      setFromAmount("");
      return sig;
    });

  const insufficientBalance = amountInBase.gt(fromBalance);

  return (
    <div className="space-y-8 px-10 py-10">
      <PageHeader
        eyebrow="swap"
        title="Swap"
        description="Trade tranche tokens against the underlying stablecoin on the AMM. This price is set by pool liquidity — a separate number from redemption value, which is what the contract owes."
      />

      <section className="space-y-3">
        <h2 className="font-sans text-sm text-fg">Liquidity pools ({pools.length})</h2>
        {loading && pools.length === 0 ? (
          <Empty>Loading pools…</Empty>
        ) : pools.length === 0 ? (
          <Empty>No liquidity pools yet.</Empty>
        ) : (
          <div className="overflow-hidden rounded-xl border border-line-soft">
            <div className="grid grid-cols-[1.6fr_1.4fr_0.6fr] gap-4 border-b border-line-soft px-6 py-4 font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
              <span>Pair</span>
              <span>Liquidity</span>
              <span>Fee</span>
            </div>
            <div>
              {pools.map((p) => {
                const a = resolveMint(p.mintA, vaults);
                const b = resolveMint(p.mintB, vaults);
                const active = pool?.address.equals(p.address);
                return (
                  <button
                    key={p.address.toBase58()}
                    onClick={() => selectPool(p.address.toBase58())}
                    className={`grid w-full grid-cols-[1.6fr_1.4fr_0.6fr] items-center gap-4 border-b border-line-soft px-6 py-4 text-left transition-colors duration-[var(--dur-micro)] ease-out last:border-b-0 hover:bg-surface-2 ${
                      active ? "bg-surface-2" : ""
                    }`}
                  >
                    <span className="font-mono text-sm text-fg">
                      {a.label}
                      {a.sub && <span className="text-muted-2"> ({a.sub}…)</span>} / {b.label}
                      {b.sub && <span className="text-muted-2"> ({b.sub}…)</span>}
                    </span>
                    <span className="font-mono text-xs text-muted tabular-nums">
                      {fmt(p.reserveA, 0)} {a.label} · {fmt(p.reserveB, 0)} {b.label}
                    </span>
                    <span className="font-mono text-xs text-fg tabular-nums">{pct(p.feeBps, 2)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {pool && fromMint && toMint && fromInfo && toInfo && (
        <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
          <Card title="Swap">
            <div className="space-y-3">
              <div>
                <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
                  <span>From</span>
                  <button onClick={() => setFromAmount((Number(fromBalance.toString()) / 1_000_000).toString())} className="text-accent hover:opacity-80">
                    Max: {fmt(fromBalance, 2)}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <AmountInput value={fromAmount} onChange={setFromAmount} placeholder="0.00" />
                  <span className="shrink-0 rounded-lg border border-line-soft px-3 py-2.5 font-mono text-xs text-fg">{fromInfo.label}</span>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={flip}
                  aria-label="Reverse direction"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line-soft text-muted transition-colors duration-[var(--dur-micro)] ease-out hover:border-line-strong hover:text-fg"
                >
                  ↓↑
                </button>
              </div>

              <div>
                <div className="mb-1.5 font-mono text-[11px] tracking-[0.06em] text-muted uppercase">To (estimated)</div>
                <div className="flex items-center gap-2">
                  <div className="w-full rounded-lg border border-line-soft bg-black px-3 py-2.5 font-mono text-sm text-fg tabular-nums">
                    {quoteOut ? fmt(quoteOut, 4) : "0.00"}
                  </div>
                  <span className="shrink-0 rounded-lg border border-line-soft px-3 py-2.5 font-mono text-xs text-fg">{toInfo.label}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                {SLIPPAGE_PRESETS.map((bps) => (
                  <button
                    key={bps}
                    onClick={() => setSlippageBps(bps)}
                    className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase transition-colors duration-[var(--dur-micro)] ease-out ${
                      slippageBps === bps ? "bg-surface-3 text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {(bps / 100).toFixed(1)}%
                  </button>
                ))}
                <span className="font-mono text-[11px] text-muted-2">slippage</span>
              </div>

              {pool.frozen ? (
                <Note>This pool is frozen — swaps are disabled.</Note>
              ) : !publicKey ? (
                <Note>Connect a wallet to swap.</Note>
              ) : (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setConfirming(true)}
                  disabled={state.status === "pending" || !fromAmount || amountInBase.isZero() || insufficientBalance}
                >
                  {insufficientBalance ? "Insufficient balance" : "Swap"}
                </Button>
              )}
            </div>
          </Card>

          <Card title="Details">
            <div className="space-y-3">
              <Stat label="Price impact" value={`${(impactBps / 100).toFixed(2)}%`} />
              <Stat label="Minimum received" value={minOut ? `${fmt(minOut, 4)} ${toInfo.label}` : "—"} />
              <Stat label="Pool fee" value={pct(pool.feeBps, 2)} />
              <Stat
                label="Pool reserves"
                value={`${fmt(pool.reserveA, 0)} / ${fmt(pool.reserveB, 0)}`}
                sub={`${resolveMint(pool.mintA, vaults).label} / ${resolveMint(pool.mintB, vaults).label}`}
              />
            </div>
          </Card>
        </div>
      )}

      <Note>
        Swap price is set by this pool&rsquo;s reserves at the moment you trade — a thin pool moves price further per
        unit traded than a deep one. It has nothing to do with a tranche&rsquo;s redemption value, which accrues
        deterministically regardless of what any pool is doing.
      </Note>

      {confirming && pool && fromInfo && toInfo && minOut && (
        <Modal open onClose={() => setConfirming(false)} title="Confirm swap">
          <div className="space-y-4">
            <p className="font-sans text-sm text-muted">
              Swap <span className="text-fg">{fromAmount}</span> <span className="text-fg">{fromInfo.label}</span> for
              at least <span className="text-fg">{fmt(minOut, 4)}</span> <span className="text-fg">{toInfo.label}</span>.
            </p>
            <p className="font-sans text-xs text-muted-2">This transaction cannot be undone once confirmed on-chain.</p>
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" onClick={() => setConfirming(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setConfirming(false);
                  swap();
                }}
                disabled={state.status === "pending"}
                className="flex-1"
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
