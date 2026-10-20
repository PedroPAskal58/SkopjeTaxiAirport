import type { MetadataRoute } from 'next'
import { site, tourList, transfers } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const staticPages = ['', '/tours', '/transfers', '/routes', '/fleet', '/faq', '/reviews', '/contact', '/book', '/build-trip']

  return [
    ...staticPages.map((path) => ({
      url: `${site.url}${path}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
    ...tourList.map((tour) => ({
      url: `${site.url}/tours/${tour.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...transfers.map((transfer) => ({
      url: `${site.url}/transfers/${transfer.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
