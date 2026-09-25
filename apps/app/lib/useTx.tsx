"use client";

import { useCallback, useState } from "react";
import { useToast } from "@prism/ui";
import { explorerUrl } from "@prism/config";

export type TxState =
  | { status: "idle" }
  | { status: "pending"; label: string }
  | { status: "success"; label: string; signature: string }
  | { status: "error"; message: string };

/** Wraps a transaction call with pending/success/error state, keyed off actual chain confirmation, and mirrors that lifecycle into the global toast stack. */
export function useTx() {
  const [state, setState] = useState<TxState>({ status: "idle" });
  const { push, update } = useToast();

  const run = useCallback(
    async (label: string, fn: () => Promise<string>) => {
      setState({ status: "pending", label });
      const toastId = push({ tone: "pending", title: `${label}…` });
      try {
        const signature = await fn();
        setState({ status: "success", label, signature });
        update(toastId, {
          tone: "success",
          title: `${label} confirmed`,
          description: (
            <a href={explorerUrl(signature)} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-fg">
              View on Explorer ↗
            </a>
          ),
        });
        return signature;
      } catch (e) {
        const message = e instanceof Error ? e.message.split("\n")[0] : "Transaction failed";
        setState({ status: "error", message });
        update(toastId, { tone: "error", title: `${label} failed`, description: message });
        return null;
      }
    },
    [push, update]
  );

  return { state, run, reset: () => setState({ status: "idle" }) };
}
