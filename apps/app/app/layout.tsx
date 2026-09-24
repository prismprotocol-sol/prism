import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { ScrollArea } from "@/components/ScrollArea";

export const metadata: Metadata = {
  title: "Prism — Invest",
  description: "Browse credit vaults, invest across tranches, and track your positions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden bg-black text-[15px] leading-normal font-sans text-fg antialiased">
        <Providers>
          <div className="flex h-full">
            <Sidebar />
            <div className="flex h-full min-w-0 flex-1 flex-col">
              <TopBar />
              <ScrollArea>{children}</ScrollArea>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
