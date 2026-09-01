'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { getAllDocItems, type DocItem } from '../lib/docs-data';

interface PageNavigationProps {
  currentSlug: string;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({ currentSlug }) => {
  const router = useRouter();
  const allDocs = getAllDocItems();
  const currentIndex = allDocs.findIndex((d) => d.slug === currentSlug);

  const prevDoc: DocItem | undefined = currentIndex > 0 ? allDocs[currentIndex - 1] : undefined;
  const nextDoc: DocItem | undefined =
    currentIndex >= 0 && currentIndex < allDocs.length - 1
      ? allDocs[currentIndex + 1]
      : undefined;

  // Keyboard navigation: ArrowLeft for Prev, ArrowRight for Next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'ArrowLeft' && prevDoc) {
        const prevUrl = prevDoc.slug === 'overview' ? '/' : `/docs/${prevDoc.slug}`;
        router.push(prevUrl);
      } else if (e.key === 'ArrowRight' && nextDoc) {
        router.push(`/docs/${nextDoc.slug}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevDoc, nextDoc, router]);

  if (!prevDoc && !nextDoc) return null;

  return (
    <div className="my-12 pt-8 border-t border-slate-200/80">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Previous Page Card */}
        {prevDoc ? (
          <Link
            href={prevDoc.slug === 'overview' ? '/' : `/docs/${prevDoc.slug}`}
            className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition duration-200"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2 group-hover:text-slate-600 transition">
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition duration-150" />
              <span>Previous</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mb-1 inline-block">
                {prevDoc.category}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-black">
                {prevDoc.title}
              </h4>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {/* Next Page Card */}
        {nextDoc && (
          <Link
            href={`/docs/${nextDoc.slug}`}
            className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-stripe-indigo/20 bg-gradient-to-br from-white to-indigo-50/20 hover:border-stripe-indigo/40 hover:shadow-md transition duration-200 text-right sm:text-right"
          >
            <div className="flex items-center justify-end gap-1.5 text-xs text-stripe-indigo font-semibold mb-2">
              <span>Next Guide</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition duration-150" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-lime-100 text-slate-900 border border-lime-300 mb-1 inline-block">
                {nextDoc.category}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-stripe-indigo transition">
                {nextDoc.title}
              </h4>
            </div>
          </Link>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
        <span className="hidden sm:inline">💡 Tip: Use Left / Right arrow keys to navigate guides</span>
        <span className="ml-auto font-mono">
          Page {currentIndex + 1} of {allDocs.length}
        </span>
      </div>
    </div>
  );
};
