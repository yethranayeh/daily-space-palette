import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: { remotePatterns: [{ hostname: "apod.nasa.gov" }] }
};

export default nextConfig;
