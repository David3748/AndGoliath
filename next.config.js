/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  basePath: '/AndGoliath',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig