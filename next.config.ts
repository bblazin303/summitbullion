import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.platform.gold',
        port: '',
        pathname: '/core/media/**',
      },
    ],
  },
};

export default nextConfig;
