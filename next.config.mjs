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

  // Moved from experimental.serverComponentsExternalPackages in Next.js 15+
  serverExternalPackages: ["html-react-parser", "html-dom-parser", "domhandler", "htmlparser2"],

  reactCompiler: true,
};

export default nextConfig;
