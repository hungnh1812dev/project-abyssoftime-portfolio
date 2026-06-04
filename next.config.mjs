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

  // Node.js 22 supports require(ESM) natively, so we externalize the entire
  // html-react-parser → html-dom-parser → domhandler (ESM-only) chain on the
  // server side instead of letting Next.js webpack try to bundle it.
  experimental: {
    serverComponentsExternalPackages: [
      "html-react-parser",
      "html-dom-parser",
      "domhandler",
      "htmlparser2",
    ],
  },
};

export default nextConfig;
