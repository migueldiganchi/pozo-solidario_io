import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://pozosolidario.com'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/acerca`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/contacto`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/terminos`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/privacidad`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/cookies`, changeFrequency: 'monthly', priority: 0.2 },
  ]
}
