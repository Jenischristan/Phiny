'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Field } from '@/components/ui/Field';
import { Switch } from '@/components/ui/Switch';
import { toast } from '@/components/ui/Toaster';
import { useC } from '@/context/PhinyContext';

export function CollDialog() {
  const c = useC();
  const o = c.cd;
  const [n, setN] = useState('');
  const [pv, setPv] = useState(false);
  const [er, setEr] = useState('');

  useEffect(() => {
    if (o) {
      setN(o.coll ? o.coll.name : '');
      setPv(!!(o.coll && o.coll.priv));
      setEr('');
    }
  }, [o]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (n.trim().length < 2) {
      setEr('Name the collection (at least 2 characters).');
      return;
    }
    if (o?.coll) {
      c.setColls((cs) =>
        cs.map((x) =>
          x.id === o.coll!.id ? { ...x, name: n.trim(), priv: pv } : x
        )
      );
    } else {
      c.setColls((cs) => [
        ...cs,
        { id: 'c' + Date.now(), name: n.trim(), priv: pv, pins: [] },
      ]);
    }
    toast(o?.coll ? 'Collection updated' : 'Collection created');
    c.setCd(null);
  };

  return (
    <Dialog
      open={!!o}
      onClose={() => c.setCd(null)}
      label={o && o.coll ? 'Rename collection' : 'New collection'}
      desc="Name your collection and choose who can see it."
    >
      <form onSubmit={save} noValidate>
        <h2 className="text-2xl font-bold mb-6">
          {o && o.coll ? 'Edit collection' : 'New collection'}
        </h2>
        <Field
          id="cn"
          label="Name"
          value={n}
          onChange={setN}
          error={er}
          maxLength={40}
        />
        <Switch
          on={pv}
          set={setPv}
          label="Private"
          hint="Only you can see this collection."
        />
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => c.setCd(null)}
            className="btn btn-s flex-1"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-p flex-1">
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
}
