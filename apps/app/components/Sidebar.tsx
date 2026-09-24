"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PrismIcon } from "@prism/ui";
import { IconDashboard, IconVaults, IconPortfolio, IconWallet, IconCollapse, IconInfo } from "./icons";

const LINKS = [
  { href: "/", label: "Dashboard", icon: IconDashboard },
  { href: "/vaults", label: "Vaults", icon: IconVaults },
  { href: "/portfolio", label: "Portfolio", icon: IconPortfolio },
  { href: "/wallet", label: "Wallet", icon: IconWallet },
];

const STORAGE_KEY = "prism-app-sidebar-collapsed";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const activeIndex = LINKS.findIndex((link) => link.href === pathname);

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
      className={`flex h-full shrink-0 flex-col border-r border-line-soft py-6 transition-[width] duration-[var(--dur-micro)] ease-out max-mobile:hidden ${
        collapsed ? "w-[76px] px-3" : "w-[220px] px-4"
      }`}
    >
      <Link href="/" className={`mb-10 flex items-center gap-2 text-fg ${collapsed ? "justify-center" : "px-2"}`}>
        <span className="animate-mark-resolve">
          <PrismIcon size={22} />
        </span>
      </Link>

      <nav aria-label="Primary" className="relative flex flex-col gap-2">
        {activeIndex >= 0 && (
          <span
            aria-hidden="true"
            className="absolute left-0 h-12 w-0.5 bg-fg transition-transform duration-300 ease-out"
            style={{ transform: `translateY(${activeIndex * 56}px)` }}
          />
        )}
        {LINKS.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              className={`flex h-12 items-center gap-3 font-sans text-sm transition-colors duration-[var(--dur-micro)] ease-out ${
                collapsed ? "justify-center px-0" : "px-3"
              } ${active ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"}`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-[var(--dur-micro)] ease-out" />
              {!collapsed && link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-line-soft pt-4">
        <a
          href="https://prism.credit"
          title={collapsed ? "About Prism" : undefined}
          className={`flex items-center gap-3 py-2 font-mono text-xs tracking-[0.06em] text-muted uppercase transition-colors duration-[var(--dur-micro)] ease-out hover:text-fg ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
        >
          <IconInfo className="h-[15px] w-[15px] shrink-0" />
          {!collapsed && "About Prism"}
        </a>
        <button
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex items-center gap-3 py-2 font-mono text-xs tracking-[0.06em] text-muted uppercase transition-colors duration-[var(--dur-micro)] ease-out hover:text-fg ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
        >
          <IconCollapse collapsed={collapsed} className="h-[15px] w-[15px] shrink-0" />
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}
