/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'andreazignoli.github.io' },
    ],
  },
  async rewrites() {
    return [
      // A shared link should survive a version bump, so /manual always points
      // at the current PDF. The versioned file stays at its own path for
      // anyone who needs to cite a specific edition.
      { source: '/manual', destination: '/manual/oxynet-manual.pdf' },
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['shiki'],
  },
}

export default nextConfig
