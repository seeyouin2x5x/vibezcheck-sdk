import { NextRequest } from 'next/server';
import { getDocItemBySlug, getAllDocItems } from '../../../../lib/docs-data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const item = getDocItemBySlug(slug);
    if (!item) {
      return new Response(JSON.stringify({ error: `Doc '${slug}' not found` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(item.content, {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }

  const all = getAllDocItems();
  return Response.json(
    all.map((item) => ({
      slug: item.slug,
      title: item.title,
      category: item.category,
      description: item.description,
    }))
  );
}
