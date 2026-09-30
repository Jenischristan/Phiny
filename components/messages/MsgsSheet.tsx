'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bubble } from '@/components/messages/Bubble';
import { Dialog } from '@/components/ui/Dialog';
import { Empty } from '@/components/ui/Empty';
import { Icon } from '@/components/ui/Icon';
import { Menu } from '@/components/ui/Menu';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { toast } from '@/components/ui/Toaster';
import { useC } from '@/context/PhinyContext';
import { PEOPLE } from '@/data/mockData';
import { Conversation } from '@/types';

export function MsgsSheet() {
  const c = useC();
  const cv = c.convs;
  const setCv = c.setConvs;
  const [cur, setCur] = useState<number | null>(null);
  const [t, setT] = useState('');
  const [rp, setRp] = useState<string | null>(null);
  const end = useRef<HTMLLIElement | null>(null);

  const cn = cv.find((x) => x.id === cur);
  const P = cn && PEOPLE[cn.id];
  const n = cn ? cn.m.length : 0;

  const upd = (id: number | null, f: (x: Conversation) => Conversation) =>
    setCv((v) => v.map((x) => (x.id === id ? f(x) : x)));

  useEffect(() => {
    if (end.current && end.current.scrollIntoView) {
      end.current.scrollIntoView({ block: 'end' });
    }
  }, [cur, n]);

  const ask = (
    title: string,
    text: string,
    cta: string,
    ok: () => void,
    danger?: number
  ) => c.confirm({ title, text, cta, danger, ok });

  const last = (x: Conversation) => x.m[x.m.length - 1];

  const shut = () => {
    c.setSheet(null);
    setCur(null);
    setRp(null);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!t.trim()) return;
    upd(cur, (x) => ({
      ...x,
      m: [...x.m, { id: Date.now(), me: 1, t: t.trim(), w: 'Now', rp }],
    }));
    setT('');
    setRp(null);
  };

  return (
    <Dialog open={c.sheet === 'messages'} onClose={shut} side="left" label="Messages">
      {!cn || !P ? (
        <>
          <h2 className="text-xl font-bold mb-4 pr-10">Messages</h2>
          {cv.length ? (
            <ul className="border border-line divide-y divide-line">
              {cv.map((x) => (
                <li key={x.id}>
                  <button
                    type="button"
                    onClick={() => {
                      upd(x.id, (z) => ({ ...z, u: 0 }));
                      setCur(x.id);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-sub"
                  >
                    <ProfileAvatar p={PEOPLE[x.id]} size={36} />
                    <span className="flex-1 min-w-0">
                      <span
                        className={'block text-sm truncate ' + (x.u ? 'font-bold' : 'font-medium')}
                      >
                        {PEOPLE[x.id].name}
                        {x.mute ? ' · Muted' : ''}
                      </span>
                      <span
                        className={
                          'block text-xs truncate mt-0.5 ' + (x.u ? 'text-fg' : 'text-mut')
                        }
                      >
                        {last(x).t}
                      </span>
                    </span>
                    <span className="lbl shrink-0">{last(x).w}</span>
                    {x.u ? (
                      <span className="w-2 h-2 bg-coral shrink-0" aria-label="Unread"></span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <Empty
              title="NO MESSAGES."
              text="Start a conversation from a creator’s profile."
            />
          )}
        </>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 pb-3 border-b border-line pr-10">
            <button
              type="button"
              aria-label="Back to conversations"
              onClick={() => setCur(null)}
              className="p-2 -ml-2"
            >
              <Icon n="arrow" c="w-5 h-5 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => c.go('profile', P.id)}
              className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
            >
              <ProfileAvatar p={P} size={32} />
              <span className="min-w-0">
                <span className="block text-sm font-medium truncate">{P.name}</span>
                <span className="block text-xs text-mut truncate">@{P.handle}</span>
              </span>
            </button>
            <Menu
              label="Conversation options"
              items={[
                [
                  cn.mute ? 'Unmute conversation' : 'Mute conversation',
                  'bell',
                  () => {
                    upd(cur, (x) => ({ ...x, mute: !x.mute }));
                    toast(cn.mute ? 'Unmuted' : 'Muted');
                  },
                ],
                ['Report conversation', 'flag', () => c.report('conversation')],
                [
                  'Delete conversation',
                  'trash',
                  () =>
                    ask(
                      'Delete conversation?',
                      'This removes the conversation from your inbox only.',
                      'Delete conversation',
                      () => {
                        setCv((v) => v.filter((x) => x.id !== cur));
                        setCur(null);
                      },
                      1
                    ),
                ],
              ]}
            />
          </div>
          <ul
            className="flex-1 min-h-0 overflow-y-auto ns overscroll-contain py-4 space-y-4"
            aria-label={'Conversation with ' + P.name}
          >
            {cn.m.map((m) => (
              <Bubble
                key={m.id}
                m={m}
                items={[
                  ['Reply', 'reply', () => setRp(m.t)],
                  [
                    'Copy',
                    'copy',
                    () => {
                      try {
                        navigator.clipboard.writeText(m.t);
                      } catch {
                        // ignore
                      }
                      toast('Message copied');
                    },
                  ],
                  m.me
                    ? [
                        'Delete',
                        'trash',
                        () =>
                          ask(
                            'Delete message?',
                            'This message will be removed from the conversation.',
                            'Delete message',
                            () =>
                              upd(cur, (x) => ({
                                ...x,
                                m: x.m.filter((y) => y.id !== m.id),
                              })),
                            1
                          ),
                      ]
                    : ['Report', 'flag', () => c.report('message')],
                ]}
              />
            ))}
            <li ref={end} aria-hidden="true"></li>
          </ul>
          {rp && (
            <p className="text-xs text-mut border-l-2 border-fg pl-2 py-1 mb-2 flex justify-between gap-2">
              <span className="truncate">Replying to: {rp}</span>
              <button
                type="button"
                aria-label="Cancel reply"
                onClick={() => setRp(null)}
              >
                <Icon n="x" c="w-3.5 h-3.5" />
              </button>
            </p>
          )}
          <form onSubmit={send} className="flex gap-2 pt-3 border-t border-line">
            <button
              type="button"
              aria-label="Attach an image"
              onClick={() => toast('Attachments connect to the backend next.')}
              className="btn btn-s px-3"
            >
              <Icon n="clip" />
            </button>
            <label htmlFor="mi" className="sr-only">
              Message
            </label>
            <input
              id="mi"
              value={t}
              onChange={(e) => setT(e.target.value)}
              placeholder="Write a message"
              className="inp"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="btn btn-p px-4"
            >
              <Icon n="send" />
            </button>
          </form>
        </div>
      )}
    </Dialog>
  );
}
