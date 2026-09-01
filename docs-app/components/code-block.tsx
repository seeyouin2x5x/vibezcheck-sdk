'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

/**
 * Lightweight, zero-dependency, ultra-fast syntax colorizer for TypeScript, Bash, JSON, and React.
 */
function highlightCode(code: string, language: string = 'typescript') {
  if (language === 'bash' || language === 'sh') {
    return code.split('\n').map((line, lineIdx) => {
      if (line.startsWith('#')) {
        return <span key={lineIdx} className="text-slate-500 italic">{line}</span>;
      }
      if (line.startsWith('npm') || line.startsWith('pnpm') || line.startsWith('npx')) {
        const parts = line.split(' ');
        return (
          <span key={lineIdx}>
            <span className="text-pink-400 font-bold">{parts[0]}</span>{' '}
            <span className="text-sky-300">{parts[1]}</span>{' '}
            <span className="text-emerald-300">{parts.slice(2).join(' ')}</span>
          </span>
        );
      }
      return <span key={lineIdx} className="text-slate-200">{line}</span>;
    });
  }

  // Tokenize line by line for vibrant developer colors
  const lines = code.split('\n');

  return lines.map((line, lineIdx) => {
    // Single line comments
    if (line.trim().startsWith('//')) {
      return (
        <div key={lineIdx} className="text-slate-500 italic">
          {line}
        </div>
      );
    }

    // Regex token replacement for syntax colors
    const highlighted = line
      // Strings in emerald
      .replace(/(['"`])(.*?)\1/g, '<span class="text-emerald-400">$1$2$1</span>')
      // Keywords in pink / purple
      .replace(
        /\b(import|export|from|const|let|var|return|async|await|function|default|type|interface|class|extends|new|if|else|switch|case|break)\b/g,
        '<span class="text-pink-400 font-semibold">$1</span>'
      )
      // Special SDK functions & hooks in cyan
      .replace(
        /\b(vibezcheck|streamText|generateText|generateObject|streamObject|createOpenAI|createAnthropic|useVibezChat|useVibezSession|defineAdapter|getOrCreate|createCheckoutSession)\b/g,
        '<span class="text-sky-400 font-semibold">$1</span>'
      )
      // Core types in teal
      .replace(
        /\b(Request|Response|Promise|Record|string|number|boolean|any|void|UsageEvent|DocItem|TokenUsage|InferenceCost)\b/g,
        '<span class="text-teal-300">$1</span>'
      )
      // Booleans & Numbers in amber
      .replace(/\b(true|false|null|undefined|\d+(\.\d+)?)\b/g, '<span class="text-amber-400">$1</span>')
      // JSX Tags in violet
      .replace(/(&lt;|<\/?)(\w+)(.*?)(&gt;|>)/g, '<span class="text-indigo-400 font-medium">$1$2$3$4</span>');

    return (
      <div
        key={lineIdx}
        dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }}
        className="text-slate-200"
      />
    );
  });
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  filename,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  return (
    <div className="relative my-4 rounded-xl border border-slate-800 bg-[#090a0f] overflow-hidden text-sm font-mono shadow-md">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-[#0e1017] text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-sky-400" />
          <span className="text-slate-300 font-medium font-mono">{filename || language}</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-800 transition shadow-xs"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code contents */}
      <div className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono">
        <pre className="!bg-transparent !p-0 !m-0 font-mono">
          <code>{highlightCode(code.trim(), language)}</code>
        </pre>
      </div>
    </div>
  );
};
