/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  allowedDevOrigins: [
    'ais-dev-pbn6ab6eei5nqbqf7epbq6-299465333390.asia-southeast1.run.app',
    'ais-pre-pbn6ab6eei5nqbqf7epbq6-299465333390.asia-southeast1.run.app',
    '*.run.app',
    '**.run.app',
    '*.google.com',
    '**.google.com',
    '*.googleusercontent.com',
    '**.googleusercontent.com',
    'localhost',
    '127.0.0.1',
  ],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
