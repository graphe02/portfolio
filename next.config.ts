import type { NextConfig } from "next";

/** Repo is graphe02/portfolio → site lives at graphe02.github.io/portfolio */
const basePath = "/portfolio";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
