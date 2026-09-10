import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VibezCheck AI Router — Next.js Copilot',
  description: 'AI SDK + VibezCheck with Sticky Bottom Router Chat & Real-Time Token Telemetry',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
