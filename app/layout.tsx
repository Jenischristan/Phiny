import type { Metadata, Viewport } from 'next';
import React from 'react';
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import { AppShell } from '@/components/layout/AppShell';
import { PhinyProvider } from '@/context/PhinyContext';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Phiny',
  description: 'A visual discovery, curation, and creative publishing platform.',
  openGraph: {
    title: 'Phiny',
    description: 'A visual discovery, curation, and creative publishing platform.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const themeInitScript = `
(function() {
  try {
    var t = localStorage.getItem('phiny-theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-theme', t);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <PhinyProvider>
          <AppShell>{children}</AppShell>
        </PhinyProvider>
      </body>
    </html>
  );
}
