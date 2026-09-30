'use client';

import React, { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Switch } from '@/components/ui/Switch';
import { toast } from '@/components/ui/Toaster';
import { useC } from '@/context/PhinyContext';
import { SESS } from '@/data/mockData';
import { V } from '@/lib/validation';

export function Security() {
  const c = useC();
  const [v, setV] = useState({ a: '', b: '', c: '' });
  const [t, setT] = useState(false);
  const [ss, setSs] = useState(SESS);

  const E = {
    a: v.a ? '' : 'Enter your current password.',
    b: V.pw(v.b),
    c: v.c === v.b ? '' : 'Passwords do not match.',
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Security</h2>
      <p className="text-sm text-mut mb-4">
        Preview only: nothing here is connected to a backend yet.
      </p>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (E.a || E.b || E.c) {
            setT(true);
            return;
          }
          setV({ a: '', b: '', c: '' });
          setT(false);
          toast('Password updated');
        }}
      >
        <Field
          id="pa"
          label="Current password"
          type="password"
          value={v.a}
          onChange={(x) => setV({ ...v, a: x })}
          error={t ? E.a : ''}
          autoComplete="current-password"
        />
        <Field
          id="pb"
          label="New password"
          type="password"
          value={v.b}
          onChange={(x) => setV({ ...v, b: x })}
          error={t ? E.b : ''}
          autoComplete="new-password"
        />
        <Field
          id="pc"
          label="Confirm new password"
          type="password"
          value={v.c}
          onChange={(x) => setV({ ...v, c: x })}
          error={t ? E.c : ''}
          autoComplete="new-password"
        />
        <button type="submit" className="btn btn-p">
          Change password
        </button>
      </form>
      <div className="mt-8">
        <Switch
          on={!!c.pf.tfa}
          set={(x) => {
            c.sp('tfa')(x ? 1 : 0);
            toast(
              x
                ? 'Two-factor authentication on'
                : 'Two-factor authentication off'
            );
          }}
          label="Two-factor authentication"
          hint="Ask for a code from an authenticator app when you log in."
        />
      </div>
      <p className="lbl mt-8 mb-3">Active sessions</p>
      <ul className="border border-line divide-y divide-line">
        {ss.map(([d, w]) => (
          <li key={d} className="p-4 flex justify-between gap-3 text-sm">
            <span>{d}</span>
            <span className="text-mut">{w}</span>
          </li>
        ))}
      </ul>
      {ss.length > 1 && (
        <button
          type="button"
          onClick={() =>
            c.confirm({
              title: 'Log out other sessions?',
              text: 'Every device except this one will be signed out.',
              cta: 'Log out others',
              ok: () => {
                setSs((x) => x.slice(0, 1));
                toast('Other sessions logged out');
              },
            })
          }
          className="btn btn-s mt-4"
        >
          Log out other sessions
        </button>
      )}
    </div>
  );
}
