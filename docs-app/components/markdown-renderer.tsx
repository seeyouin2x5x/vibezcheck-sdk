'use client';

import React from 'react';
import { CodeBlock } from './code-block';
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Outcome-driven, zero-dependency Markdown Renderer.
 * Features Electric Lime marker highlights (==text==), soft pill badges, and clean spacing.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const elements: React.ReactNode[] = [];
  const lines = content.split('\n');

  let inCodeBlock = false;
  let codeBlockLang = 'typescript';
  let codeBlockFilename: string | undefined = undefined;
  let codeBlockLines: string[] = [];

  let inList = false;
  let listItems: string[] = [];

  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-2.5 my-4 pl-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <span className="h-5 w-5 rounded-full bg-lime-100 text-slate-900 border border-lime-300 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                ✓
              </span>
              <span className="flex-1">{renderInlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (inTable && tableRows.length > 0) {
      const headerRow = tableRows[0];
      const bodyRows = tableRows.slice(1);

      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-6 rounded-2xl border border-slate-200/80 shadow-xs bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-cream-100/60 font-semibold text-slate-900">
              <tr>
                {headerRow.map((col, idx) => (
                  <th key={idx} className="px-4 py-3 text-left font-semibold text-slate-900">
                    {renderInlineMarkdown(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-cream-50/50 transition">
                  {row.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-2.5 text-slate-700 whitespace-nowrap">
                      {renderInlineMarkdown(col)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check for code fence start/end
    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        // Start code block
        flushList();
        flushTable();
        inCodeBlock = true;
        codeBlockLines = [];

        const meta = trimmed.replace('```', '').trim();
        if (meta.includes(':')) {
          const [lang, file] = meta.split(':');
          codeBlockLang = lang || 'typescript';
          codeBlockFilename = file;
        } else {
          codeBlockLang = meta || 'typescript';
          codeBlockFilename = undefined;
        }
      } else {
        // End code block
        inCodeBlock = false;
        elements.push(
          <CodeBlock
            key={`code-${elements.length}`}
            code={codeBlockLines.join('\n')}
            language={codeBlockLang}
            filename={codeBlockFilename}
          />
        );
        codeBlockLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Empty line
    if (!trimmed) {
      flushList();
      flushTable();
      continue;
    }

    // Heading 1 (# Heading)
    if (trimmed.startsWith('# ')) {
      flushList();
      flushTable();
      const title = trimmed.replace('# ', '').trim();
      elements.push(
        <h1 key={`h1-${elements.length}`} className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 mt-4 mb-3">
          {renderInlineMarkdown(title)}
        </h1>
      );
      continue;
    }

    // Heading 2 (## Heading)
    if (trimmed.startsWith('## ')) {
      flushList();
      flushTable();
      const title = trimmed.replace('## ', '').trim();
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      elements.push(
        <h2 key={`h2-${elements.length}`} id={id} className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-10 mb-3 scroll-mt-20">
          {renderInlineMarkdown(title)}
        </h2>
      );
      continue;
    }

    // Heading 3 (### Heading)
    if (trimmed.startsWith('### ')) {
      flushList();
      flushTable();
      const title = trimmed.replace('### ', '').trim();
      elements.push(
        <h3 key={`h3-${elements.length}`} className="text-base sm:text-lg font-bold text-slate-900 mt-6 mb-2">
          {renderInlineMarkdown(title)}
        </h3>
      );
      continue;
    }

    // Blockquote (> Quote) - Warm Cream & Stripe Indigo Style
    if (trimmed.startsWith('> ')) {
      flushList();
      flushTable();
      const quote = trimmed.replace('> ', '').trim();
      elements.push(
        <div key={`quote-${elements.length}`} className="p-4 sm:p-5 rounded-2xl bg-cream-100/70 border-l-4 border-stripe-indigo text-slate-800 my-5 text-xs sm:text-sm leading-relaxed shadow-xs">
          {renderInlineMarkdown(quote)}
        </div>
      );
      continue;
    }

    // Unordered List (* item or - item)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      flushTable();
      inList = true;
      listItems.push(trimmed.replace(/^[\*\-]\s+/, ''));
      continue;
    }

    // Table rows (| col 1 | col 2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (trimmed.includes('---')) {
        continue;
      }
      flushList();
      inTable = true;
      const cols = trimmed
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());
      tableRows.push(cols);
      continue;
    }

    // Standard paragraph
    flushList();
    flushTable();
    elements.push(
      <p key={`p-${elements.length}`} className="text-xs sm:text-sm leading-relaxed text-slate-600 my-3.5">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  }

  flushList();
  flushTable();

  return <div className="space-y-1">{elements}</div>;
};

/**
 * Safely renders inline markdown:
 * - ==highlighter== -> Electric Lime Marker
 * - `code` -> Clean soft pill badge without raw backticks
 * - **bold** -> Semi-bold dark text
 * - [link](url) -> Stripe Indigo Link
 */
function renderInlineMarkdown(text: string): React.ReactNode {
  // Regex splitting by marker ==...==, bold **...**, inline code `...`, or link [...]()
  const parts = text.split(/(==.*?==|\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);

  return parts.map((part, idx) => {
    // Electric Lime Marker Highlighter (from user illustration)
    if (part.startsWith('==') && part.endsWith('==')) {
      return (
        <mark key={idx} className="bg-lime-400 text-slate-950 font-bold px-1.5 py-0.5 rounded-sm mx-0.5 selection:bg-slate-950 selection:text-white">
          {part.slice(2, -2)}
        </mark>
      );
    }

    // Bold text
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Clean inline code pill badge (ZERO raw backticks leaking)
    if (part.startsWith('`') && part.endsWith('`')) {
      const cleanCode = part.slice(1, -1).replace(/^`+|`+$/g, '');
      return (
        <code key={idx} className="px-2 py-0.5 mx-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-[11px] sm:text-xs border border-slate-200/80 font-medium">
          {cleanCode}
        </code>
      );
    }

    // Links
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        const [, label, url] = match;
        return (
          <a key={idx} href={url} className="text-stripe-indigo hover:text-indigo-800 font-semibold underline decoration-stripe-indigo/40 hover:decoration-stripe-indigo transition">
            {label}
          </a>
        );
      }
    }

    // Clean any stray literal backticks from raw unclosed markdown
    const sanitized = part.replace(/`/g, '');
    return sanitized;
  });
}
