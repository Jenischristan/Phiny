'use client';

import React, { useState } from 'react';
import { AccountSet } from '@/components/settings/AccountSet';
import { Security } from '@/components/settings/Security';
import { Empty } from '@/components/ui/Empty';
import { Switch } from '@/components/ui/Switch';
import { useC } from '@/context/PhinyContext';
import { SECS } from '@/data/mockData';
import { Preferences, ThemeMode } from '@/types';

interface SelProps {
  id: string;
  label: string;
  hint: string;
  v: string;
  set: (v: string) => void;
  o: string[];
}

function Sel({ id, label, hint, v, set, o }: SelProps) {
  return (
    <div className="py-4 border-b border-line">
      <label htmlFor={id} className="text-sm font-medium block">
        {label}
      </label>
      <p className="text-xs text-mut mb-2">{hint}</p>
      <select
        id={id}
        value={v}
        onChange={(e) => set(e.target.value)}
        className="inp"
      >
        {o.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </div>
  );
}

export function SettingsView() {
  const c = useC();
  const [sec, setSec] = useState('Account');
  const pf = c.pf;
  const sp = c.sp;
  const m = c.me;

  if (!m) {
    return (
      <Empty
        title="SIGNED OUT."
        text="Log in to manage your account."
        cta="Log in"
        go={c.openLogin}
      />
    );
  }

  const P: [keyof Preferences, string, string][] = [
    ['likes', 'Likes', 'Someone likes your post'],
    ['comments', 'Comments', 'Comments and replies'],
    ['follows', 'Follows', 'New followers'],
    ['mentions', 'Mentions', 'Someone mentions you'],
    ['messages', 'Messages', 'New direct messages'],
    ['recs', 'Recommendations', 'Suggested creators and posts'],
  ];

  const row = (
    t: string,
    x: string,
    l: string,
    fn: () => void,
    cls: string
  ) => (
    <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div>
        <p className="font-medium">{t}</p>
        <p className="text-sm text-mut max-w-md">{x}</p>
      </div>
      <button type="button" onClick={fn} className={'btn shrink-0 ' + cls}>
        {l}
      </button>
    </div>
  );

  const body =
    sec === 'Account' ? (
      <AccountSet />
    ) : sec === 'Privacy' ? (
      <div>
        <h2 className="text-xl font-bold">Privacy</h2>
        <p className="text-sm text-mut mb-4">
          Control who can find you and interact with you.
        </p>
        <Switch
          on={m.vis === 'private'}
          set={(x) => c.setUser((u) => ({ ...u, vis: x ? 'private' : 'public' }))}
          label="Private profile"
          hint="Only approved followers can see your posts, collections and followers."
        />
        <Sel
          id="p1"
          label="Who can follow me"
          hint="Approved only means you review every request."
          v={pf.follow}
          set={sp('follow')}
          o={['Everyone', 'Approved only']}
        />
        <Sel
          id="p2"
          label="Who can message me"
          hint="Messages from others go to requests."
          v={pf.msg}
          set={sp('msg')}
          o={['Everyone', 'People I follow', 'No one']}
        />
        <Sel
          id="p3"
          label="Who can comment"
          hint="Applies to your new posts."
          v={pf.cmt}
          set={sp('cmt')}
          o={['Everyone', 'People I follow', 'No one']}
        />
        <Sel
          id="p4"
          label="Who can mention me"
          hint="Controls @mentions in posts and comments."
          v={pf.men}
          set={sp('men')}
          o={['Everyone', 'People I follow', 'No one']}
        />
        <Switch
          on={pf.saved}
          set={sp('saved')}
          label="Show saved content"
          hint="Off by default. Saved posts and collections stay visible only to you."
        />
      </div>
    ) : sec === 'Appearance' ? (
      <div>
        <h2 className="text-xl font-bold">Appearance</h2>
        <p className="text-sm text-mut mb-4">
          Phiny stays monochrome in every theme.
        </p>
        <fieldset>
          <legend className="sr-only">Theme</legend>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                ['light', 'Light'],
                ['dark', 'Dark'],
                ['system', 'System'],
              ] as [ThemeMode, string][]
            ).map(([k, l]) => (
              <label key={k} className="cursor-pointer">
                <input
                  type="radio"
                  name="th"
                  checked={c.theme === k}
                  onChange={() => c.setTheme(k)}
                  className="sr-only peer"
                />
                <div className="border border-line p-4 text-sm text-center peer-checked:border-fg peer-checked:bg-sub peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-navy">
                  {l}
                </div>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-6 hidden lg:block">
          <Switch
            on={c.col}
            set={(x) => c.toggleCol(x)}
            label="Collapse sidebar"
            hint="Show icons only in the left navigation."
          />
        </div>
      </div>
    ) : sec === 'Notifications' ? (
      <div>
        <h2 className="text-xl font-bold">Notifications</h2>
        <p className="text-sm text-mut mb-4">
          Choose what appears in your notification center.
        </p>
        {P.map(([k, l, h]) => (
          <Switch
            key={k}
            on={!!pf[k]}
            set={(x) => sp(k)((x ? 1 : 0) as never)}
            label={l}
            hint={h}
          />
        ))}
      </div>
    ) : sec === 'Security' ? (
      <Security />
    ) : (
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-coral" aria-hidden="true"></span>
          Danger zone
        </h2>
        <p className="text-sm text-mut mb-4">
          These actions affect your whole account.
        </p>
        <div className="border border-line divide-y divide-line">
          {row(
            'Deactivate account',
            'Hide your profile and content until you log in again. Nothing is deleted.',
            'Deactivate account',
            () =>
              c.confirm({
                title: 'Deactivate your account?',
                text: 'Your profile and content will no longer be visible to other users until you reactivate your account.',
                cta: 'Deactivate account',
                danger: 1,
                ok: () =>
                  c.exit('Account deactivated. Log in to reactivate it.'),
              }),
            'btn-s'
          )}
          {row(
            'Delete account',
            'Permanently remove your profile, posts, collections and other account data.',
            'Delete account',
            () =>
              c.confirm({
                title: 'Delete your account?',
                text: 'This action is permanent. Your profile, posts, collections, and other account data may be permanently removed.',
                cta: 'Delete account',
                danger: 1,
                need: 'DELETE',
                ok: () => c.exit('Account deleted.', 1),
              }),
            'border-coral hover:bg-coral hover:text-black'
          )}
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
        Settings
      </h1>
      <div className="grid md:grid-cols-[190px_minmax(0,1fr)] gap-6 md:gap-10">
        <nav
          aria-label="Settings sections"
          className="flex md:flex-col gap-1 overflow-x-auto ns md:self-start"
        >
          {SECS.map((k) => (
            <button
              key={k}
              type="button"
              aria-current={sec === k ? 'page' : undefined}
              onClick={() => setSec(k)}
              className={
                'h-11 px-3 text-sm text-left border whitespace-nowrap ' +
                (sec === k
                  ? 'border-fg bg-fg text-bg'
                  : 'border-transparent hover:border-line')
              }
            >
              {k}
            </button>
          ))}
          <button
            type="button"
            onClick={c.askLogout}
            className="h-11 px-3 text-sm text-left border border-transparent hover:border-line whitespace-nowrap md:mt-4"
          >
            Log out
          </button>
        </nav>
        <section className="min-w-0 max-w-xl">{body}</section>
      </div>
    </div>
  );
}
