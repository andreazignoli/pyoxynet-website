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
      // The data transfer agreement template: shareable, reachable from the
      // partner pages, deliberately kept out of search (see headers below).
      { source: '/data-agreement', destination: '/agreement/oxynet-data-transfer-agreement.pdf' },
    ]
  },
  async headers() {
    return [
      {
        source: '/(data-agreement|agreement/:path*)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ]
  },
  async redirects() {
    return [
      // The unversioned address follows the current API version. Links that
      // must not move when v2 ships should point at /developers/api/v1.
      { source: '/developers/api', destination: '/developers/api/v1', permanent: false },
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['shiki'],
  },
}

export default nextConfig
