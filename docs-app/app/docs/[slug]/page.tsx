import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '../../../components/header';
import { Sidebar } from '../../../components/sidebar';
import { TableOfContents } from '../../../components/toc';
import { MarkdownRenderer } from '../../../components/markdown-renderer';
import { PageNavigation } from '../../../components/page-navigation';
import { CostCalculator } from '../../../components/cost-calculator';
import { WidgetSandbox } from '../../../components/widget-sandbox';
import { getDocItemBySlug, getAllDocItems } from '../../../lib/docs-data';

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocItemBySlug(slug);

  if (!doc) {
    return {
      title: 'Documentation',
    };
  }

  return {
    title: doc.title,
    description: doc.description,
    alternates: {
      canonical: `https://docs.vibezcheck.app/docs/${doc.slug}`,
    },
    openGraph: {
      title: `${doc.title} — vibezcheck Docs`,
      description: doc.description,
      url: `https://docs.vibezcheck.app/docs/${doc.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${doc.title} — vibezcheck Docs`,
      description: doc.description,
    },
  };
}

export async function generateStaticParams() {
  const items = getAllDocItems();
  return items.map((item) => ({
    slug: item.slug,
  }));
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocItemBySlug(slug);

  if (!doc) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Main Content */}
        <main className="flex-1 min-w-0 px-6 py-8 sm:px-10 lg:px-12">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 font-medium">
            <span>Documentation</span>
            <span>/</span>
            <span>{doc.category}</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{doc.title}</span>
          </div>

          {/* Render Full Document Content Cleanly */}
          <div className="space-y-4">
            <MarkdownRenderer content={doc.content} />
          </div>

          {/* Contextual Interactive Widget Embeds */}
          {doc.slug === 'model-table' && (
            <div className="my-8">
              <CostCalculator />
            </div>
          )}

          {(doc.slug === 'session-widget' || doc.slug === 'billing-modal') && (
            <div className="my-8">
              <WidgetSandbox />
            </div>
          )}

          {/* Next & Back Navigation Footer */}
          <PageNavigation currentSlug={slug} />
        </main>

        {/* Right Table of Contents */}
        <TableOfContents headings={doc.headings} />
      </div>
    </div>
  );
}
