import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.myanimelist.net"],
  },
  eslint: {
    ignoreDuringBuilds: true, // <-- skip ESLint errors in production build
  },
};

export default nextConfig;
