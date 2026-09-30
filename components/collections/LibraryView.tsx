'use client';

import React, { useState } from 'react';
import { CollGrid } from '@/components/collections/CollGrid';
import { CollView } from '@/components/collections/CollView';
import { Grid } from '@/components/feed/Grid';
import { Empty } from '@/components/ui/Empty';
import { Tabs } from '@/components/ui/Tabs';
import { useC } from '@/context/PhinyContext';

export function LibraryView() {
  const c = useC();
  const [tab, setTab] = useState('Saved');
  const [oc, setOc] = useState<string | null>(null);
  const coll = c.colls.find((k) => k.id === oc);

  if (!c.me) {
    return (
      <Empty
        title="SIGNED OUT."
        text="Log in to see your library."
        cta="Log in"
        go={c.openLogin}
      />
    );
  }

  if (coll) {
    return <CollView coll={coll} mine={true} onBack={() => setOc(null)} />;
  }

  return (
    <div>
      <h1 className="sr-only">Library</h1>
      <Tabs
        tabs={['Saved', 'Collections']}
        v={tab}
        set={setTab}
        label="Library"
        right={
          tab === 'Collections' && (
            <button
              type="button"
              onClick={() => c.setCd({})}
              className="btn btn-s sm"
            >
              New collection
            </button>
          )
        }
      />
      {tab === 'Saved' ? (
        <Grid
          list={c.posts.filter((p) => c.saved[p.id])}
          empty="Save an image and it will appear here."
        />
      ) : (
        <CollGrid colls={c.colls} onOpen={setOc} />
      )}
    </div>
  );
}
