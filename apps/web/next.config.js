/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [], // Add domains as needed for image optimization
  },
  // Add empty turbopack config to avoid conflicts
  turbopack: {},
  // Simple webpack fallback for compatibility
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false
    };
    return config;
  },
};

module.exports = nextConfig;