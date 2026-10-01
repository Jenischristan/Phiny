import type { Metadata } from 'next';
import React from 'react';
import { PostView } from '@/components/feed/PostView';
import { PINS } from '@/data/mockData';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const p = PINS.find((x) => String(x.id) === String(id));
  if (!p) {
    return {
      title: 'Post Not Found | Phiny',
      description: 'The requested visual post could not be found.',
    };
  }
  return {
    title: `${p.title} by ${p.by.name} | Phiny`,
    description: p.desc || `Curated visual post by ${p.by.name} (@${p.by.handle}) on Phiny.`,
    openGraph: {
      title: `${p.title} by ${p.by.name}`,
      description: p.desc || `Curated visual post by ${p.by.name} on Phiny.`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${p.title} by ${p.by.name}`,
      description: p.desc || `Curated visual post by ${p.by.name} on Phiny.`,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const parsedId = /^\d+$/.test(id) ? Number(id) : id;
  return <PostView id={parsedId} />;
}
