import React from 'react';
import { PostView } from '@/components/feed/PostView';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const parsedId = /^\d+$/.test(id) ? Number(id) : id;
  return <PostView id={parsedId} />;
}
