"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export const VISITED_VAULT_KEY = "prism-app-visited-vault";

type Step = {
  key: string;
  title: string;
  body: string;
  done: boolean;
  href?: string;
  onClick?: () => void;
  actionLabel: string;
};

const ACTION_CLASSES =
  "mt-5 flex w-full items-center justify-center rounded-full border px-4 py-2.5 font-mono text-xs tracking-[0.08em] uppercase transition-colors duration-[var(--dur-micro)] ease-out";
const ACTION_CURRENT = "border-fg bg-fg text-black hover:bg-[#dcdcd8]";
const ACTION_UPCOMING = "border-line-soft text-muted hover:border-line-strong hover:text-fg";

/** Onboarding banner — every step is real, checkable state, not a fabricated KYC/document flow. Disappears once all three are done. */
export function QuickStartGuide({ hasCommitted }: { hasCommitted: boolean }) {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [visitedVault, setVisitedVault] = useState(false);

  useEffect(() => {
    try {
      setVisitedVault(localStorage.getItem(VISITED_VAULT_KEY) === "1");
    } catch {
      // localStorage unavailable — step reads as not yet done.
    }
  }, []);

  const steps: Step[] = [
    {
      key: "connect",
      title: "Connect wallet",
      body: "Link a Solana wallet to browse and commit to vaults.",
      done: connected,
      onClick: () => setVisible(true),
      actionLabel: "Connect Wallet",
    },
    {
      key: "browse",
      title: "Browse a vault",
      body: "Open a vault to see its tranches, coupon, and terms.",
      done: visitedVault,
      href: "/vaults",
      actionLabel: "Browse Vaults",
    },
    {
      key: "commit",
      title: "Commit capital",
      body: "Pick a tranche and commit — your position appears in Portfolio.",
      done: hasCommitted,
      href: "/vaults",
      actionLabel: "Browse Vaults",
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const firstIncomplete = steps.findIndex((s) => !s.done);

  if (doneCount === steps.length) return null;

  return (
    <section className="rounded-xl border border-line-soft bg-surface-2 p-7">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-fg">Quick start</h2>
          <p className="mt-1 font-sans text-sm text-muted">Get from wallet to your first position.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full bg-fg transition-[width] duration-300 ease-out"
              style={{ width: `${(doneCount / steps.length) * 100}%` }}
            />
          </div>
          <span className="font-mono text-xs tracking-[0.06em] text-muted uppercase">
            {doneCount}/{steps.length} complete
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => {
          const status = step.done ? "done" : i === firstIncomplete ? "current" : "upcoming";
          return (
            <div
              key={step.key}
              className={`rounded-xl border p-5 ${status === "current" ? "border-line-strong bg-surface-3" : "border-line-soft"} ${
                status === "upcoming" ? "opacity-60" : ""
              }`}
            >
              <div
                className={`mb-4 flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs ${
                  status === "done" ? "border-line-soft text-muted" : "border-line-strong text-accent"
                }`}
              >
                {status === "done" ? "✓" : i + 1}
              </div>
              <h3 className={`font-sans text-sm ${status === "done" ? "text-muted" : "text-fg"}`}>{step.title}</h3>
              <p className="mt-1.5 font-sans text-xs leading-relaxed text-muted-2">{step.body}</p>
              {status !== "done" &&
                (step.href ? (
                  <Link href={step.href} className={`${ACTION_CLASSES} ${status === "current" ? ACTION_CURRENT : ACTION_UPCOMING}`}>
                    {step.actionLabel}
                  </Link>
                ) : (
                  <button onClick={step.onClick} className={`${ACTION_CLASSES} ${status === "current" ? ACTION_CURRENT : ACTION_UPCOMING}`}>
                    {step.actionLabel}
                  </button>
                ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
