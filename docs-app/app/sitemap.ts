import { MetadataRoute } from 'next';
import { getAllDocItems } from '../lib/docs-data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://docs.vibezcheck.app';
  const docItems = getAllDocItems();

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...docItems.map((item) => ({
      url: `${baseUrl}/docs/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: item.slug === 'overview' || item.slug === 'tutorial' || item.slug === 'quickstart' ? 0.9 : 0.8,
    })),
  ];

  return routes;
}
