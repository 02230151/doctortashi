/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  output: 'standalone',
  distDir: '.next',
  webpack: (config, { isServer }) => {
    return config;
  },
};

export default nextConfig;
