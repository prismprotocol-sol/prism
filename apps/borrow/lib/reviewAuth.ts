/**
 * Shared secret between this app's API and the admin app's server-side
 * proxy. Never exported to client bundles — only read inside Route
 * Handlers. The fallback is a placeholder for local development only;
 * production deployments must set REVIEW_API_TOKEN on both apps.
 */
export function isAuthorizedReviewer(request: Request): boolean {
  const secret = process.env.REVIEW_API_TOKEN ?? "dev-review-token-change-me";
  return request.headers.get("x-review-token") === secret;
}
