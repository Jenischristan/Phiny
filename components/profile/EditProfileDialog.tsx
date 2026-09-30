'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Field } from '@/components/ui/Field';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { Switch } from '@/components/ui/Switch';
import { toast } from '@/components/ui/Toaster';
import { useC } from '@/context/PhinyContext';
import { V } from '@/lib/validation';
import { Person } from '@/types';

export function EditProfileDialog() {
  const c = useC();
  const open = c.edit;
  const [v, setV] = useState<Partial<Person>>({});
  const [t, setT] = useState(false);

  const set = <K extends keyof Person>(k: K) => (x: Person[K]) =>
    setV((s) => ({ ...s, [k]: x }));

  useEffect(() => {
    if (open) {
      setV(c.me || {});
      setT(false);
    }
  }, [open]);

  const E = {
    name: V.name(v.name || ''),
    handle: V.user(v.handle || ''),
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (E.name || E.handle) {
      setT(true);
      return;
    }
    c.setUser((u) => ({ ...u, ...v }));
    toast('Profile updated');
    c.setEdit(false);
  };

  return (
    <Dialog
      open={!!open}
      onClose={() => c.setEdit(false)}
      label="Edit profile"
      desc="Update your public profile details."
    >
      <form onSubmit={save} noValidate>
        <h2 className="text-2xl font-bold mb-6">Edit profile</h2>
        <div className="mb-6">
          <ImageUploader value={v.photo || ''} onChange={set('photo')} />
        </div>
        <Field
          id="en"
          label="Display name"
          value={v.name || ''}
          onChange={set('name')}
          error={t ? E.name : ''}
        />
        <Field
          id="eh"
          label="Username"
          prefix="@"
          value={v.handle || ''}
          onChange={set('handle')}
          error={t ? E.handle : ''}
        />
        <div className="mb-5">
          <label htmlFor="eb" className="text-sm font-medium block mb-2">
            Bio
          </label>
          <textarea
            id="eb"
            maxLength={160}
            value={v.bio || ''}
            onChange={(e) => set('bio')(e.target.value)}
            className="inp h-20 py-2.5"
          ></textarea>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field
            id="ew"
            label="Website"
            value={v.web || ''}
            onChange={set('web')}
          />
          <Field
            id="ep"
            label="Pronouns"
            value={v.pro || ''}
            onChange={set('pro')}
          />
        </div>
        <Switch
          on={v.vis === 'private'}
          set={(x) => set('vis')(x ? 'private' : 'public')}
          label="Private profile"
          hint="Only approved followers see your posts."
        />
        <button type="submit" className="btn btn-p w-full mt-5">
          Save changes
        </button>
      </form>
    </Dialog>
  );
}
