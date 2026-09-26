import type { ComponentType } from "react";
import { IconDashboard, IconVaults, IconSwap, IconPortfolio } from "@/components/icons";

export type NavLink = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Dashboard", icon: IconDashboard },
  { href: "/vaults", label: "Vaults", icon: IconVaults },
  { href: "/swap", label: "Swap", icon: IconSwap },
  { href: "/portfolio", label: "Portfolio", icon: IconPortfolio },
];
