/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  experimental: {
    appDir: true,
  },
  output: 'standalone',
};

export default nextConfig;
