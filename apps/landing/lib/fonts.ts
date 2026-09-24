import { Oswald } from "next/font/google";

/**
 * Header's "Join Waitlist" CTA only — a tall, condensed display face none of
 * the site's self-hosted fonts provide, in a genuinely light weight (Bebas
 * Neue, tried first, only ships one bold-by-design cut). next/font fetches
 * and self-hosts it at build time (same "ship the font, don't call Google
 * at runtime" result as the local @font-face files in
 * packages/ui/src/styles/tokens.css), it just doesn't need a woff2 checked
 * in because next/font handles that step.
 */
export const condensedDisplay = Oswald({
  subsets: ["latin"],
  weight: "300",
  display: "swap",
});
