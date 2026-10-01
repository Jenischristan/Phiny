import type { Metadata } from 'next';
import React from 'react';
import { CollectionDetailView } from '@/components/collections/CollectionDetailView';
import { COLLS0, SC } from '@/data/mockData';

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { id } = await params;
  const coll = COLLS0.find((x) => x.id === id) || SC.find((x) => x.id === id);
  if (!coll) {
    return {
      title: 'Collection | Phiny',
      description: 'Curated visual collection on Phiny.',
    };
  }
  return {
    title: `${coll.name} | Phiny`,
    description: `Curated collection with ${coll.pins.length} visual studies on Phiny.`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id } = await params;
  return <CollectionDetailView id={id} />;
}
