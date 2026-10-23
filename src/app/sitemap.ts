import type { MetadataRoute } from "next";
import { getPostSlugs } from "@/lib/blog";
import { SITE_URL } from "@/lib/paths";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/projects", "/wip", "/blog"];
  const posts = getPostSlugs().map((slug) => `/blog/${slug}`);

  return [...routes, ...posts].map((route) => ({
    url: `${SITE_URL}${route}/`,
  }));
}
