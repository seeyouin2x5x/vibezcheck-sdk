import { getAllDocItems } from '../../lib/docs-data';

export const dynamic = 'force-static';

export async function GET() {
  const items = getAllDocItems();
  const fullContent = items
    .map((item) => `\n---\n# ${item.title} (${item.category})\n${item.content}\n`)
    .join('\n');

  return new Response(fullContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
