import type { NextConfig } from "next";

// Hosted inside rasitburucu.com under /web (see README, `npm run sync:site`).
// basePath prefixes routes and /_next assets; lib/asset.ts prefixes public files.
const BASE_PATH = "/web";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
};

export default nextConfig;
