import React from 'react';
import { PeopleView } from '@/components/profile/PeopleView';

interface FollowersPageProps {
  params: Promise<{ id: string }>;
}

export default async function FollowersPage({ params }: FollowersPageProps) {
  const { id } = await params;
  const parsedId = id === 'me' ? 'me' : /^\d+$/.test(id) ? Number(id) : id;
  return <PeopleView type="followers" id={parsedId} />;
}
