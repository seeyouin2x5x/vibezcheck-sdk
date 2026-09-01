'use client';

import React from 'react';
import { CodeBlock } from './code-block';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Bulletproof, zero-dependency Markdown Renderer designed for tech documentation.
 * Prevents code duplication, string corruption, and mangled brackets.
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
        <ul key={`list-${elements.length}`} className="list-disc pl-5 space-y-1.5 my-4 text-xs sm:text-sm text-slate-700">
          {listItems.map((item, idx) => (
            <li key={idx}>
              {renderInlineMarkdown(item)}
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
        <div key={`table-${elements.length}`} className="overflow-x-auto my-6 rounded-xl border border-slate-200 shadow-xs">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-semibold text-slate-900">
              <tr>
                {headerRow.map((col, idx) => (
                  <th key={idx} className="px-4 py-2.5 text-left font-semibold">
                    {renderInlineMarkdown(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/70 transition">
                  {row.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-2 text-slate-700 whitespace-nowrap">
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
          {title}
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
        <h2 key={`h2-${elements.length}`} id={id} className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-8 mb-3 scroll-mt-20">
          {title}
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
        <h3 key={`h3-${elements.length}`} className="text-lg font-bold text-slate-900 mt-6 mb-2">
          {title}
        </h3>
      );
      continue;
    }

    // Blockquote (> Quote)
    if (trimmed.startsWith('> ')) {
      flushList();
      flushTable();
      const quote = trimmed.replace('> ', '').trim();
      elements.push(
        <blockquote key={`quote-${elements.length}`} className="p-4 rounded-xl bg-slate-50 border-l-4 border-slate-900 text-slate-700 my-4 text-xs sm:text-sm leading-relaxed">
          {renderInlineMarkdown(quote)}
        </blockquote>
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
      // Ignore separator row (| :--- | :--- |)
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
      <p key={`p-${elements.length}`} className="text-xs sm:text-sm leading-relaxed text-slate-600 my-3">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  }

  flushList();
  flushTable();

  return <div className="space-y-2">{elements}</div>;
};

/**
 * Safely renders inline markdown (**bold**, `code`, [link](url)) without regex mangling.
 */
function renderInlineMarkdown(text: string): React.ReactNode {
  // Regex splitting by bold, inline code, or link
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 font-mono text-[11px] sm:text-xs border border-slate-200/80">
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        const [, label, url] = match;
        return (
          <a key={idx} href={url} className="text-indigo-600 hover:text-indigo-800 underline font-medium">
            {label}
          </a>
        );
      }
    }

    return part;
  });
}
