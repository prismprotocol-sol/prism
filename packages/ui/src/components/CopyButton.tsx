"use client";

import { useState } from "react";

/** Icon button that copies `value` to the clipboard, swapping to a checkmark briefly as its only feedback. */
export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard API unavailable — no-op, button just doesn't confirm.
    }
  };

  return (
    <button
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-[var(--dur-micro)] ease-out hover:bg-surface-3 hover:text-fg ${className ?? ""}`}
    >
      {copied ? (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
          <path d="M3 8.5 6.5 12 13 4.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-3.5 w-3.5">
          <rect x="5.5" y="5.5" width="9" height="9" />
          <path d="M2.5 10.5V2.5H10.5" />
        </svg>
      )}
    </button>
  );
}
