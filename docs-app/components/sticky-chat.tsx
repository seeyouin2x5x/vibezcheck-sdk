'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Coins,
  Wallet,
  Volume2,
} from 'lucide-react';
import { PromptInput } from './ai-elements/prompt-input';

export interface StickyChatProps {
  input: string;
  setInput: (val: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onStop?: () => void;
  isLoading?: boolean;
  onChipClick?: (prompt: string) => void;
  placeholder?: string;
  placeholderMessages?: string[];
}

export const DEFAULT_PLACEHOLDER_MESSAGES = [
  'How can I help you track margins today?',
  'How can I help you meter tokens today?',
  'How can I help you bill users today?',
  'How can I help you stream AI today?',
  'How can I help you request payment today?',
  'Check real-time wholesale costs for Claude Opus...',
  'Top up credits or configure profit margins...',
];

/**
 * Animated typewriter hook: types forward pretty fast, pauses, deletes backward, and switches to next message.
 */
function useTypewriter({
  messages = DEFAULT_PLACEHOLDER_MESSAGES,
  typingSpeed = 38,
  deletingSpeed = 18,
  pauseDuration = 1800,
  pauseBeforeNext = 300,
  enabled = true,
}: {
  messages?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  pauseBeforeNext?: number;
  enabled?: boolean;
}) {
  const [displayText, setDisplayText] = useState(messages[0] || '');
  const [msgIndex, setMsgIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!enabled || messages.length <= 1) return;

    const currentFullText = messages[msgIndex % messages.length];

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentFullText.length) {
        timer = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Paused at full message
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        // Finished deleting, transition to next message
        timer = setTimeout(() => {
          setIsDeleting(false);
          setMsgIndex((prev) => (prev + 1) % messages.length);
        }, pauseBeforeNext);
      }
    }

    return () => clearTimeout(timer);
  }, [
    displayText,
    isDeleting,
    msgIndex,
    messages,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    pauseBeforeNext,
    enabled,
  ]);

  return displayText;
}

export function StickyChat({
  input,
  setInput,
  onSubmit,
  onStop,
  isLoading = false,
  onChipClick,
  placeholder,
  placeholderMessages = DEFAULT_PLACEHOLDER_MESSAGES,
}: StickyChatProps) {
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);

  // Animate typewriter placeholder when user hasn't typed their own input
  const animatedPlaceholder = useTypewriter({
    messages: placeholder ? [placeholder] : placeholderMessages,
    typingSpeed: 38,
    deletingSpeed: 18,
    pauseDuration: 1800,
    pauseBeforeNext: 300,
    enabled: !input && !placeholder, // If a static placeholder is given, keep static; otherwise animate
  });

  const activePlaceholder = placeholder || animatedPlaceholder || 'How can I help you track margins today?';

  const chips = [
    {
      id: 'account',
      label: 'Account',
      icon: User,
      prompt: 'Show my account details and API keys',
    },
    {
      id: 'credits',
      label: 'Buy Credits',
      icon: Coins,
      prompt: 'Top up $50 credits via Stripe checkout',
    },
    {
      id: 'balance',
      label: 'Balance 147',
      icon: Wallet,
      prompt: 'Check remaining balance and profit margins',
    },
    {
      id: 'voice',
      label: 'Voice',
      icon: Volume2,
      prompt: 'Activate voice router mode',
    },
  ];

  const handleChipSelect = (prompt: string) => {
    if (onChipClick) {
      onChipClick(prompt);
    } else {
      setInput(prompt);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-40">
      <PromptInput
        value={input}
        onChange={setInput}
        onSubmit={onSubmit}
        onStop={onStop}
        isLoading={isLoading}
        placeholder={activePlaceholder}
        onVoiceToggle={() => setIsVoiceActive(!isVoiceActive)}
        isVoiceActive={isVoiceActive}
      >
        {/* Bottom Quick-Action Chips Row (Matching Screenshot) */}
        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar px-1 py-0.5">
          {chips.map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChipSelect(chip.prompt)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition whitespace-nowrap cursor-pointer shrink-0"
              >
                <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </PromptInput>
    </div>
  );
}

export default StickyChat;
