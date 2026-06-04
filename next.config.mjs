import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: false,
    },
  },

  // Only list CJS-compatible packages here — ESM-only packages (domhandler, htmlparser2, etc.)
  // must be bundled, not externalized, to avoid ERR_REQUIRE_ESM at runtime
  serverExternalPackages: ["isomorphic-dompurify", "jsdom"],

  reactCompiler: true,
};

export default withBundleAnalyzer(nextConfig);
