'use client';

import React from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { useC } from '@/context/PhinyContext';

export function AccountSwitcherDialog() {
  const c = useC();
  if (!c.me) return null;

  return (
    <Dialog
      open={c.accOpen}
      onClose={() => c.setAccOpen(false)}
      label="Switch account"
      desc="Switch between your linked Phiny accounts or add another account."
    >
      <h2 className="text-xl font-bold mb-4 pr-10">Switch account</h2>

      <div className="mb-4">
        <p className="lbl mb-2">Current account</p>
        <div className="flex items-center gap-3 p-3 border border-line bg-sub">
          <ProfileAvatar p={c.me} size={40} src={c.me.photo} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{c.me.name}</p>
            <p className="text-xs text-mut truncate">@{c.me.handle}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              c.setAccOpen(false);
              c.go('profile', 'me');
            }}
            className="btn btn-s sm"
          >
            Profile
          </button>
        </div>
      </div>

      <div className="mb-5">
        <p className="lbl mb-2">Available accounts</p>
        <ul className="border border-line divide-y divide-line">
          {c.accounts.map((acc) => {
            const handle = acc.handle || 'user';
            const isCurrent =
              handle.toLowerCase() === c.me?.handle.toLowerCase();
            const personObj = {
              id: handle,
              name: acc.name || handle,
              handle,
              photo: acc.photo,
              fers: 0,
              state: 'active' as const,
            };
            return (
              <li key={handle}>
                <button
                  type="button"
                  onClick={() => {
                    c.setAccOpen(false);
                    if (!isCurrent) {
                      c.switchAccount(handle);
                    } else {
                      c.go('profile', 'me');
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-3 hover:bg-sub text-left transition-colors"
                >
                  <ProfileAvatar p={personObj} size={36} src={acc.photo} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium truncate">
                      {personObj.name}
                    </span>
                    <span className="block text-xs text-mut truncate">
                      @{handle}
                    </span>
                  </span>
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-coral font-mono uppercase tracking-wider shrink-0">
                      <Icon n="check" c="w-4 h-4" />
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => {
            c.setAccOpen(false);
            c.openLogin();
          }}
          className="btn btn-p flex-1"
        >
          <Icon n="plus" c="w-4 h-4" />
          Add account
        </button>
        <button
          type="button"
          onClick={() => {
            c.setAccOpen(false);
            c.askLogout();
          }}
          className="btn btn-s"
        >
          <Icon n="out" c="w-4 h-4" />
          Log out
        </button>
      </div>
    </Dialog>
  );
}
