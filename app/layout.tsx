import type { Metadata, Viewport } from 'next';
import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PhinyProvider } from '@/context/PhinyContext';
import './globals.css';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
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
