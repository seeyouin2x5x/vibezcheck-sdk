'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

const KEYWORDS = new Set([
  'import', 'export', 'from', 'const', 'let', 'var', 'return', 'async',
  'await', 'function', 'default', 'type', 'interface', 'class', 'extends',
  'new', 'if', 'else', 'switch', 'case', 'break', 'try', 'catch', 'finally'
]);

const SDK_FUNCTIONS = new Set([
  'vibezcheck', 'streamText', 'generateText', 'generateObject', 'streamObject',
  'createOpenAI', 'createAnthropic', 'useVibezChat', 'useVibezSession',
  'useVibez', 'VibezSessionProvider', 'VibezSessionWidget', 'VibezBillingModal',
  'toDataStreamResponse', 'toTextStreamResponse', 'getOrCreate', 'createCheckoutSession'
]);

const TYPES = new Set([
  'Request', 'Response', 'Promise', 'Record', 'string', 'number', 'boolean',
  'any', 'void', 'UsageEvent', 'DocItem', 'TokenUsage', 'InferenceCost', 'VibezChatMessage'
]);

/**
 * Tokenize a single line of code into safe React JSX tokens without dangerous regex HTML injection.
 */
function renderHighlightedLine(line: string, lineIndex: number): React.ReactNode {
  const trimmed = line.trim();

  // Full comment line
  if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
    return (
      <span key={lineIndex} className="text-slate-500 italic">
        {line}
      </span>
    );
  }

  // Tokenize line using regex matcher for strings, words, numbers, and symbols
  const tokenRegex = /('(?:\\'|[^'])*'|"(?:\\"|[^"])*"|`(?:\\`|[^`])*`|\b[a-zA-Z_$][a-zA-Z0-9_$]*\b|\b\d+(?:\.\d+)?\b|[^\s\w]+|\s+)/g;
  const tokens: string[] = line.match(tokenRegex) || [line];

  return (
    <span key={lineIndex}>
      {tokens.map((token, tokenIdx) => {
        // String literal
        if (
          (token.startsWith("'") && token.endsWith("'")) ||
          (token.startsWith('"') && token.endsWith('"')) ||
          (token.startsWith('`') && token.endsWith('`'))
        ) {
          return (
            <span key={tokenIdx} className="text-emerald-400">
              {token}
            </span>
          );
        }

        // Keywords
        if (KEYWORDS.has(token)) {
          return (
            <span key={tokenIdx} className="text-pink-400 font-semibold">
              {token}
            </span>
          );
        }

        // SDK Methods & Hooks
        if (SDK_FUNCTIONS.has(token)) {
          return (
            <span key={tokenIdx} className="text-sky-400 font-semibold">
              {token}
            </span>
          );
        }

        // Types
        if (TYPES.has(token)) {
          return (
            <span key={tokenIdx} className="text-teal-300">
              {token}
            </span>
          );
        }

        // Numbers & Booleans
        if (/^\d+(\.\d+)?$/.test(token) || token === 'true' || token === 'false') {
          return (
            <span key={tokenIdx} className="text-amber-400">
              {token}
            </span>
          );
        }

        // Default text / punctuation / whitespace
        return (
          <span key={tokenIdx} className="text-slate-200">
            {token}
          </span>
        );
      })}
    </span>
  );
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="relative my-5 rounded-xl border border-slate-800 bg-[#090a0f] overflow-hidden text-sm font-mono shadow-md">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-[#0e1017] text-xs text-slate-400 select-none">
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

      {/* Code contents with separate unselectable gutter */}
      <div className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono flex">
        {showLineNumbers && (
          <div
            aria-hidden="true"
            className="select-none pr-4 mr-3 text-right text-slate-600 border-r border-slate-800/80 text-xs font-mono select-none"
            style={{ userSelect: 'none' }}
          >
            {lines.map((_, idx) => (
              <div key={idx} className="leading-relaxed opacity-50">
                {idx + 1}
              </div>
            ))}
          </div>
        )}

        <pre className="!bg-transparent !p-0 !m-0 font-mono flex-1 overflow-x-auto">
          <code>
            {lines.map((line, idx) => (
              <div key={idx} className="leading-relaxed whitespace-pre">
                {renderHighlightedLine(line, idx)}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};
