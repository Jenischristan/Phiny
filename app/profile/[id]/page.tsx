import type { Metadata } from 'next';
import React from 'react';
import { ProfileView } from '@/components/profile/ProfileView';
import { PEOPLE } from '@/data/mockData';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  if (id === 'me') {
    return {
      title: 'Your Profile | Phiny',
      description: 'Your saved collections and posts on Phiny.',
    };
  }
  const numId = /^\d+$/.test(id) ? Number(id) : null;
  const p = numId !== null ? PEOPLE.find((x) => x.id === numId) : null;
  if (!p) {
    return {
      title: 'Profile | Phiny',
      description: 'Creator profile on Phiny.',
    };
  }
  return {
    title: `${p.name} (@${p.handle}) | Phiny`,
    description: p.bio || `${p.name} on Phiny. Visual research and studies.`,
    openGraph: {
      title: `${p.name} (@${p.handle})`,
      description: p.bio || `${p.name} on Phiny.`,
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const parsedId = id === 'me' ? 'me' : /^\d+$/.test(id) ? Number(id) : id;
  return <ProfileView id={parsedId} />;
}
