import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // isomorphic-dompurify pulls in jsdom whose transitive dep html-encoding-sniffer
  // uses require() on an ESM-only package — externalize both so Node loads them natively
  serverExternalPackages: ["isomorphic-dompurify", "jsdom"],

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
