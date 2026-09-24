import type { StatusTone } from "@prism/ui";

const TONE: Record<string, StatusTone> = {
  funding: "neutral",
  active: "positive",
  matured: "attention",
  cancelled: "muted",
};

export function vaultStatus(state: string): { label: string; tone: StatusTone } {
  return { label: state, tone: TONE[state] ?? "neutral" };
}
