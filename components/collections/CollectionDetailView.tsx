'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollView } from '@/components/collections/CollView';
import { Empty } from '@/components/ui/Empty';
import { useC } from '@/context/PhinyContext';
import { COLLS0, SC } from '@/data/mockData';

export function CollectionDetailView({ id }: { id: string }) {
  const router = useRouter();
  const c = useC();
  const coll =
    c.colls.find((x) => x.id === id) ||
    SC.find((x) => x.id === id) ||
    COLLS0.find((x) => x.id === id);

  if (!coll) {
    return (
      <Empty
        title="COLLECTION UNAVAILABLE."
        text="This collection may have been removed or is private."
        cta="Back to Library"
        go={() => router.push('/library')}
      />
    );
  }

  const mine = c.colls.some((x) => x.id === id);

  return (
    <CollView
      coll={coll}
      mine={mine}
      onBack={() => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
          router.back();
        } else {
          router.push('/library');
        }
      }}
    />
  );
}
