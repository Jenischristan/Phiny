'use client';

import React, { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { toast } from '@/components/ui/Toaster';
import { useC } from '@/context/PhinyContext';
import { V } from '@/lib/validation';

export function AccountSet() {
  const c = useC();
  const m = c.me!;
  const b = {
    name: m.name,
    handle: m.handle,
    email: m.email || '',
    bio: m.bio || '',
    web: m.web || '',
    photo: m.photo || '',
  };
  const [v, setV] = useState(b);
  const [t, setT] = useState(false);

  const set = <K extends keyof typeof b>(k: K) => (x: (typeof b)[K]) =>
    setV((z) => ({ ...z, [k]: x }));

  const dirty = JSON.stringify(v) !== JSON.stringify(b);

  const E = {
    name: V.name(v.name),
    handle: V.user(v.handle),
    email: v.email ? V.email(v.email) : '',
    web:
      v.web && !/^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v.web)
        ? 'Enter a valid website, like yourname.com.'
        : '',
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (Object.values(E).some(Boolean)) {
          setT(true);
          return;
        }
        c.setUser((u) => ({ ...u, ...v }));
        toast('Changes saved');
      }}
    >
      <h2 className="text-xl font-bold">Account</h2>
      <p className="text-sm text-mut mb-4">How you appear on Phiny.</p>
      <div className="mb-6">
        <p className="text-sm font-medium mb-2">Profile picture</p>
        <ImageUploader value={v.photo} onChange={set('photo')} />
      </div>
      <Field
        id="sn"
        label="Display name"
        value={v.name}
        onChange={set('name')}
        error={t ? E.name : ''}
        autoComplete="name"
      />
      <Field
        id="su"
        label="Username"
        prefix="@"
        value={v.handle}
        onChange={set('handle')}
        error={t ? E.handle : ''}
        autoComplete="username"
      />
      <Field
        id="se"
        label="Email"
        type="email"
        value={v.email}
        onChange={set('email')}
        error={t ? E.email : ''}
        autoComplete="email"
      />
      <div className="mb-6">
        <label
          htmlFor="sb"
          className="text-sm font-medium flex justify-between mb-2"
        >
          Bio
          <span className="lbl">{v.bio.length}/160</span>
        </label>
        <textarea
          id="sb"
          maxLength={160}
          value={v.bio}
          onChange={(e) => set('bio')(e.target.value)}
          className="inp h-24 py-3"
        ></textarea>
      </div>
      <Field
        id="sw"
        label="Website"
        optional={true}
        value={v.web}
        onChange={set('web')}
        error={t ? E.web : ''}
        hint="Shown on your profile as a link."
      />
      <div className="flex gap-3">
        <button
          type="button"
          disabled={!dirty}
          onClick={() => {
            setV(b);
            setT(false);
          }}
          className="btn btn-s"
        >
          Cancel
        </button>
        <button type="submit" disabled={!dirty} className="btn btn-p">
          Save changes
        </button>
      </div>
    </form>
  );
}
