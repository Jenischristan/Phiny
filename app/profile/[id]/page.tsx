import React from 'react';
import { ProfileView } from '@/components/profile/ProfileView';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const parsedId = id === 'me' ? 'me' : /^\d+$/.test(id) ? Number(id) : id;
  return <ProfileView id={parsedId} />;
}
