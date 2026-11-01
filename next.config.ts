import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      // ? APOD images live under two different prefixes depending on the era
      { hostname: "assets.science.nasa.gov", pathname: "/dynamicimage/**" },
      { hostname: "assets.science.nasa.gov", pathname: "/content/dam/**" },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
};

export default nextConfig;
