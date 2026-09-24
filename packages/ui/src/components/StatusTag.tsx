export type StatusTone = "neutral" | "positive" | "attention" | "muted";

const TONE_STYLES: Record<StatusTone, string> = {
  neutral: "border border-line text-fg",
  positive: "bg-fg text-black",
  attention: "border border-line-strong text-fg",
  muted: "border border-line-soft text-muted-2 line-through",
};

/** Monochrome state tag — intensity/pattern instead of color, matching the brand's near-colorless system. Each app maps its own domain states to a tone. */
export function StatusTag({ label, tone = "neutral" }: { label: string; tone?: StatusTone }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 font-mono text-[10px] tracking-[0.08em] uppercase ${TONE_STYLES[tone]}`}
    >
      {label}
    </span>
  );
}
