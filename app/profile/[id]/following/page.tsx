import React from 'react';
import { PeopleView } from '@/components/profile/PeopleView';

interface FollowingPageProps {
  params: Promise<{ id: string }>;
}

export default async function FollowingPage({ params }: FollowingPageProps) {
  const { id } = await params;
  const parsedId = id === 'me' ? 'me' : /^\d+$/.test(id) ? Number(id) : id;
  return <PeopleView type="following" id={parsedId} />;
}
