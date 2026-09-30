'use client';

import React from 'react';
import { Grid } from '@/components/feed/Grid';
import { useC } from '@/context/PhinyContext';
import { INTERESTS } from '@/data/mockData';
import { tagsOf } from '@/lib/utils';

export function ExploreView() {
  const c = useC();
  const { q, setQ, tag, setTag } = c;

  const vis = c.posts.filter(
    (p) =>
      p.by.state !== 'deactivated' &&
      !c.hidden[p.id] &&
      p.vis !== 'private' &&
      (tag === 'All' || p.tag === tag) &&
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
      <div
        className="flex gap-2 overflow-x-auto ns py-1 pr-4 mb-5"
        role="group"
        aria-label="Filter by interest"
      >
        {['All', ...INTERESTS.slice(0, 9)].map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={tag === k}
            onClick={() => setTag(k)}
            className={'btn sm shrink-0 ' + (tag === k ? 'btn-p' : 'btn-s')}
          >
            {k}
          </button>
        ))}
      </div>
      <Grid list={[...vis].reverse()} empty="Try another filter." />
    </>
  );
}
