import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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

  // Moved from experimental.serverComponentsExternalPackages in Next.js 15+
  serverExternalPackages: ["html-react-parser", "html-dom-parser", "domhandler", "htmlparser2", "isomorphic-dompurify", "jsdom"],

  reactCompiler: true,
};

export default withBundleAnalyzer(nextConfig);
