"use client";

import { explorerUrl } from "@prism/config";

export type TxState =
  | { status: "idle" }
  | { status: "pending"; label: string }
  | { status: "success"; label: string; signature: string }
  | { status: "error"; message: string };

/** Surfaces every write's lifecycle — never shows success before the chain confirms it. */
export function TxPanel({ state }: { state: TxState }) {
  if (state.status === "idle") return null;

  return (
    <div className="border border-line-soft bg-surface-2 px-4 py-3 font-mono text-xs">
      {state.status === "pending" && <span className="text-muted">Pending — {state.label}…</span>}
      {state.status === "success" && (
        <span className="text-fg">
          {state.label} confirmed —{" "}
          <a
            href={explorerUrl(state.signature)}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-muted"
          >
            view on Explorer ↗
          </a>
        </span>
      )}
      {state.status === "error" && <span className="text-muted-2">Failed — {state.message}</span>}
    </div>
  );
}
