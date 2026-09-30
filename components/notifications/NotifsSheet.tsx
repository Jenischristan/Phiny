'use client';

import React from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Empty } from '@/components/ui/Empty';
import { Icon } from '@/components/ui/Icon';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { useC } from '@/context/PhinyContext';
import { PEOPLE, PINS } from '@/data/mockData';
import { pinSrc } from '@/lib/art';
import { clipQ, IB, IBS } from '@/lib/utils';

export function NotifsSheet() {
  const c = useC();
  const n = c.notes;
  const rd = (id: number) =>
    c.setNotes((x) => x.map((z) => (z.id === id ? { ...z, u: 0 } : z)));

  return (
    <Dialog
      open={c.sheet === 'notifications'}
      onClose={() => c.setSheet(null)}
      side="left"
      label="Notifications"
    >
      <div className="flex items-center justify-between mb-4 pr-10">
        <h2 className="text-xl font-bold">Notifications</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={!c.unread}
            onClick={() => c.setNotes((x) => x.map((a) => ({ ...a, u: 0 })))}
            className="text-xs underline underline-offset-4 text-mut hover:text-fg disabled:opacity-40 disabled:no-underline"
          >
            Mark all read
          </button>
          <button
            type="button"
            disabled={!n.length}
            onClick={() =>
              c.confirm({
                title: 'Clear all notifications?',
                text: 'This will remove all notifications from your notification center.',
                cta: 'Clear all',
                danger: 1,
                ok: () => c.setNotes([]),
              })
            }
            className="text-xs underline underline-offset-4 text-mut hover:text-fg disabled:opacity-40 disabled:no-underline"
          >
            Clear all
          </button>
        </div>
      </div>
      {n.length ? (
        <ul className="border border-line divide-y divide-line">
          {n.map((a) => (
            <li
              key={a.id}
              className={'group flex items-center gap-3 px-3.5 py-3 ' + (a.u ? 'bg-sub' : '')}
            >
              <button
                type="button"
                aria-label={'View ' + PEOPLE[a.p].name + ' profile'}
                onClick={() => c.go('profile', a.p)}
                className="shrink-0"
              >
                <ProfileAvatar p={PEOPLE[a.p]} size={36} />
              </button>
              <p className="flex-1 text-sm min-w-0">
                <span className="block line-clamp-1 break-words" title={a.t}>
                  <b>{PEOPLE[a.p].name}</b> {clipQ(a.t, 18)}
                </span>
                <span className="lbl block mt-0.5">{a.w}</span>
              </p>
              {a.pin != null && (
                <button
                  type="button"
                  aria-label={'Open post: ' + PINS[a.pin].title}
                  onClick={() => {
                    rd(a.id);
                    c.go('post', a.pin);
                  }}
                  className="shrink-0"
                >
                  <img
                    src={pinSrc(PINS[a.pin])}
                    alt=""
                    className="w-10 h-10 object-cover border border-line"
                  />
                </button>
              )}
              {a.u ? (
                <span
                  className="w-2 h-2 bg-coral shrink-0"
                  aria-label="Unread"
                ></span>
              ) : null}
              <button
                type="button"
                aria-label={'Dismiss notification from ' + PEOPLE[a.p].name}
                onClick={() => c.setNotes((x) => x.filter((z) => z.id !== a.id))}
                className={
                  IB +
                  ' w-8 h-8 text-mut hover:text-fg opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
                }
              >
                <Icon n="x" c="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Empty title="ALL CAUGHT UP." text="New activity will appear here." />
      )}
    </Dialog>
  );
}
