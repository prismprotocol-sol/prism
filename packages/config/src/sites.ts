/** Cross-app links. Each app can override its own origin via env when deployed on its subdomain. */
export const SITE_URLS = {
  landing: process.env.NEXT_PUBLIC_LANDING_URL ?? "https://prism.credit",
  app: process.env.NEXT_PUBLIC_APP_URL ?? "https://app.prism.credit",
  admin: process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://admin.prism.credit",
  borrow: process.env.NEXT_PUBLIC_BORROW_URL ?? "https://borrow.prism.credit",
} as const;
