"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PrismMark from "./PrismMark";

export type NavLink = { href: string; label: string };

/** Shared sticky app header: mark + section tag, primary nav, and an app-specific right slot (wallet button, CTA, etc). */
export function AppNav({ links, tag, right }: { links: NavLink[]; tag: string; right?: ReactNode }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[var(--z-chrome)] grid h-[76px] grid-cols-[1fr_auto] items-center border-b border-line-soft bg-black/95 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2 text-fg">
          <span className="animate-mark-resolve">
            <PrismMark size={16} />
          </span>
          <span className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">{tag}</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-6 max-mobile:hidden">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-xs tracking-[0.08em] uppercase transition-colors duration-[var(--dur-micro)] ease-out hover:text-fg ${
                  active ? "text-fg" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {right}
    </header>
  );
}
