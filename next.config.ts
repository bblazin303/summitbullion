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
  // Suppress specific webpack warnings
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config, { isServer, webpack }) => {
    // Suppress pino-pretty warnings from WalletConnect dependencies
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'pino-pretty': false,
      };
    }
    
    // Ignore pino-pretty module warnings
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pino-pretty$/,
      })
    );
    
    // Suppress specific warnings
    config.ignoreWarnings = [
      { module: /node_modules\/pino\/lib\/tools\.js/ },
      { message: /Can't resolve 'pino-pretty'/ },
    ];
    
    return config;
  },
};

export default nextConfig;
