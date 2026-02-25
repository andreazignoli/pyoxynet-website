/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'andreazignoli.github.io' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['shiki'],
  },
}

export default nextConfig
