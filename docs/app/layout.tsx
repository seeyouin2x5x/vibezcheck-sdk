import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://vibezcheck.dev'),
  title: {
    default: 'VibezCheck — Zero-Latency AI Cost Metering, FinOps & Safety Fuse for LLMs',
    template: '%s | VibezCheck',
  },
  description:
    'In-process token cost calculator, circuit breaker, and usage-based billing engine for Next.js, Vercel AI SDK, and autonomous agents. 0ms added latency, 100% Zero Data Retention, pre-bundled rates for 700+ models.',
  keywords: [
    'AI FinOps',
    'LLM token cost calculator',
    'Vercel AI SDK metering',
    'stop runaway agent loops',
    'Metronome AI billing',
    'Stripe token billing',
    'Claude 3.7 reasoning tokens',
    'DeepSeek R1 pricing',
    'OpenAI o1 token pricing',
    'prompt caching discounts',
    'AI circuit breaker',
    'Zero Data Retention AI',
    'llms.txt',
    'cursorrules AI SDK',
  ],
  authors: [{ name: 'VibezCheck Team', url: 'https://vibezcheck.dev' }],
  creator: 'VibezCheck',
  publisher: 'VibezCheck',
  alternates: {
    canonical: 'https://vibezcheck.dev',
    types: {
      'text/plain': 'https://vibezcheck.dev/llms.txt',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vibezcheck.dev',
    siteName: 'VibezCheck',
    title: 'VibezCheck — Zero-Latency AI Cost Metering, FinOps & Safety Fuse for LLMs',
    description:
      'Measure every token, calculate exact real-time costs, and stream usage to Metronome or your database with 0ms added latency and 100% Zero Data Retention.',
    images: [
      {
        url: '/release-v055.jpg',
        width: 1200,
        height: 630,
        alt: 'VibezCheck AI FinOps & Zero-Latency Token Metering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibezCheck — Zero-Latency AI Cost Metering, FinOps & Safety Fuse for LLMs',
    description:
      'In-process token cost calculator, circuit breaker, and usage-based billing engine for Next.js and Vercel AI SDK.',
    images: ['/release-v055.jpg'],
    creator: '@vibezcheck',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// JSON-LD Structured Data for AEO (Answer Engine Optimization)
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://vibezcheck.dev/#software',
      name: 'VibezCheck',
      url: 'https://vibezcheck.dev',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Node.js, Bun, Edge Runtimes',
      softwareVersion: '0.5.10',
      license: 'https://opensource.org/licenses/MIT',
      description:
        'Zero-latency token metering, profit margin, and usage-based billing engine for Large Language Model applications and Vercel AI SDK.',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      featureList: [
        '0ms Added Streaming Latency',
        '100% Zero Data Retention (ZDR)',
        'Automatic Runaway Agent Circuit Breaker',
        'Offline Rate Cards for 700+ Models',
        'Native Metronome and Supabase Ledgers',
        'Reasoning Token and Prompt Cache Awareness',
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://vibezcheck.dev/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is VibezCheck?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'VibezCheck is an in-process TypeScript/JavaScript library for Large Language Model (LLM) applications. It tracks token usage, calculates real-time micro-cent costs, prevents runaway recursive agent loops with safety fuses, and spools usage events to Metronome, Stripe, or PostgreSQL/Supabase with 0ms added streaming latency.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does VibezCheck add latency to AI streaming responses?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. VibezCheck adds 0ms of latency because it executes in-process inside your application runtime (Node.js, Bun, Edge) rather than routing through an external proxy server. All telemetry is flushed asynchronously in background microtasks.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does VibezCheck stop runaway agent loops?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'VibezCheck includes an automatic circuit breaker via maxCost and vibezcheck.stopWhen(session, budgetUSD). If an autonomous agent enters an infinite loop or exceeds its allocated dollar limit, VibezCheck instantly severs the stream to prevent surprise bills.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does VibezCheck store or read user prompts?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. VibezCheck operates with 100% Zero Data Retention (ZDR). It only inspects token numbers, model IDs, and timestamps. User prompts and AI completions are never saved, stored, or sent to external telemetry servers.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
