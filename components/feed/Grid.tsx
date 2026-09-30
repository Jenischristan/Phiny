'use client';

import React from 'react';
import { ImageCard } from '@/components/feed/ImageCard';
import { Empty } from '@/components/ui/Empty';
import { useC } from '@/context/PhinyContext';
import { MenuItemTuple, Post } from '@/types';

interface GridProps {
  list: Post[];
  extra?: ((p: Post) => MenuItemTuple[]) | null;
  empty?: string;
}

export function Grid({ list, extra, empty = 'Nothing here yet.' }: GridProps) {
  const c = useC();
  return list.length ? (
    <div className="columns-1 min-[360px]:columns-2 lg:columns-3 xl:columns-4 min-[1900px]:columns-5 gap-4 md:gap-6">
      {list.map((p) => (
        <ImageCard key={p.id} pin={p} extra={extra ? extra(p) : []} />
      ))}
    </div>
  ) : (
    <Empty
      title="NOTHING FOUND."
      text={empty}
      cta="Explore"
      go={() => c.go('explore')}
    />
  );
}
