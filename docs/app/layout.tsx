import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://vibezcheck.app'),
  title: {
    default: 'VibezCheck — AI Cost Monitoring & LLM Usage Metering',
    template: '%s | VibezCheck',
  },
  description:
    'Track AI usage and calculate LLM costs in real dollars. VibezCheck adds TypeScript AI cost monitoring, token metering, spend limits, and usage events.',
  alternates: {
    canonical: 'https://vibezcheck.app/',
    types: {
      'text/plain': 'https://vibezcheck.app/llms.txt',
    },
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vibezcheck.app/',
    siteName: 'VibezCheck',
    title: 'VibezCheck — Know What Every AI Request Costs',
    description:
      'AI cost monitoring and LLM usage metering for developers. Measure costs, control AI spending, and connect usage to revenue.',
    images: [
      {
        url: '/release-v055.jpg',
        width: 1200,
        height: 630,
        alt: 'VibezCheck — AI Cost Monitoring & LLM Usage Metering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibezCheck — Know What Every AI Request Costs',
    description:
      'AI cost monitoring, LLM usage metering, and spending controls for developers.',
    images: ['/release-v055.jpg'],
    creator: '@vibezcheck',
  },
};

// JSON-LD Structured Data for AEO & Entity Graph (Spec Sections 19 & 37)
const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://vibezcheck.app/#organization',
      name: 'VibezCheck',
      url: 'https://vibezcheck.app/',
      logo: 'https://vibezcheck.app/release-v055.jpg',
      email: 'yt@vibezcheck.app',
      sameAs: [
        'https://www.npmjs.com/package/vibezcheck',
        'https://github.com/seeyouin2x5x/vibezcheck-sdk',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://vibezcheck.app/#website',
      url: 'https://vibezcheck.app/',
      name: 'VibezCheck',
      publisher: {
        '@id': 'https://vibezcheck.app/#organization',
      },
    },
    {
      '@type': 'SoftwareSourceCode',
      '@id': 'https://vibezcheck.app/#software',
      name: 'VibezCheck',
      description:
        'TypeScript SDK for AI cost monitoring, LLM usage metering, cost calculation, and AI spending limits.',
      codeRepository: 'https://github.com/seeyouin2x5x/vibezcheck-sdk',
      programmingLanguage: 'TypeScript',
      runtimePlatform: 'Node.js',
      license: 'https://opensource.org/licenses/MIT',
      url: 'https://vibezcheck.app/',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#0c0d10] text-slate-900 dark:text-zinc-100 antialiased transition-colors duration-200">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
