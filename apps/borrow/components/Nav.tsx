"use client";

import Link from "next/link";
import { AppNav } from "@prism/ui";

export function Nav() {
  return (
    <AppNav
      links={[]}
      tag="Borrow"
      right={
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 border border-line-soft px-3 py-2 font-mono text-xs tracking-[0.06em] text-fg uppercase transition-colors duration-[var(--dur-micro)] ease-out hover:border-line-strong"
        >
          Apply for financing
        </Link>
      }
    />
  );
}
