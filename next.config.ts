import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.devtunnels.ms"],
  experimental: {
    serverActions: {
      allowedOrigins: ["*.devtunnels.ms"],
    },
  },
};

export default nextConfig;
