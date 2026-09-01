'use client';

import React, { useEffect, useState } from 'react';
import { AlignLeft } from 'lucide-react';

interface TOCProps {
  headings: { id: string; title: string; level: number }[];
}

export const TableOfContents: React.FC<TOCProps> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0% 0% -70% 0%' }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  return (
    <div className="hidden xl:block w-56 shrink-0 py-8 pl-4 pr-6 text-xs sticky top-14 self-start max-h-[calc(100vh-3.5rem)] overflow-y-auto">
      <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
        <AlignLeft className="h-3.5 w-3.5 text-slate-400" />
        <span>On this page</span>
      </div>

      <nav className="space-y-2">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`block transition truncate py-0.5 ${
              activeId === h.id
                ? 'text-slate-900 font-semibold pl-2 border-l-2 border-slate-900'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {h.title}
          </a>
        ))}
      </nav>
    </div>
  );
};
