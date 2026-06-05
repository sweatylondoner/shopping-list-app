import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force no caching
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
