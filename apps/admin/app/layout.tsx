import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Shell } from "@prism/ui";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Prism — Admin",
  description: "Prism protocol administration: vaults, tranches, and activity.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="bg-black text-[15px] leading-normal font-sans text-fg antialiased">
        <Providers>
          <Shell>
            <Nav />
            {children}
          </Shell>
        </Providers>
      </body>
    </html>
  );
}
