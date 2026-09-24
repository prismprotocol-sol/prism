import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@prism/ui";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Prism — Borrow",
  description: "Apply for financing from Prism and track your application.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="bg-black text-[15px] leading-normal font-sans text-fg antialiased">
        <Shell>
          <Nav />
          {children}
        </Shell>
      </body>
    </html>
  );
}
