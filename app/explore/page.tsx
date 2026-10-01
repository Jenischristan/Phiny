import type { Metadata } from 'next';
import React from 'react';
import { ExploreView } from '@/components/feed/ExploreView';

export const metadata: Metadata = {
  title: 'Explore | Phiny',
  description: 'Explore visual themes, architecture, design, typography, and creative disciplines.',
};

export default function ExplorePage() {
  return <ExploreView />;
}
