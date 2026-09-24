"use client";

import { useCallback, useState } from "react";
import type { TxState } from "@/components/TxPanel";

/** Wraps a transaction call with pending/success/error state, keyed off actual chain confirmation. */
export function useTx() {
  const [state, setState] = useState<TxState>({ status: "idle" });

  const run = useCallback(async (label: string, fn: () => Promise<string>) => {
    setState({ status: "pending", label });
    try {
      const signature = await fn();
      setState({ status: "success", label, signature });
      return signature;
    } catch (e) {
      const message = e instanceof Error ? e.message.split("\n")[0] : "Transaction failed";
      setState({ status: "error", message });
      return null;
    }
  }, []);

  return { state, run, reset: () => setState({ status: "idle" }) };
}
