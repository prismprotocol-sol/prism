"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PrismIcon } from "@prism/ui";
import { explorerUrl, PRISM_PROGRAM_ID } from "@prism/config";
import { NAV_LINKS } from "@/lib/nav";
import { IconCollapse, IconInfo, IconExternal } from "./icons";

const STORAGE_KEY = "prism-app-sidebar-collapsed";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // localStorage unavailable — keep expanded.
    }
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col border-r border-line-soft py-6 transition-[width] duration-[var(--dur-micro)] ease-out max-mobile:hidden ${
        collapsed ? "w-[76px] px-3" : "w-[220px] px-4"
      }`}
    >
      <Link href="/" className={`mb-10 flex items-center gap-2 text-fg ${collapsed ? "justify-center" : "px-2"}`}>
        <span className="animate-mark-resolve">
          <PrismIcon size={22} />
        </span>
      </Link>

      <nav aria-label="Primary" className="flex flex-col gap-2">
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              className={`flex h-12 items-center gap-3 font-sans text-sm transition-colors duration-[var(--dur-micro)] ease-out ${
                collapsed ? "justify-center px-0" : "px-2"
              } ${active ? "text-fg" : "text-muted hover:text-fg"}`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors duration-[var(--dur-micro)] ease-out ${
                  active ? "border-line-strong bg-surface-2" : "border-transparent"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              {!collapsed && link.label}
            </Link>
          );
        })}
      </nav>

      {/* Secondary utility actions — icon-only regardless of collapsed
          state (unlike the primary nav, which shows labels when expanded),
          each real and functional: Explorer, About Prism, then the
          collapse toggle itself. Labels surface as native tooltips. */}
      <div className="mt-auto flex flex-col items-center gap-1 border-t border-line-soft pt-4">
        <a
          href={explorerUrl(PRISM_PROGRAM_ID, "address")}
          target="_blank"
          rel="noreferrer"
          title="Prism program on Explorer"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors duration-[var(--dur-micro)] ease-out hover:bg-surface-2 hover:text-fg"
        >
          <IconExternal className="h-[17px] w-[17px]" />
        </a>
        <a
          href="https://prism.credit"
          title="About Prism"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors duration-[var(--dur-micro)] ease-out hover:bg-surface-2 hover:text-fg"
        >
          <IconInfo className="h-[17px] w-[17px]" />
        </a>
        <button
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors duration-[var(--dur-micro)] ease-out hover:bg-surface-2 hover:text-fg"
        >
          <IconCollapse collapsed={collapsed} className="h-[17px] w-[17px]" />
        </button>
      </div>
    </aside>
  );
}
