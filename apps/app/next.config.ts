import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@prism/ui", "@prism/config", "@prism/solana"],
  // The wallet button lives top-right; Next's dev route indicator collides with it there.
  devIndicators: false,
};

export default nextConfig;
