/**
 * Wrapper for all /api/admin/* calls.
 * Adds X-Admin-Bypass header so Cloudflare WAF lets admin traffic through.
 *
 * Cloudflare WAF rule to add:
 *   Expression: (http.request.headers["x-admin-bypass"] eq "GHA_ADMIN_2026")
 *   Action: Skip → WAF managed rules
 */
export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-bypass": "GHA_ADMIN_2026",
      ...(options.headers ?? {}),
    },
  });
}
