/** Repo is graphe02/portfolio → site lives at graphe02.github.io/portfolio */
export const BASE_PATH = "/portfolio";

/** Full public URL of the site (no trailing slash). */
export const SITE_URL = `https://graphe02.github.io${BASE_PATH}`;

/** Prefix public asset paths for GitHub Pages project sites. */
export function asset(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
