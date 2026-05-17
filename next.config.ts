import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: { remotePatterns: [{ hostname: "apod.nasa.gov" }, { hostname: "i1.ytimg.com" }] },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
};

export default nextConfig;
