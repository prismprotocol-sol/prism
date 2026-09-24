"use client";

import { AppNav } from "@prism/ui";
import { WalletButton } from "./WalletButton";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/vaults", label: "Vaults" },
  { href: "/vaults/create", label: "Create Vault" },
  { href: "/applications", label: "Applications" },
  { href: "/config", label: "Protocol" },
  { href: "/activity", label: "Activity" },
];

export function Nav() {
  return <AppNav links={LINKS} tag="Admin" right={<WalletButton />} />;
}
