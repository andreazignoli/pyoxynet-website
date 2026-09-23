import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/demo/clip' },
    sitemap: 'https://www.oxynet.net/sitemap.xml',
  }
}
