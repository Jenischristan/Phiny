'use client';

import React from 'react';
import { Grid } from '@/components/feed/Grid';
import { useC } from '@/context/PhinyContext';
import { tagsOf } from '@/lib/utils';

export function HomeView() {
  const c = useC();
  const { q, setQ } = c;

  const vis = c.posts.filter(
    (p) =>
      p.by.state !== 'deactivated' &&
      !c.hidden[p.id] &&
      p.vis !== 'private' &&
      (p.title + p.by.name + tagsOf(p).join(' '))
        .toLowerCase()
        .includes(q.replace(/^#/, '').toLowerCase())
  );

  return (
    <>
      {q && (
        <p className="flex items-center gap-3 mb-6">
          <span className="lbl">Results for “{q}”</span>
          <button
            type="button"
            onClick={() => setQ('')}
            className="text-xs underline underline-offset-4"
          >
            Clear
          </button>
        </p>
      )}
      <Grid list={vis} empty="Try another search." />
    </>
  );
}
