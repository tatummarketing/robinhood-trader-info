/** Mount-path prefix for client fetch/img URLs on Webflow Cloud. */
export function basePath() {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_PATH;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (typeof window !== "undefined") {
    const match = window.location.pathname.match(/^(\/[^/]+)(?:\/|$)/);
    if (match?.[1] === "/robinhood-trader-info") return "/robinhood-trader-info";
  }

  return "";
}

export function apiUrl(path: string) {
  const base = basePath();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
