import stylexPlugin from '@stylexswc/nextjs-plugin/turbopack'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

// export default nextConfig

export default stylexPlugin({
  rsOptions: {
    dev: process.env.NODE_ENV === 'development',
  },
})(nextConfig)
