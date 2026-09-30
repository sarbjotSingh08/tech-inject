/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@tech-inject/theme', '@tech-inject/ui', '@tech-inject/registry-schema', '@tech-inject/db']
};

module.exports = nextConfig;
