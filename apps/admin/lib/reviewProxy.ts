/**
 * Server-only bridge to the borrower app's applications API. Runs on this
 * app's server, never in the browser, so the shared reviewer secret is
 * never bundled into client JS.
 */
const BORROW_API_BASE = process.env.BORROW_API_URL ?? "http://localhost:3003";
const REVIEW_TOKEN = process.env.REVIEW_API_TOKEN ?? "dev-review-token-change-me";

export function borrowApiFetch(path: string, init?: RequestInit) {
  return fetch(`${BORROW_API_BASE}${path}`, {
    ...init,
    headers: { ...init?.headers, "x-review-token": REVIEW_TOKEN, "Content-Type": "application/json" },
    cache: "no-store",
  });
}
