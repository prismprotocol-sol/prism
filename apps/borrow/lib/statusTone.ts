import type { StatusTone } from "@prism/ui";

const TONE: Record<string, StatusTone> = {
  submitted: "neutral",
  in_review: "neutral",
  info_requested: "attention",
  approved: "positive",
  rejected: "muted",
};

const LABEL: Record<string, string> = {
  submitted: "Submitted",
  in_review: "In review",
  info_requested: "Info requested",
  approved: "Approved",
  rejected: "Not approved",
};

export function applicationStatus(status: string): { label: string; tone: StatusTone } {
  return { label: LABEL[status] ?? status, tone: TONE[status] ?? "neutral" };
}
