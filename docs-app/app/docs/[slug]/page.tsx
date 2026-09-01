import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '../../../components/header';
import { Sidebar } from '../../../components/sidebar';
import { TableOfContents } from '../../../components/toc';
import { CodeBlock } from '../../../components/code-block';
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

  // Simple Markdown Section Splitter for rendering code blocks and widgets
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const firstLine = lines[0].replace('```', '').trim();
        const code = lines.slice(1, -1).join('\n');

        let language = firstLine || 'typescript';
        let filename: string | undefined;

        if (firstLine.includes(':')) {
          const [lang, file] = firstLine.split(':');
          language = lang;
          filename = file;
        }

        return (
          <CodeBlock
            key={index}
            code={code}
            language={language}
            filename={filename}
          />
        );
      }

      // Render standard paragraph / headers / tables
      return (
        <div
          key={index}
          className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4 my-4"
        >
          {part.split('\n\n').map((para, pIdx) => {
            const trimmed = para.trim();
            if (!trimmed) return null;

            if (trimmed.startsWith('# ')) {
              return (
                <h1 key={pIdx} className="text-3xl font-bold tracking-tight text-slate-950 mt-2 mb-4">
                  {trimmed.replace('# ', '')}
                </h1>
              );
            }

            if (trimmed.startsWith('## ')) {
              const headingText = trimmed.replace('## ', '');
              const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <h2 key={pIdx} id={id} className="text-xl font-bold tracking-tight text-slate-900 mt-8 mb-3 scroll-mt-20">
                  {headingText}
                </h2>
              );
            }

            if (trimmed.startsWith('> ')) {
              return (
                <blockquote key={pIdx} className="p-3.5 rounded-xl bg-slate-50 border-l-4 border-slate-900 text-slate-700 my-4 text-xs sm:text-sm">
                  {trimmed.replace('> ', '')}
                </blockquote>
              );
            }

            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
              const listItems = trimmed.split('\n').map((li) => li.replace(/^[\*\-]\s+/, ''));
              return (
                <ul key={pIdx} className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                  {listItems.map((li, lIdx) => (
                    <li key={lIdx}>{li}</li>
                  ))}
                </ul>
              );
            }

            if (trimmed.startsWith('|')) {
              const rows = trimmed.split('\n').filter((r) => !r.includes('---'));
              return (
                <div key={pIdx} className="overflow-x-auto my-4 rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {rows.map((row, rIdx) => {
                        const cols = row.split('|').filter(Boolean).map((c) => c.trim());
                        return (
                          <tr key={rIdx} className={rIdx === 0 ? 'bg-slate-50 font-semibold text-slate-900' : 'hover:bg-slate-50'}>
                            {cols.map((col, cIdx) => (
                              <td key={cIdx} className="px-3.5 py-2 whitespace-nowrap">
                                {col}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            }

            return (
              <p key={pIdx} className="text-xs sm:text-sm leading-relaxed text-slate-600">
                {trimmed}
              </p>
            );
          })}
        </div>
      );
    });
  };

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

          {/* Doc Header */}
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
              {doc.title}
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              {doc.description}
            </p>
          </div>

          <hr className="my-6 border-slate-100" />

          {/* Render Document Content */}
          <div className="space-y-6">{renderContent(doc.content)}</div>

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
        </main>

        {/* Right Table of Contents */}
        <TableOfContents headings={doc.headings} />
      </div>
    </div>
  );
}
