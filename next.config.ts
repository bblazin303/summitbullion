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
  webpack: (config, { isServer }) => {
    // Suppress pino-pretty warnings from WalletConnect dependencies
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'pino-pretty': false,
      };
    }
    return config;
  },
};

export default nextConfig;
