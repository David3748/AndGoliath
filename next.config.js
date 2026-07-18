/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // Lets a second dev server run without clobbering .next (e.g. NEXT_DIST_DIR=.next-preview)
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig