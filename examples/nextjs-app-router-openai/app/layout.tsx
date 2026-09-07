import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI SDK + Next.js App Router + VibezCheck',
  description: 'Getting Started with AI SDK, Next.js App Router, OpenAI and VibezCheck Token Metering',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
