import type { MetadataRoute } from 'next'
import { DEV_PAGES } from '@/content/developers/nav'
import { VENDOR_GUIDES, guideHref } from '@/content/thresholds'

const SITE = 'https://www.oxynet.net'

/** The indexable pages. The recording stage (/demo/clip) is noindex and left out on purpose. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '/',
    '/ventilatory-thresholds',
    ...VENDOR_GUIDES.map(guideHref),
    '/integration',
    '/demo',
    ...DEV_PAGES.map((p) => p.href),
    '/terms',
    '/privacy',
  ]
  return pages.map((p) => ({ url: `${SITE}${p === '/' ? '' : p}` }))
}
