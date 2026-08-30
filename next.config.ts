import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporary: lets the ngrok host reach the dev server without a
  // cross-origin warning. Remove along with the tunnel.
  allowedDevOrigins: ["ailanthic-olene-unhushing.ngrok-free.dev"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "bwnhgomltktnmtohwfms.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
