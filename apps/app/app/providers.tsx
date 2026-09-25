"use client";

import { SolanaProvider } from "@prism/solana";
import { ToastProvider } from "@prism/ui";
import type { ReactNode } from "react";
import { DataProvider } from "@/components/DataProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <SolanaProvider>
        <DataProvider>{children}</DataProvider>
      </SolanaProvider>
    </ToastProvider>
  );
}
