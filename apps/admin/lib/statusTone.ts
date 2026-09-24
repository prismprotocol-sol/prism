import type { StatusTone } from "@prism/ui";

const VAULT_TONE: Record<string, StatusTone> = {
  funding: "neutral",
  active: "positive",
  matured: "attention",
  cancelled: "muted",
};

export function vaultStatus(state: string): { label: string; tone: StatusTone } {
  return { label: state, tone: VAULT_TONE[state] ?? "neutral" };
}

const APPLICATION_TONE: Record<string, StatusTone> = {
  submitted: "neutral",
  in_review: "neutral",
  info_requested: "attention",
  approved: "positive",
  rejected: "muted",
};

const APPLICATION_LABEL: Record<string, string> = {
  submitted: "Submitted",
  in_review: "In review",
  info_requested: "Info requested",
  approved: "Approved",
  rejected: "Rejected",
};

export function applicationStatus(status: string): { label: string; tone: StatusTone } {
  return { label: APPLICATION_LABEL[status] ?? status, tone: APPLICATION_TONE[status] ?? "neutral" };
}
