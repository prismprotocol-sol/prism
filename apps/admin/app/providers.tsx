"use client";

import { SolanaProvider } from "@prism/solana";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <SolanaProvider>{children}</SolanaProvider>;
}
