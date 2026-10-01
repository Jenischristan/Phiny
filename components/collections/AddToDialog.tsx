'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { toast } from '@/components/ui/Toaster';
import { useC } from '@/context/PhinyContext';

export function AddToDialog() {
  const c = useC();
  const id = c.addTo;
  const [n, setN] = useState('');

  return (
    <Dialog
      open={id != null}
      onClose={() => c.setAddTo(null)}
      label="Add to collection"
      desc="Choose the collections for this post."
    >
      <h2 className="text-2xl font-bold mb-6">Add to collection</h2>
      <ul className="border border-line divide-y divide-line">
        {c.colls.map((k) => {
          const on = id != null && k.pins.some((pinId) => String(pinId) === String(id));
          return (
            <li key={k.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => id != null && c.addToggle(k.id, id)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-sub"
              >
                <span>
                  {k.name}
                  {k.priv ? ' (private)' : ''}
                </span>
                <span className="lbl">{on ? 'Added' : 'Add'}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (n.trim().length < 2 || id == null) return;
          c.setColls((cs) => [
            ...cs,
            { id: 'c' + Date.now(), name: n.trim(), priv: false, pins: [id] },
          ]);
          toast('Added to “' + n.trim() + '”');
          setN('');
        }}
        className="flex gap-2 mt-4"
      >
        <label htmlFor="nc" className="sr-only">
          New collection name
        </label>
        <input
          id="nc"
          value={n}
          onChange={(e) => setN(e.target.value)}
          placeholder="New collection"
          className="inp"
        />
        <button type="submit" className="btn btn-s">
          Create
        </button>
      </form>
    </Dialog>
  );
}
