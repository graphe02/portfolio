/** Must match `basePath` in next.config.ts (GitHub project Pages). */
export const BASE_PATH = "/portfolio";

/** Prefix public asset paths for GitHub Pages project sites. */
export function asset(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
