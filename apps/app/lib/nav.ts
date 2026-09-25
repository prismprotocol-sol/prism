import type { ComponentType } from "react";
import { IconDashboard, IconVaults, IconPortfolio, IconWallet } from "@/components/icons";

export type NavLink = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Dashboard", icon: IconDashboard },
  { href: "/vaults", label: "Vaults", icon: IconVaults },
  { href: "/portfolio", label: "Portfolio", icon: IconPortfolio },
  { href: "/wallet", label: "Wallet", icon: IconWallet },
];
