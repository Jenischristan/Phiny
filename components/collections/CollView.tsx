'use client';

import React from 'react';
import { Grid } from '@/components/feed/Grid';
import { Icon } from '@/components/ui/Icon';
import { Menu } from '@/components/ui/Menu';
import { toast } from '@/components/ui/Toaster';
import { useC } from '@/context/PhinyContext';
import { Collection, Post } from '@/types';

interface CollViewProps {
  coll: Collection;
  onBack: () => void;
  mine: boolean;
}

export function CollView({ coll, onBack, mine }: CollViewProps) {
  const c = useC();
  const list = coll.pins
    .map((id) => c.posts.find((x) => String(x.id) === String(id)))
    .filter((x): x is Post => Boolean(x));

  return (
    <div>
      <button type="button" onClick={onBack} className="btn btn-s sm mb-4">
        <Icon n="arrow" c="w-4 h-4 rotate-180" />
        Back
      </button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {coll.name}
          </h1>
          <p className="text-sm text-mut">
            {list.length} posts
            {coll.priv ? ' · Private' : ''}
          </p>
        </div>
        {mine && (
          <Menu
            label="Collection options"
            items={[
              [
                'Rename or change privacy',
                'pencil',
                () => c.setCd({ coll }),
              ],
              [
                'Delete collection',
                'trash',
                () => {
                  c.setColls((cs) => cs.filter((x) => x.id !== coll.id));
                  onBack();
                  toast('Collection deleted');
                },
              ],
            ]}
          />
        )}
      </div>
      <Grid
        list={list}
        empty="Add posts from the ⋯ menu on any image."
        extra={
          mine
            ? (p) => [
                [
                  'Remove from collection',
                  'x',
                  () => c.removeFrom(coll.id, p.id),
                ],
              ]
            : null
        }
      />
    </div>
  );
}
