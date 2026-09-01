'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DOC_SECTIONS } from '../lib/docs-data';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white pt-16 pb-8 px-4 overflow-y-auto lg:static lg:block transition-transform duration-200 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <nav className="space-y-6 text-xs">
        {DOC_SECTIONS.map((section) => (
          <div key={section.id}>
            <div className="flex items-center justify-between font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-2 px-2">
              <span>{section.title}</span>
              {section.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                  {section.badge}
                </span>
              )}
            </div>

            <ul className="space-y-1">
              {section.items.map((item) => {
                const href = item.slug === 'overview' ? '/' : `/docs/${item.slug}`;
                const isActive = pathname === href || (item.slug === 'overview' && pathname === '/');

                return (
                  <li key={item.slug}>
                    <Link
                      href={href}
                      onClick={onCloseMobile}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition font-medium ${
                        isActive
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            item.badge === 'New'
                              ? 'bg-purple-50 text-purple-700 border border-purple-100'
                              : item.badge === 'Safety'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};
