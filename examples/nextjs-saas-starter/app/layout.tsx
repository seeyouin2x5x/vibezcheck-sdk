import type { Metadata } from 'next';
import './globals.css';
import { VibezSessionProvider } from 'vibezcheck/react';

export const metadata: Metadata = {
  title: 'AI SaaS Starter • Metered with VibezCheck & Stripe',
  description: 'Production-ready Next.js 15 template with 1-line token metering, 0ms added latency, and Stripe billing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafaf9] text-stone-900 antialiased selection:bg-[#D4FF32] selection:text-black">
        <VibezSessionProvider>
          {children}
        </VibezSessionProvider>
      </body>
    </html>
  );
}
