import type { Metadata } from 'next';
import React from 'react';
import { CreateView } from '@/components/feed/CreateView';

export const metadata: Metadata = {
  title: 'Create | Phiny',
  description: 'Publish a new visual post to your Phiny profile and collections.',
};

export default function CreatePage() {
  return <CreateView />;
}
