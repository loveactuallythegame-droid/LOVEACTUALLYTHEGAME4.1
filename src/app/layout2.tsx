import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'animate.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Love, Actually... The Game - How About We DON\'T Break Up?',
  description: 'Interactive couples therapy gaming platform with Dr. Marcie Liss - Transform relationship healing into an engaging, competitive experience.',
  keywords: 'couples therapy, relationship games, Dr. Marcie, interactive therapy, love game, relationship improvement',
  authors: [{ name: 'Love Actually Game Team' }],
  openGraph: {
    title: 'Love, Actually... The Game',
    description: 'How About We DON\'T Break Up? - Interactive Couples Gaming Platform',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Love, Actually... The Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Love, Actually... The Game',
    description: 'How About We DON\'T Break Up? - Interactive Couples Gaming Platform',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ec4899' },
    { media: '(prefers-color-scheme: dark)', color: '#be185d' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
