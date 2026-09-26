"use client";

import { useState, useRef, useEffect } from "react";
import { SITE_URLS } from "@prism/config";
import { IconGrid } from "./icons";

const APPS = [
  { href: SITE_URLS.landing, label: "Prism", sub: "Marketing" },
  { href: SITE_URLS.app, label: "Invest", sub: "You are here" },
  { href: SITE_URLS.admin, label: "Admin", sub: "Protocol operators" },
  { href: SITE_URLS.borrow, label: "Borrow", sub: "Businesses" },
  { href: SITE_URLS.docs, label: "Docs", sub: "How it works" },
];

export function EcosystemSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Switch Prism app"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line-soft text-muted transition-colors duration-[var(--dur-micro)] ease-out hover:border-line-strong hover:text-fg"
      >
        <IconGrid className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[var(--z-overlay)] w-56 overflow-hidden rounded-xl border border-line-soft bg-surface-2">
          {APPS.map((a) => (
            <a
              key={a.label}
              href={a.href}
              className="flex items-center justify-between border-b border-line-soft px-4 py-3 font-mono text-xs uppercase tracking-[0.06em] text-muted transition-colors duration-[var(--dur-micro)] ease-out last:border-b-0 hover:bg-surface-3 hover:text-fg"
            >
              <span>{a.label}</span>
              <span className="text-muted-2 normal-case">{a.sub}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
