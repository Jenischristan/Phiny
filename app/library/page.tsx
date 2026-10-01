import type { Metadata } from 'next';
import React from 'react';
import { LibraryView } from '@/components/collections/LibraryView';

export const metadata: Metadata = {
  title: 'Library | Phiny',
  description: 'Your saved visual studies, collections, and mood boards.',
};

export default function LibraryPage() {
  return <LibraryView />;
}
