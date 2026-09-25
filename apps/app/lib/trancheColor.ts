import type { Seniority } from "@prism/solana";

/** Alpha (junior) → Core (mezzanine) → Prime (senior), the one place this mapping lives instead of a repeated ternary per file. */
export const TRANCHE_DOT: Record<Seniority, string> = {
  0: "bg-alpha",
  1: "bg-core",
  2: "bg-prime",
};

export const TRANCHE_TEXT: Record<Seniority, string> = {
  0: "text-alpha",
  1: "text-core",
  2: "text-prime",
};

export const TRANCHE_STROKE: Record<Seniority, string> = {
  0: "stroke-alpha",
  1: "stroke-core",
  2: "stroke-prime",
};
