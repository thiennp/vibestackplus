import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@scaffold/shared"],
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
};

export default nextConfig;
