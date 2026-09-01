import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'GPTBot',
          'ChatGPT-User',
          'Claude-Web',
          'ClaudeBot',
          'PerplexityBot',
          'Bytespider',
        ],
        allow: '/',
      },
    ],
    sitemap: 'https://docs.vibezcheck.app/sitemap.xml',
    host: 'https://docs.vibezcheck.app',
  };
}
