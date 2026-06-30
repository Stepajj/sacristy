import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
