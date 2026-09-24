import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prism",
  description:
    "Prism is an AI transformation firm. We build production AI systems for mid-market and enterprise companies in healthcare, hospitality, manufacturing, construction, financial services, and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden bg-black text-[15px] leading-normal font-sans text-fg antialiased">
        {children}
      </body>
    </html>
  );
}
