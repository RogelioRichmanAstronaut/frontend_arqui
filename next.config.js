/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to allow API routes to work
  // If you need static export, use it only for production builds without API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
