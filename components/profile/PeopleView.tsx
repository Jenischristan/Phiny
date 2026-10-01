'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Empty } from '@/components/ui/Empty';
import { FollowButton } from '@/components/ui/FollowButton';
import { Icon } from '@/components/ui/Icon';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { useC } from '@/context/PhinyContext';
import { PEOPLE } from '@/data/mockData';

interface PeopleViewProps {
  type: 'followers' | 'following';
  id: number | string;
}

export function PeopleView({ type, id }: PeopleViewProps) {
  const router = useRouter();
  const c = useC();
  const [q, setQ] = useState('');
  const isMe = id === 'me';
  const numId = typeof id === 'number' ? id : Number(id);
  const p = isMe ? c.me : (PEOPLE.find((person) => person.id === numId) || PEOPLE[numId]);

  if (!p) {
    return (
      <Empty
        title="UNAVAILABLE."
        text="This profile is currently unavailable."
      />
    );
  }

  const all =
    type === 'following' && isMe
      ? PEOPLE.filter((x) => c.fol[x.id])
      : PEOPLE.filter(
          (x) => x.id !== (isMe ? 'me' : numId) && x.state !== 'deactivated'
        ).slice(type === 'followers' ? 0 : 2);

  const list = all.filter((x) =>
    (x.name + x.handle).toLowerCase().includes(q.toLowerCase())
  );

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(isMe ? '/profile/me' : `/profile/${id}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button type="button" onClick={handleBack} className="btn btn-s sm mb-6">
        <Icon n="arrow" c="w-4 h-4 rotate-180" />
        Back
      </button>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 mb-6 border-b border-line">
        <div className="flex items-center gap-4 min-w-0">
          <ProfileAvatar p={p} size={56} src={p.photo} />
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight capitalize">
              {type}
            </h1>
            <p className="text-sm text-mut truncate">
              @{p.handle} · {all.length}{' '}
              {all.length === 1 ? 'account' : 'accounts'}
            </p>
          </div>
        </div>
        <div className="relative w-full md:w-80 shrink-0">
          <label htmlFor="pq" className="sr-only">
            {'Search ' + type}
          </label>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mut pointer-events-none">
            <Icon n="search" />
          </span>
          <input
            id="pq"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={'Search ' + type}
            className="inp pl-10"
          />
        </div>
      </div>
      {list.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((x) => (
            <li
              key={x.id}
              className="flex items-center gap-3 p-4 border border-line hover:border-mut transition-colors"
            >
              <Link
                href={'/profile/' + x.id}
                aria-label={'View ' + x.name + ' profile'}
                className="flex items-center gap-3 min-w-0 flex-1 text-left hover:opacity-85 transition-opacity"
              >
                <ProfileAvatar p={x} size={48} />
                <span className="min-w-0">
                  <span className="block font-medium truncate">{x.name}</span>
                  <span className="block text-xs text-mut truncate">
                    @{x.handle}
                  </span>
                  <span className="block text-xs text-mut truncate mt-0.5">
                    {x.bio}
                  </span>
                </span>
              </Link>
              <FollowButton
                on={!!c.fol[x.id]}
                name={x.name}
                onClick={() => c.toggleFol(x.id)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <Empty
          title="NO ACCOUNTS."
          text={q ? 'No one matches your search.' : 'Nothing to show yet.'}
        />
      )}
    </div>
  );
}
