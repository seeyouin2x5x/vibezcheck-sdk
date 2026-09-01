import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://docs.vibezcheck.app'),
  title: {
    default: 'vibezcheck Docs — 1-Line Stripe Billing & Token Metering for LLMs',
    template: '%s | vibezcheck Docs',
  },
  description:
    'The declarative 1-line Stripe Billing and Token Metering engine for LLMs and the Vercel AI SDK. Track tokens, extract reasoning thoughts, compute USD costs, and bill customers with 0ms added latency.',
  applicationName: 'vibezcheck',
  authors: [{ name: 'vibezcheck team', url: 'https://vibezcheck.app' }],
  keywords: [
    'vibezcheck',
    'vibezcheck.app',
    'docs.vibezcheck.app',
    'Stripe LLM billing',
    'Vercel AI SDK Stripe',
    'LLM token metering',
    'OpenAI token cost calculator',
    'Claude 3.7 reasoning tokens',
    'o3-mini thinking tokens billing',
    'AI credit wallet top-up',
    'Next.js AI billing',
    'streamText Stripe integration',
    'usage-based billing AI',
  ],
  creator: 'vibezcheck',
  publisher: 'vibezcheck',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    types: {
      'text/markdown': 'https://docs.vibezcheck.app/llms.txt',
    },
  },
  openGraph: {
    title: 'vibezcheck Docs — 1-Line Stripe Billing & Token Metering for LLMs',
    description:
      'The declarative 1-line Stripe Billing and Token Metering engine for LLMs and the Vercel AI SDK with 0ms latency.',
    url: 'https://docs.vibezcheck.app',
    siteName: 'vibezcheck Documentation',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'vibezcheck Docs — 1-Line Stripe Billing & Token Metering for LLMs',
    description:
      'The declarative 1-line Stripe Billing and Token Metering engine for LLMs with 0ms latency.',
    creator: '@vibezcheckapp',
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

const JSON_LD_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://vibezcheck.app/#organization',
      name: 'vibezcheck',
      url: 'https://vibezcheck.app',
      logo: 'https://vibezcheck.app/logo.png',
      sameAs: ['https://github.com/seeyouin2x5x/vibezcheck-sdk'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://docs.vibezcheck.app/#website',
      url: 'https://docs.vibezcheck.app',
      name: 'vibezcheck Documentation',
      description: 'The 1-Line Stripe Billing and Token Metering engine for LLMs.',
      publisher: {
        '@id': 'https://vibezcheck.app/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://docs.vibezcheck.app/docs/{search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'vibezcheck',
      operatingSystem: 'Cross-platform (Node.js, Browser, Edge)',
      applicationCategory: 'DeveloperApplication',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SCHEMA) }}
        />
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="AI Agent Scraper Context" />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
