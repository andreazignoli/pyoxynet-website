import type { MetadataRoute } from 'next'
import { DEV_PAGES } from '@/content/developers/nav'

const SITE = 'https://www.oxynet.net'

/** The indexable pages. The recording stage (/demo/clip) is noindex and left out on purpose. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/integration', '/demo', ...DEV_PAGES.map((p) => p.href)]
  return pages.map((p) => ({ url: `${SITE}${p === '/' ? '' : p}` }))
}
